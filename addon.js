const { addonBuilder, getRouter } = require('stremio-addon-sdk');
const { findByImdbId, getSimilarMovies, getSimilarSeries, getTrendingMovies, getTrendingSeries } = require('./tmdb');
const { getGeminiRecommendations, getGeneralRecommendations } = require('./gemini');
const { getConfigurePage } = require('./configure');
const express = require('express');

// Cache for items
const tmdbCache = new Map();
const geminiCache = new Map();

const PORT = process.env.PORT || 7000;

// Addon manifest with configuration
const manifest = {
    id: 'com.morelikethis.stremio',
    version: '1.4.0',
    name: 'More Like This',
    description: 'Discover similar movies and series based on what you love.',
    logo: '/logo.svg',
    
    resources: ['catalog', 'meta', 'stream'],
    types: ['movie', 'series'],
    idPrefixes: ['tt'],
    catalogs: [
        {
            type: 'movie',
            id: 'morelikethis-movie',
            name: 'More Like This',
            extra: [{ name: 'search' }]
        },
        {
            type: 'series',
            id: 'morelikethis-series',
            name: 'More Like This',
            extra: [{ name: 'search' }]
        }
    ],
    config: [
        {
            key: 'tmdbApiKey',
            type: 'text',
            title: 'TMDB API Key (for movie lookup)',
            required: false
        },
        {
            key: 'geminiApiKey',
            type: 'text',
            title: 'Gemini AI API Key (required for recommendations)',
            required: false
        },
        {
            key: 'geminiModel',
            type: 'text',
            title: 'Gemini Model',
            required: false
        },
        {
            key: 'maxResults',
            type: 'text',
            title: 'Number of recommendations (1-30)',
            required: false
        },
        {
            key: 'contentTypeFilter',
            type: 'text',
            title: 'Content type filter (same/all)',
            required: false
        }
    ],
    behaviorHints: {
        configurable: true,
        configurationRequired: false
    }
};

// Create addon builder
const builder = new addonBuilder(manifest);

// Helper function to get config from args
function getConfig(args) {
    return args.config || {};
}

// Helper function to extract base IMDB ID from series episode IDs
// Series episodes come as "tt1234567:1:1" (imdbId:season:episode)
// We need just "tt1234567" for TMDB lookups
function getBaseImdbId(id) {
    if (!id) return null;
    // Extract just the tt part (before any colon)
    const match = id.match(/^(tt\d+)/);
    return match ? match[1] : id;
}

// Helper function to get similar items (with caching)
async function getSimilarItems(id, type, apiKey) {
    if (!apiKey) {
        return null;
    }

    const cacheKey = `${id}-${apiKey}`;
    const cached = tmdbCache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp < 3600000)) {
        return cached;
    }

    const itemInfo = await findByImdbId(id, apiKey);
    if (!itemInfo) return null;

    let similarItems = [];
    if (itemInfo.type === 'movie') {
        similarItems = await getSimilarMovies(itemInfo.id, apiKey);
    } else if (itemInfo.type === 'tv') {
        similarItems = await getSimilarSeries(itemInfo.id, apiKey);
    }

    const result = {
        items: similarItems,
        title: itemInfo.title,
        itemType: itemInfo.type,
        timestamp: Date.now()
    };

    tmdbCache.set(cacheKey, result);
    return result;
}

function getBaseUrl(config) {
    return config.baseUrl || process.env.BASE_URL || null;
}

// Helper function to get AI recommendations (with caching)
async function getAIItems(id, type, title, aiApiKey, dbApiKey, aiModel, maxResults = 10, contentTypeFilter = 'same') {
    if (!aiApiKey) return null;
    
    const cacheKey = `${id}-${type}-${aiApiKey}-${aiModel}-${maxResults}-${contentTypeFilter}`;
    const cached = geminiCache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp < 3600000)) {
        return cached;
    }

    const items = await getGeminiRecommendations(title, type, aiApiKey, dbApiKey, aiModel, maxResults, contentTypeFilter);
    
    const result = {
        items: items,
        title: title,
        timestamp: Date.now()
    };

    geminiCache.set(cacheKey, result);
    return result;
}

// Meta handler
builder.defineMetaHandler(async (args) => {
    const { type, id } = args;
    const config = getConfig(args);
    
    console.log(`Meta request: type=${type}, id=${id}`);

    if (!id.startsWith('tt')) {
        return { meta: null };
    }

    if (!config.tmdbApiKey) {
        return { meta: null };
    }

    try {
        // Extract base IMDB ID (handles series episode IDs like "tt1234567:1:1")
        const baseId = getBaseImdbId(id);
        
        const data = await getSimilarItems(baseId, type, config.tmdbApiKey);
        
        if (!data) {
            return { meta: null };
        }

        const links = data.items.map(item => ({
            name: item.title,
            category: 'Recommendations',
            url: `stremio:///detail/${item.type}/${item.imdbId}`
        }));

        return {
            meta: {
                id: id,
                type: type,
                name: data.title,
                links: links
            }
        };

    } catch (error) {
        console.error(`Meta error: ${error.message}`);
        return { meta: null };
    }
});

// Stream handler (for Desktop/Web - provides quick access button)
// Note: externalUrl doesn't work on Samsung/LG TVs - TV users should use catalog dropdown
builder.defineStreamHandler(async (args) => {
    const { type, id } = args;
    const config = getConfig(args);
    
    console.log(`Stream request: type=${type}, id=${id}`);

    if (!id.startsWith('tt')) {
        return { streams: [] };
    }

    if (!config.tmdbApiKey) {
        return { streams: [] };
    }

    try {
        // Extract base IMDB ID (handles series episode IDs like "tt1234567:1:1")
        const baseId = getBaseImdbId(id);
        
        const data = await getSimilarItems(baseId, type, config.tmdbApiKey);
        
        if (!data) {
            return { streams: [] };
        }

        const streams = [];
        const catalogType = type === 'series' ? 'series' : 'movie';
        
        const baseUrl = getBaseUrl(config);
        if (!baseUrl) {
            return { streams: [] };
        }

        const configStr = encodeURIComponent(JSON.stringify(config));
        const addonUrl = `${baseUrl}/${configStr}/manifest.json`;

        // Single unified catalog with search parameter (use base ID for series)
        const catalogId = type === 'series' ? 'morelikethis-series' : 'morelikethis-movie';
        const discoverUrl = `stremio:///discover/${encodeURIComponent(addonUrl)}/${catalogType}/${catalogId}?search=${encodeURIComponent(baseId)}`;
        
        streams.push({
            name: '🎬 MORE LIKE THIS',
            description: `Find similar titles to "${data.title}"`,
            externalUrl: discoverUrl
        });

        return { streams };

    } catch (error) {
        console.error(`Stream error: ${error.message}`);
        return { streams: [] };
    }
});

// Cache for general recommendations (TV fallback)
const generalCache = new Map();

// Helper function to get general recommendations (for TV - no search param)
// AI-only - no TMDB fallback
async function getGeneralItems(type, geminiApiKey, tmdbApiKey, geminiModel, maxResults = 10) {
    const cacheKey = `general-${type}-${geminiModel}-${maxResults}`;
    const cached = generalCache.get(cacheKey);
    
    // Cache for 1 hour
    if (cached && (Date.now() - cached.timestamp < 3600000)) {
        return cached;
    }

    let items = [];

    // AI recommendations only - no fallback
    if (geminiApiKey) {
        items = await getGeneralRecommendations(type, geminiApiKey, tmdbApiKey, geminiModel, maxResults);
        if (items.length === 0) {
            console.log(`AI returned no general ${type} recommendations`);
        }
    } else {
        console.log('No Gemini API key provided - AI recommendations require Gemini key');
    }

    const result = {
        items: items,
        timestamp: Date.now()
    };

    generalCache.set(cacheKey, result);
    return result;
}

// Catalog handler - Hybrid: Desktop (movie-specific) vs TV (general recommendations)
builder.defineCatalogHandler(async (args) => {
    const { type, id, extra } = args;
    const config = getConfig(args);
    
    const searchId = extra?.search;
    
    console.log(`Catalog request: type=${type}, id=${id}, search=${searchId || 'NONE (TV mode)'}`);

    if (!config.tmdbApiKey) {
        console.log('No TMDB API key - returning empty');
        return { metas: [] };
    }

    try {
        let items = [];

        if (searchId && searchId.startsWith('tt')) {
            // DESKTOP MODE: Movie-specific recommendations
            // Extract base IMDB ID (handles series episode IDs like "tt1234567:1:1")
            const baseSearchId = getBaseImdbId(searchId);
            console.log(`Desktop mode: Getting recommendations for ${baseSearchId}`);
            
            // Get source movie info
            const data = await getSimilarItems(baseSearchId, type, config.tmdbApiKey);
            
            if (data) {
                // AI recommendations only - no fallback
                if (config.geminiApiKey) {
                    const maxResults = parseInt(config.maxResults) || 10;
                    const contentTypeFilter = config.contentTypeFilter || 'same';
                    const aiData = await getAIItems(baseSearchId, type, data.title, config.geminiApiKey, config.tmdbApiKey, config.geminiModel, maxResults, contentTypeFilter);
                    if (aiData && aiData.items.length > 0) {
                        items = aiData.items;
                        console.log(`Got ${items.length} AI recommendations for "${data.title}" (max: ${maxResults}, filter: ${contentTypeFilter})`);
                    } else {
                        console.log(`AI returned no results for "${data.title}"`);
                    }
                } else {
                    console.log('No Gemini API key provided - AI recommendations require Gemini key');
                }
            }
        } else {
            // TV MODE: General recommendations (no specific movie)
            const maxResults = parseInt(config.maxResults) || 10;
            console.log(`TV mode: Getting ${maxResults} general recommendations using ${config.geminiModel || 'default'} model`);
            
            const generalData = await getGeneralItems(type, config.geminiApiKey, config.tmdbApiKey, config.geminiModel, maxResults);
            if (generalData) {
                items = generalData.items;
                console.log(`Got ${items.length} general recommendations for ${type}`);
            }
        }

        const metas = items.map(item => ({
            id: item.imdbId,
            type: item.type,
            name: item.title,
            poster: item.poster
        }));

        return { metas };

    } catch (error) {
        console.error(`Catalog error: ${error.message}`);
        return { metas: [] };
    }
});

const path = require('path');

// Create Express app with custom configure page
const app = express();

// Serve static assets (logo, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Disable caching for all routes
app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
    next();
});

// Custom configure page (before SDK router)
app.get('/configure', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.send(getConfigurePage(manifest));
});

// Alternative setup route (same page, different URL)
app.get('/setup', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.send(getConfigurePage(manifest));
});

// Root redirect to configure
app.get('/', (req, res) => {
    res.redirect('/configure');
});

// SDK router for addon functionality
app.use(getRouter(builder.getInterface()));

// Start server
app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════════════════╗
║                      More Like This                            ║
╠════════════════════════════════════════════════════════════════╣
║  Addon URL: http://127.0.0.1:${PORT}/manifest.json                ║
║  Configure: http://127.0.0.1:${PORT}/configure                    ║
╠════════════════════════════════════════════════════════════════╣
║  Configuration required - Enter your API keys to get started   ║
╚════════════════════════════════════════════════════════════════╝
`);
});

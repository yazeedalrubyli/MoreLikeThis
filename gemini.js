const axios = require('axios');
const { searchTMDB } = require('./tmdb');

// Default model if none specified
const DEFAULT_MODEL = 'gemini-2.5-flash';

/**
 * Get AI-powered movie/series recommendations using Gemini
 * @param {string} title - The title of the movie/series
 * @param {string} type - 'movie' or 'series'
 * @param {string} geminiApiKey - Gemini API key
 * @param {string} tmdbApiKey - TMDB API key (optional, for searching)
 * @param {string} geminiModel - Gemini model to use (optional)
 * @param {number} maxResults - Maximum number of recommendations (1-30)
 * @param {string} contentTypeFilter - 'same' for same type only, 'all' for both movies and series
 * @returns {Promise<Array>}
 */
async function getGeminiRecommendations(title, type, geminiApiKey, tmdbApiKey, geminiModel = DEFAULT_MODEL, maxResults = 10, contentTypeFilter = 'same') {
    if (!geminiApiKey) {
        console.log('No Gemini API key provided');
        return [];
    }

    if (!tmdbApiKey) {
        console.log('No TMDB API key provided for Gemini TMDB search');
        return [];
    }
    
    // Clamp maxResults between 1 and 30
    const count = Math.min(30, Math.max(1, maxResults));
    
    try {
        // Determine media type based on filter
        let mediaTypePrompt;
        let searchTypes;
        
        if (contentTypeFilter === 'all') {
            mediaTypePrompt = 'movies and TV series';
            searchTypes = ['movie', 'series'];
        } else {
            mediaTypePrompt = type === 'series' ? 'TV series' : 'movies';
            searchTypes = [type];
        }
        
        const sourceType = type === 'series' ? 'TV series' : 'movie';
        
        const prompt = `You are a movie recommendation expert. Given the ${sourceType} "${title}", suggest exactly ${count} similar ${mediaTypePrompt} that fans would enjoy.

Consider these factors:
- Similar themes, mood, and atmosphere
- Similar genres and subgenres
- Similar storytelling style
- Similar time period or setting

Return ONLY a JSON array of objects with "title", "year", and "type" fields. The "type" field should be either "movie" or "series".
No explanation, no markdown, just the JSON array.

Example format:
[{"title": "Movie Name", "year": 2020, "type": "movie"}, {"title": "Series Name", "year": 2019, "type": "series"}]

Now suggest ${count} ${mediaTypePrompt} most similar to "${title}", ordered by similarity:`;

        const modelToUse = geminiModel || DEFAULT_MODEL;
        console.log(`Calling Gemini API (${modelToUse}) for "${title}"...`);

        // Gemini API endpoint - using selected model
        const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${modelToUse}:generateContent`;

        const response = await axios.post(
            `${GEMINI_API_URL}?key=${geminiApiKey}`,
            {
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 65536
                }
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 30000
            }
        );

        const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (!text) {
            console.error('No text in Gemini response');
            return [];
        }

        console.log(`Gemini raw response for "${title}":`, text.substring(0, 200) + '...');

        let recommendations = [];
        try {
            let cleanText = text.trim();
            if (cleanText.startsWith('```json')) {
                cleanText = cleanText.slice(7);
            }
            if (cleanText.startsWith('```')) {
                cleanText = cleanText.slice(3);
            }
            if (cleanText.endsWith('```')) {
                cleanText = cleanText.slice(0, -3);
            }
            cleanText = cleanText.trim();
            
            recommendations = JSON.parse(cleanText);
        } catch (parseError) {
            console.error('Failed to parse Gemini response:', parseError.message);
            console.error('Raw text was:', text);
            return [];
        }

        console.log(`Parsed ${recommendations.length} recommendations from Gemini`);

        const results = await Promise.all(
            recommendations.slice(0, count).map(async (rec) => {
                // Determine the search type from the recommendation or fall back to source type
                const recType = rec.type === 'series' ? 'series' : (rec.type === 'movie' ? 'movie' : type);
                const searchResult = await searchTMDB(rec.title, rec.year, recType, tmdbApiKey);
                if (searchResult) {
                    return {
                        title: searchResult.title,
                        imdbId: searchResult.imdbId,
                        type: recType === 'series' ? 'series' : 'movie',
                        poster: searchResult.poster,
                        year: rec.year
                    };
                }
                return null;
            })
        );

        const filtered = results.filter(r => r !== null && r.imdbId);
        console.log(`Found ${filtered.length} recommendations with IMDB IDs`);
        return filtered;

    } catch (error) {
        console.error('Gemini API error:', error.response?.data || error.message);
        return [];
    }
}

/**
 * Get general AI-powered recommendations (for TV - no specific source movie)
 * @param {string} type - 'movie' or 'series'
 * @param {string} geminiApiKey - Gemini API key
 * @param {string} tmdbApiKey - TMDB API key (for searching)
 * @param {string} geminiModel - Gemini model to use (optional)
 * @param {number} maxResults - Maximum number of recommendations (1-30)
 * @returns {Promise<Array>}
 */
async function getGeneralRecommendations(type, geminiApiKey, tmdbApiKey, geminiModel = DEFAULT_MODEL, maxResults = 15) {
    if (!geminiApiKey) {
        console.log('No Gemini API key provided for general recommendations');
        return [];
    }

    if (!tmdbApiKey) {
        console.log('No TMDB API key provided for general recommendations');
        return [];
    }
    
    // Clamp maxResults between 1 and 30
    const count = Math.min(30, Math.max(1, maxResults));
    
    try {
        const mediaType = type === 'series' ? 'TV series' : 'movies';
        
        const prompt = `You are a movie recommendation expert. Suggest ${count} must-watch ${mediaType} that are highly acclaimed, entertaining, and diverse in genres.

Include a mix of:
- Recent critically acclaimed titles (2020-2025)
- Modern classics (2010-2019)
- Hidden gems that deserve more attention
- Different genres (thriller, drama, comedy, sci-fi, etc.)

Return ONLY a JSON array of objects with "title" and "year" fields. No explanation, no markdown, just the JSON array.

Example format:
[{"title": "Movie Name", "year": 2020}, {"title": "Another Movie", "year": 2019}]

Now suggest ${count} diverse, highly-rated ${mediaType}:`;

        const modelToUse = geminiModel || DEFAULT_MODEL;
        console.log(`Calling Gemini API (${modelToUse}) for general ${type} recommendations...`);

        const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${modelToUse}:generateContent`;

        const response = await axios.post(
            `${GEMINI_API_URL}?key=${geminiApiKey}`,
            {
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.9,
                    maxOutputTokens: 65536
                }
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 30000
            }
        );

        const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (!text) {
            console.error('No text in Gemini response for general recommendations');
            return [];
        }

        console.log(`Gemini general recommendations response:`, text.substring(0, 200) + '...');

        let recommendations = [];
        try {
            let cleanText = text.trim();
            if (cleanText.startsWith('```json')) {
                cleanText = cleanText.slice(7);
            }
            if (cleanText.startsWith('```')) {
                cleanText = cleanText.slice(3);
            }
            if (cleanText.endsWith('```')) {
                cleanText = cleanText.slice(0, -3);
            }
            cleanText = cleanText.trim();
            
            recommendations = JSON.parse(cleanText);
        } catch (parseError) {
            console.error('Failed to parse Gemini general response:', parseError.message);
            return [];
        }

        console.log(`Parsed ${recommendations.length} general recommendations from Gemini`);

        const results = await Promise.all(
            recommendations.slice(0, count).map(async (rec) => {
                const searchResult = await searchTMDB(rec.title, rec.year, type, tmdbApiKey);
                if (searchResult) {
                    return {
                        title: searchResult.title,
                        imdbId: searchResult.imdbId,
                        type: type === 'series' ? 'series' : 'movie',
                        poster: searchResult.poster,
                        year: rec.year
                    };
                }
                return null;
            })
        );

        const filtered = results.filter(r => r !== null && r.imdbId);
        console.log(`Found ${filtered.length} general recommendations with IMDB IDs`);
        return filtered;

    } catch (error) {
        console.error('Gemini API error for general recommendations:', error.response?.data || error.message);
        return [];
    }
}

module.exports = {
    getGeminiRecommendations,
    getGeneralRecommendations
};

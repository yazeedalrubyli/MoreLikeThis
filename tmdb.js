const axios = require('axios');

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

/**
 * Find TMDB ID by IMDB ID
 * @param {string} imdbId - The IMDB ID (e.g., 'tt1375666')
 * @param {string} apiKey - TMDB API key
 * @returns {Promise<{id: number, type: string}|null>}
 */
async function findByImdbId(imdbId, apiKey) {
    try {
        const response = await axios.get(`${TMDB_BASE_URL}/find/${imdbId}`, {
            params: {
                api_key: apiKey,
                external_source: 'imdb_id'
            }
        });

        const data = response.data;

        if (data.movie_results && data.movie_results.length > 0) {
            const movie = data.movie_results[0];
            return {
                id: movie.id,
                type: 'movie',
                title: movie.title,
                poster: movie.poster_path ? `${TMDB_IMAGE_BASE}${movie.poster_path}` : null
            };
        }

        if (data.tv_results && data.tv_results.length > 0) {
            const tv = data.tv_results[0];
            return {
                id: tv.id,
                type: 'tv',
                title: tv.name,
                poster: tv.poster_path ? `${TMDB_IMAGE_BASE}${tv.poster_path}` : null
            };
        }

        return null;
    } catch (error) {
        console.error(`Error finding TMDB ID for ${imdbId}:`, error.message);
        return null;
    }
}

/**
 * Get similar movies from TMDB
 * @param {number} tmdbId - The TMDB movie ID
 * @param {string} apiKey - TMDB API key
 * @returns {Promise<Array>}
 */
async function getSimilarMovies(tmdbId, apiKey) {
    try {
        const response = await axios.get(`${TMDB_BASE_URL}/movie/${tmdbId}/similar`, {
            params: {
                api_key: apiKey,
                language: 'en-US',
                page: 1
            }
        });

        const movies = response.data.results || [];
        
        const moviesWithImdb = await Promise.all(
            movies.slice(0, 10).map(async (movie) => {
                const imdbId = await getImdbId(movie.id, 'movie', apiKey);
                return {
                    tmdbId: movie.id,
                    imdbId: imdbId,
                    title: movie.title,
                    type: 'movie',
                    poster: movie.poster_path ? `${TMDB_IMAGE_BASE}${movie.poster_path}` : null
                };
            })
        );

        return moviesWithImdb.filter(m => m.imdbId);
    } catch (error) {
        console.error(`Error getting similar movies for TMDB ID ${tmdbId}:`, error.message);
        return [];
    }
}

/**
 * Get similar TV series from TMDB
 * @param {number} tmdbId - The TMDB TV series ID
 * @param {string} apiKey - TMDB API key
 * @returns {Promise<Array>}
 */
async function getSimilarSeries(tmdbId, apiKey) {
    try {
        const response = await axios.get(`${TMDB_BASE_URL}/tv/${tmdbId}/similar`, {
            params: {
                api_key: apiKey,
                language: 'en-US',
                page: 1
            }
        });

        const series = response.data.results || [];
        
        const seriesWithImdb = await Promise.all(
            series.slice(0, 10).map(async (show) => {
                const imdbId = await getImdbId(show.id, 'tv', apiKey);
                return {
                    tmdbId: show.id,
                    imdbId: imdbId,
                    title: show.name,
                    type: 'series',
                    poster: show.poster_path ? `${TMDB_IMAGE_BASE}${show.poster_path}` : null
                };
            })
        );

        return seriesWithImdb.filter(s => s.imdbId);
    } catch (error) {
        console.error(`Error getting similar series for TMDB ID ${tmdbId}:`, error.message);
        return [];
    }
}

/**
 * Get IMDB ID for a TMDB item
 * @param {number} tmdbId - The TMDB ID
 * @param {string} mediaType - 'movie' or 'tv'
 * @param {string} apiKey - TMDB API key
 * @returns {Promise<string|null>}
 */
async function getImdbId(tmdbId, mediaType, apiKey) {
    try {
        const response = await axios.get(`${TMDB_BASE_URL}/${mediaType}/${tmdbId}/external_ids`, {
            params: {
                api_key: apiKey
            }
        });

        return response.data.imdb_id || null;
    } catch (error) {
        console.error(`Error getting IMDB ID for TMDB ${mediaType} ${tmdbId}:`, error.message);
        return null;
    }
}

/**
 * Get trending movies from TMDB (for TV fallback)
 * @param {string} apiKey - TMDB API key
 * @returns {Promise<Array>}
 */
async function getTrendingMovies(apiKey) {
    try {
        const response = await axios.get(`${TMDB_BASE_URL}/trending/movie/week`, {
            params: {
                api_key: apiKey,
                language: 'en-US'
            }
        });

        const movies = response.data.results || [];
        
        const moviesWithImdb = await Promise.all(
            movies.slice(0, 20).map(async (movie) => {
                const imdbId = await getImdbId(movie.id, 'movie', apiKey);
                return {
                    tmdbId: movie.id,
                    imdbId: imdbId,
                    title: movie.title,
                    type: 'movie',
                    poster: movie.poster_path ? `${TMDB_IMAGE_BASE}${movie.poster_path}` : null
                };
            })
        );

        return moviesWithImdb.filter(m => m.imdbId);
    } catch (error) {
        console.error('Error getting trending movies:', error.message);
        return [];
    }
}

/**
 * Get trending TV series from TMDB (for TV fallback)
 * @param {string} apiKey - TMDB API key
 * @returns {Promise<Array>}
 */
async function getTrendingSeries(apiKey) {
    try {
        const response = await axios.get(`${TMDB_BASE_URL}/trending/tv/week`, {
            params: {
                api_key: apiKey,
                language: 'en-US'
            }
        });

        const series = response.data.results || [];
        
        const seriesWithImdb = await Promise.all(
            series.slice(0, 20).map(async (show) => {
                const imdbId = await getImdbId(show.id, 'tv', apiKey);
                return {
                    tmdbId: show.id,
                    imdbId: imdbId,
                    title: show.name,
                    type: 'series',
                    poster: show.poster_path ? `${TMDB_IMAGE_BASE}${show.poster_path}` : null
                };
            })
        );

        return seriesWithImdb.filter(s => s.imdbId);
    } catch (error) {
        console.error('Error getting trending series:', error.message);
        return [];
    }
}

/**
 * Search TMDB for a movie/series
 * @param {string} title - The title to search for
 * @param {number} year - The release year
 * @param {string} type - 'movie' or 'series'
 * @param {string} apiKey - TMDB API key
 * @returns {Promise<Object|null>}
 */
async function searchTMDB(title, year, type, apiKey) {
    try {
        const mediaType = type === 'series' ? 'tv' : 'movie';
        
        const response = await axios.get(`${TMDB_BASE_URL}/search/${mediaType}`, {
            params: {
                api_key: apiKey,
                query: title,
                year: year,
                language: 'en-US'
            }
        });

        const results = response.data.results;
        if (!results || results.length === 0) {
            return null;
        }

        const item = results[0];
        
        const externalIds = await axios.get(`${TMDB_BASE_URL}/${mediaType}/${item.id}/external_ids`, {
            params: {
                api_key: apiKey
            }
        });

        const imdbId = externalIds.data.imdb_id;
        if (!imdbId) {
            return null;
        }

        return {
            title: mediaType === 'tv' ? item.name : item.title,
            imdbId: imdbId,
            poster: item.poster_path ? `${TMDB_IMAGE_BASE}${item.poster_path}` : null
        };

    } catch (error) {
        console.error(`TMDB search error for "${title}":`, error.message);
        return null;
    }
}

module.exports = {
    findByImdbId,
    getSimilarMovies,
    getSimilarSeries,
    getTrendingMovies,
    getTrendingSeries,
    searchTMDB
};

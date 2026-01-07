import axios from 'axios';

const API_KEY = 'a778a51a37c399e4c1d3bc8d96b11162'; 
const BASE_URL = 'https://api.themoviedb.org/3';

const tmdb = axios.create({
  baseURL: BASE_URL,
  params: { api_key: API_KEY, language: 'es-ES' },
});

export const GENRES = {
  TRENDING: '/trending/movie/week',
  ACCION: 28,
  TERROR: 27,
  ROMANCE: 10749,
  DRAMA: 18,
};

export const getMovies = async (endpoint: string, isGenre = false) => {
  const url = isGenre ? '/discover/movie' : endpoint;
  const params = isGenre ? { with_genres: endpoint, sort_by: 'popularity.desc' } : {};
  const { data } = await tmdb.get(url, { params });
  return data.results;
};

export const searchMovies = async (query: string) => {
  const { data } = await tmdb.get('/search/movie', { params: { query } });
  return data.results;
};

export const getTrailer = async (id: number) => {
  try {
    const { data } = await tmdb.get(`/movie/${id}/videos`);
    const videos = data.results;
    let video = videos.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube') || 
                videos.find((v: any) => v.site === 'YouTube');
    return video ? video.key : null;
  } catch { return null; }
};

export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
export const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/original';
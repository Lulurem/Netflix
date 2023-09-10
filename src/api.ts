const API_KEY = "2f1c74c116a2a5794f7b03e146165fc4";
const BASE_PATH = "https://api.themoviedb.org/3";

interface IMovie {
  id: number;
  backdrop_path: string;
  genre_ids: number[];
  poster_path: string;
  title: string;
  name: string;
  overview: string;
}

export interface IGetMoviesResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

// Movies API
export function getMoviesNowPlaying() {
  return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then(
    response => response.json()
  );
}

export function getMoviesTopRated() {
  return fetch(`${BASE_PATH}/movie/top_rated?api_key=${API_KEY}`).then(
    response => response.json()
  );
}

export function getMoviesUpcoming() {
  return fetch(`${BASE_PATH}/movie/upcoming?api_key=${API_KEY}`).then(
    response => response.json()
  );
}

// Tv shows API
export function getTvAiringToday() {
  return fetch(`${BASE_PATH}/tv/airing_today?api_key=${API_KEY}`).then(
    response => response.json()
  );
}

export function getTvPopular() {
  return fetch(`${BASE_PATH}/tv/popular?api_key=${API_KEY}`).then(response =>
    response.json()
  );
}

export function getTvTopRated() {
  return fetch(`${BASE_PATH}/tv/top_rated?api_key=${API_KEY}`).then(response =>
    response.json()
  );
}

// Search
export function getMovieSearch() {
  return fetch(
    `${BASE_PATH}/search/movie?api_key=${API_KEY}&query=${"keyword"}`
  ).then(response => response.json());
}

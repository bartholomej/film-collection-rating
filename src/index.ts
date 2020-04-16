import fs from 'fs';
import path from 'path';
import axios from 'axios';
import parseTorrentName from 'parse-torrent-name';
import { MovieResult } from '@interfaces/interfaces';
import { TMDB_URL, FOLDER } from './config/vars';

const movieFolderPath = path.join(process.cwd(), FOLDER);

const showMovie = (movies: MovieResult[]) => {
  return movies
    .map((movie) => {
      return `
          ${movie.fileName}
          ${movie.data.title || ''}
          ${movie.data.vote_average || ''}
          ${movie.data.release_date || ''}
          `;
    })
    .join('');
};

fs.readdir(movieFolderPath, (err, folders) => {
  const movieNames = folders.map((item) => parseTorrentName(item).title);

  const movieNames$ = movieNames.map((movie) => axios.get(`${TMDB_URL}${movie}`));

  axios
    .all(movieNames$)
    .then(
      axios.spread((...args) => {
        const movieResults: MovieResult[] = folders.map((item, idx) => {
          return {
            fileName: item,
            title: parseTorrentName(item).title,
            year: parseTorrentName(item).year,
            data: args[idx].status === 200 && args[idx].data.total_results > 0 ? args[idx].data.results[0] : {},
          };
        });

        console.log(showMovie(movieResults));
      })
    )
    .catch((error) => {
      if (error.response) {
        console.log(error.response);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log('Error', error.message);
      }
      console.log(error.config);
    });
});

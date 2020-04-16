import fs from 'fs';
import path from 'path';
import axios from 'axios';
import parseTorrentName from 'parse-torrent-name';
import { MovieResult } from '@interfaces/interfaces';
import { TMDB_URL, FOLDER } from './config/vars';
import { shell } from 'electron';

const movieFolderPath = path.join(process.cwd(), FOLDER);

const showMovie = (movies: MovieResult[]) => {
  const html = movies
    .map((movie) => {
      return `
        <div
          class="card"
          title="${movie.fileName}"
          onclick="openFolder('${movieFolderPath}/${movie.fileName}')">
            <img width="200" src="https://image.tmdb.org/t/p/w500${movie.data.poster_path}"><br />
            <h1>${movie.data.title || ''}</h1>
            <div class="rating">${movie.data.vote_average || ''}</div>
            <div class="release-date">${movie.data.release_date || ''}</div>
        </div>
          `;
    })
    .join('');

  console.log(html);
  const child = document.createElement('div');
  child.className = 'cards';
  child.innerHTML = html;
  document.body.appendChild(child);
};

function openFolder(path: string): void {
  shell.showItemInFolder(path);
}

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

        showMovie(movieResults);
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

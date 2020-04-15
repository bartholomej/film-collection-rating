declare module 'parse-torrent-name' {
  export default function parseTorrentName(torrentString: string): Movie;

  interface Movie {
    year: number;
    resolution: string;
    quality: string;
    codec: string;
    group: string;
    title: string;
  }
}

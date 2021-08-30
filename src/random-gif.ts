import { useEffect, useState } from "react";
import { useConfig } from "./use-config";
const tags = [
  "loop",
  "chill",
  "vaporwave",
  "anime",
  "8bit",
  "simpsons",
  "space",
  "cats",
  "sunset",
  "surrealism",
  "shapes",
  "videogames",
  "fractal",
  "night",
  "driving",
  "beach",
  "party",
  "pizza",
  "japan",
  "tunnel",
  "90s",
  "80s",
  "seinfeld",
  "dali",
];
export function useRandomGIF(songTitle: string) {
  const [url, setUrl] = useState<string | null>(null);
  const [currentTimeout, setCurrentTimeout] = useState<number | null>(null);
  const config = useConfig();
  useEffect(() => {
    if (!config) {
      return;
    }

    if (currentTimeout) {
      clearTimeout(currentTimeout);
      setCurrentTimeout(null);
    }

    async function fetchNew() {
      const tagIndex =
        songTitle
          .split("")
          .reduce((total, letter) => total + letter.charCodeAt(0), 0) %
        tags.length;

      const giphy = {
        baseURL: "https://api.giphy.com/v1/gifs/",
        apiKey: config?.giphy_api_key,
        tag: tags[tagIndex],
        type: "random",
        rating: "pg-13",
      };
      let giphyURL = encodeURI(
        giphy.baseURL +
          giphy.type +
          "?api_key=" +
          giphy.apiKey +
          "&tag=" +
          giphy.tag +
          "&rating=" +
          giphy.rating
      );
      const req = await fetch(giphyURL);
      const data = await req.json();

      const img = new Image();

      img.src = data.data.image_original_url;

      img.onload = () => {
        setUrl(data.data.image_original_url);
        const tm = 10000 * Math.random();
        console.log("setting timeout for", tm);

        setCurrentTimeout(setTimeout(fetchNew, tm));
      };

      img.onerror = () => {
        setCurrentTimeout(setTimeout(fetchNew, 10000 * Math.random()));
      };
    }

    fetchNew();

    return () => {
      currentTimeout && clearTimeout(currentTimeout);
    };
  }, [config, songTitle]);

  return url;
}

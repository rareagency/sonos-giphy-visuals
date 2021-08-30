import React, { useState } from "react";

import "./App.css";
import { useRandomGIF } from "./random-gif";

function App() {
  const [cover, setCover] = React.useState<any>();
  React.useEffect(() => {
    async function fetchCover() {
      let activeSonos;
      try {
        const res = await fetch("http://localhost:5005/zones", {
          mode: "cors",
          headers: {
            Authorization: "Basic " + btoa("admin:password"),
          },
        });
        const data = await res.json();

        activeSonos = data.find(
          (d: any) => d.coordinator.state.playbackState === "PLAYING"
        );
      } catch (error) {
        setTimeout(fetchCover, 5000);
        return;
      }

      if (!activeSonos) {
        setTimeout(fetchCover, 5000);
        return;
      }

      const activeSonosState = activeSonos.coordinator.state;

      setCover(activeSonosState);
      setTimeout(fetchCover, 5000);
    }
    fetchCover();
  }, []);

  const gif = useRandomGIF(cover?.currentTrack.title || "");
  return (
    <div className="App">
      <div className="content" style={{ backgroundImage: `url(${gif})` }}></div>
      {cover && (
        <footer>
          <div className="footer-container">
            <div className="cover">
              <img
                className="cover-image"
                src={cover.currentTrack.albumArtUri}
              />
            </div>
            <div className="currently-playing">
              <label>Now playing</label>
              <div className="track-title">{cover.currentTrack.title}</div>
              <div className="track-artist">{cover.currentTrack.artist}</div>
              <div className="track-album">{cover.currentTrack.album}</div>
            </div>
            {cover.nextTrack && (
              <div className="next-up">
                <label>Next up</label>
                <div className="track-title">{cover.nextTrack.title}</div>
                <div className="track-artist">{cover.nextTrack.artist}</div>
                <div className="track-album">{cover.nextTrack.album}</div>
              </div>
            )}
          </div>
          <div className="footer-progress-container">
            <div
              style={{
                width:
                  (cover.elapsedTime / cover.currentTrack.duration) * 100 + "%",
              }}
              className="footer-progress"
            ></div>
          </div>
        </footer>
      )}
    </div>
  );
}

export default App;

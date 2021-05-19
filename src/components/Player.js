import React, { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import videojs from "video.js";
import { client } from "../utils";
import "video.js/dist/video-js.css";

const Player = ({ previewUrl, speedInit }) => {
  const videoRef = useRef(null);
  let nSpeed = Math.round(speedInit);


  const dispatch = useDispatch();
  let { id: videoId, url: src, thumb: poster, duration: duration } = useSelector(
    (state) => state.video.data
  );

  const changeQuality = async () => {

    const vjsPlayer = videojs(videoRef.current);

    let a = vjsPlayer.currentTime()
    //src = "https://res.cloudinary.com/dtelr3fsv/video/upload/q_1/v1619367127/youtube/qgtotofykmh7q8h7rnqd.mp4"


    vjsPlayer.src(src);
    vjsPlayer.currentTime(a);
    vjsPlayer.play();
  }

  const fetchSpeed = async () => {
    const { data } = await client(`${process.env.REACT_APP_BE}/videos/speed`);
    nSpeed = Math.round(data);
    console.log("(inside fetchSpeed) Network speed: " + nSpeed)

  }

  useEffect(() => {
    const interval = setInterval(() => {
      fetchSpeed();

    }, 1000);
    return () => {
      clearInterval(interval);
    }
  }, [])

  useEffect(() => {
    const vjsPlayer = videojs(videoRef.current);

    if (!previewUrl) {
      vjsPlayer.poster(poster);
      vjsPlayer.src(src);
    }

    if (previewUrl) {
      vjsPlayer.src({ type: "video/mp4", src: previewUrl });
    }

    vjsPlayer.on("ended", () => {
      client(`${process.env.REACT_APP_BE}/videos/${videoId}/view`);
    });

    return () => {
      if (vjsPlayer) {
        vjsPlayer.dispose();
      }
    };
  }, [videoId, dispatch, src, previewUrl, poster]);


  return (
    <div data-vjs-player>
      <video
        controls
        id="video"
        ref={videoRef}
        className="video-js vjs-fluid vjs-big-play-centered"
      ></video>
    </div>
  );
};

export default Player;

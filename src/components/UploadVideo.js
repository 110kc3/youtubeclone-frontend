import React, { useState } from "react";
import path from "path";
import { toast } from "react-toastify";
import { UploadIcon } from "./Icons";
import UploadVideoModal from "./UploadVideoModal";
import { upload } from "../utils";

const UploadVideo = () => {
  const [showModal, setShowModal] = useState(false);
  const [previewVideo, setPreviewVideo] = useState("");
  const closeModal = () => setShowModal(false);

  const [url, setUrl] = useState("");

  const [duration, setDuration] = useState(0);
  const [bitrate, setBitrate] = useState(0);
  const [bytes, setBytes] = useState(0);
  const [thumbnail, setThumbnail] = useState("");

  const loadVideo = file => new Promise((resolve, reject) => {
    try {
      let video = document.createElement('video')
      video.preload = 'metadata'

      video.onloadedmetadata = function () {
        resolve(this)
      }

      video.onerror = function () {
        reject("Invalid video. Please select a video file.")
      }

      video.src = window.URL.createObjectURL(file)
    } catch (e) {
      reject(e)
    }
  })

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    const video = await loadVideo(e.currentTarget.files[0])

    if (file) {
      const size = file.size / 1000000;

      console.log(file)

      if (size > 99) {
        return toast.error("Sorry, file size should be less than 99MB");
      }

      const url = URL.createObjectURL(file);
      setPreviewVideo(url);
      setShowModal(true);

      const data = await upload("video", file, Math.round(video.duration));
      setUrl(data.url);

      setDuration(data.duration);

      setBitrate(data.bitrate); //dodane
      setBytes(data.bytes); //dodane

      const ext = path.extname(data.url);
      setThumbnail(data.url.replace(ext, ".jpg"));
    }
  };

  return (
    <div>
      <label htmlFor="video-upload">
        <UploadIcon />
      </label>
      <input
        style={{ display: "none" }}
        id="video-upload"
        type="file"
        accept="video/*"
        onChange={handleVideoUpload}
      />
      {showModal && (
        <UploadVideoModal
          closeModal={closeModal}
          previewVideo={previewVideo}
          thumbnail={thumbnail}
          url={url}
          duration={duration}
          bitrate={bitrate} //dodane
          bytes={bytes} //dodane
        />
      )}
    </div>
  );
};

export default UploadVideo;

// AdUploadForm.js

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { adsUpload } from '../../actions/adsActions';

const AdUploadForm = () => {
  const dispatch = useDispatch();
  const [adData, setAdData] = useState({
    title: '',
    description: '',
    image: null,
    audio: null,
  });

  const handleChange = (e) => {
    setAdData({ ...adData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setAdData({ ...adData, image: e.target.files[0] });
  };

  const handleAudioChange = (e) => {
    setAdData({ ...adData, audio: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', adData.title);
    formData.append('description', adData.description);
    formData.append('image', adData.image);
    formData.append('audio', adData.audio);

    dispatch(adsUpload(formData));
  };

  return (
    <div className="ad-upload-form">
      <h3>Upload Your Ad</h3>
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input type="text" name="title" onChange={handleChange} />
        </label>
        <br />
        <label>
          Description:
          <textarea name="description" onChange={handleChange}></textarea>
        </label>
        <br />
        <label>
          Image:
          <input type="file" name="image" accept="image/*" onChange={handleImageChange} />
        </label>
        <br />
        <label>
          Audio:
          <input type="file" name="audio" accept="audio/*" onChange={handleAudioChange} />
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AdUploadForm;

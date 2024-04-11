import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { adsUpload } from '../../actions/adsActions';
import '../../designs/Ads.css'

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
<div className="card-ads">
  <div className="ad-upload-form">
    <h3>Upload Your Ad</h3>
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="title">Title:</label>
        <input type="text" id="title" name="title" onChange={handleChange} />
      </div>
      <div className="form-group">
        <label htmlFor="description">Description:</label>
        <textarea id="description" name="description" onChange={handleChange}></textarea>
      </div>
      <div className="form-group">
        <label htmlFor="image">Image:</label>
        <input type="file" id="image" name="image" accept="image/*" onChange={handleImageChange} />
      </div>
      <div className="form-group">
        <label htmlFor="audio">Audio:</label>
        <input type="file" id="audio" name="audio" accept="audio/*" onChange={handleAudioChange} />
      </div>
      <button type="submit">Submit</button>
    </form>
  </div>
</div>
  );
};

export default AdUploadForm;
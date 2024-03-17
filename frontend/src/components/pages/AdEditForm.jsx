import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { editAd } from '../../actions/adsActions';

const AdEditForm = ({ ad, onEditComplete }) => {
  const dispatch = useDispatch();
  const [editedAd, setEditedAd] = useState({ ...ad, image: null, audio: null });

  const handleChange = (e) => {
    const value = e.target.type === 'file' ? e.target.files[0] : e.target.value;

    setEditedAd({
      ...editedAd,
      [e.target.name]: value,
    });
  };

  const handleImageChange = (e) => {
    setEditedAd({
      ...editedAd,
      image: e.target.files[0],  // Store the File object in the state
    });
  };

  const handleAudioChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setEditedAd({
        ...editedAd,
        audio: e.target.files[0],  // Store the File object in the state if it exists
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const formData = new FormData();
  
    if (editedAd.title !== undefined && editedAd.title !== null) {
      formData.append('title', editedAd.title);
    }
  
    if (editedAd.description !== undefined && editedAd.description !== null) {
      formData.append('description', editedAd.description);
    }
  
    if (editedAd.image !== undefined && editedAd.image !== null) {
      formData.append('image', editedAd.image || ad.image);
    }
  
    if (editedAd.audio !== undefined && editedAd.audio !== null) {
      formData.append('audio', editedAd.audio || ad.audio);
    }
    
  
    dispatch(editAd(ad.id, formData));
    onEditComplete(); // Notify the parent component that editing is complete
  };

  return (
    <div className="ad-edit-form">
      <form onSubmit={handleSubmit}>
        <label className="form-label">
          Title:
          <input
            type="text"
            name="title"
            value={editedAd.title}
            onChange={handleChange}
            className="form-input"
          />
        </label>
        <label className="form-label">
          Description:
          <textarea
            name="description"
            value={editedAd.description}
            onChange={handleChange}
            className="form-input"
          />
        </label>
        <label className="form-label">
          Image:
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            name="image"
            className="form-input"
          />
        </label>
        <label className="form-label">
          Audio:
          <input
            type="file"
            accept="audio/*"
            onChange={handleAudioChange}
            name="audio"
            className="form-input"
          />
        </label>
        <button type="submit" className="upload-button">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default AdEditForm;

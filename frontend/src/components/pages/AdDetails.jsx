import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAd, deleteAd } from '../../actions/adsActions';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../Navbar'; // Import Navbar component
import AdEditForm from './AdEditForm'; // Import AdEditForm component

const AdDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  // Get user details for color and font
  const userDetails = useSelector((state) => state.userDetails.user);
  const color = userDetails?.data?.profile_data?.color || '#defaultColor';
  const selectedFont = userDetails?.data?.profile_data?.font || 'Arial, sans-serif';

  const adDetailsState = useSelector((state) => state.adsList);
  const { loading, error, ad } = adDetailsState;

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    dispatch(getAd(id));
  }, [dispatch, id]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleEditComplete = () => {
    setIsEditing(false);
    dispatch(getAd(id)); // Refresh ad details after editing
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this ad?')) {
      dispatch(deleteAd(id)).then(() => {
        // After successful delete, go back to the previous page
        navigate(-1);
      });
    }
  };

  // Function to handle navigating back
  const goBack = () => {
    navigate(-1);
  };

  // Check if loading
  if (loading) {
    return <p>Loading...</p>;
  }

  // Check if error
  if (error) {
    return <p>Error: {error}</p>;
  }

  // Check if ad is undefined or null
  if (!ad) {
    return <p>No ad found</p>;
  }

  return (
    <div style={{ display: 'flex', backgroundColor: color, minHeight: '100vh', color: '#fff', fontFamily: selectedFont }}>
      <Navbar color={color} />
      <div className='template-background' style={{ flex: 1, padding: '20px' }}>
        <h1>{ad.title}</h1>
        <p>{ad.description}</p>
        {/* Check if ad.image exists before rendering */}
        {ad.image && <img src={ad.image} alt={ad.title} style={{ maxWidth: '100%' }} />}
        {/* Check if ad.audio exists before rendering */}
        {ad.audio && (
          <audio controls className="ad-audio" style={{ marginTop: '20px' }}>
            <source src={ad.audio} type="audio/mp3" />
            Your browser does not support the audio tag.
          </audio>
        )}

        {/* Edit and Delete Buttons */}
        <div style={{ marginTop: '20px' }}>
          <button onClick={handleEdit}>Edit</button>
          <button onClick={handleDelete} style={{ marginLeft: '10px' }}>Delete</button>
        </div>

        {/* Display Edit Form when editing */}
        {isEditing && (
          <AdEditForm ad={ad} onEditComplete={handleEditComplete} />
        )}

        {/* Go Back Button */}
        <button onClick={goBack} style={{ marginTop: '20px' }}>Go Back</button>
      </div>
    </div>
  );
};

export default AdDetails;

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listAds } from '../../actions/adsActions';
import { Link } from 'react-router-dom'; 
import Navbar from '../Navbar';
import AdUploadForm from './AdUploadForm'; // Import the UploadAdForm component

const AdComponent = () => {
  const dispatch = useDispatch();
  const adsState = useSelector((state) => state.adsList);
  const { loading, error, ads } = adsState;
  const user = useSelector((state) => state.userDetails.user);
  const selectedFont = user?.data?.profile_data?.font || 'Arial, sans-serif';
  const color = user?.data?.profile_data?.color || '#defaultColor';

  const [showUploadForm, setShowUploadForm] = useState(false); // State to track if upload form should be shown

  useEffect(() => {
    dispatch(listAds());
  }, [dispatch]);

  const handleShowUploadForm = () => {
    setShowUploadForm(true); // Set the state to show the upload form when the button is clicked
  };

  const handleHideUploadForm = () => {
    setShowUploadForm(false); // Set the state to hide the upload form when the hide button is clicked
  };

  return (
    <div style={{ display: 'flex', backgroundColor: color, minHeight: '100vh', color: '#fff', fontFamily: selectedFont }}>
      <Navbar color={color}  />
      <div className='template-background' style={{ flex: 1, padding: '20px' }}>
        <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>Advertisement</h1>
        <div style={{ marginBottom: '20px' }}>
          {/* Conditionally render the upload form or button based on the state */}
          {showUploadForm ? (
            <div>
              <AdUploadForm />
              <button onClick={handleHideUploadForm}>Hide</button> {/* Button to hide the upload form */}
            </div>
          ) : (
            <button onClick={handleShowUploadForm}>Upload Ad</button>
          )}
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {ads && ads.map((ad) => (
              <li key={ad.id} style={{ marginBottom: '20px', borderBottom: '1px solid #444' }}>
                <div>
                  <Link to={`/ads/${ad.id}`} style={{ textDecoration: 'none', color: '#fff' }}>
                    <h3 style={{ margin: 0 }}>{ad.title}</h3>
                  </Link>
                  <p style={{ margin: '5px 0' }}>{ad.description}</p>
                  {ad.audio && (
                    <audio controls>
                      <source src={ad.audio} type="audio/mp3" />
                      Your browser does not support the audio tag.
                    </audio>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdComponent;

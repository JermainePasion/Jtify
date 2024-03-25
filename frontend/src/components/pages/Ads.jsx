import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listAds } from '../../actions/adsActions';
import { Link } from 'react-router-dom'; 
import Navbar from '../Navbar';
import AdUploadForm from './AdUploadForm';

const AdComponent = () => {
  const dispatch = useDispatch();
  const adsState = useSelector((state) => state.adsList);
  const { loading, error, ads } = adsState;
  const user = useSelector((state) => state.userDetails.user);
  const selectedFont = user?.data?.profile_data?.font || 'Arial, sans-serif';
  const color = user?.data?.profile_data?.color || '#defaultColor';

  const [showUploadForm, setShowUploadForm] = useState(false);

  useEffect(() => {
    dispatch(listAds());
  }, [dispatch]);

  const handleShowUploadForm = () => {
    setShowUploadForm(true);
  };

  const handleHideUploadForm = () => {
    setShowUploadForm(false);
  };

  return (
    <div style={{ display: 'flex', backgroundColor: color, minHeight: '115vh', color: '#fff', fontFamily: selectedFont }}>
      <Navbar />
      <div className='template-background' style={{ flex: 1, padding: '20px' }}>
        <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>Advertisement</h1>
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
                  {ad.image && <img src={ad.image} alt={ad.title} style={{ width: '64px', height: '64px', marginRight: '10px' }}  />}
                    <h3 style={{ margin: 0 }}>{ad.title}</h3>
                  </Link>
                  <p style={{ margin: '5px 0' }}>{ad.description}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
        <div style={{ marginBottom: '20px' }}>
          {showUploadForm ? (
            <div>
              <AdUploadForm />
              <button onClick={handleHideUploadForm}>Hide</button>
            </div>
          ) : (
            <button onClick={handleShowUploadForm}>Upload Ad</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdComponent;

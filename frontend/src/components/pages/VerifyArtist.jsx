import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { artistVerify } from '../../actions/userActions';
import { useParams } from 'react-router-dom';

const VerifyArtist = () => {
  const dispatch = useDispatch();
  const { loading, success, error } = useSelector((state) => state.artistVerify);
  const { token } = useParams(); // Get both token and artist_id from the URL

  useEffect(() => {
    dispatch(artistVerify(token)); // Pass both token and artist_id to the action
  }, [dispatch, token]);

  const handleVerifyClick = () => {
    dispatch(artistVerify(token)); // Pass both token and artist_id to the action
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px', backgroundColor: '#f0f0f0', padding: '20px', borderRadius: '10px', boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.5)', fontSize: '24px' }}>
      {loading && <p>Loading...</p>}
      {success && <p style={{ color: 'green', fontSize: '28px' }}>Artist verified successfully</p>}
      {error && <p style={{ color: 'red', fontSize: '28px' }}>{error.detail}</p>}
      {!loading && !success && !error && (
        <>
          {/* <p>Verifying artist...</p>
          <button onClick={handleVerifyClick} style={{ fontSize: '20px', padding: '10px 20px', marginTop: '20px' }}>Verify Again</button> */}
        </>
      )}
    </div>
  );
};

export default VerifyArtist;

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

  console.log("Error:", error); 
  console.log ("Token:", token);// Add this line to print the error received from the API

  return (
    <div>
      {loading && <p>Loading...</p>}
      {success && <p>Artist verified successfully</p>}
      {error && <p>{error.detail}</p>}
      <button onClick={handleVerifyClick} disabled={loading || success}>Verify</button>
    </div>
  );
};

export default VerifyArtist;

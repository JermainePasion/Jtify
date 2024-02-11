import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Navbar from '../Navbar';
import { getUserDetails, updateUserProfile } from '../../actions/userActions';
import { resetUpdateProfile } from '../../actions/userActions';

function Profile() {
  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state.userDetails);
  const userProfileUpdate = useSelector((state) => state.userUpdateProfile) ?? {};
  const { loading, error, user } = userDetails;
  const { success: updateSuccess, error: updateError } = userProfileUpdate;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [profilePicture, setProfilePicture] = useState(null); // Use null instead of an empty string
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    dispatch(getUserDetails());
  }, [dispatch]);

  useEffect(() => {
    if (updateSuccess) {
      // Reset the update profile state after a successful update
      dispatch(resetUpdateProfile());
    }
  }, [updateSuccess, dispatch]);

  useEffect(() => {
    if (user.data && user.data.user_data) {
      setName(user.data.user_data.name);
      setEmail(user.data.user_data.email);
    }
  }, [user]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      setProfilePicture(selectedFile);
      setFileName(selectedFile.name);
    } else {
      setProfilePicture(null);
      setFileName('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedUser = {
      name,
      email,
      ...(profilePicture && { profile: { image: profilePicture } }),
    };

    // Dispatch the updateUserProfile action
    await dispatch(updateUserProfile(updatedUser));

    // After updating the profile, fetch the updated user details
    dispatch(getUserDetails());
  };

  return (
    <div style={{ display: 'flex', width: '100vw', minHeight: '100vh', backgroundColor: 'black' }}>
        <Navbar />
      <div className='template-background' style={{ flex: 1, padding: '20px', textAlign: 'center', backgroundImage: `url('')`, backgroundSize: 'cover' }}>
        <h1 style={{ color: 'white', fontSize: '30px' }}>Profile Page</h1>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          <>
            {updateSuccess && <p style={{ color: 'green' }}>Profile updated successfully!</p>}
            {updateError && <p style={{ color: 'red' }}>{updateError}</p>}

            {user.data && user.data.profile_data && user.data.profile_data.image && (
              <img
                src={user.data.profile_data.image}
                alt='Profile'
                style={{ width: '150px', height: '150px', borderRadius: '50%', marginBottom: '20px' }}
              />
            )}

            {fileName && (
              <p style={{ color: 'white' }}>Selected file: {fileName}</p>
            )}

            {user.data && user.data.user_data && (
              <form onSubmit={handleSubmit}>
                <div>
                  <label>Name:</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                  <label>Email:</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                  <label>Profile Picture:</label>
                  <input type="file" onChange={handleFileChange} />
                </div>
                <button type="submit">Update Profile</button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
     );
    }
    export default Profile;
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Navbar from '../Navbar';
import { getUserDetails, updateUserProfile } from '../../actions/userActions';
import { resetUpdateProfile } from '../../actions/userActions';
import { SketchPicker } from 'react-color';

function Profile() {
  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state.userDetails);
  const userProfileUpdate = useSelector((state) => state.userUpdateProfile) ?? {};
  const { loading, error, user } = userDetails;
  const { success: updateSuccess, error: updateError } = userProfileUpdate;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [fileName, setFileName] = useState('');
  const [color, setColor] = useState('');

  const [showColorPicker, setShowColorPicker] = useState(false);

  useEffect(() => {
    dispatch(getUserDetails());
  }, [dispatch]);

  useEffect(() => {
    if (updateSuccess) {
      dispatch(resetUpdateProfile());
    }
  }, [updateSuccess, dispatch]);

  useEffect(() => {
    if (user.data && user.data.user_data) {
      setName(user.data.user_data.name);
      setEmail(user.data.user_data.email);
      setColor(user.data.profile_data.color);
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

  const handleColorChange = (newColor) => {
    setColor(newColor.hex);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedUser = {
      name,
      email,
      color,
      ...(profilePicture && { profile: { image: profilePicture } }),
    };

    await dispatch(updateUserProfile(updatedUser));
    dispatch(getUserDetails());
  };

  return (
    <div style={{ display: 'flex', width: '100vw', minHeight: '100vh', backgroundColor: color }}>
      <Navbar />
      <div className='template-background' style={{ flex: 1, padding: '20px', textAlign: 'center', backgroundImage: `url('')`, backgroundSize: 'cover' }}>
        <h1 style={{ color: 'white', fontSize: '30px', marginBottom: '20px' }}>Profile Page</h1>

        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p>Error: {error}</p>
            ) : (
              <>
                {updateSuccess && <p style={{ color: 'green', marginBottom: '15px' }}>Profile updated successfully!</p>}
                {updateError && <p style={{ color: 'red', marginBottom: '15px' }}>{updateError}</p>}

                {user.data && user.data.profile_data && user.data.profile_data.image && (
                  <img
                    src={user.data.profile_data.image}
                    alt='Profile'
                    style={{ width: '150px', height: '150px', borderRadius: '50%', marginBottom: '20px' }}
                  />
                )}

                <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '400px' }}>
                  <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="name" style={{ color: 'white', display: 'block', marginBottom: '5px' }}>Name:</label>
                    <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} style={{ width: '100%', padding: '8px' }} />
                  </div>
                  <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="email" style={{ color: 'white', display: 'block', marginBottom: '5px' }}>Email:</label>
                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '8px' }} />
                  </div>
                  <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="profilePicture" style={{ color: 'white', display: 'block', marginBottom: '5px' }}>Profile Picture:</label>
                    <input type="file" id="profilePicture" onChange={handleFileChange} style={{ width: '100%' }} />
                  </div>
                  <div style={{ marginBottom: '15px', position: 'relative' }}>
                    <label htmlFor="color" style={{ color: 'white', display: 'block', marginBottom: '5px' }}>Profile Color:</label>
                    <div
                      style={{ backgroundColor: color, width: '30px', height: '30px', cursor: 'pointer', border: '1px solid #fff', marginBottom: '10px' }}
                      onClick={() => setShowColorPicker((prev) => !prev)}
                    ></div>
                    {showColorPicker && (
                      <div style={{ position: 'fixed', zIndex: 1, top: '50%', left: '50%', transform: 'translate(-50%, -50%)', marginTop: '10px' }}>
                        <SketchPicker color={color} onChange={handleColorChange} />
                      </div>
                    )}
                  </div>
                  <button type="submit" style={{ padding: '10px', backgroundColor: '#61dafb', color: 'white', border: 'none', cursor: 'pointer', width: '100%' }}>Update Profile</button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;

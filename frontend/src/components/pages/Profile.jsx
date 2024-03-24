import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Navbar from '../Navbar';
import { getUserDetails, updateUserProfile } from '../../actions/userActions';
import { resetUpdateProfile } from '../../actions/userActions';
import { SketchPicker } from 'react-color';
import { Card } from 'react-bootstrap';

const FontChoices = [
  ['Default', 'Default'],
  ['Open Sans', 'Open Sans'],
  ['Young Serif', 'Young Serif'],
  ['Roboto Slab', 'Roboto Slab'],
  ['Roboto Mono', 'Roboto Mono'],
  ['Noto Sans JP', 'Noto Sans JP'],
  ['Yuji Hentaigana Akari', 'Yuji Hentaigana Akari'],
  ['Agbalumo', 'Agbalumo'],
  ['Alegreya Sans', 'Alegreya Sans'],
  ['Montserrat', 'Montserrat'],
  ['Edu TAS Begginer', 'Edu TAS Begginer'],
  ['Playpen Sans', 'Playpen Sans'],
];

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
  const [selectedFont, setSelectedFont] = useState(user?.data?.profile_data?.font);

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
    if (user?.data?.user_data) {
      setName(user.data.user_data.name);
      setEmail(user.data.user_data.email);
    }

    if (user?.data?.profile_data) {
      setColor(user.data.profile_data.color);
    }

    if (user?.data?.profile_data) {
      setSelectedFont(user.data.profile_data.font);
    }
  }, [user]);

  useEffect(() => {
    const head = document.head || document.getElementsByTagName('head')[0];
    const link = document.createElement('link');
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css?family=${selectedFont}`;
    head.appendChild(link);
  }, [selectedFont]);
  

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

  const handleFontChange = (e) => {
    setSelectedFont(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const updatedUser = {
      name,
      email,
      color,
      font: selectedFont,
    };
  
    await dispatch(updateUserProfile(updatedUser, profilePicture));
    dispatch(getUserDetails());
  };

  return (
    <div style={{ display: 'flex', width: '100vw', minHeight: '180vh', backgroundColor: color, fontFamily: selectedFont }}>
      <Navbar />
      <div className='template-background' style={{ 
        flex: 1, 
        marginLeft: '10px', 
        position: 'relative', 
        padding: '10px 20px', // Increase padding for better spacing
        backgroundSize: '110%',
        backgroundRepeat: 'no-repeat'

      }}>
      <div className='profile-container'>
          <div>
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p>Error: {error}</p>
            ) : (
              <>
                {updateSuccess && <p style={{ color: 'green', marginBottom: '15px' }}>Profile updated successfully!</p>}
                {updateError && <p style={{ color: 'red', marginBottom: '15px' }}>{updateError}</p>}

                {user.data && user.data.profile_data && user.data.profile_data.image && (
                  <div className='profile-card' style={{backgroundColor: color}}>
                  <img
                    src={user.data.profile_data.image}
                    alt='Profile'
                  />
                  <div style={{ marginRight: '20px' }}>
                  <h1 className='h1'>Profile</h1>
                  <h1 className='h1'>{name}</h1>
                  </div>  
                  </div>
                )}
                
                <form onSubmit={handleSubmit} >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '15px', 
                  borderRadius: '10px', opacity: 0.9, marginTop: '-0.5rem', marginLeft:'-1rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'row1', justifyContent: 'center' }}>
                  {/* Name and Email Card  */}
                  <Card style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', height: '500px', width: '720px', padding: '15px', 
                  borderRadius: '10px', backgroundColor: color, opacity: 0.9, marginTop: '0.1rem', marginLeft: '1rem', marginRight: '0.5rem'}}>
                  <div className='name-card'>
                  <div>
                    <label htmlFor="name" style={{ color: 'white', display: 'block', marginBottom: '5px' }}>Name:</label>
                    <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                  <div style={{ marginBottom: '15px', marginLeft: '20px'}}>
                    <label htmlFor="email" style={{ color: 'white', display: 'block', marginBottom: '5px' }}>Email:</label>
                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                  </div>
                  </div>
                  </Card>
                  {/* Profile, Color, and Fonts Card */}
                  <Card style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', height: '500px', width: '720px', padding: '15px', 
                  borderRadius: '10px', backgroundColor: color , opacity: 0.9, marginTop: '0.1rem', marginLeft: '0.1rem'}}>
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1, alignItems: 'left', position: 'relative'}}>
              <div style={{ marginBottom: '15px', marginLeft: '20px', color: 'white' }}>
                <label htmlFor="profilePicture" style={{ display: 'block', marginBottom: '5px' }}>Profile Picture:</label>
                <input type="file" id="profilePicture" onChange={handleFileChange} style={{ width: '100%', color: 'white' }} />
                {fileName && <p style={{ marginTop: '5px' }}></p>} {/* Display file name if a file has been selected */}
              </div>
                  <div style={{ marginBottom: '15px', position: 'relative', marginLeft: '20px' }}>
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
                  <div style={{ marginBottom: '15px', marginLeft: '20px'}}>
                    <label htmlFor="font" style={{ color: 'white', display: 'block', marginBottom: '5px' }}>Select Font:</label>
                    <select id="font" value={selectedFont} onChange={handleFontChange} style={{ width: '100%', padding: '8px' }}>
                      {FontChoices.map(([key, value]) => (
                        <option key={key} value={value}>
                          {value}
                        </option>
                      ))}
                    </select>
                  </div>
                  </div>
                  </Card>
                  </div>
                  <button className='custom-button' type="submit" style={{alignContent: 'center', padding: '10px',  color: 'white', border: 'none', 
                  cursor: 'pointer', width: '50%', marginTop: '20px' }}>Update Profile</button>
                </div>
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

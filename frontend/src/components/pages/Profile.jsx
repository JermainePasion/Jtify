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
    <div style={{ display: 'flex', width: '100vw', height: '100vh', backgroundColor: color, fontFamily: selectedFont }}>
      <Navbar />
      <div className='template-background' >
      <Card style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', height: '100vh', width: '100vw', padding: '20px', 
        borderRadius: '10px',  margin: '5px', opacity: 0.9, marginTop: '-5px'}}>

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
                  <Card style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', height: '250px', width: '1490px', padding: '15px', 
                    borderRadius: '10px', backgroundColor: 'rgba(255, 255, 255, 0.18)', opacity: 0.9, marginLeft: '-7px', marginTop: '-60px'}}>
                  <img
                    src={user.data.profile_data.image}
                    alt='Profile'
                    style={{ width: '200px', height: '200px', borderRadius: '50%', marginBottom: '20px', marginLeft: '50px', marginTop: '50px' }}
                  />
                  <div style={{ marginRight: '20px' }}>
                  <h1 style={{ color: 'white', fontSize: '20px', marginBottom: '-30px', textAlign: 'left', marginLeft: '20px' }}>Profile : </h1>
                  <h1 style={{ color: 'white', fontSize: '35px', marginBottom: '20px', textAlign: 'left',  marginLeft: '20px' }}>{name}</h1>
                  </div>
                  </Card>
                )}
                
                <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '400px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '600px', width: '1490px', padding: '15px', 
                  borderRadius: '10px', opacity: 0.9, marginTop: '-15px', marginLeft: '-7px'}}>
                  <div style={{ display: 'flex', flexDirection: 'row1', justifyContent: 'center' }}>
                  {/* Name and Email Card  */}
                  <Card style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', height: '500px', width: '725px', padding: '15px', 
                  borderRadius: '10px', backgroundColor: 'rgba(255, 255, 255, 0.18)', opacity: 0.9, marginTop: '10px', marginLeft: '-5px', marginRight: '15px'}}>
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1, alignItems: 'left', position: 'relative'}}>
                  <div style={{ marginBottom: '10px', marginLeft: '20px'}}>
                    <label htmlFor="name" style={{ color: 'white', display: 'block', marginBottom: '5px' }}>Name:</label>
                    <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} style={{ width: '90%', padding: '8px' }} />
                  </div>
                  <div style={{ marginBottom: '15px', marginLeft: '20px'}}>
                    <label htmlFor="email" style={{ color: 'white', display: 'block', marginBottom: '5px' }}>Email:</label>
                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '90%', padding: '8px' }} />
                  </div>
                  </div>
                  </Card>
                  {/* Profile, Color, and Fonts Card */}
                  <Card style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', height: '500px', width: '725px', padding: '15px', 
                  borderRadius: '10px', backgroundColor: color, opacity: 0.9, marginTop: '10px', marginLeft: '-7px'}}>
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
                  <button type="submit" style={{ alignContent: 'center', padding: '10px', backgroundColor: 'rgb(130,50,139)', color: 'white', border: 'none', 
                  cursor: 'pointer', width: '50%', marginTop: '20px' }}>Update Profile</button>
                </div>
                </form>
              </>
            )}
          </div>
        </Card>
      </div>
    </div>

  );
}

export default Profile;

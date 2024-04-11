import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '../Navbar';
import { Container, ListGroup, Image } from 'react-bootstrap';
import { getUserDetails } from '../../actions/userActions';
import { BsSearch } from 'react-icons/bs';
import Song from '../Song';
import Playlist from '../Playlist';
import axios from 'axios';
import VerifiedIcon from '../img/VerifiedIcon.png';
import { updatePlayCount } from '../../actions/songActions';
import { setCurrentlyPlayingSong, togglePlayerVisibility } from '../../actions/musicPlayerActions';

const UserProfile = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const [userData, setUserData] = useState(null);
    const [profileData, setProfileData] = useState(null);
    const [uploadedSongs, setUploadedSongs] = useState([]);
    const [createdPlaylists, setCreatedPlaylists] = useState([]);
    const [error, setError] = useState(null);
    const user = useSelector(state => state.userDetails.user);
    const color = user?.data?.profile_data?.color || '#defaultColor';
    const selectedFont = user?.data?.profile_data?.font || 'defaultFont';
    const [scrollPosition, setScrollPosition] = useState(0);
    const [showMinimizedProfile, setShowMinimizedProfile] = useState(false);
    const Songs = useSelector((state) => state.songList.songs);

    useEffect(() => {
        const handleScroll = () => {
            setScrollPosition(window.scrollY);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        // Fetch user data, uploaded songs, and created playlists when component mounts
        dispatch(getUserDetails());

        const fetchUserData = async () => {
            try {
                const userResponse = await axios.get(`/api/user/user-profile/${id}`);
                const { profile, profile_data, uploaded_songs, created_playlists } = userResponse.data;
                setUserData(profile);
                setUploadedSongs(uploaded_songs);
                setCreatedPlaylists(created_playlists);
                // Set profile_data in state
                setProfileData(profile_data);
            } catch (error) {
                setError(error.message);
            }
        };
        fetchUserData();

        // Cleanup function
        return () => {
            // Perform cleanup if necessary
        };
    }, [id]);

    useEffect(() => {
        if (scrollPosition > 50) {
            setShowMinimizedProfile(true);
        } else {
            setShowMinimizedProfile(false);
        }
    }, [scrollPosition]);
    const playSong = async (index) => {
        const song = Songs[index];
        console.log("Playing song:", song);
        try {
          // Dispatch the updatePlayCount action to update the play count
          await dispatch(updatePlayCount(song.id, user.data.user_data.id));
        } catch (error) {
          // Handle any errors
          console.error('Error updating play count:', error);
        }
      
        setCurrentlyPlayingSong(song);
        dispatch(setCurrentlyPlayingSong(song));
        dispatch(togglePlayerVisibility());
      };

      const handleSongClick = (index) => {
        console.log("Clicked song index:", index);
        // Play the clicked song
        playSong(index);
    };
    

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: color, fontFamily: selectedFont }}>
            <Navbar />
            <div className='template-background-wrapper' style={{ overflowY: 'auto', flex: 1 }}>
                <div className='template-background' style={{
                    marginLeft: '10px',
                    position: 'relative',
                    padding: '10px 20px', // Increase padding for better spacing
                    backgroundSize: 'cover',
                }}>
                    {error && <p>Error: {error}</p>}
                    {userData && (
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div style={{ flex: '1', backgroundImage: `url(${profileData.image})`, backgroundSize: 'cover', backgroundPosition: 'center', height: '250px', marginRight: '-20px', marginLeft: '-20px', marginTop: '-10px', borderRadius: '15px', position: 'relative' }}>
                                    <h2 style={{ color: 'white', textAlign: 'left', fontFamily: selectedFont, fontSize: '20px', marginTop: showMinimizedProfile ? '10px' : '110px', marginBottom: '1px', marginLeft: '75px', transition: 'margin-top 0.5s' }}><img src={VerifiedIcon} alt="Verified Icon" style={{ width: '30px', height: '30px', marginTop:'-140px', marginLeft: '-30px', }} />Verified Artist</h2>
                                    <strong style={{ color: 'white', textAlign: 'left', fontFamily: selectedFont, fontSize: '60px', marginTop: showMinimizedProfile ? '10px' : '5px', marginLeft: '50px', transition: 'margin-top 0.5s' }}>{userData.name}'s Profile</strong>
                                </div>
                            </div>
                            {showMinimizedProfile && (
                                <div style={{ display: 'flex', position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 999 }}>
                                    <div style={{ flex: '1', backgroundImage: `url(${profileData.image})`, backgroundSize: 'cover', backgroundPosition: 'center', height: '70px', marginRight: '10px', marginLeft: '350px', marginTop: '0px', borderRadius: '15px', position: 'relative', mixBlendMode: 'darken'  }}>
                                    <strong style={{ color: 'white', textAlign: 'left', fontFamily: selectedFont, fontSize: '50px', marginTop: showMinimizedProfile ? '10px' : '5px', marginLeft: '50px', transition: 'margin-top 0.5s' }}>{userData.name}'s Profile</strong>
                                    </div>
                                </div>
                            )}
                            <div style={{ display: 'flex', flexDirection: 'column', marginTop: showMinimizedProfile ? '10px' : '20px', marginBottom: '20px' }}>
                                <h3 style={{ color: 'white', fontFamily: selectedFont, fontSize: '24px', marginBottom: '10px' }}>Songs</h3>
                                <div style={{ marginBottom: '30px' }}>
                                    <ListGroup variant="flush">
                                        {uploadedSongs.map((uploadedSong, index) => (
                                            <ListGroup.Item key={index} className="position-relative" style={{ backgroundColor: 'transparent', color: '#ffffff', fontFamily: selectedFont, border: 'none', position: 'relative', marginBottom: '10px',marginLeft:'10px', borderRadius: '8px', padding: '15px' }} onClick={() => handleSongClick(index)}>
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <div style={{ marginRight: '15px', fontSize: '16px', fontWeight: 'bold' }}>{index + 1}</div> {/* Added line to display the index + 1 */}
                                                    <Image src={uploadedSong.picture} alt={uploadedSong.name} rounded style={{ width: '64px', height: '64px', marginRight: '15px' }} />
                                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                        <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '5px' }}>{uploadedSong.name}</div>
                                                        <div style={{ fontSize: '14px' }}><span style={{ fontWeight: 'normal' }}>{uploadedSong.artist}</span></div>
                                                    </div>
                                                </div>
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                </div>
                                <h3 style={{ color: 'white', fontFamily: selectedFont, fontSize: '24px', marginBottom: '10px' }}>Created Playlists</h3>
                                <div style={{ display: 'flex', flexDirection: 'row', overflowX: 'auto' }}>
                                    {createdPlaylists.map(playlist => (
                                        <Playlist key={playlist.id} playlist={playlist} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
);

}

export default UserProfile;

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

const UserProfile = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const [userData, setUserData] = useState(null);
    const [uploadedSongs, setUploadedSongs] = useState([]);
    const [createdPlaylists, setCreatedPlaylists] = useState([]);
    const [error, setError] = useState(null);
    const user = useSelector(state => state.userDetails.user);
    const color = user?.data?.profile_data?.color || '#defaultColor';
    const selectedFont = user?.data?.profile_data?.font || 'defaultFont';

    useEffect(() => {
        // Fetch user data, uploaded songs, and created playlists when component mounts
        dispatch(getUserDetails());
        const fetchUserData = async () => {
            try {
                const userResponse = await axios.get(`/api/user/user-profile/${id}`);
                const { profile, uploaded_songs, created_playlists } = userResponse.data;
                setUserData(profile);
                setUploadedSongs(uploaded_songs);
                setCreatedPlaylists(created_playlists);
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

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: color, fontFamily: selectedFont }}>
            <Navbar />
            <div className='template-background' style={{
                flex: 1,
                marginLeft: '10px',
                position: 'relative',
                overflowX: 'auto',
                padding: '10px 20px', // Increase padding for better spacing
                backgroundSize: 'cover',
            }}>
                {error && <p>Error: {error}</p>}
                {userData && (
                    <div>
                        <h2 style={{ color: 'white', textAlign: 'left', fontFamily: selectedFont, fontSize: '40px', marginBottom: '20px' }}>{userData.name}'s Profile</h2>
                        <h3 style={{ color: 'white', fontFamily: selectedFont, fontSize: '24px', marginBottom: '10px' }}>Songs</h3>
                        <div style={{ marginBottom: '30px' }}>
                            <ListGroup variant="flush">
                                {uploadedSongs.map((uploadedSong, index) => (
                                    <ListGroup.Item key={index} className="position-relative" style={{ backgroundColor: 'transparent', color: '#ffffff', fontFamily: selectedFont, border: 'none', position: 'relative', marginBottom: '10px', marginLeft: '10px', borderRadius: '8px', padding: '15px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
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
                )}
            </div>
        </div>
    );
}

export default UserProfile;

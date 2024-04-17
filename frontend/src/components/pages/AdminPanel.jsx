import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { adminPanel } from '../../actions/userActions'; 
import { getUserDetails } from '../../actions/userActions';
import { listSongs } from "../../actions/songActions";
import { fetchSongPlayCount } from '../../actions/songActions';
import Navbar from '../Navbar';
import {Chart, ArcElement, registerables} from 'chart.js'
import { FaStepBackward, FaStepForward } from 'react-icons/fa';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const AdminPanel = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.userDetails);
  const color = user?.data?.profile_data?.color || '#defaultColor';
  const font = user?.data?.profile_data?.font || 'defaultFont';
  const { users, loading, error } = useSelector(state => state.adminPanelUsers);
  const [permissions, setPermissions] = useState({});
  const { songs } = useSelector(
    (state) => state.songList
  );
  const { songPlayCounts } = useSelector(state => state.songPlayCount);
  const [showNavbar, setShowNavbar] = useState(true);
  
  useEffect(() => {
    dispatch(getUserDetails());
  }, [dispatch]);

  useEffect(() => {
    dispatch(adminPanel()); // Fetch users on component mount
    dispatch(listSongs());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchSongPlayCount());
  }, [dispatch]);

  Chart.register(ArcElement);
  Chart.register(...registerables);

  const chartRef = useRef(null);
  const subscriberChartRef = useRef(null);
 

  useEffect(() => {
    if (chartRef && chartRef.current) {
      const songCount = songs.length;
      const artistCount = users.filter(user => user.permissions.is_artist).length;
  
      const chartData = {
        labels: ['Songs Uploaded', 'Artists'],
        datasets: [{
          data: [songCount, artistCount],
          backgroundColor: ['#9938A3', '#5CCFCF'],
          hoverBackgroundColor: ['#c74ad4', '#5be3e3']
        }]
      };
      const chartOptions = {
        plugins: {
          tooltip: {
            callbacks: {
              label: function(context) {
                let label = '';
                if (context.datasetIndex === 0) {
                  label = `${context.dataset.data[context.dataIndex]}`;
                } else if (context.datasetIndex === 1) {
                  label = `${context.label}: ${context.dataset.data[context.dataIndex]}`;
                }
                return label;
              }
            }
          }
        }
      };
  
      const chart = new Chart(chartRef.current, {
        type: 'pie',
        data: chartData,
        options: chartOptions
      });
  
      return () => chart.destroy();
    }
  }, [songs, users]);
  
  useEffect(() => {
    if (subscriberChartRef && subscriberChartRef.current) {
      const unsubscribedCount = users.filter(user => !user.permissions.is_subscriber).length;
      const subscriberCount = users.filter(user => user.permissions.is_subscriber).length;
  
      const chartData = {
        labels: ['User Count'], 
        datasets: [{
          label: 'Subscribed Users',
          data: [subscriberCount],
          backgroundColor: '#0a99fa',
          hoverBackgroundColor: '#36A2EB'
        }, {
          label: 'Unsubscribed Users',
          data: [unsubscribedCount],
          backgroundColor: '#fa2d58',
          hoverBackgroundColor: '#FF6384'
        }]
      };
  
      const chartOptions = {
        indexAxis: 'y', 
        plugins: {
          tooltip: {
            callbacks: {
              label: function(context) {
                let label = '';
                if (context.datasetIndex === 0) {
                  label = ` ${chartData.datasets[0].data[context.dataIndex]}`;
                } else if (context.datasetIndex === 1) {
                  label = `${chartData.datasets[1].data[context.dataIndex]}`;
                }
                return label;
              }
            }
          }
        }
      };
  
      const chart = new Chart(subscriberChartRef.current, { // Use the new ref here
        type: 'bar', // Change chart type to bar
        data: chartData,
        options: chartOptions
      });
  
      return () => chart.destroy();
    }
  }, [users]);

  // Initialize permissions when users data changes
  useEffect(() => {
    if (users.length > 0) {
      const initialPermissions = {};
      users.forEach(user => {
        initialPermissions[user.id] = {
          is_superuser: user.permissions.is_superuser,
          is_artist: user.permissions.is_artist,
          is_subscriber: user.permissions.is_subscriber,
        };
      });
      setPermissions(initialPermissions);
    }
  }, [users]);

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        dispatch({ type: 'DELETE_USER_REQUEST' });

        // Send DELETE request to delete user from the server
        await fetch(`/api/user/adminpanel/${userId}/delete`, {
          method: 'DELETE',
        });

        // Dispatch DELETE_USER_SUCCESS action to update state after successful deletion
        dispatch({
          type: 'DELETE_USER_SUCCESS',
          payload: userId,
        });
      } catch (error) {
        // Dispatch DELETE_USER_FAILURE action in case of error
        dispatch({
          type: 'DELETE_USER_FAILURE',
          payload: error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
        });
      }
    }
  };

  const handleCheckboxChange = (userId, permission, value) => {
    setPermissions(prevPermissions => ({
      ...prevPermissions,
      [userId]: {
        ...prevPermissions[userId],
        [permission]: value,
      },
    }));
  
    // Update checkbox state immediately
    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        return {
          ...user,
          permissions: {
            ...user.permissions,
            [permission]: value,
          },
        };
      }
      return user;
    });
    dispatch({
      type: 'GET_USERS_SUCCESS',
      payload: updatedUsers,
    });
  };

  const handleUpdatePermissions = async () => {
    try {
      dispatch({ type: 'UPDATE_USER_REQUEST' });

      // Iterate through each user and send PUT request to update permissions
      await Promise.all(users.map(async user => {
        await fetch(`/api/user/adminpanel/${user.id}/update/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: user.id,
            permissions: permissions[user.id],
          }),
        });
      }));

      // Dispatch UPDATE_USER_SUCCESS action to update state after successful update
      dispatch({
        type: 'UPDATE_USER_SUCCESS',
        payload: { users, permissions },
      });
    } catch (error) {
      // Dispatch UPDATE_USER_FAILURE action in case of error
      dispatch({
        type: 'UPDATE_USER_FAILURE',
        payload: error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
      });
    }
  };

  const calculateRevenue = (playCount) => {
    if (playCount >= 1000000) {
      return '₱150,000'; // 1,000,000 clicks
    } else if (playCount >= 100000) {
      return '₱15,000'; // 100,000 clicks
    } else if (playCount >= 10000) {
      return '₱1,500'; // 10,000 clicks
    } else if (playCount >= 1000) {
      const thousands = Math.floor(playCount / 1000);
      const revenue = thousands * 150;
      return `₱${revenue.toLocaleString()}`; // For play counts between 1,000 and 999,999, calculate revenue based on multiples of 1,000
    } else if (playCount >= 100) {
      const hundreds = Math.floor(playCount / 100);
      const revenue = hundreds * 15;
      return `₱${revenue.toLocaleString()}`; // For play counts between 100 and 999, calculate revenue based on multiples of 100
    } else {
      return '₱0'; // For play counts less than 100
    }
  };
  
  const toggleNavbar = () => {
    setShowNavbar(!showNavbar);
  };

  return (

    
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: color, fontFamily: font }}>
     {showNavbar && <Navbar />}
      <div className='template-background' style={{ 
        flex: 1, 
        marginLeft: '10px', 
        position: 'relative', 
        padding: '10px 20px', 
        backgroundSize: '110%',
        backgroundRepeat: 'no-repeat'

      }}>
        <div style={{ position: 'absolute', top: '10px', left: '5px' }}>
            <FontAwesomeIcon
              icon={faBars}
              style={{
                cursor: 'pointer',
                color: '#fff',
                fontSize: '20px',
                transform: showNavbar ? 'rotate(0deg)' : 'rotate(90deg)',
                transition: 'transform 0.3s ease',
              }}
              onClick={toggleNavbar}
            />
          </div>
      <h2 style={{ fontSize: '40px', color: 'white', marginBottom: '20px' }}>Admin Panel</h2>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: '500px' }}>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '500px' }}>
  <canvas ref={chartRef}></canvas>
  <canvas ref={subscriberChartRef}></canvas>
</div>
</div>


      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>{error}</div>
      ) : (
          
        
        <div className="card" style={{ backgroundColor: '#f0f0f0', padding: '20px', borderRadius: '8px', maxHeight: '400px', overflowY: 'auto', marginTop: '40px' }}>
  <table style={{ width: '100%' }}>
    <thead>
      <tr>
        <th style={{ textAlign: 'left' }}>ID</th>
        <th>Name</th>
        <th>Email</th>
        <th>Permissions</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
    {users.map((user, index) => (
      <React.Fragment key={user.id}>
        <tr>
          <td>{user.id}</td>
          <td style={{ textAlign: 'center' }}>{user.name}</td>
          <td style={{ textAlign: 'center' }}>{user.email}</td>
          <td style={{ textAlign: 'center' }}>
            <input
              type="checkbox"
              checked={permissions[user.id]?.is_superuser || user.permissions.is_superuser}
              onChange={(e) => handleCheckboxChange(user.id, 'is_superuser', e.target.checked)}
            /> Superuser<br />
            <input
              type="checkbox"
              checked={permissions[user.id]?.is_artist || user.permissions.is_artist}
              onChange={(e) => handleCheckboxChange(user.id, 'is_artist', e.target.checked)}
            /> Artist<br />
            <input
              type="checkbox"
              checked={permissions[user.id]?.is_subscriber || user.permissions.is_subscriber}
              onChange={(e) => handleCheckboxChange(user.id, 'is_subscriber', e.target.checked)}
            /> Subscriber
          </td>
          <td style={{ textAlign: 'center' }}>
              <button className='admin-button' onClick={() => handleDeleteUser(user.id)}>Delete</button>
          </td>
        </tr>
        {index % 2 === 0 && <tr><td colSpan="5" style={{ height: '1px', backgroundColor: '#ddd' }}></td></tr>}
      </React.Fragment>
    ))}
  </tbody>
  </table>
</div>
)}
<div style={{ display: 'flex', justifyContent: 'left', marginTop: '20px' }}>
<button className='custom-button' onClick={handleUpdatePermissions}>Save Permissions</button>
</div>
<h2 style={{ fontSize: '40px', color: 'white', marginBottom: '20px' }}>Royalties</h2>
<div className="card" style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginTop: '40px', marginBottom: '100px', overflowY: 'auto',maxHeight: '400px' }}>
  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
    <thead>
      <tr style={{ borderBottom: '1px solid #ddd' }}>
        <th style={{ padding: '12px 0', textAlign: 'left', fontWeight: 'bold', color: '#555' }}>ID</th>
        <th style={{ padding: '12px 0', fontWeight: 'bold', color: '#555' }}>Name</th>
        <th style={{ padding: '12px 0', fontWeight: 'bold', color: '#555' }}>Play Count</th>
        <th style={{ padding: '12px 0', fontWeight: 'bold', color: '#555' }}>Revenue</th> {/* Added Revenue column */}
        <th style={{ padding: '12px 0', fontWeight: 'bold', color: '#555' }}>User</th>
      </tr>
    </thead>
    <tbody>
      {[...songPlayCounts].sort((a, b) => a.name.localeCompare(b.name)).map((song, index) => (
        <React.Fragment key={song.id}>
          <tr style={{ borderBottom: '1px solid #ddd', backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#fff' }}>
            <td style={{ padding: '12px 0', textAlign: 'left', color: '#333' }}>{song.id}</td>
            <td style={{ padding: '12px 0', textAlign: 'center', color: '#333' }}>{song.name}</td>
            <td style={{ padding: '12px 0', textAlign: 'center', color: '#333' }}>{song.play_count}</td>
            <td style={{ padding: '12px 0', textAlign: 'center', color: '#333' }}>{calculateRevenue(song.play_count)}</td> {/* Added Revenue column */}
            <td style={{ padding: '12px 0', textAlign: 'center', color: '#333' }}>{song.user}</td>
          </tr>
        </React.Fragment>
      ))}
    </tbody>
  </table>
</div>
<h2 style={{ fontSize: '40px', color: 'white', marginBottom: '0px' }}>Legend</h2>
<div className="card" style={{ margin: '0 auto', backgroundColor: '#f0f0f0', padding: '20px', borderRadius: '8px', marginTop: '20px', marginBottom: '200px', maxWidth: '300px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)' }}>
    <table style={{ width: '100%', textAlign: 'center', fontSize: '16px', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ backgroundColor: '#e0e0e0', color: '#333', fontWeight: 'bold' }}>
          <th style={{ padding: '12px 0', borderBottom: '1px solid #ccc' }}>Clicks</th>
          <th style={{ padding: '12px 0', borderBottom: '1px solid #ccc' }}>Revenue</th>
        </tr>
      </thead>
      <tbody>
        <tr style={{ backgroundColor: '#f5f5f5' }}>
          <td style={{ padding: '12px 0', borderBottom: '1px solid #ccc' }}>1,000 clicks</td>
          <td style={{ padding: '12px 0', borderBottom: '1px solid #ccc' }}>₱150</td>
        </tr>
        <tr style={{ backgroundColor: '#f5f5f5' }}>
          <td style={{ padding: '12px 0', borderBottom: '1px solid #ccc' }}>10,000 clicks</td>
          <td style={{ padding: '12px 0', borderBottom: '1px solid #ccc' }}>₱1,500</td>
        </tr>
        <tr style={{ backgroundColor: '#f5f5f5' }}>
          <td style={{ padding: '12px 0', borderBottom: '1px solid #ccc' }}>100,000 clicks</td>
          <td style={{ padding: '12px 0', borderBottom: '1px solid #ccc' }}>₱15,000</td>
        </tr>
        <tr style={{ backgroundColor: '#f5f5f5' }}>
          <td style={{ padding: '12px 0', borderBottom: '1px solid #ccc' }}>1,000,000 clicks</td>
          <td style={{ padding: '12px 0', borderBottom: '1px solid #ccc' }}>₱150,000</td>
        </tr>
      </tbody>
    </table>
  </div>

</div>

</div>
);
};

export default AdminPanel;
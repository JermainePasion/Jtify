import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { adminPanel } from '../../actions/userActions'; // Import the adminPanel action
import { useNavigate } from 'react-router-dom';
import { getUserDetails } from '../../actions/userActions';
import { listSongs } from "../../actions/songActions";
import Navbar from '../Navbar';
import { Pie } from 'react-chartjs-2';
import {Chart, ArcElement, registerables} from 'chart.js'

const AdminPanel = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.userDetails);
  const color = user?.data?.profile_data?.color || '#defaultColor';
  const font = user?.data?.profile_data?.font || 'defaultFont';
  const { users, loading, error } = useSelector(state => state.adminPanelUsers);
  const [permissions, setPermissions] = useState({});
  const { songs, playlists } = useSelector(
    (state) => state.songList
  );
  
  
  
  useEffect(() => {
    dispatch(getUserDetails());
  }, [dispatch]);

  useEffect(() => {
    dispatch(adminPanel()); // Fetch users on component mount
    dispatch(listSongs());
  }, [dispatch]);

  Chart.register(ArcElement);
  Chart.register(...registerables);

  const chartRef = useRef(null);
  const subscriberChartRef = useRef(null);
  const songCountRef = useRef(0);
  const artistCountRef = useRef(0);

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
        labels: ['Subscribed Users', 'Unsubscribed Users'],
        datasets: [{
          data: [unsubscribedCount, subscriberCount],
          backgroundColor: ['#36A2EB', '#FF6384'],
          hoverBackgroundColor: ['#1f9df2', '#fa2d58']
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
                  label = `${context.dataset.data[context.dataIndex]}`;
                }
                return label;
              }
            }
          }
        }
      };
  
      const chart = new Chart(subscriberChartRef.current, { // Use the new ref here
        type: 'pie',
        data: chartData,
        options: chartOptions
      });
  
      return () => chart.destroy();
    }
  }, [users])

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

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: color, fontFamily: font }}>
      <Navbar style={{ flex: '0 0 auto', width: '200px', backgroundColor: 'black', color: 'white' }} />
      <div className='template-background' style={{ 
        flex: 1, 
        marginLeft: '10px', 
        position: 'relative', 
        padding: '10px 20px', // Increase padding for better spacing
        backgroundSize: '110%',
        backgroundRepeat: 'no-repeat'

      }}>
      <h2>Admin Panel</h2>
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
          
        
        <div className="card" style={{ backgroundColor: '#f0f0f0', padding: '20px', borderRadius: '8px', maxHeight: '400px', overflowY: 'auto', marginTop: '20px' }}>
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

      </div>
      
    </div>
  );
};

export default AdminPanel;

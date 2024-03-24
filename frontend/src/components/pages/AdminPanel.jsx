import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { adminPanel } from '../../actions/userActions'; // Import the adminPanel action
import { useNavigate } from 'react-router-dom';
import { getUserDetails } from '../../actions/userActions';
import Navbar from '../Navbar';

const AdminPanel = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.userDetails);
  const color = user?.data?.profile_data?.color || '#defaultColor';
  const font = user?.data?.profile_data?.font || 'defaultFont';
  const { users, loading, error } = useSelector(state => state.adminPanelUsers);
  const [permissions, setPermissions] = useState({});

  useEffect(() => {
    dispatch(getUserDetails());
  }, [dispatch]);

  useEffect(() => {
    dispatch(adminPanel()); // Fetch users on component mount
  }, [dispatch]);

  

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
    <div style={{ display: 'flex', minHeight: '115vh', backgroundColor: color, fontFamily: font }}>
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
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>{error}</div>
      ) : (
          
        <div className="card" style={{ backgroundColor: '#f0f0f0', padding: '20px', borderRadius: '8px', maxHeight: '400px', overflowY: 'auto' }}>
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

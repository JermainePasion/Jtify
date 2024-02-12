import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '../Navbar';
import { getUserDetails } from '../../actions/userActions';


function Home() {
  
  const dispatch = useDispatch();
  const user = useSelector(state => state.userDetails.user);
  const color = user?.data?.profile_data?.color || '#defaultColor';

  useEffect(() => {
    dispatch(getUserDetails());
  }, [dispatch]);


  return (
    <div style={{ display: 'flex', width: '100vw', minHeight: '100vh', backgroundColor: color }}>
      <Navbar />
      <div className='template-background' style={{ 
        flex: 1, 
        marginLeft: '10px', 
        position: 'relative', 
        overflowX: 'auto', 
        padding: '10px 0',
        /* backgroundImage: `url(${process.env.PUBLIC_URL}/HomeBg.png)`, */
        backgroundSize: 'cover',
      }}>
        <h1 style={{ color: 'white', fontFamily: 'Verdana', paddingLeft: '15px', fontSize: '30px', }}>Contact Page</h1>
       
       

      </div>
    </div>
  );
}

export default Home;
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails } from '../../actions/userActions';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import ButtonWrapper from '../ButtonWrapper';
import Navbar from '../Navbar';
import { Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { faCrown } from '@fortawesome/free-solid-svg-icons';
import { FaStepBackward, FaStepForward } from 'react-icons/fa';
import { faBars } from '@fortawesome/free-solid-svg-icons';


function Plans() {
  // Define plan details locally
  const plans = [
    { id: 'P-7EX04796RJ8312733MX57JVQ', name: '60 pesos' },
    //{ id: 'P-5V92551883714634CMX575XY', name: 'Piso. Pang try to' },
  ];

  const dispatch = useDispatch();
  const { user } = useSelector(state => state.userDetails);
  const color = user?.data?.profile_data?.color || '#defaultColor';
  const font = user?.data?.profile_data?.font || 'defaultFont';
  const [showNavbar, setShowNavbar] = useState(true);

  useEffect(() => {
    dispatch(getUserDetails());
  }, [dispatch]);


  const toggleNavbar = () => {
    setShowNavbar(!showNavbar);
  };

  return (
    <div style={{ display: 'flex', minHeight: '120vh', backgroundColor: color, fontFamily: font }}>
       {showNavbar && <Navbar />}
      <div className='template-background' style={{ 
        flex: 1, 
        marginLeft: '10px', 
        position: 'relative', 
        padding: '10px 20px', // Increase padding for better spacing
        backgroundSize: '120%',
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
          <div style={{ fontSize: '20px', padding: '20px', textAlign: 'center', color: 'steelblue' }}>
            <h1>Subscription Plans</h1>
            
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <Card style={{
        width: '50%',
        padding: '20px',
        border: '2px solid white',
        borderRadius: '30px',
        backgroundColor: 'black',
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.6), rgba(0,0,0,0.9))',
        color: 'white'
    }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <PayPalScriptProvider
                options={{
                    'client-id': 'AX5UaS4FL8dtDE9A1zwx6-t4KFAsF-C0Ni_sCwGG1Tp6Uq_3F4x3xbvzDDsXPU_Vo-3b56Mj_son0JIi',
                    components: 'buttons',
                    intent: 'subscription',
                    vault: true,
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <FontAwesomeIcon icon={faCrown} style={{ color: 'gold', marginRight: '10px', fontSize: '40px' }} />
                    <h1 style={{ fontSize: '40px', marginBottom: '10px', textShadow: '1px 1px 2px #000000', color: 'white' }}>Jtify Premium</h1>
                </div>
                <p style={{ fontSize: '15px', marginTop: '-5px' }}>Get unlimited access to all of Jtify's premium features.</p>
                <hr style={{ borderTop: '1px solid black', width: '100%' }} />
                <div style={{ textAlign: 'left' }}>
                    <h1 style={{ fontSize: '25px' }}>Features/Benefits</h1>
                    <h2 style={{ fontSize: '20px' }}>
                        <FontAwesomeIcon icon={faCheck} style={{ marginRight: '10px', color: 'green' }} />
                        Customize your text fonts to suit your style.
                    </h2>
                    <h2 style={{ fontSize: '20px' }}>
                        <FontAwesomeIcon icon={faCheck} style={{ marginRight: '10px', color: 'green' }} />
                        Personalize your background colors for a unique experience.
                    </h2>
                    <h2 style={{ fontSize: '20px' }}>
                        <FontAwesomeIcon icon={faCheck} style={{ marginRight: '10px', color: 'green' }} />
                        Enjoy ad-free listening with our premium plan.
                    </h2>
                </div>


                {plans.map((plan) => (
                    <div key={plan.id} style={{ marginBottom: '20px', fontSize: '30px' }}>
                        <h2>{plan.name}/mo</h2>
                        <ButtonWrapper type="subscription" plan={plan.id} />
                    </div>
                ))}
            </PayPalScriptProvider>
        </div>
    </Card>
</div>


          </div>
    </div>
    
    </div>
  );
}

export default Plans;

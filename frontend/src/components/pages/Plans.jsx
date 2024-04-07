import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails } from '../../actions/userActions';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import ButtonWrapper from '../ButtonWrapper';
import Navbar from '../Navbar';
import { Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { faCrown } from '@fortawesome/free-solid-svg-icons';


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

  useEffect(() => {
    dispatch(getUserDetails());
  }, [dispatch]);

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

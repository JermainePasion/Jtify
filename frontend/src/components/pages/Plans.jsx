import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails } from '../../actions/userActions';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import ButtonWrapper from '../ButtonWrapper';
import Navbar from '../Navbar';



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
      <h1>Subscription Plans</h1>
      <PayPalScriptProvider
        options={{
          'client-id':
            'AX5UaS4FL8dtDE9A1zwx6-t4KFAsF-C0Ni_sCwGG1Tp6Uq_3F4x3xbvzDDsXPU_Vo-3b56Mj_son0JIi',
          components: 'buttons',
          intent: 'subscription',
          vault: true,
        }}
      >
        {plans.map((plan) => (
          <div key={plan.id}>
            <h1>{plan.name}</h1>
            <ButtonWrapper type="subscription" plan={plan.id} />
          </div>
        ))}
      </PayPalScriptProvider>
    </div>
    </div>
  );
}

export default Plans;

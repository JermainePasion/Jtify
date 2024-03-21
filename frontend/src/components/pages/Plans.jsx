import React from 'react';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import ButtonWrapper from '../ButtonWrapper';

function Plans() {
  // Define plan details locally
  const plans = [
    { id: 'P-7EX04796RJ8312733MX57JVQ', name: '75 pesos' },
    { id: 'P-5V92551883714634CMX575XY', name: 'Piso. Pang try to' },
  ];

  return (
    <div>
      <h1>Plans</h1>
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
  );
}

export default Plans;

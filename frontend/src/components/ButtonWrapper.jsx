import React, { useEffect, useState } from 'react';
import { PayPalScriptProvider, PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { useDispatch, useSelector } from 'react-redux';
import { userUpdateSubscriber } from '../actions/userActions';

function ButtonWrapper({ type, plan }) {
  const [{ options }, dispatch] = usePayPalScriptReducer();
  const [subscriptionApproved, setSubscriptionApproved] = useState(false);

  useEffect(() => {
    dispatch({
      type: 'resetOptions',
      value: {
        ...options,
        currency: 'PHP',
        intent: 'subscription',
      },
    });
  }, [type]);

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const dispatchUpdateSubscriber = useDispatch();

  const approveHandler = (data, actions) => {
    actions.subscription.get().then(function (subscription) {
      dispatchUpdateSubscriber(userUpdateSubscriber(subscription.billing_info));
    })
  };


  return (
    <PayPalButtons
      createSubscription={(data, actions) => {
        return actions.subscription.create({
          plan_id: plan,
        });
      }}
      onApprove={approveHandler}
    />
  );
}

export default ButtonWrapper;

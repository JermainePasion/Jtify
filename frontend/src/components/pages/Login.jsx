// Import statements
import React, { useState, useEffect } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../actions/userActions';
import { useNavigate, Link } from 'react-router-dom';
import FormContainer from '../FormContainer';
import Footer from '../Footer';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo, error } = userLogin;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (userInfo) {
      navigate('/home');
    }
  }, [navigate, userInfo]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(login(email, password));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Card style={{ width: '400px', padding: '20px', border: '2px solid white', borderRadius: '10px' }}>
        <FormContainer>
          <h1 style={{ textAlign: 'center', color: 'white' }}>Sign In</h1>

          <Form className="login-form" onSubmit={submitHandler}>
            <Form.Group controlId='email'>
              <Form.Control
                className='form-control'
                type='email'
                placeholder='Enter email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId='password'>
              <Form.Control
                type='password'
                placeholder='Enter password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Button className='login-button glow-button' type='submit' variant='primary'>
              Sign In
            </Button>

            {error && (
              <p style={{ color: 'red', textAlign: 'center' }}>
                {error.includes('email') ? 'Invalid email format.' :
                  error.includes('password') ? 'Invalid password.' :
                    error.includes('verify') ? 'Email not verified. Please check your email for verification instructions.' :
                      'Login failed. Please check your credentials and try again.'
                }
              </p>
            )}
          </Form>
        </FormContainer>

        <div style={{ color: 'white', marginTop: '10px', textAlign: 'center' }}>
          Don't have an account? <Link to="/register">Sign up here</Link>.
        </div>

        <div style={{ color: 'white', marginTop: '10px', textAlign: 'center' }}>
          <Link to="/requestPassword">Forgot Password</Link>.
        </div>
      </Card>
      <Footer />

      <div className="background">
        <div className="logo-image">
          <img src="Jlogo.png" alt="background" width={200} />
        </div>
      </div>
    </div>
  );
}

export default Login;

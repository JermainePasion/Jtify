import React, { useState, useEffect } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../../actions/userActions';
import FormContainer from '../FormContainer';
import { useNavigate, Link } from 'react-router-dom';
import Footer from '../Footer';

function Register() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo) {
      navigate('/verify-otp');
    }
  }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const response = await dispatch(register(email, name, password, password2));
      console.log(response.user_id, response.otp_id);

      navigate(`/verify-otp?user_id=${response.user_id}&otp_id=${response.otp_id}`);
    } catch (error) {
      console.error('Error during registration:', error.message);
      // Handle error, e.g., display an error message to the user
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
            <Card style={{ width: '400px', padding: '20px', border: '2px solid white', borderRadius: '10px'}}>
                <FormContainer>
                    <h1 style={{ textAlign: 'center', color: 'white' }}>Sign Up</h1>

                        <Form.Label style={{ color: 'white' }}>Email</Form.Label>
                        <Form className="login-form" onSubmit={submitHandler}>
                            <Form.Group controlId='email'>
                                <Form.Control
                                    type='email'
                                    placeholder='Enter email'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                ></Form.Control>
                            </Form.Group>

                        <Form.Label style={{ color: 'white' }}>Name</Form.Label>
                            <Form.Group controlId='name'>

                                <Form.Control
                                    type='name'
                                    placeholder='Name'
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                ></Form.Control>
                            </Form.Group>
                        <Form.Label style={{ color: 'white' }}>Password</Form.Label>
                            <Form.Group controlId='password'>
                                <Form.Control
                                    type='password'
                                    placeholder='Enter password'
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                ></Form.Control>
                            </Form.Group>

                        <Form.Label style={{ color: 'white' }}>Confirm Password</Form.Label>
                            <Form.Group controlId='password2'>
                                <Form.Control
                                    type='password'
                                    placeholder='Confirm password'
                                    value={password2}
                                    onChange={(e) => setPassword2(e.target.value)}
                                ></Form.Control>
                            </Form.Group>

                            <Button className='login-button glow-button' type='submit' variant='primary'>
                                Sign Up
                            </Button>
                        </Form>
                </FormContainer>
                <div style={{ color: 'white', marginTop: '10px', textAlign: 'center' }}>
                    Already have an Account? <Link to="/login">Sign In here</Link>.
                </div>
            </Card>
            <Footer/>
            <div className="background">
                <div className="logo-image">
                     <img src="Jlogo.png" alt="background" width={200} />
                </div>
            </div>
        </div>
  );
}

export default Register;

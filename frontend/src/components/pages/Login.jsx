import React, { useState } from 'react';
import { Form, Button, Card} from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { login } from '../../actions/userActions';
import FormContainer from '../FormContainer';
import { useNavigate, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import Footer from '../Footer';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    let navigate = useNavigate();
    const dispatch = useDispatch();
    useEffect(() => {
        if (userInfo) {
            navigate('/home');
        }
    }, [navigate, userInfo]);


    const submitHandler = (e) => {
        e.preventDefault();

        // Dispatch the login action with the provided email and password
        dispatch(login(email, password));
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
            <Card style={{ width: '400px', padding: '20px', border: '2px solid white', borderRadius: '10px'}}>
                <FormContainer>
                    <h1 style={{ textAlign: 'center', color: 'white' }}>Sign In</h1>

                    <Form.Label style={{ color: 'white' }}>Email</Form.Label>
                    <Form className="login-form" onSubmit={submitHandler}>
                        <Form.Group controlId='email'>
                            <Form.Control className='form-control'
                                type='email'
                                placeholder='Enter email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Label style={{ color: 'white' }}>Password</Form.Label>
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

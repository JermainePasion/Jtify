import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Navbar from '../Navbar';
import { useSelector } from 'react-redux';
import { Container, Row, Col, Form, Button, } from 'react-bootstrap';
import { getUserDetails } from '../../actions/userActions'; // Import getUserDetails action

const CompanyContact = () => {
  return (
    <Row className='mb-5 mt-3'>
      <Col lg='7'>
        <div className='company-contact-container'>
          <h2>Company Contact</h2>
          <p>Feel free to contact us for any inquiries or questions. We are happy to help you.</p>
          <p>
            <strong>Email:</strong> info@company.com
          </p>
          <p>
            <strong>Phone:</strong> +1 (123) 456-7890
          </p>
          <p>
            <strong>Address:</strong> 123 Main Street, Cityville
          </p>
        </div>
      </Col>
    </Row>
  );
};



const Contact = () => {
  const user = useSelector((state) => state.userDetails.user);
  const color = user?.data?.profile_data?.color || '#defaultColor';
  const selectedFont = user?.data?.profile_data?.font || 'defaultFont';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form data submitted:', formData);
    // You can add your logic for sending the data to a server or performing any other actions.
  };

  const dispatch = useDispatch();

  // Fetch user data when the component mounts
  useEffect(() => {
    dispatch(getUserDetails());
  }, [dispatch]);

  return (
    <div style={{ display: 'flex', width: '100vw', minHeight: '100vh', backgroundColor: color, fontFamily: selectedFont }}>
      <Navbar />
  
      <div className='template-background contact-container'>

                    
        
                  {/* Add the CompanyContact component */}
                  <CompanyContact />
              

                <Container>
                  {/* Add the CompanyContact component */}
                

                  <Row className='mb-5 mt-3'>
                    <Col lg='7'>
                      <Form className='contact-form' onSubmit={handleSubmit}>
                        <div>
                          <h2>Contact Us</h2>
                          <p>If you have any questions, feel free to contact us. We will get back to you as soon as possible.</p>
                        </div>
                        <Form.Group controlId='formName'>
                          <Form.Label>Name</Form.Label>
                          <Form.Control
                            type='text'
                            placeholder='Enter your name'
                            name='name'
                            value={formData.name}
                            onChange={handleChange}
                            required
                          />
                        </Form.Group>

                        <Form.Group controlId='formEmail'>
                          <Form.Label>Email</Form.Label>
                          <Form.Control
                            type='email'
                            placeholder='Enter your email'
                            name='email'
                            value={formData.email}
                            onChange={handleChange}
                            required
                          />
                        </Form.Group>

                        <Form.Group controlId='formMessage'>
                          <Form.Label>Message</Form.Label>
                          <Form.Control
                            as='textarea'
                            rows={4}
                            placeholder='Type your message here'
                            name='message'
                            value={formData.message}
                            onChange={handleChange}
                            required
                          />
                        </Form.Group>

                        <Button variant='primary' type='submit'>
                          Send
                        </Button>
                      </Form>
                    </Col>
                  </Row>
                </Container>
      
      </div>
    </div>
  );
};

export default Contact;
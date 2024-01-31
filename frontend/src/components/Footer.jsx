import React from 'react'
import { Container, Row, Col  } from 'react-bootstrap'

function Footer() {
  return (
    <footer>
        <Container>
            <Row>
                <Col className='text-center-py-3'><strong>EST.2024</strong></Col>
                <Col className='text-center-py-3'><strong>Jtify is an music streaming website that will cater your muscial needs.</strong></Col>
            </Row>
        </Container>
    </footer>
  )
}

export default Footer

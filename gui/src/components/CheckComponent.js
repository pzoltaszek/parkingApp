import React, { useState } from 'react';
import { Button, Form, ButtonGroup, Toast, ToastContainer } from 'react-bootstrap';
import UserService from '../services/UserService';
import { AiOutlineAppstoreAdd } from "react-icons/ai";
import { useMediaQuery } from 'usehooks-ts';

export default function CheckComponent() {
    const [email, setEmail] = useState('');
    const [reservationForToday, setReservationForToday] = useState(true);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const smallScreen = useMediaQuery('(max-width:410px)');
    const gigaSmallScreen = useMediaQuery('(max-width:290px)');


    const onSubmitForm = (event) => {
        event.preventDefault();
        if (!showToast) {
                UserService.check(email, reservationForToday)
                .then(response => {
                    setShowToast(true);
                    if (!response.success) {
                        setToastMessage('YOU HAVE NO RESERVED PLACE');
                    } else {
                        setToastMessage(`YOUR RESERVATION 
                         number: ' ${response.data.number} ' building: ' ${response.data.building}`);
                    } 
                });
        }
    }

    return (
        <div>
            <ToastContainer position="top-end">
                <Toast className='d-inline-block m-3' bg="success" onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide>
                    <Toast.Header>
                        <strong className="me-auto">'Success'</strong>
                    </Toast.Header>
                    <Toast.Body>{toastMessage}</Toast.Body>
                </Toast>
            </ToastContainer>
            <Form className="form-container" onSubmit={onSubmitForm}>
                <h3>Check your reservation</h3>
                <hr />
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" value={email} onChange={(event) => setEmail(event.target.value)} />
                </Form.Group>

                <div className='select-container'>
                    <Form.Group className="radio-buttons-container">
                        <Form.Check type="radio" label="Today" checked={reservationForToday} onChange={() => { setReservationForToday(!reservationForToday) }} />
                        <Form.Check type="radio" label="Tomorrow" checked={!reservationForToday} onChange={() => { setReservationForToday(!reservationForToday) }} />
                    </Form.Group>
                </div>
                <hr />
                <ButtonGroup className='button-group'>
                    <Button variant="light" type="submit">
                        {smallScreen ? <AiOutlineAppstoreAdd size={gigaSmallScreen ? "1.5em" : "2.5em"} /> : " Check"}
                    </Button>
                </ButtonGroup>
            </Form>
        </div >
    );
}
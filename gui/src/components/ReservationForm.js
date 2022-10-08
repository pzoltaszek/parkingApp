import React, { useState } from 'react';
import { Button, Form, ButtonGroup, Toast, ToastContainer } from 'react-bootstrap';
import UserService from '../services/UserService';
import { sha512 } from 'crypto-hash';
import { AiOutlineAppstoreAdd } from "react-icons/ai";
import { FcCancel } from "react-icons/fc";
import { useMediaQuery } from 'usehooks-ts';

export default function ReservationForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [building, setBuilding] = useState('K');
    const [reservationForToday, setReservationForToday] = useState(true);
    const [showToast, setShowToast] = useState(false);
    const [success, setSuccess] = useState(true);
    const [toastMessage, setToastMessage] = useState('');
    const smallScreen = useMediaQuery('(max-width:410px)');
    const gigaSmallScreen = useMediaQuery('(max-width:290px)');

    const onSubmitForm = (event) => {
        event.preventDefault();
        if (!showToast) {
            sha512(password).then(hashedPass => {
                UserService.assignUser(email, hashedPass, building, reservationForToday).then(response => {
                    setSuccess(response.success);
                    setShowToast(true);
                    let toDisplay;
                    if (response.data.number) {
                        toDisplay = `PLACE ASSIGNED | number: ' ${response.data.number} ' building: ' ${response.data.building}`;
                    } else {
                        toDisplay = response.data
                    }
                    setToastMessage(toDisplay);
                });
            })
        }
    }
    const cancelReservation = () => {
        if (!showToast) {
        sha512(password).then(hashedPass => {
            UserService.unassignUser(email, hashedPass, building, reservationForToday)
            .then(response => {
                setSuccess(response.success);
                setShowToast(true);
                setToastMessage(response.data);
            });
        })
    }
    }
    return (
        <div>
            <ToastContainer position="top-end">
                <Toast className='d-inline-block m-3' bg={success ? "success" : "danger"} onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide>
                    <Toast.Header>
                        <strong className="me-auto">{success ? 'Success' : 'Failed'} </strong>
                    </Toast.Header>
                    <Toast.Body>{toastMessage}</Toast.Body>
                </Toast>
            </ToastContainer>
            <Form className="form-container" onSubmit={onSubmitForm}>
                <h3>Parking spot reservation</h3>
                <hr />
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" value={email} onChange={(event) => setEmail(event.target.value)} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" value={password} onChange={(event) => setPassword(event.target.value)} />
                </Form.Group>
                <div className='select-container'>
                    <Form.Group>
                        <Form.Label>Building</Form.Label>
                        <Form.Select value={building} onChange={(event) => setBuilding(event.target.value)}>
                            <option>K</option>
                            <option>H</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="radio-buttons-container">
                        <Form.Check type="radio" label="Today" checked={reservationForToday} onChange={() => { setReservationForToday(!reservationForToday) }} />
                        <Form.Check type="radio" label="Tomorrow" checked={!reservationForToday} onChange={() => { setReservationForToday(!reservationForToday) }} />
                    </Form.Group>
                </div>
                <hr />
                <ButtonGroup className='button-group'>
                    <Button variant="light" type="submit">
                        {smallScreen ? <AiOutlineAppstoreAdd size={gigaSmallScreen ? "1.5em" : "2.5em"} /> : " Reserve"}
                    </Button>
                    <Button variant="secondary" onClick={cancelReservation}>
                        {smallScreen ? <FcCancel size={gigaSmallScreen ? "1.5em" : "2.5em"} /> : "Cancel your reservation"}
                    </Button>
                </ButtonGroup>
            </Form>
        </div >

    );
}

import React, { useState } from 'react';
import { Button, Form, ButtonGroup, Toast, ToastContainer } from 'react-bootstrap';
import UserService from '../services/UserService';
import { sha512 } from 'crypto-hash';
import { AiOutlineAppstoreAdd } from "react-icons/ai";
import { FcCancel } from "react-icons/fc";
import { useMediaQuery } from 'usehooks-ts';

export default function SimpleForm({ title, inputs, buildingDropdown, componentType }) {
    const [fields, setFields] = useState({
        email: '',
        password: ''
    })
    const [building, setBuilding] = useState('K');
    const [reservationForToday, setReservationForToday] = useState(true);
    const [showToast, setShowToast] = useState(false);
    const [success, setSuccess] = useState(true);
    const [toastMessage, setToastMessage] = useState('');
    const mediaQueries = {
        smallScreen: useMediaQuery('(max-width:410px)'),
        gigaSmallScreen: useMediaQuery('(max-width:290px)'),
        toastPosition: useMediaQuery('(max-width:460px)')
    }

    const onSubmitReservationForm = (event) => {
        event.preventDefault();
        if (!showToast) {
            sha512(fields.password).then(hashedPass => {
                UserService.assignUser(fields.email, hashedPass, building, reservationForToday).then(response => {
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
    const onSubmitCheckForm = (event) => {
        event.preventDefault();
        if (!showToast) {
            UserService.check(fields.email, reservationForToday)
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
    const cancelReservation = () => {
        if (!showToast) {
            sha512(fields.password).then(hashedPass => {
                UserService.unassignUser(fields.email, hashedPass, building, reservationForToday)
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
            <ToastContainer position={mediaQueries.toastPosition ? "top-center" : "top-end"} className='toast-container'>
                <Toast className='d-inline-block m-3' bg={success ? "success" : "danger"} onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide>
                    <Toast.Header>
                        <strong className="me-auto">{success ? 'Success' : 'Failed'} </strong>
                    </Toast.Header>
                    <Toast.Body>{toastMessage}</Toast.Body>
                </Toast>
            </ToastContainer>
            <Form className="form-container" onSubmit={componentType === "reservation" ? onSubmitReservationForm : onSubmitCheckForm}>
                <h3>{title}</h3>
                <hr />
                {inputs.map((element, index) =>
                    <Form.Group className="mb-3" key={index}>
                        <Form.Label>{element.label}</Form.Label>
                        <Form.Control type={element.type} name={element.type} placeholder={element.placeholder} value={fields[index]} onChange={(event) => setFields({ ...fields, [event.target.name]: event.target.value })} />
                    </Form.Group>)}
                <div className='select-container'>
                    {buildingDropdown &&
                        <Form.Group>
                            <Form.Label>Building</Form.Label>
                            <Form.Select value={building} onChange={(event) => setBuilding(event.target.value)}>
                                <option>K</option>
                                <option>H</option>
                            </Form.Select>
                        </Form.Group>}
                    <Form.Group className="radio-buttons-container">
                        <Form.Check type="radio" label="Today" checked={reservationForToday} onChange={() => { setReservationForToday(!reservationForToday) }} />
                        <Form.Check type="radio" label="Tomorrow" checked={!reservationForToday} onChange={() => { setReservationForToday(!reservationForToday) }} />
                    </Form.Group>
                </div>
                <hr />
                <ButtonGroup className='button-group'>
                    {componentType === "reservation" && <>
                        <Button variant="light" type="submit">
                            {mediaQueries.smallScreen ? <AiOutlineAppstoreAdd size={mediaQueries.gigaSmallScreen ? "1.5em" : "2.5em"} /> : " Reserve"}
                        </Button>
                        <Button variant="secondary" onClick={cancelReservation}>
                            {mediaQueries.smallScreen ? <FcCancel size={mediaQueries.gigaSmallScreen ? "1.5em" : "2.5em"} /> : "Cancel your reservation"}
                        </Button>
                    </>}
                    {componentType === "check" && <Button variant="light" type="submit">
                        Check
                    </Button>}
                </ButtonGroup>
            </Form>
        </div >

    );
}

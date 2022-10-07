import React, { useState } from 'react';
import { Button, Form, ButtonGroup } from 'react-bootstrap';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isReservationForToday, setIsReservationForToday] = useState(true);
    const onSubmitForm = (event) => {
        event.preventDefault();
    }
    return (
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
                    <Form.Select>
                        <option>K</option>
                        <option>H</option>
                    </Form.Select>
                </Form.Group>
                <Form.Group className="radio-buttons-container">
                    <Form.Check type="radio" label="Today" checked={isReservationForToday} onChange={() => { setIsReservationForToday(!isReservationForToday) }} />
                    <Form.Check type="radio" label="Tomorrow" checked={!isReservationForToday} onChange={() => { setIsReservationForToday(!isReservationForToday) }} />
                </Form.Group>
            </div>
            <hr />
            <ButtonGroup className='button-group'>
                <Button variant="light" type="submit">
                    Reserve
                </Button>
                <Button variant="secondary" type="submit">
                    Cancel your reservation
                </Button>
            </ButtonGroup>
        </Form>
    );
}

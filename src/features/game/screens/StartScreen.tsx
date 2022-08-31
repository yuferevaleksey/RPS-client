import React, {FormEvent, useState} from 'react';
import {Button, Form} from 'react-bootstrap';

export interface StartScreenProps {
    onSetNickNameJoin: (nickName: string) => void
}

export const StartScreen = ({onSetNickNameJoin}: StartScreenProps) => {
    const [nickName, setNickName] = useState('');

    /**
     * Set nickname.
     *
     * @param evt
     */
    const handleSubmit = (evt: FormEvent) => {
        evt.preventDefault();
        onSetNickNameJoin(nickName)
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Enter Nickname</Form.Label>
                <Form.Control type="text" placeholder="Enter nickname"  value={nickName} onChange={(e) => setNickName(e.target.value)}/>
            </Form.Group>
            <Button variant="primary" type="submit">
                GO!
            </Button>
        </Form>
    );
}
import React from 'react';
import {Button, Modal} from 'react-bootstrap';

export interface ResultModalProps {
    isShowModal: boolean,
    onBtnClick: () => void,
    isShowBtn: boolean,
    headerText: string;
    bodyText: string;
    btnText: string;
}

function PauseModal({ headerText, bodyText, isShowModal, onBtnClick, isShowBtn, btnText}: ResultModalProps) {

    let btn;

    if (isShowBtn) {
        btn = <Button variant="secondary" onClick={onBtnClick}>
            {btnText}
        </Button>
    }

    return (
        <Modal show={isShowModal}>
            <Modal.Header closeButton>
                <Modal.Title>{headerText}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{bodyText}</Modal.Body>
            <Modal.Footer>
                {btn}
            </Modal.Footer>
        </Modal>
    );
}

export default PauseModal;
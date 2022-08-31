import React from 'react';
import {Button, Modal} from 'react-bootstrap';

export interface ResultModalProps {
    headerText: string;
    bodyText: string;
    btnText: string;
    isShowModal: boolean,
    onBtnClick: () => void,
}

function ResultModal({ headerText, bodyText,  btnText, isShowModal, onBtnClick}: ResultModalProps) {
    return (
        <Modal show={isShowModal}>
            <Modal.Header closeButton>
                <Modal.Title>{headerText}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{bodyText}</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onBtnClick}>
                    {btnText}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ResultModal;
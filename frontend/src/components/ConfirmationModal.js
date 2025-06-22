import React from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideUp = keyframes`
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  animation: ${fadeIn} 0.3s ease;
`;

const ModalContainer = styled.div`
  background: #fff;
  padding: 2.5rem;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 90%;
  max-width: 400px;
  animation: ${slideUp} 0.4s cubic-bezier(0.25, 1, 0.5, 1);
`;

const Message = styled.p`
  font-size: 1.2rem;
  margin-bottom: 2rem;
  color: #333;
  line-height: 1.6;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

const Button = styled.button`
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  border: none;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  }
`;

const ConfirmButton = styled(Button)`
  background: #d32f2f; /* Red for destructive action */
  color: #fff;
  
  &:hover {
    background: #c62828;
  }
`;

const CancelButton = styled(Button)`
  background: #eee;
  color: #555;
  border: 1px solid #ddd;
  
  &:hover {
    background: #e0e0e0;
  }
`;

const ConfirmationModal = ({ message, onConfirm, onCancel }) => {
    return (
        <Overlay onClick={onCancel}>
            <ModalContainer onClick={(e) => e.stopPropagation()}>
                <Message>{message}</Message>
                <ButtonContainer>
                    <CancelButton onClick={onCancel}>Cancel</CancelButton>
                    <ConfirmButton onClick={onConfirm}>Confirm Delete</ConfirmButton>
                </ButtonContainer>
            </ModalContainer>
        </Overlay>
    );
};

export default ConfirmationModal; 
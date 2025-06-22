import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaTimes, FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import api from '../services/api';

const BlogModal = ({ blog, onClose }) => {
    const [localBlog, setLocalBlog] = useState(blog);
    const [userInteraction, setUserInteraction] = useState(null); // 'like', 'dislike', or null for initial state
    const [interactionChanged, setInteractionChanged] = useState(false);

    // In a real-world scenario with many users, you wouldn't know the user's past
    // interactions without a dedicated API endpoint. This is a simplification.
    // For now, we assume the user has no prior interaction when the modal opens.
    
    const handleInteraction = async (interactionType) => {
        const newInteraction = userInteraction === interactionType ? null : interactionType;

        try {
            await api.post(`/blog/${blog.id}/${interactionType}`);
            setInteractionChanged(true);
            
            // Optimistically update the UI
            setLocalBlog(prevBlog => {
                let newLikes = prevBlog.likes;
                let newDislikes = prevBlog.dislikes;

                if (userInteraction === interactionType) { // Undoing an action
                    interactionType === 'like' ? newLikes-- : newDislikes--;
                } else if (userInteraction) { // Switching action
                    interactionType === 'like' ? newLikes++ : newDislikes++;
                    userInteraction === 'like' ? newLikes-- : newDislikes--;
                } else { // New action
                    interactionType === 'like' ? newLikes++ : newDislikes++;
                }
                
                return { ...prevBlog, likes: newLikes, dislikes: newDislikes };
            });

            setUserInteraction(newInteraction);

        } catch (error) {
            console.error(`Failed to ${interactionType} the blog`, error);
        }
    };

    if (!blog) return null;

    return (
        <Overlay onClick={() => onClose(interactionChanged)}>
            <ModalContainer onClick={(e) => e.stopPropagation()}>
                <CloseButton onClick={() => onClose(interactionChanged)}>
                    <FaTimes />
                </CloseButton>
                <BlogTitle>{localBlog.title}</BlogTitle>
                <BlogDescription>{localBlog.description}</BlogDescription>
                <BlogBody dangerouslySetInnerHTML={{ __html: localBlog.body }} />
                <InteractionFooter>
                    <ActionButton clicked={userInteraction === 'like'} onClick={() => handleInteraction('like')}>
                        <FaThumbsUp /> {localBlog.likes}
                    </ActionButton>
                    <ActionButton clicked={userInteraction === 'dislike'} onClick={() => handleInteraction('dislike')}>
                        <FaThumbsDown /> {localBlog.dislikes}
                    </ActionButton>
                </InteractionFooter>
            </ModalContainer>
        </Overlay>
    );
};

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideIn = keyframes`
  from { transform: translateY(-30px); }
  to { transform: translateY(0); }
`;

const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2000;
    animation: ${fadeIn} 0.3s ease;
`;

const ModalContainer = styled.div`
    background: white;
    padding: 40px;
    border-radius: 20px;
    width: 90%;
    max-width: 800px;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
    animation: ${slideIn} 0.4s ease;
`;

const CloseButton = styled.button`
    position: absolute;
    top: 20px;
    right: 20px;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #999;
    
    &:hover {
        color: #333;
    }
`;

const BlogTitle = styled.h1`
    font-size: 2.5rem;
    margin-bottom: 10px;
    color: #333;
`;

const BlogDescription = styled.p`
    font-size: 1.2rem;
    color: #666;
    margin-bottom: 30px;
    font-style: italic;
`;

const BlogBody = styled.div`
    line-height: 1.8;
    color: #444;
    
    p {
        margin-bottom: 20px;
    }
`;

const InteractionFooter = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-top: 30px;
    padding-top: 20px;
    border-top: 1px solid #eee;
    gap: 20px;
`;

const ActionButton = styled.button`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    border-radius: 20px;
    border: 1px solid ${props => props.clicked ? '#667eea' : '#ccc'};
    background-color: ${props => props.clicked ? '#667eea' : 'transparent'};
    color: ${props => props.clicked ? 'white' : '#666'};
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        background-color: ${props => props.clicked ? '#764ba2' : '#f0f0f0'};
        border-color: ${props => props.clicked ? '#764ba2' : '#bbb'};
    }
`;

export default BlogModal; 
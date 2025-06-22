import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaTimes } from 'react-icons/fa';
import api from '../services/api';

const CreateBlogModal = ({ onClose, blogToEdit }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [body, setBody] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        // Fetch categories for the dropdown
        api.get('/categories')
            .then(res => setCategories(res.data))
            .catch(err => setError('Could not load categories.'));
        
        // If we are editing, populate the form
        if (blogToEdit) {
            setTitle(blogToEdit.title);
            setDescription(blogToEdit.description);
            setBody(blogToEdit.body);
            setCategoryId(blogToEdit.category.id);
        }
    }, [blogToEdit]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        const blogData = { title, description, body, category_id: parseInt(categoryId) };

        try {
            if (blogToEdit) {
                // Update existing blog
                await api.put(`/blog/${blogToEdit.id}`, blogData);
            } else {
                // Create new blog
                await api.post('/blog', blogData);
            }
            onClose(true); // Pass true to signal a refresh is needed
        } catch (err) {
            setError(err.response?.data?.detail || 'An error occurred.');
            setSubmitting(false);
        }
    };

    return (
        <Overlay onClick={() => !submitting && onClose()}>
            <ModalContainer onClick={(e) => e.stopPropagation()}>
                <CloseButton onClick={() => !submitting && onClose()}>
                    <FaTimes />
                </CloseButton>
                <form onSubmit={handleSubmit}>
                    <ModalTitle>{blogToEdit ? 'Edit Your Story' : 'Create a New Story'}</ModalTitle>
                    {error && <ErrorMessage>{error}</ErrorMessage>}
                    <Input
                        type="text"
                        placeholder="Blog Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        disabled={submitting}
                    />
                    <Select
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        required
                        disabled={submitting}
                    >
                        <option value="" disabled>Select a Category</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </Select>
                    <Input
                        type="text"
                        placeholder="A short, catchy description (max 15 words)"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        disabled={submitting}
                    />
                    <TextArea
                        placeholder="Write your story here..."
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        required
                        disabled={submitting}
                    />
                    <SubmitButton type="submit" disabled={submitting}>
                        {submitting ? 'Submitting...' : (blogToEdit ? 'Update Blog' : 'Create Blog')}
                    </SubmitButton>
                </form>
            </ModalContainer>
        </Overlay>
    );
};

// Keyframes and Overlay are similar to BlogModal, could be refactored into a BaseModal component
const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const slideIn = keyframes`from { transform: translateY(-30px); } to { transform: translateY(0); }`;

const Overlay = styled.div`
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex; justify-content: center; align-items: center;
    z-index: 2000; animation: ${fadeIn} 0.3s ease;
`;

const ModalContainer = styled.div`
    background: white; padding: 40px; border-radius: 20px;
    width: 90%; max-width: 700px; position: relative;
    animation: ${slideIn} 0.4s ease;
`;

const CloseButton = styled.button`
    position: absolute; top: 20px; right: 20px;
    background: none; border: none; font-size: 1.5rem;
    cursor: pointer; color: #999;
    &:hover { color: #333; }
`;

const ModalTitle = styled.h2`
    margin-bottom: 20px;
    font-size: 2rem;
    color: #333;
`;

const Input = styled.input`
    width: 100%; padding: 12px; margin-bottom: 15px;
    border-radius: 8px; border: 1px solid #ddd; font-size: 1rem;
`;

const Select = styled.select`
    width: 100%; padding: 12px; margin-bottom: 15px;
    border-radius: 8px; border: 1px solid #ddd; font-size: 1rem;
    background-color: white;
`;

const TextArea = styled.textarea`
    width: 100%; padding: 12px; margin-bottom: 20px;
    border-radius: 8px; border: 1px solid #ddd; font-size: 1rem;
    height: 200px; resize: vertical;
`;

const SubmitButton = styled.button`
    width: 100%; padding: 15px; border: none; border-radius: 8px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white; font-size: 1.2rem; font-weight: bold; cursor: pointer;
    transition: background 0.3s ease;
    &:disabled { background: #ccc; cursor: not-allowed; }
`;

const ErrorMessage = styled.p`
    color: #dc3545;
    margin-bottom: 15px;
    text-align: center;
`;


export default CreateBlogModal; 
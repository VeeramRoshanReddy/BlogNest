import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import BlogCard from '../components/BlogCard';
import BlogModal from '../components/BlogModal';
import { FaPlusCircle } from 'react-icons/fa';
import CreateBlogModal from '../components/CreateBlogModal';
import ConfirmationModal from '../components/ConfirmationModal';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
    const { user, logout } = useAuth();
    const [myBlogs, setMyBlogs] = useState([]);
    const [likedBlogs, setLikedBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const [forceUpdate, setForceUpdate] = useState(0);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [blogToDelete, setBlogToDelete] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfileData = async () => {
            if (!user) return;
            setLoading(true);
            setError('');
            try {
                const [myBlogsResponse, likedBlogsResponse] = await Promise.all([
                    api.get('/users/me/blogs'),
                    api.get('/users/me/liked-blogs')
                ]);
                setMyBlogs(myBlogsResponse.data);
                setLikedBlogs(likedBlogsResponse.data);
            } catch (err) {
                setError('Failed to fetch profile data.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [user, forceUpdate]);
    
    const handleDeleteClick = (blogId) => {
        setBlogToDelete(blogId);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        if (!blogToDelete) return;
        try {
            await api.delete(`/blog/${blogToDelete}`);
            setForceUpdate(prev => prev + 1);
        } catch (err) {
            setError('Failed to delete the blog. Please try again.');
        } finally {
            setShowDeleteConfirm(false);
            setBlogToDelete(null);
        }
    };

    const cancelDelete = () => {
        setShowDeleteConfirm(false);
        setBlogToDelete(null);
    };

    const handleUnlike = async (blogId) => {
        try {
            await api.post(`/blog/${blogId}/like`); // Toggling like will unlike it
            setLikedBlogs(prevBlogs => prevBlogs.filter(b => b.id !== blogId));
            setForceUpdate(prev => prev + 1);
        } catch (err) {
            console.error('Failed to unlike blog', err);
            setError('Failed to update liked blogs.');
        }
    };

    const handleCloseCreateModal = (didCreate) => {
        setCreateModalOpen(false);
        if (didCreate) {
            setForceUpdate(prev => prev + 1);
        }
    };
    
    const handleCloseViewModal = (didInteract) => {
        setSelectedBlog(null);
        if (didInteract) {
            setForceUpdate(prev => prev + 1);
        }
    };

    return (
        <Container>
            <Header>
                <div>
                    <Title>{user?.sub}'s Profile</Title>
                    <p>Your corner of the BlogNest universe.</p>
                </div>
                <CreateBlogButton onClick={() => setCreateModalOpen(true)}>
                    <FaPlusCircle /> Post a New Blog
                </CreateBlogButton>
            </Header>

            {error && <ErrorMessage>{error}</ErrorMessage>}

            <SectionTitle>My Posts</SectionTitle>
            {loading ? <p>Loading your blogs...</p> : (
                <BlogGrid>
                    {myBlogs.length > 0 ? myBlogs.map((blog) => (
                        <BlogCard 
                            key={`my-${blog.id}`} 
                            blog={blog} 
                            onClick={setSelectedBlog} 
                            onDelete={() => handleDeleteClick(blog.id)}
                            showDelete={true}
                        />
                    )) : <p>You haven't posted any blogs yet.</p>}
                </BlogGrid>
            )}

            <SectionTitle>Liked Posts</SectionTitle>
            {loading ? <p>Loading liked blogs...</p> : (
                 <BlogGrid>
                    {likedBlogs.length > 0 ? likedBlogs.map((blog) => (
                        <BlogCard 
                            key={`liked-${blog.id}`}
                            blog={blog} 
                            onClick={setSelectedBlog} 
                            onUnlike={() => handleUnlike(blog.id)}
                        />
                    )) : <p>You haven't liked any blogs yet.</p>}
                </BlogGrid>
            )}

            {selectedBlog && <BlogModal blog={selectedBlog} onClose={handleCloseViewModal} />}
            {isCreateModalOpen && <CreateBlogModal onClose={handleCloseCreateModal} />}

            {showDeleteConfirm && (
                <ConfirmationModal
                    message="Are you sure you want to permanently delete this blog?"
                    onConfirm={confirmDelete}
                    onCancel={cancelDelete}
                />
            )}
        </Container>
    );
};

const Container = styled.div`
    padding: 5px 2rem;
    max-width: 1200px;
    margin: 0 auto;
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 40px;
`;

const Title = styled.h1`
    font-size: 2.5rem;
    color: #1976d2;
`;

const CreateBlogButton = styled.button`
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 12px 25px;
    border-radius: 25px;
    border: none;
    background: #1976d2;
    color: white;
    font-size: 1.1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        transform: translateY(-2px);
        background: #1565c0;
        box-shadow: 0 10px 20px rgba(25, 118, 210, 0.1);
    }
`;

const SectionTitle = styled.h2`
    font-size: 2rem;
    color: #1976d2;
    margin-top: 40px;
    margin-bottom: 20px;
    border-bottom: 2px solid #e3f0fd;
    padding-bottom: 10px;
`;

const BlogGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 30px;
`;

const ErrorMessage = styled.p`
    color: #d32f2f;
    background: #ffcdd2;
    padding: 10px;
    border-radius: 5px;
    text-align: center;
`;

const UserInfo = styled.div`
    text-align: center;
    margin-top: 0;
    margin-bottom: 2rem;
`;

const UserName = styled.h1`
    font-size: 2.5rem;
    color: #1976d2;
`;

export default ProfilePage; 
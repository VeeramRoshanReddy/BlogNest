import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import BlogCard from '../components/BlogCard';
import BlogModal from '../components/BlogModal';
import { FaPlusCircle } from 'react-icons/fa';
import CreateBlogModal from '../components/CreateBlogModal';

const ProfilePage = () => {
    const { user } = useAuth();
    const [myBlogs, setMyBlogs] = useState([]);
    const [likedBlogs, setLikedBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const [forceUpdate, setForceUpdate] = useState(0);

    useEffect(() => {
        const fetchProfileData = async () => {
            if (!user) return;
            try {
                setLoading(true);
                // The user object from the token might not have the ID.
                // You might need a /users/me endpoint to get full user details.
                // Assuming we can get it or already have it.
                // The API doesn't have a dedicated "get my blogs" endpoint,
                // so we filter all blogs. This is inefficient and should be
                // optimized in a real app with a dedicated backend endpoint.
                const allBlogsResponse = await api.get('/blogs');
                const userBlogs = allBlogsResponse.data.filter(b => b.creator.username === user.sub); // user.sub is the email/username from JWT
                setMyBlogs(userBlogs);

                // Liked blogs endpoint doesn't exist yet. Placeholder.
                // const likedBlogsResponse = await api.get('/users/me/liked-blogs');
                // setLikedBlogs(likedBlogsResponse.data);

            } catch (err) {
                setError('Failed to fetch profile data.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [user, forceUpdate]);

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

            <SectionTitle>My Posts</SectionTitle>
            {loading && <p>Loading your blogs...</p>}
            {error && <p>{error}</p>}
            {!loading && !error && (
                <BlogGrid>
                    {myBlogs.length > 0 ? myBlogs.map((blog) => (
                        <BlogCard key={blog.id} blog={blog} onClick={setSelectedBlog} />
                    )) : <p>You haven't posted any blogs yet.</p>}
                </BlogGrid>
            )}

            <SectionTitle>Liked Posts</SectionTitle>
            <p>Feature coming soon...</p>
            {/* When ready, you would map over likedBlogs here */}

            {selectedBlog && <BlogModal blog={selectedBlog} onClose={handleCloseViewModal} />}
            {isCreateModalOpen && <CreateBlogModal onClose={handleCloseCreateModal} />}
        </Container>
    );
};

const Container = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 40px;
`;

const Title = styled.h1`
    font-size: 2.5rem;
    color: #333;
`;

const CreateBlogButton = styled.button`
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 12px 25px;
    border-radius: 25px;
    border: none;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    font-size: 1.1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 20px rgba(0,0,0,0.1);
    }
`;

const SectionTitle = styled.h2`
    font-size: 2rem;
    color: #444;
    margin-top: 40px;
    margin-bottom: 20px;
    border-bottom: 2px solid #eee;
    padding-bottom: 10px;
`;

const BlogGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 30px;
`;

export default ProfilePage; 
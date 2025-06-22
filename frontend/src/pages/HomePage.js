import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import api from '../services/api';
import BlogCard from '../components/BlogCard';
import BlogModal from '../components/BlogModal';

const HomePage = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [forceUpdate, setForceUpdate] = useState(0);

    const fetchBlogs = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get('/blogs');
            // Sort by created_at descending and take only the first 9
            const sorted = response.data
                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                .slice(0, 9);
            setBlogs(sorted);
        } catch (err) {
            setError('Failed to fetch blogs.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBlogs();
    }, [fetchBlogs, forceUpdate]);

    const handleCardClick = (blog) => {
        setSelectedBlog(blog);
    };

    const handleCloseModal = (didInteract) => {
        setSelectedBlog(null);
        if (didInteract) {
            setForceUpdate(prev => prev + 1);
        }
    };

    return (
        <Container>
            {loading && <Loading>Loading blogs...</Loading>}
            {error && <ErrorMsg>{error}</ErrorMsg>}
            {!loading && !error && (
                <BlogGrid>
                    {blogs.map((blog) => (
                        <BlogCard key={blog.id} blog={blog} onClick={handleCardClick} />
                    ))}
                </BlogGrid>
            )}
            {selectedBlog && <BlogModal blog={selectedBlog} onClose={handleCloseModal} />}
        </Container>
    );
};

const Container = styled.div`
    min-height: 100vh;
    width: 100vw;
    background: linear-gradient(135deg, #1976d2 0%, #2196f3 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding: 40px 0 0 0;
`;

const BlogGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
    gap: 32px;
    width: 90%;
    max-width: 1200px;
    margin: 0 auto;
`;

const Loading = styled.div`
    color: #1976d2;
    font-size: 1.5rem;
    margin-top: 60px;
    font-weight: bold;
`;

const ErrorMsg = styled.div`
    color: #fff;
    background: #1976d2;
    padding: 16px 32px;
    border-radius: 10px;
    margin-top: 60px;
    font-size: 1.2rem;
`;

export default HomePage; 
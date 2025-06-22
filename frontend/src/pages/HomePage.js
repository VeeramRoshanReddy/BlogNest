import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import api from '../services/api';
import BlogCard from '../components/BlogCard';
import BlogModal from '../components/BlogModal';
import { FaSearch } from 'react-icons/fa';

const HomePage = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [forceUpdate, setForceUpdate] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchBy, setSearchBy] = useState('title');

    const fetchBlogs = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get('/blogs');
            let sorted = response.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            if (searchTerm.trim()) {
                if (searchBy === 'author') {
                    sorted = sorted.filter(blog => blog.author?.username?.toLowerCase().includes(searchTerm.toLowerCase()));
                } else {
                    sorted = sorted.filter(blog => blog.title?.toLowerCase().includes(searchTerm.toLowerCase()));
                }
            }
            setBlogs(sorted.slice(0, 24));
        } catch (err) {
            setError('Failed to fetch blogs.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [searchTerm, searchBy]);

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
            <SearchBarContainer>
                <SearchInput
                    type="text"
                    placeholder={`Search by ${searchBy}...`}
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
                <Dropdown value={searchBy} onChange={e => setSearchBy(e.target.value)}>
                    <option value="title">Title</option>
                    <option value="author">Author</option>
                </Dropdown>
                <SearchIcon />
            </SearchBarContainer>
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
    background: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding: 40px 0 0 0;
`;

const SearchBarContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 32px;
    margin-top: 10px;
    background: #e3f0fd;
    border-radius: 12px;
    padding: 16px 24px;
    box-shadow: 0 2px 8px 0 rgba(25, 118, 210, 0.06);
`;

const SearchInput = styled.input`
    padding: 12px 16px;
    border-radius: 8px;
    border: 1.5px solid #1976d2;
    font-size: 1rem;
    background: #fff;
    color: #0d2346;
    width: 260px;
    &:focus {
        border-color: #1565c0;
        outline: none;
    }
`;

const Dropdown = styled.select`
    padding: 12px 16px;
    border-radius: 8px;
    border: 1.5px solid #1976d2;
    font-size: 1rem;
    background: #fff;
    color: #1976d2;
    &:focus {
        border-color: #1565c0;
        outline: none;
    }
`;

const SearchIcon = styled(FaSearch)`
    color: #1976d2;
    font-size: 1.3rem;
`;

const BlogGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
    gap: 40px;
    width: 92%;
    max-width: 1280px;
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
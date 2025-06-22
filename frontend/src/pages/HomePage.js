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
                    sorted = sorted.filter(blog => blog.creator?.username?.toLowerCase().includes(searchTerm.toLowerCase()));
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
            <PageContainer>
                <Title>Blog Posts</Title>
                <SearchContainer>
                    <SearchInput
                        type="text"
                        placeholder={`Search by ${searchBy}...`}
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                    <SearchSelect value={searchBy} onChange={e => setSearchBy(e.target.value)}>
                        <option value="title">Title</option>
                        <option value="author">Author</option>
                    </SearchSelect>
                    <SearchIcon />
                </SearchContainer>
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
            </PageContainer>
        </Container>
    );
};

const Container = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    padding: 5px 2rem;
`;

const PageContainer = styled.div`
    padding: 1rem 2rem;
    max-width: 1200px;
    margin: 0 auto;
`;

const Title = styled.h1`
    font-size: 2.5rem;
    color: #1976d2;
    margin-top: 0;
    margin-bottom: 1rem;
    text-align: center;
    font-weight: 700;
`;

const SearchContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-bottom: 2rem;
    gap: 1rem;
    align-items: center;
    margin-right: 1rem;
`;

const SearchInput = styled.input`
    padding: 0.8rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 1rem;
    width: 300px;
    transition: border-color 0.3s;

    &:focus {
        outline: none;
        border-color: #1976d2;
    }
`;

const SearchSelect = styled.select`
    padding: 0.8rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 1rem;
    background: white;
    cursor: pointer;
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
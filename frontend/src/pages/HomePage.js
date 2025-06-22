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
    const [searchTerm, setSearchTerm] = useState('');
    const [forceUpdate, setForceUpdate] = useState(0);

    const fetchBlogs = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get('/blogs', {
                params: { search: searchTerm }
            });
            setBlogs(response.data);
        } catch (err) {
            setError('Failed to fetch blogs.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [searchTerm]);

    useEffect(() => {
        const searchTimeout = setTimeout(() => {
            fetchBlogs();
        }, 500); // Debounce search

        return () => clearTimeout(searchTimeout);
    }, [fetchBlogs, forceUpdate]);

    const handleCardClick = (blog) => {
        setSelectedBlog(blog);
    };

    const handleCloseModal = (didInteract) => {
        setSelectedBlog(null);
        if (didInteract) {
            setForceUpdate(prev => prev + 1); // Trigger a refetch
        }
    };

    return (
        <Container>
            <Header>
                <Title>Latest Stories</Title>
                <SearchContainer>
                    <SearchInput
                        type="text"
                        placeholder="Search by title or author..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <SearchIcon />
                </SearchContainer>
            </Header>

            {loading && <p>Loading blogs...</p>}
            {error && <p>{error}</p>}
            
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

const SearchContainer = styled.div`
    position: relative;
    width: 300px;
`;

const SearchInput = styled.input`
    width: 100%;
    padding: 12px 20px 12px 40px;
    border-radius: 20px;
    border: 1px solid #ddd;
    font-size: 1rem;
    
    &:focus {
        outline: none;
        border-color: #667eea;
    }
`;

const SearchIcon = styled(FaSearch)`
    position: absolute;
    left: 15px;
    top: 50%;
    transform: translateY(-50%);
    color: #aaa;
`;

const BlogGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 30px;
`;

export default HomePage; 
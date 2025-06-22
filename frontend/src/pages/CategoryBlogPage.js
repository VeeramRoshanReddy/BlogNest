import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import BlogCard from '../components/BlogCard';
import BlogModal from '../components/BlogModal';
import { FaSearch, FaArrowLeft } from 'react-icons/fa';

const CategoryBlogPage = () => {
    const { categoryId } = useParams();
    const [blogs, setBlogs] = useState([]);
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchBy, setSearchBy] = useState('title');
    const [forceUpdate, setForceUpdate] = useState(0);

    const fetchCategoryBlogs = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get(`/categories/${categoryId}/blogs`);
            let sorted = response.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            if (searchTerm.trim()) {
                if (searchBy === 'author') {
                    sorted = sorted.filter(blog => blog.author?.username?.toLowerCase().includes(searchTerm.toLowerCase()));
                } else {
                    sorted = sorted.filter(blog => blog.title?.toLowerCase().includes(searchTerm.toLowerCase()));
                }
            }
            setBlogs(sorted);
            if(sorted.length > 0 && !category) {
                setCategory(sorted[0].category);
            }
        } catch (err) {
            setError('Failed to fetch blogs for this category.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [categoryId, searchTerm, searchBy, category]);

    useEffect(() => {
        fetchCategoryBlogs();
    }, [fetchCategoryBlogs, forceUpdate]);

    const handleCloseModal = (didInteract) => {
        setSelectedBlog(null);
        if (didInteract) {
            setForceUpdate(prev => prev + 1);
        }
    };

    return (
        <Container>
            <Header>
                <div>
                    <BackButton to="/categories"><FaArrowLeft /> Back to Categories</BackButton>
                    <Title>Blogs in {category ? `"${category.name}"` : 'Category'}</Title>
                </div>
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
            </Header>

            {loading && <p>Loading blogs...</p>}
            {error && <p>{error}</p>}
            {!loading && !error && blogs.length > 0 ? (
                <BlogGrid>
                    {blogs.map((blog) => (
                        <BlogCard key={blog.id} blog={blog} onClick={setSelectedBlog} />
                    ))}
                </BlogGrid>
            ) : (
                <p>No blogs found in this category.</p>
            )}

            {selectedBlog && <BlogModal blog={selectedBlog} onClose={handleCloseModal} />}
        </Container>
    );
};

// Reusing some styles from HomePage for consistency, but defining them here
// to make the component self-contained. In a larger app, these could be shared components.
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

const BackButton = styled(Link)`
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
    color: #1976d2;
    font-weight: 500;
`;

const SearchBarContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    background: #e3f0fd;
    border-radius: 12px;
    padding: 12px 20px;
    box-shadow: 0 2px 8px 0 rgba(25, 118, 210, 0.06);
`;

const SearchInput = styled.input`
    padding: 10px 14px;
    border-radius: 8px;
    border: 1.5px solid #1976d2;
    font-size: 1rem;
    background: #fff;
    color: #0d2346;
    width: 180px;
    &:focus {
        border-color: #1565c0;
        outline: none;
    }
`;

const Dropdown = styled.select`
    padding: 10px 14px;
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
    font-size: 1.2rem;
`;

const BlogGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 30px;
`;

export default CategoryBlogPage; 
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
    const [category, setCategory] = useState(null); // To store category info
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [forceUpdate, setForceUpdate] = useState(0);

    const fetchCategoryBlogs = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get(`/categories/${categoryId}/blogs`, {
                params: { search: searchTerm }
            });
            setBlogs(response.data);
            if(response.data.length > 0 && !category) {
                setCategory(response.data[0].category);
            }
        } catch (err) {
            setError('Failed to fetch blogs for this category.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [categoryId, searchTerm, category]);

    useEffect(() => {
        const searchTimeout = setTimeout(() => {
            fetchCategoryBlogs();
        }, 500);

        return () => clearTimeout(searchTimeout);
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
                <SearchContainer>
                    <SearchInput
                        type="text"
                        placeholder="Search in this category..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <SearchIcon />
                </SearchContainer>
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
    color: #667eea;
    font-weight: 500;
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

export default CategoryBlogPage; 
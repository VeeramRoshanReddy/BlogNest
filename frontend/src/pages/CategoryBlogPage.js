import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import BlogCard from '../components/BlogCard';
import BlogModal from '../components/BlogModal';
import { FaSearch, FaArrowLeft } from 'react-icons/fa';

const PageContainer = styled.div`
    padding: 1rem 2rem;
    max-width: 1200px;
    margin: 0 auto;
`;

const Title = styled.h1`
    font-size: 2.5rem;
    color: #1976d2;
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

const BlogGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 30px;
`;

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
                    sorted = sorted.filter(blog => blog.creator?.username?.toLowerCase().includes(searchTerm.toLowerCase()));
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
        <PageContainer>
            <Title>{category ? `"${category.name}"` : 'Category'}</Title>
            
            <SearchContainer>
                <SearchSelect 
                    value={searchBy} 
                    onChange={(e) => setSearchBy(e.target.value)}
                >
                    <option value="title">Title</option>
                    <option value="author">Author</option>
                </SearchSelect>
                <SearchInput
                    type="text"
                    placeholder={`Search by ${searchBy}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </SearchContainer>

            {loading ? (
                <div>Loading...</div>
            ) : error ? (
                <div>Error: {error}</div>
            ) : (
                <BlogGrid>
                    {blogs.map((blog) => (
                        <BlogCard 
                            key={blog.id} 
                            blog={blog} 
                            onClick={() => setSelectedBlog(blog)}
                        />
                    ))}
                </BlogGrid>
            )}

            {selectedBlog && (
                <BlogModal 
                    blog={selectedBlog} 
                    onClose={handleCloseModal}
                />
            )}
        </PageContainer>
    );
};

export default CategoryBlogPage; 
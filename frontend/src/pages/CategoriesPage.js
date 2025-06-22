import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import api from '../services/api';

const CategoriesPage = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const response = await api.get('/categories');
                setCategories(response.data);
            } catch (err) {
                setError('Failed to fetch categories.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    return (
        <Container>
            <Title>Explore by Category</Title>
            {loading && <p>Loading categories...</p>}
            {error && <p>{error}</p>}
            {!loading && !error && (
                <CategoryGrid>
                    {categories.map((category) => (
                        <CategoryCard key={category.id} to={`/categories/${category.id}/blogs`}>
                            <CategoryName>{category.name}</CategoryName>
                            <CategoryDescription>{category.description}</CategoryDescription>
                            <BlogCount>{category.blog_count} Blogs</BlogCount>
                        </CategoryCard>
                    ))}
                </CategoryGrid>
            )}
        </Container>
    );
};

const Container = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
`;

const Title = styled.h1`
    font-size: 2.5rem;
    color: #333;
    margin-bottom: 40px;
    text-align: center;
`;

const CategoryGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 30px;
`;

const CategoryCard = styled(Link)`
    background: white;
    border-radius: 15px;
    padding: 25px;
    box-shadow: 0 10px 20px rgba(0,0,0,0.05);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    display: flex;
    flex-direction: column;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 15px 30px rgba(0,0,0,0.1);
    }
`;

const CategoryName = styled.h2`
    font-size: 1.5rem;
    color: #667eea;
    margin-bottom: 15px;
`;

const CategoryDescription = styled.p`
    color: #666;
    line-height: 1.6;
    flex-grow: 1;
    margin-bottom: 20px;
`;

const BlogCount = styled.span`
    font-weight: bold;
    color: #999;
`;


export default CategoriesPage; 
import React from 'react';
import styled from 'styled-components';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';

const BlogCard = ({ blog, onClick }) => {
    // Early return if blog is null or undefined
    if (!blog) {
        return (
            <Card>
                <Title>Loading...</Title>
                <Meta>
                    <Author>By Unknown</Author>
                    <Date>Unknown date</Date>
                </Meta>
                <Excerpt>Content loading...</Excerpt>
                <Stats>
                    <Stat><FaThumbsUp /> 0</Stat>
                    <Stat><FaThumbsDown /> 0</Stat>
                </Stats>
            </Card>
        );
    }

    // Safe date formatting function
    const formatDate = (dateString) => {
        if (!dateString) return 'Unknown date';
        
        try {
            const date = new Date(dateString);
            // Check if date is valid
            if (isNaN(date.getTime())) {
                return 'Invalid date';
            }
            return date.toLocaleDateString();
        } catch (error) {
            console.error('Date formatting error:', error);
            return 'Invalid date';
        }
    };

    // Safe content handling
    const getExcerpt = (content) => {
        if (!content || typeof content !== 'string') return 'No content available';
        return content.length > 120 ? content.slice(0, 120) + '...' : content;
    };

    return (
        <Card onClick={() => onClick && onClick(blog)}>
            <Title>{blog.title || 'Untitled'}</Title>
            <Meta>
                <Author>By {blog.author?.username || 'Unknown'}</Author>
                <Date>{formatDate(blog.created_at)}</Date>
            </Meta>
            <Excerpt>{getExcerpt(blog.content)}</Excerpt>
            <Stats>
                <Stat><FaThumbsUp /> {blog.likes || 0}</Stat>
                <Stat><FaThumbsDown /> {blog.dislikes || 0}</Stat>
            </Stats>
        </Card>
    );
};

const Card = styled.div`
    background: #fff;
    border-radius: 18px;
    box-shadow: 0 4px 24px 0 rgba(25, 118, 210, 0.08), 0 1.5px 6px 0 rgba(25, 118, 210, 0.06);
    padding: 32px 28px 24px 28px;
    transition: transform 0.18s, box-shadow 0.18s, border-color 0.18s;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    gap: 18px;
    border: 2px solid #e3f0fd;
    &:hover {
        transform: translateY(-6px) scale(1.025);
        box-shadow: 0 8px 32px 0 rgba(25, 118, 210, 0.14), 0 3px 12px 0 rgba(25, 118, 210, 0.10);
        border-color: #1976d2;
    }
`;

const Title = styled.h2`
    color: #1976d2;
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0 0 4px 0;
    letter-spacing: 0.5px;
`;

const Meta = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.98rem;
    color: #1976d2;
    opacity: 0.85;
`;

const Author = styled.span`
    font-weight: 500;
`;

const Date = styled.span`
    font-style: italic;
`;

const Excerpt = styled.p`
    color: #0d2346;
    font-size: 1.08rem;
    margin: 0 0 8px 0;
    line-height: 1.6;
    min-height: 48px;
`;

const Stats = styled.div`
    display: flex;
    gap: 18px;
    align-items: center;
    margin-top: 8px;
`;

const Stat = styled.div`
    display: flex;
    align-items: center;
    gap: 6px;
    color: #1976d2;
    font-weight: 600;
    font-size: 1.05rem;
`;

export default BlogCard;
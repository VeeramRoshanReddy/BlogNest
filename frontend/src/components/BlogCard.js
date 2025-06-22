import React from 'react';
import styled from 'styled-components';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';

const BlogCard = ({ blog, onClick }) => {
    return (
        <Card onClick={() => onClick(blog)}>
            <Title>{blog.title}</Title>
            <Meta>
                <Author>By {blog.author?.username || 'Unknown'}</Author>
                <Date>{new Date(blog.created_at).toLocaleDateString()}</Date>
            </Meta>
            <Excerpt>{blog.content.slice(0, 120)}{blog.content.length > 120 ? '...' : ''}</Excerpt>
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
    box-shadow: 0 4px 24px 0 rgba(25, 118, 210, 0.10), 0 1.5px 6px 0 rgba(25, 118, 210, 0.08);
    padding: 32px 28px 24px 28px;
    transition: transform 0.18s, box-shadow 0.18s;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    gap: 18px;
    border: 2px solid #1976d2;
    &:hover {
        transform: translateY(-6px) scale(1.025);
        box-shadow: 0 8px 32px 0 rgba(25, 118, 210, 0.18), 0 3px 12px 0 rgba(25, 118, 210, 0.12);
        border-color: #2196f3;
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
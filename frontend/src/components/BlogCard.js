import React from 'react';
import styled from 'styled-components';
import { FaThumbsUp, FaThumbsDown, FaTrash, FaHeart } from 'react-icons/fa';

const BlogCard = ({ blog, onClick, onDelete, onUnlike }) => {
    
    const handleDeleteClick = (e) => {
        e.stopPropagation();
        if (onDelete) onDelete();
    };

    const handleUnlikeClick = (e) => {
        e.stopPropagation();
        if (onUnlike) onUnlike();
    };

    if (!blog) {
        return (
            <Card>
                <Title>Loading...</Title>
            </Card>
        );
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'Unknown date';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'Invalid Date';
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            });
        } catch (error) {
            return 'Invalid Date';
        }
    };

    const getExcerpt = () => {
        const content = blog.description || blog.body || '';
        const cleanContent = content.replace(/<[^>]*>/g, '');
        return cleanContent.length > 100 ? cleanContent.slice(0, 100) + '...' : cleanContent;
    };

    const getAuthorName = () => {
        return blog.creator?.username || 'Anonymous';
    };

    return (
        <Card onClick={() => onClick && onClick(blog)}>
            {onDelete && (
                <DeleteButton onClick={handleDeleteClick}>
                    <FaTrash />
                </DeleteButton>
            )}
            {onUnlike && (
                <UnlikeButton onClick={handleUnlikeClick}>
                    <FaHeart />
                </UnlikeButton>
            )}
            <Title>{blog.title || 'Untitled'}</Title>
            <Meta>
                <Author>By {getAuthorName()}</Author>
                <DateText>{formatDate(blog.created_at)}</DateText>
            </Meta>
            <Excerpt>{getExcerpt()}</Excerpt>
            <Stats>
                <Stat><FaThumbsUp /> {blog.likes || 0}</Stat>
                <Stat><FaThumbsDown /> {blog.dislikes || 0}</Stat>
            </Stats>
        </Card>
    );
};

const ActionButton = styled.button`
    position: absolute;
    top: 15px;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
    opacity: 0.7;
    z-index: 10;

    &:hover {
        opacity: 1;
        transform: scale(1.1);
    }
`;

const DeleteButton = styled(ActionButton)`
    right: 15px;
    background: #fff;
    border: 1.5px solid #d32f2f;
    color: #d32f2f;

    &:hover {
        background: #d32f2f;
        color: #fff;
    }
`;

const UnlikeButton = styled(ActionButton)`
    right: 15px;
    background: #d32f2f;
    border: 1.5px solid #d32f2f;
    color: #fff;

    &:hover {
        background: #fff;
        color: #d32f2f;
    }
`;

const Card = styled.div`
    position: relative;
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
    padding-right: 40px; /* Space for buttons */
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

const DateText = styled.span`
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
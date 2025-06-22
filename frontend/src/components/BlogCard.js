import React from 'react';
import styled from 'styled-components';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';

const BlogCard = ({ blog, onClick }) => {
    // Debug logging - remove this after fixing
    console.log('=== BlogCard Debug ===');
    console.log('Full blog object:', blog);
    console.log('Blog keys:', blog ? Object.keys(blog) : 'blog is null/undefined');
    console.log('Blog.creator:', blog?.creator);
    console.log('Blog.created_at:', blog?.created_at);
    console.log('Blog.description:', blog?.description);
    console.log('======================');
    
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

    // Enhanced date formatting function with better error handling
    const formatDate = (dateString) => {
        if (!dateString) return 'Unknown date';
        
        try {
            let date;
            
            console.log('Raw date from backend:', dateString, typeof dateString);
            
            // Handle different date formats from backend
            if (typeof dateString === 'string') {
                // Remove any timezone info that might cause issues
                let cleanDateString = dateString;
                
                // Handle common problematic formats
                if (dateString.includes('T')) {
                    // ISO format: 2024-01-15T10:30:00.000Z or 2024-01-15T10:30:00
                    cleanDateString = dateString.split('T')[0]; // Get just the date part
                } else if (dateString.includes(' ')) {
                    // SQL datetime format: 2024-01-15 10:30:00
                    cleanDateString = dateString.split(' ')[0]; // Get just the date part
                }
                
                console.log('Cleaned date string:', cleanDateString);
                
                // Try to parse the cleaned date
                date = new Date(cleanDateString + 'T00:00:00'); // Add time to avoid timezone issues
            } else if (dateString instanceof Date) {
                date = dateString;
            } else {
                date = new Date(dateString);
            }
            
            console.log('Parsed date object:', date);
            
            // Check if date is valid
            if (isNaN(date.getTime())) {
                console.error('Invalid date after parsing:', dateString);
                return 'Invalid date';
            }
            
            // Format date in a readable way
            const formattedDate = date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
            
            console.log('Final formatted date:', formattedDate);
            return formattedDate;
            
        } catch (error) {
            console.error('Date formatting error:', error, 'for date:', dateString);
            return 'Invalid date';
        }
    };

    // Get description for excerpt - prioritize description over body for cards
    const getExcerpt = () => {
        // For blog cards, we want description, not the full body content
        const content = blog.description || 'No description available';
        
        if (!content || typeof content !== 'string') {
            return 'No description available';
        }
        
        // Truncate if too long
        return content.length > 120 ? content.slice(0, 120) + '...' : content;
    };

    // Get author name from creator relationship with better fallbacks
    const getAuthorName = () => {
        // Check if we have a computed field from backend
        if (blog.author_name) {
            return blog.author_name;
        }
        
        // Check creator object
        if (blog.creator) {
            return blog.creator.username || blog.creator.email || 'Unknown Author';
        }
        
        // Fallback
        return 'Unknown Author';
    };

    return (
        <Card onClick={() => onClick && onClick(blog)}>
            <Title>{blog.title || 'Untitled'}</Title>
            <Meta>
                <Author>By {getAuthorName()}</Author>
                <Date>{formatDate(blog.created_at || blog.formatted_date)}</Date>
            </Meta>
            <Excerpt>{getExcerpt()}</Excerpt>
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
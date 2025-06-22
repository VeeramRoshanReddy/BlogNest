import React from 'react';
import styled from 'styled-components';
import { FaUser, FaCalendarAlt, FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import { format } from 'date-fns';

const BlogCard = ({ blog, onClick }) => {
    return (
        <Card onClick={() => onClick(blog)}>
            <CardHeader>
                <BlogTitle>{blog.title}</BlogTitle>
                <BlogCategory>{blog.category.name}</BlogCategory>
            </CardHeader>
            <BlogDescription>{blog.description}</BlogDescription>
            <CardFooter>
                <AuthorInfo>
                    <FaUser />
                    <span>{blog.creator.username}</span>
                </AuthorInfo>
                <DateInfo>
                    <FaCalendarAlt />
                    <span>{format(new Date(blog.created_at), 'MMM dd, yyyy')}</span>
                </DateInfo>
                <Interactions>
                    <Likes>
                        <FaThumbsUp />
                        {blog.likes}
                    </Likes>
                    <Dislikes>
                        <FaThumbsDown />
                        {blog.dislikes}
                    </Dislikes>
                </Interactions>
            </CardFooter>
        </Card>
    );
};

const Card = styled.div`
    background: #ffffff;
    border-radius: 15px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
    padding: 25px;
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    display: flex;
    flex-direction: column;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 15px 30px rgba(0, 0, 0, 0.12);
    }
`;

const CardHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 15px;
`;

const BlogTitle = styled.h2`
    font-size: 1.5rem;
    color: #333;
    font-weight: 700;
`;

const BlogCategory = styled.span`
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 5px 15px;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 500;
    white-space: nowrap;
`;

const BlogDescription = styled.p`
    font-size: 1rem;
    color: #666;
    line-height: 1.6;
    flex-grow: 1;
    margin-bottom: 20px;
`;

const CardFooter = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #999;
    font-size: 0.9rem;
`;

const AuthorInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`;

const DateInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`;

const Interactions = styled.div`
    display: flex;
    gap: 15px;
`;

const Likes = styled.div`
    display: flex;
    align-items: center;
    gap: 5px;
    color: #28a745;
`;

const Dislikes = styled.div`
    display: flex;
    align-items: center;
    gap: 5px;
    color: #dc3545;
`;

export default BlogCard; 
import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const { login, signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (isLogin) {
                await login(email, password);
            } else {
                await signup(username, email, password);
            }
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.detail || 'An error occurred. Please try again.');
        }
    };

    return (
        <Container>
            <FormContainer onSubmit={handleSubmit}>
                <Title>{isLogin ? 'Welcome Back!' : 'Create Your Account'}</Title>
                <p>Your journey into stories and ideas starts here.</p>
                {error && <ErrorMessage>{error}</ErrorMessage>}
                {!isLogin && (
                    <Input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                )}
                <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <Button type="submit">{isLogin ? 'Login' : 'Sign Up'}</Button>
                <ToggleButton onClick={() => setIsLogin(!isLogin)}>
                    {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Login'}
                </ToggleButton>
            </FormContainer>
        </Container>
    );
};

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const FormContainer = styled.form`
    padding: 40px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    border: 1px solid rgba(255, 255, 255, 0.18);
    text-align: center;
    color: white;
    max-width: 400px;
    width: 100%;
`;

const Title = styled.h1`
    margin-bottom: 10px;
    font-size: 2.5rem;
`;

const Input = styled.input`
    width: 100%;
    padding: 15px;
    margin: 10px 0;
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.3);
    background: rgba(255, 255, 255, 0.2);
    color: white;
    font-size: 1rem;

    &::placeholder {
        color: rgba(255, 255, 255, 0.7);
    }
`;

const Button = styled.button`
    width: 100%;
    padding: 15px;
    margin: 20px 0 10px;
    border: none;
    border-radius: 10px;
    background: linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%);
    color: white;
    font-size: 1.2rem;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        background: linear-gradient(-135deg, #89f7fe 0%, #66a6ff 100%);
    }
`;

const ToggleButton = styled.p`
    cursor: pointer;
    text-decoration: underline;
`;

const ErrorMessage = styled.p`
    color: #ffcccb;
    margin-top: 10px;
`;


export default LoginPage; 
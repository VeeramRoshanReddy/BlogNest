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
    const [loading, setLoading] = useState(false);
    const { login, signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        try {
            if (isLogin) {
                const data = await login(email, password);
                // Data and token setting is now handled in AuthContext
                if (data) {
                    navigate('/');
                } else {
                    throw new Error('Login failed - no data returned');
                }
            } else {
                // Validate required fields for signup
                if (!username.trim()) {
                    throw new Error('Username is required');
                }
                if (!email.trim()) {
                    throw new Error('Email is required');
                }
                if (!password.trim()) {
                    throw new Error('Password is required');
                }
                
                const result = await signup(username, email, password);
                // After successful signup, navigate to login or home
                if (result) {
                    navigate('/');
                } else {
                    // If signup successful but no data returned, switch to login
                    setIsLogin(true);
                    setError('Account created successfully! Please login.');
                }
            }
        } catch (err) {
            console.error('Authentication error:', err);
            
            // Handle different types of errors
            let errorMessage = 'An error occurred. Please try again.';
            
            if (err.response?.status === 422) {
                errorMessage = 'Invalid email or password format. Please check your input.';
            } else if (err.response?.status === 401) {
                errorMessage = 'Invalid email or password.';
            } else if (err.response?.status === 400) {
                errorMessage = 'Bad request. Please check your input.';
            } else if (err.response?.data?.detail) {
                if (Array.isArray(err.response.data.detail)) {
                    errorMessage = err.response.data.detail.map(d => d.msg || d).join(', ');
                } else {
                    errorMessage = err.response.data.detail;
                }
            } else if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err.message) {
                errorMessage = err.message;
            } else if (typeof err === 'string') {
                errorMessage = err;
            }
            
            setError(errorMessage);
        } finally {
            setLoading(false);
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
                        disabled={loading}
                    />
                )}
                <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                />
                <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                />
                <Button type="submit" disabled={loading}>
                    {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Sign Up')}
                </Button>
                <ToggleButton 
                    onClick={() => {
                        if (!loading) {
                            setIsLogin(!isLogin);
                            setError(''); // Clear error when switching
                        }
                    }}
                    disabled={loading}
                >
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
    box-sizing: border-box;

    &::placeholder {
        color: rgba(255, 255, 255, 0.7);
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
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

    &:hover:not(:disabled) {
        background: linear-gradient(-135deg, #89f7fe 0%, #66a6ff 100%);
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;

const ToggleButton = styled.p`
    cursor: pointer;
    text-decoration: underline;
    
    &[disabled] {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;

const ErrorMessage = styled.p`
    color: #ffcccb;
    margin: 10px 0;
    font-weight: bold;
`;

export default LoginPage;
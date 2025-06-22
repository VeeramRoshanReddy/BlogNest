import React, { useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
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
                if (data) {
                    navigate('/');
                } else {
                    throw new Error('Login failed - no data returned');
                }
            } else {
                if (!username.trim()) throw new Error('Username is required');
                if (!email.trim()) throw new Error('Email is required');
                if (!password.trim()) throw new Error('Password is required');
                const result = await signup(username, email, password);
                if (result) {
                    navigate('/');
                } else {
                    setIsLogin(true);
                    setError('Account created successfully! Please login.');
                }
            }
        } catch (err) {
            let errorMessage = 'An error occurred. Please try again.';
            if (err.response?.status === 422) errorMessage = 'Invalid email or password format. Please check your input.';
            else if (err.response?.status === 401) errorMessage = 'Invalid email or password.';
            else if (err.response?.status === 400) errorMessage = 'Bad request. Please check your input.';
            else if (err.response?.data?.detail) {
                if (Array.isArray(err.response.data.detail)) errorMessage = err.response.data.detail.map(d => d.msg || d).join(', ');
                else errorMessage = err.response.data.detail;
            } else if (err.response?.data?.message) errorMessage = err.response.data.message;
            else if (err.message) errorMessage = err.message;
            else if (typeof err === 'string') errorMessage = err;
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <OuterContainer>
            <CardContainer>
                <ToggleBar>
                    <ToggleButton
                        active={isLogin}
                        onClick={() => !loading && setIsLogin(true)}
                        disabled={loading || isLogin}
                    >
                        Sign In
                    </ToggleButton>
                    <ToggleButton
                        active={!isLogin}
                        onClick={() => !loading && setIsLogin(false)}
                        disabled={loading || !isLogin}
                    >
                        Sign Up
                    </ToggleButton>
                    <ToggleSlider isLogin={isLogin} />
                </ToggleBar>
                <FormWrapper isLogin={isLogin}>
                    <FormContainer onSubmit={handleSubmit}>
                        <Title>{isLogin ? 'Welcome Back!' : 'Create Your Account'}</Title>
                        <SubTitle>Your journey into stories and ideas starts here.</SubTitle>
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
                    </FormContainer>
                </FormWrapper>
            </CardContainer>
        </OuterContainer>
    );
};

const slide = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const OuterContainer = styled.div`
    min-height: 100vh;
    width: 100vw;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const CardContainer = styled.div`
    background: #fff;
    border-radius: 24px;
    box-shadow: 0 8px 32px 0 rgba(25, 118, 210, 0.10);
    padding: 48px 32px 32px 32px;
    min-width: 370px;
    max-width: 400px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    animation: ${slide} 0.5s cubic-bezier(0.23, 1, 0.32, 1);
`;

const ToggleBar = styled.div`
    display: flex;
    position: relative;
    background: #e3f0fd;
    border-radius: 12px;
    margin-bottom: 32px;
    overflow: hidden;
    height: 48px;
`;

const ToggleButton = styled.button`
    flex: 1;
    background: none;
    border: none;
    color: ${({ active }) => (active ? '#fff' : '#1976d2')};
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    z-index: 2;
    transition: color 0.2s;
    outline: none;
    position: relative;
    &:disabled {
        cursor: not-allowed;
        opacity: 0.7;
    }
`;

const ToggleSlider = styled.div`
    position: absolute;
    top: 0;
    left: ${({ isLogin }) => (isLogin ? '0%' : '50%')};
    width: 50%;
    height: 100%;
    background: #1976d2;
    border-radius: 12px;
    transition: left 0.3s cubic-bezier(0.23, 1, 0.32, 1);
    z-index: 1;
`;

const FormWrapper = styled.div`
    width: 100%;
    animation: ${slide} 0.5s cubic-bezier(0.23, 1, 0.32, 1);
`;

const FormContainer = styled.form`
    display: flex;
    flex-direction: column;
    gap: 18px;
    width: 100%;
`;

const Title = styled.h1`
    color: #1976d2;
    font-size: 2rem;
    margin-bottom: 0;
`;

const SubTitle = styled.p`
    color: #0d2346;
    font-size: 1.05rem;
    margin-bottom: 8px;
`;

const Input = styled.input`
    width: 100%;
    padding: 14px;
    border-radius: 8px;
    border: 1.5px solid #e3f0fd;
    background: #fff;
    color: #0d2346;
    font-size: 1rem;
    box-sizing: border-box;
    transition: border-color 0.18s, box-shadow 0.18s;
    &::placeholder {
        color: #b0c4de;
    }
    &:focus {
        border-color: #1976d2;
        box-shadow: 0 0 0 2px #1976d255;
    }
    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;

const Button = styled.button`
    width: 100%;
    padding: 15px;
    margin-top: 10px;
    border: none;
    border-radius: 8px;
    background: #1976d2;
    color: #fff;
    font-size: 1.2rem;
    font-weight: bold;
    cursor: pointer;
    transition: background 0.2s;
    &:hover:not(:disabled) {
        background: #1565c0;
    }
    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;

const ErrorMessage = styled.p`
    color: #d32f2f;
    margin: 10px 0;
    font-weight: bold;
`;

export default LoginPage;
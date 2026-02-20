import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                username,
                password
            });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Authentication failed. Access denied.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="auth-mesh"></div>
            <div className="auth-container">
                <div className="glass-panel auth-card animate-fade-in">
                    <div className="stagger-1 animate-fade-in" style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <div style={{ width: '60px', height: '60px', margin: '0 auto 1.5rem', background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-magenta))', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 30px rgba(0,242,234,0.3)' }}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
                        </div>
                        <h1 className="heading-lg heading-gradient">KODBANK</h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '0.5rem' }}>Secure Global Access</p>
                    </div>

                    {error && <div className="animate-fade-in" style={{ background: 'rgba(255, 51, 102, 0.1)', color: 'var(--error)', padding: '12px', borderRadius: '8px', marginBottom: '1.5rem', textAlign: 'center', border: '1px solid rgba(255, 51, 102, 0.2)', fontSize: '0.9rem' }}>{error}</div>}

                    <form onSubmit={handleLogin}>
                        <div className="input-group stagger-2 animate-fade-in">
                            <input
                                type="text"
                                className="input-field"
                                placeholder="IDENTIFIER (USERNAME)"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="input-group stagger-3 animate-fade-in">
                            <input
                                type="password"
                                className="input-field"
                                placeholder="SECURITY PASSPHRASE"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="stagger-4 animate-fade-in" style={{ marginTop: '2.5rem' }}>
                            <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={isLoading}>
                                {isLoading ? 'Authenticating...' : 'Initialize Session'}
                            </button>
                        </div>
                    </form>

                    <div className="stagger-4 animate-fade-in" style={{ marginTop: '2.5rem', textAlign: 'center', borderTop: '1px solid var(--panel-border)', paddingTop: '1.5rem' }}>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                            New to Kodbank? <Link to="/register" style={{ color: 'var(--text-main)', textDecoration: 'none', fontWeight: 600, borderBottom: '1px solid var(--accent-cyan)', paddingBottom: '2px', marginLeft: '8px' }}>Request Access</Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const VerifyEmail = () => {
    const { token } = useParams();
    const [status, setStatus] = useState('VERIFYING'); // 'VERIFYING', 'SUCCESS', 'ERROR'
    const [message, setMessage] = useState('Establishing secure connection for verification...');

    useEffect(() => {
        const verifyToken = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/auth/verify/${token}`);
                setStatus('SUCCESS');
                setMessage(response.data.message);
            } catch (err) {
                setStatus('ERROR');
                setMessage(err.response?.data?.message || 'Verification token invalid or expired.');
            }
        };

        verifyToken();
    }, [token]);

    return (
        <>
            <div className="auth-mesh" style={{
                backgroundImage: 'radial-gradient(at 50% 50%, rgba(0, 242, 234, 0.1) 0px, transparent 60%)'
            }}></div>
            <div className="auth-container">
                <div className="glass-panel auth-card animate-fade-in" style={{ textAlign: 'center', maxWidth: '500px' }}>

                    {status === 'VERIFYING' && (
                        <div className="animate-fade-in">
                            <div style={{ width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--accent-cyan)', borderRadius: '50%', margin: '0 auto 1.5rem', animation: 'spin 1s linear infinite' }}></div>
                            <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
                            <h2 className="heading-gradient" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>VERIFYING IDENTITY</h2>
                            <p style={{ color: 'var(--text-muted)' }}>{message}</p>
                        </div>
                    )}

                    {status === 'SUCCESS' && (
                        <div className="animate-fade-in">
                            <div style={{ width: '60px', height: '60px', margin: '0 auto 1.5rem', background: 'rgba(0, 255, 157, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--success)', boxShadow: '0 0 30px rgba(0,255,157,0.2)' }}>
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            </div>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--success)', marginBottom: '1rem' }}>IDENTITY CONFIRMED</h2>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>{message}</p>
                            <Link to="/login" className="btn-primary" style={{ display: 'inline-block', textDecoration: 'none' }}>Proceed to Authentication</Link>
                        </div>
                    )}

                    {status === 'ERROR' && (
                        <div className="animate-fade-in">
                            <div style={{ width: '60px', height: '60px', margin: '0 auto 1.5rem', background: 'rgba(255, 51, 102, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--error)', boxShadow: '0 0 30px rgba(255,51,102,0.2)' }}>
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </div>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--error)', marginBottom: '1rem' }}>VERIFICATION FAILED</h2>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>{message}</p>
                            <Link to="/login" className="btn-primary" style={{ display: 'inline-block', textDecoration: 'none', background: 'transparent', border: '1px solid var(--panel-border)', boxShadow: 'none' }}>Return to Login</Link>
                        </div>
                    )}

                </div>
            </div>
        </>
    );
};

export default VerifyEmail;

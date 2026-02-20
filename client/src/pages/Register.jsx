import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '', phone: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleRegister = async (e) => {
        e.preventDefault();
        setIsLoading(true); setError(''); setSuccess('');
        try {
            const res = await axios.post('http://localhost:5000/api/auth/register', formData);
            setSuccess(res.data.message || 'Identity Registered. Verification link dispatched to secure comms.');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Request denied.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="auth-mesh" style={{ backgroundImage: 'radial-gradient(at 100% 0%, rgba(255, 0, 85, 0.1) 0px, transparent 50%), radial-gradient(at 0% 100%, rgba(0, 242, 234, 0.1) 0px, transparent 50%)' }}></div>
            <div className="auth-container">
                <div className="glass-panel auth-card animate-fade-in" style={{ maxWidth: '480px' }}>
                    <div className="stagger-1 animate-fade-in" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                        <h1 className="heading-lg heading-gradient">ELITE ONBOARDING</h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', letterSpacing: '0.05em', marginTop: '0.5rem' }}>Provide credentials to establish your instance.</p>
                    </div>

                    {error && <div className="animate-fade-in" style={{ background: 'rgba(255, 51, 102, 0.1)', color: 'var(--error)', padding: '12px', borderRadius: '8px', marginBottom: '1.5rem', textAlign: 'center', border: '1px solid rgba(255, 51, 102, 0.2)' }}>{error}</div>}
                    {success && <div className="animate-fade-in" style={{ background: 'rgba(0, 255, 157, 0.1)', color: 'var(--success)', padding: '12px', borderRadius: '8px', marginBottom: '1.5rem', textAlign: 'center', border: '1px solid rgba(0, 255, 157, 0.2)' }}>{success}</div>}

                    <form onSubmit={handleRegister}>
                        <div className="input-group stagger-2 animate-fade-in">
                            <input type="text" name="username" className="input-field" placeholder="REQUESTED IDENTIFIER" value={formData.username} onChange={handleChange} required />
                        </div>
                        <div className="input-group stagger-2 animate-fade-in">
                            <input type="email" name="email" className="input-field" placeholder="SECURE COMM LINK (EMAIL)" value={formData.email} onChange={handleChange} required />
                        </div>
                        <div className="input-group stagger-3 animate-fade-in">
                            <input type="password" name="password" className="input-field" placeholder="MASTER PASSPHRASE" value={formData.password} onChange={handleChange} required />
                        </div>
                        <div className="input-group stagger-3 animate-fade-in">
                            <input type="text" name="phone" className="input-field" placeholder="MOBILE TERMINAL (OPTIONAL)" value={formData.phone} onChange={handleChange} />
                        </div>
                        <div className="stagger-4 animate-fade-in" style={{ marginTop: '2rem' }}>
                            <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={isLoading}>
                                {isLoading ? 'Processing...' : 'Submit Request'}
                            </button>
                        </div>
                    </form>

                    <div className="stagger-4 animate-fade-in" style={{ marginTop: '2rem', textAlign: 'center', borderTop: '1px solid var(--panel-border)', paddingTop: '1.5rem' }}>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                            Existing node? <Link to="/login" style={{ color: 'var(--text-main)', textDecoration: 'none', fontWeight: 600, borderBottom: '1px solid var(--accent-magenta)', paddingBottom: '2px', marginLeft: '8px' }}>Authenticate</Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Register;

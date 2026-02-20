import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CardsSection from '../components/CardsSection';
import TransferModal from '../components/TransferModal';
import TransactionHistory from '../components/TransactionHistory';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [balance, setBalance] = useState(null);
    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0); // Used to trigger child re-renders
    const navigate = useNavigate();

    const fetchBalance = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/user/balance', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBalance(res.data.balance);
        } catch (err) {
            console.error('Failed to fetch balance', err);
        }
    };

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser || !localStorage.getItem('token')) {
            navigate('/login');
        } else {
            setUser(JSON.parse(storedUser));
            fetchBalance();
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const handleTransferComplete = () => {
        fetchBalance();
        setRefreshTrigger(prev => prev + 1); // Trigger history & cards refresh
    };

    if (!user) return <div style={{ color: 'var(--accent-cyan)', textAlign: 'center', marginTop: '20vh', fontFamily: 'monospace' }}>INITIALIZING SECURE SESSION...</div>;

    return (
        <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
            {/* Header */}
            <header className="glass-panel animate-fade-in stagger-1" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div>
                    <h1 className="heading-gradient" style={{ fontSize: '1.8rem', letterSpacing: '0.1em' }}>KODBANK CONTROL</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Secure Connection: ACTIVE | Node: {user.username}</p>
                </div>
                <button onClick={handleLogout} style={{ background: 'transparent', border: '1px solid var(--accent-magenta)', color: 'var(--accent-magenta)', padding: '8px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 600, letterSpacing: '0.05em', transition: 'all 0.3s ease' }} onMouseOver={(e) => { e.target.style.background = 'rgba(255,0,85,0.1)'; e.target.style.boxShadow = '0 0 15px rgba(255,0,85,0.3)' }} onMouseOut={(e) => { e.target.style.background = 'transparent'; e.target.style.boxShadow = 'none' }}>
                    TERMINATE SESSION
                </button>
            </header>

            {/* Main Grid Layout */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>

                {/* Left Column: Balance & Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    {/* Balance Panel */}
                    <div className="glass-panel auth-card animate-fade-in stagger-2" style={{ position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(0,242,234,0.15) 0%, transparent 70%)', borderRadius: '50%' }}></div>
                        <h2 style={{ color: 'var(--text-muted)', fontSize: '0.9rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>Liquid Assets</h2>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                            <span style={{ color: 'var(--accent-cyan)', fontSize: '2rem', fontWeight: '300' }}>$</span>
                            <span className="heading-gradient" style={{ fontSize: '4rem', letterSpacing: '-0.02em' }}>{balance !== null ? Number(balance).toLocaleString('en-US', { minimumFractionDigits: 2 }) : '---.--'}</span>
                        </div>

                        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                            <button className="btn-primary" onClick={() => setIsTransferModalOpen(true)} style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                                TRANSFER FUNDS
                            </button>
                        </div>
                    </div>

                    {/* Transaction History Component */}
                    <div className="animate-fade-in stagger-3" style={{ flex: 1 }}>
                        <TransactionHistory refreshTrigger={refreshTrigger} />
                    </div>

                </div>

                {/* Right Column: Virtual Cards */}
                <div className="animate-fade-in stagger-4">
                    <CardsSection refreshTrigger={refreshTrigger} balance={balance} />
                </div>

            </div>

            {/* Transfer Modal */}
            <TransferModal
                isOpen={isTransferModalOpen}
                onClose={() => setIsTransferModalOpen(false)}
                onSuccess={handleTransferComplete}
            />
        </div>
    );
};

export default Dashboard;

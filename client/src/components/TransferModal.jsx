import React, { useState } from 'react';
import axios from 'axios';
import confetti from 'canvas-confetti';

const TransferModal = ({ isOpen, onClose, onSuccess }) => {
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleTransfer = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/user/transfer', {
                targetUsername: recipient,
                amount: parseFloat(amount)
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Fire confetti on success
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#00f2ea', '#ff0055', '#2a2a35']
            });

            setRecipient('');
            setAmount('');
            onSuccess();
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Transfer failed. Check balance and node identity.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(10, 10, 15, 0.9)', backdropFilter: 'blur(10px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
            <div className="glass-panel animate-fade-in" style={{ width: '400px', padding: '2.5rem', position: 'relative' }}>
                <button onClick={onClose} style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.5rem' }}>✕</button>

                <h2 className="heading-gradient" style={{ marginBottom: '0.5rem', fontSize: '1.5rem' }}>INITIATE TRANSFER</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>Execute node-to-node fund distribution.</p>

                {error && <div style={{ background: 'rgba(255, 51, 102, 0.1)', color: 'var(--error)', padding: '10px', borderRadius: '4px', marginBottom: '1rem', border: '1px solid rgba(255,51,102,0.2)' }}>{error}</div>}

                <form onSubmit={handleTransfer}>
                    <div className="input-group">
                        <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>TARGET NODE (USERNAME)</label>
                        <input
                            type="text"
                            className="input-field"
                            value={recipient}
                            onChange={(e) => setRecipient(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>TRANSFER AMOUNT ($)</label>
                        <input
                            type="number"
                            step="0.01"
                            min="0.01"
                            className="input-field"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
                        {loading ? 'EXECUTING...' : 'CONFIRM TRANSFER'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default TransferModal;

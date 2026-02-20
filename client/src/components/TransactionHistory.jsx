import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TransactionHistory = ({ refreshTrigger }) => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const token = localStorage.getItem('token');
                const user = JSON.parse(localStorage.getItem('user'));
                const res = await axios.get('http://localhost:5000/api/user/history', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                // Map the transactions to add an incoming/outgoing flag based on the user's ID
                // Wait, history returns raw. Let's assume the API calculates 'isIncoming' or we deduce it by username mismatch
                // If fromUid === null, it's a deposit

                // We'll format it on the fly
                setTransactions(res.data.transactions);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, [refreshTrigger]);

    if (loading) return <div style={{ color: 'var(--accent-cyan)' }}>Scanning Node Ledger...</div>;

    const loggedInUser = JSON.parse(localStorage.getItem('user'));

    return (
        <div className="glass-panel" style={{ height: '400px', overflowY: 'auto' }}>
            <h3 className="heading-gradient" style={{ marginBottom: '1.5rem', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12H3M21 12L15 6M21 12L15 18"></path></svg>
                LEDGER RECORD
            </h3>

            {transactions.length === 0 ? (
                <p style={{ color: 'var(--text-muted)' }}>No transactions found for this node.</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {transactions.map(tx => {
                        const isIncoming = tx.Receiver?.username === loggedInUser.username;
                        const partnerNode = isIncoming ? (tx.Sender?.username || 'SYSTEM') : (tx.Receiver?.username || 'UNKNOWN');
                        const amountColor = isIncoming ? 'var(--success)' : 'var(--text-main)';
                        const prefix = isIncoming ? '+' : '-';

                        return (
                            <div key={tx.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', borderLeft: `3px solid ${isIncoming ? 'var(--success)' : 'var(--accent-magenta)'}` }}>
                                <div>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 600 }}>{tx.type}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Node: {partnerNode}</div>
                                    <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', marginTop: '4px' }}>{new Date(tx.createdAt).toLocaleDateString()} {new Date(tx.createdAt).toLocaleTimeString()}</div>
                                </div>
                                <div style={{ fontWeight: 600, color: amountColor, fontSize: '1.1rem' }}>
                                    {prefix} ${Number(tx.amount).toFixed(2)}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default TransactionHistory;

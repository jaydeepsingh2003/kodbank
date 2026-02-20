import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Tilt from 'react-parallax-tilt';

const CardsSection = ({ refreshTrigger, balance }) => {
    const [cards, setCards] = useState([]);

    useEffect(() => {
        const fetchCards = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/user/cards', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCards(res.data.cards);
            } catch (err) {
                console.error(err);
            }
        };
        fetchCards();
    }, [refreshTrigger]);

    const user = JSON.parse(localStorage.getItem('user'));

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <h3 className="heading-gradient" style={{ fontSize: '1.2rem', margin: 0 }}>AUTHORIZED ENTITIES</h3>

            {cards.length === 0 ? (
                <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                    <p style={{ color: 'var(--text-muted)' }}>No synthetic nodes found.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {cards.map((card, index) => (
                        <Tilt key={card.id} glareEnable={true} glareMaxOpacity={0.4} glareColor="var(--accent-cyan)" glarePosition="all" scale={1.02} transitionSpeed={2000}>
                            <div style={{
                                background: index % 2 === 0 ? 'linear-gradient(135deg, rgba(30,30,40,0.9) 0%, rgba(10,10,15,0.9) 100%)' : 'linear-gradient(135deg, rgba(20,20,30,0.9) 0%, rgba(5,5,10,0.9) 100%)',
                                borderRadius: '16px',
                                padding: '1.5rem',
                                border: '1px solid rgba(255,255,255,0.05)',
                                borderTop: '1px solid rgba(255,255,255,0.1)',
                                position: 'relative',
                                overflow: 'hidden',
                                boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                                height: '200px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between'
                            }}>
                                {/* Holographic Sheen */}
                                <div style={{ position: 'absolute', top: 0, left: '-100%', width: '100%', height: '100%', background: 'linear-gradient(90deg, transparent, rgba(0, 242, 234, 0.1), transparent)', transform: 'skewX(-20deg)', animation: 'sheen 5s infinite' }}></div>
                                <style>{`@keyframes sheen { 0% { left: -100% } 20% { left: 200% } 100% { left: 200% } }`}</style>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', letterSpacing: '0.1em' }}>KODBANK VIRTUAL</div>
                                    <div style={{ color: 'var(--text-main)', fontWeight: 800, fontStyle: 'italic', letterSpacing: '0.05em' }}>{card.brand.toUpperCase()}</div>
                                </div>

                                <div>
                                    <div style={{ fontSize: '1.5rem', letterSpacing: '0.2em', fontFamily: 'monospace', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                                        **** **** **** {card.last4}
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                        <div>
                                            <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>CARDHOLDER</div>
                                            <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{card.cardHolder}</div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>EXPIRES</div>
                                            <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontFamily: 'monospace' }}>{card.expiryDate}</div>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', width: '40px', height: '25px', borderRadius: '4px', background: 'linear-gradient(135deg, #d4af37, #aa8010)', opacity: 0.8 }}></div>
                            </div>
                        </Tilt>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CardsSection;

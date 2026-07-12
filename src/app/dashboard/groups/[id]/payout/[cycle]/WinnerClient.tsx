"use client";

import { useState } from "react";
import { Check, Dice5, Award, ShieldCheck, Share2, Smartphone } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function WinnerClient({ groupId, cycle, totalPot, initialEligible }: {
    groupId: string;
    cycle: number;
    totalPot: number;
    initialEligible: any[];
}) {
    const [eligible, setEligible] = useState(initialEligible);
    const [drawing, setDrawing] = useState(false);
    const [winner, setWinner] = useState<any>(null);

    const supabase = createClient();
    const isDev = process.env.NEXT_PUBLIC_DEV_BYPASS === 'true';

    const handleDraw = async () => {
        if (eligible.length === 0) return;
        setDrawing(true);
        setWinner(null);

        // Simulate spinner delay
        await new Promise(res => setTimeout(res, 2200));

        const randomIndex = Math.floor(Math.random() * eligible.length);
        const selectedWinner = eligible[randomIndex];

        try {
            if (!isDev) {
                const { error } = await supabase
                    .from('payouts')
                    .upsert({
                        group_id: groupId,
                        user_id: selectedWinner.user_id,
                        cycle_month: cycle,
                        amount: totalPot,
                        status: 'completed',
                        completed_at: new Date().toISOString()
                    }, { onConflict: 'group_id, cycle_month' });
                if (error) throw error;
            }

            setWinner(selectedWinner);
        } catch (err) {
            console.error("Payout save error:", err);
            alert("Winner was selected but could not save payout to database.");
        } finally {
            setDrawing(false);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative' }}>
            
            {/* Summary Gradient Card */}
            <div style={{
                background: 'linear-gradient(135deg, #5B5CFF 0%, #312E81 100%)',
                borderRadius: '24px', padding: '24px', color: '#fff',
                boxShadow: '0 10px 25px rgba(91,92,255,0.2)',
                position: 'relative', overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute', top: '-50px', right: '-50px', width: '180px', height: '180px',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)',
                    borderRadius: '50%', pointerEvents: 'none'
                }} />
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div>
                        <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', fontWeight: '700', letterSpacing: '0.04em' }}>POT AMOUNT</div>
                        <div style={{ fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-0.02em', marginTop: '4px' }}>
                            ₹{totalPot.toLocaleString('en-IN')}
                        </div>
                    </div>
                    <div style={{
                        width: '44px', height: '44px', borderRadius: '12px',
                        backgroundColor: 'rgba(255,255,255,0.15)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <Award size={24} />
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'rgba(255,255,255,0.8)', fontWeight: '600', marginTop: '16px' }}>
                    <ShieldCheck size={16} />
                    <span>Ensuring fairness through transparent randomized selection.</span>
                </div>
            </div>

            {/* Action Selection */}
            <div style={{ textAlign: 'center', backgroundColor: 'var(--card-bg)', borderRadius: '24px', padding: '32px 24px', boxShadow: 'var(--shadow-sm)', border: '1px solid rgba(0,0,0,0.04)' }}>
                <div style={{
                    width: '64px', height: '64px', borderRadius: '50%',
                    backgroundColor: 'rgba(212,255,0,0.15)', color: '#000',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 16px'
                }}>
                    <Dice5 size={32} color="var(--primary-accent)" />
                </div>
                <h3 style={{ fontWeight: '800', fontSize: '1.2rem', marginBottom: '6px', color: 'var(--text-primary)' }}>Ready for the Draw?</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '500', marginBottom: '24px', lineHeight: 1.4 }}>
                    {eligible.length} members are eligible for this round's payout. The selection process is randomized.
                </p>
                
                <button onClick={handleDraw} disabled={drawing} style={{
                    width: '100%', padding: '16px 24px', borderRadius: '999px', border: 'none',
                    backgroundColor: drawing ? '#ccc' : '#1A1A1A', color: '#fff',
                    fontWeight: '800', fontSize: '1rem', cursor: drawing ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    fontFamily: 'var(--font-family)', transition: 'all 0.2s',
                    boxShadow: drawing ? 'none' : '0 4px 15px rgba(0,0,0,0.15)'
                }}>
                    {drawing ? 'Drawing Winner...' : 'Run Random Draw'}
                </button>
            </div>

            {/* Winner Announcement Overlay Modal */}
            {winner && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 999,
                    backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
                }}>
                    <div style={{
                        backgroundColor: '#111', borderRadius: '28px', padding: '32px 24px',
                        width: '100%', maxWidth: '360px', textAlign: 'center',
                        border: '2.5px solid #D4FF00', boxShadow: '0 0 30px rgba(212,255,0,0.25)',
                        position: 'relative', overflow: 'hidden'
                    }}>
                        {/* Confetti radial effect */}
                        <div style={{
                            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
                            width: '280px', height: '280px',
                            background: 'radial-gradient(circle, rgba(212,255,0,0.1) 0%, transparent 70%)',
                            borderRadius: '50%', pointerEvents: 'none'
                        }} />

                        <div style={{
                            width: '80px', height: '80px', borderRadius: '50%',
                            backgroundColor: 'rgba(212,255,0,0.15)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 20px', border: '1.5px solid #D4FF00'
                        }}>
                            <Award size={40} color="#D4FF00" strokeWidth={2} />
                        </div>

                        <div style={{ fontSize: '0.72rem', color: '#D4FF00', fontWeight: '800', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>
                            WINNER ANNOUNCEMENT
                        </div>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: '900', color: '#fff', letterSpacing: '-0.02em', marginBottom: '4px' }}>
                            {winner.users?.name || winner.name}
                        </h2>
                        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', fontWeight: '500', marginBottom: '24px' }}>
                            Payout milestone: ₹{totalPot.toLocaleString('en-IN')}
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <button onClick={() => alert('Announcement shared!')} style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                width: '100%', padding: '14px', borderRadius: '14px', border: 'none',
                                backgroundColor: '#D4FF00', color: '#000', fontWeight: '800', fontSize: '0.88rem',
                                cursor: 'pointer', fontFamily: 'var(--font-family)'
                            }}>
                                <Share2 size={16} strokeWidth={2.5} />
                                <span>Share Announcement</span>
                            </button>
                            <button onClick={() => setWinner(null)} style={{
                                width: '100%', padding: '14px', borderRadius: '14px', border: 'none',
                                backgroundColor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.8)',
                                fontWeight: '700', fontSize: '0.88rem', cursor: 'pointer',
                                fontFamily: 'var(--font-family)', transition: 'all 0.2s'
                            }}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Eligible Members List */}
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <h3 style={{
                        fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-secondary)',
                        letterSpacing: '0.08em', textTransform: 'uppercase', margin: 0
                    }}>
                        Eligible Members ({eligible.length})
                    </h3>
                    <span style={{ fontSize: '0.72rem', color: 'var(--primary-accent)', fontWeight: '800', backgroundColor: 'rgba(212,255,0,0.1)', padding: '4px 10px', borderRadius: '999px' }}>
                        All Paid Up
                    </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {eligible.map((member, idx) => (
                        <div key={member.id} style={{
                            backgroundColor: 'var(--card-bg)', borderRadius: '20px', padding: '14px 18px',
                            boxShadow: 'var(--shadow-sm)', border: '1px solid rgba(0,0,0,0.04)',
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{
                                    width: '42px', height: '42px', borderRadius: '50%',
                                    backgroundColor: 'var(--bg-color)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontWeight: '800', color: 'var(--text-secondary)', fontSize: '0.85rem'
                                }}>
                                    {member.avatar || (member.users?.name || 'U').charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <div style={{ fontWeight: '800', fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                                        {member.users?.name || member.name}
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '500', marginTop: '1px' }}>
                                        Waiting for payout · No prior wins
                                    </div>
                                </div>
                            </div>
                            <div style={{
                                width: '22px', height: '22px', borderRadius: '50%',
                                backgroundColor: 'rgba(52,199,89,0.15)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <Check size={12} color="#34C759" strokeWidth={3} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}

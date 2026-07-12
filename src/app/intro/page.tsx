"use client";

import Link from "next/link";
import { ArrowRight, Users, Wallet, ShieldCheck, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

const features = [
    {
        icon: Users,
        title: "Create Savings Circles",
        desc: "Invite members & manage rotating pools effortlessly.",
        color: "#D4FF00",
        bg: "rgba(212,255,0,0.12)"
    },
    {
        icon: Wallet,
        title: "UPI & Cash Tracking",
        desc: "Upload proof, track every rupee automatically.",
        color: "#34C759",
        bg: "rgba(52,199,89,0.12)"
    },
    {
        icon: TrendingUp,
        title: "Payout Scheduling",
        desc: "Fair, transparent winner selection each cycle.",
        color: "#FF9F0A",
        bg: "rgba(255,159,10,0.12)"
    },
    {
        icon: ShieldCheck,
        title: "Secure Ledger",
        desc: "Real-time transparency for every member.",
        color: "#30D158",
        bg: "rgba(48,209,88,0.12)"
    },
];

export default function Intro() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 100);
        return () => clearTimeout(t);
    }, []);

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#0A0A0A',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            position: 'relative',
            fontFamily: 'var(--font-family)',
        }}>
            {/* Background glow orbs */}
            <div style={{
                position: 'absolute', top: '-80px', right: '-80px',
                width: '300px', height: '300px',
                background: 'radial-gradient(circle, rgba(212,255,0,0.15) 0%, transparent 70%)',
                borderRadius: '50%', pointerEvents: 'none'
            }} />
            <div style={{
                position: 'absolute', bottom: '10%', left: '-60px',
                width: '220px', height: '220px',
                background: 'radial-gradient(circle, rgba(212,255,0,0.08) 0%, transparent 70%)',
                borderRadius: '50%', pointerEvents: 'none'
            }} />

            {/* Content */}
            <div style={{
                flex: 1, display: 'flex', flexDirection: 'column',
                padding: '48px 24px 32px',
                maxWidth: '480px', margin: '0 auto', width: '100%'
            }}>

                {/* Logo + Badge */}
                <div style={{
                    opacity: visible ? 1 : 0,
                    transform: visible ? 'translateY(0)' : 'translateY(24px)',
                    transition: 'all 0.6s ease',
                    marginBottom: '40px'
                }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                        backgroundColor: 'rgba(212,255,0,0.1)', borderRadius: '999px',
                        padding: '6px 14px', marginBottom: '24px',
                        border: '1px solid rgba(212,255,0,0.2)'
                    }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#D4FF00' }} />
                        <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#D4FF00', letterSpacing: '0.08em' }}>
                            DIGITIZE YOUR CHIT FUND
                        </span>
                    </div>

                    <h1 style={{
                        fontSize: '3.5rem', fontWeight: '900', color: '#FFFFFF',
                        lineHeight: 1, letterSpacing: '-0.03em', marginBottom: '16px'
                    }}>
                        ROSCA <span style={{ color: '#D4FF00' }}>Manager</span>
                    </h1>
                    <p style={{
                        fontSize: '1rem', color: 'rgba(255,255,255,0.55)',
                        lineHeight: 1.6, fontWeight: '500', maxWidth: '320px'
                    }}>
                        Replace WhatsApp chaos and Excel sheets with a modern savings circle platform.
                    </p>
                </div>

                {/* Feature Cards */}
                <div style={{
                    display: 'flex', flexDirection: 'column', gap: '12px', flex: 1,
                    opacity: visible ? 1 : 0,
                    transform: visible ? 'translateY(0)' : 'translateY(32px)',
                    transition: 'all 0.7s ease 0.15s',
                }}>
                    {features.map((f, i) => (
                        <div key={i} style={{
                            display: 'flex', alignItems: 'center', gap: '16px',
                            padding: '16px 20px',
                            backgroundColor: 'rgba(255,255,255,0.04)',
                            borderRadius: '16px',
                            border: '1px solid rgba(255,255,255,0.07)',
                            backdropFilter: 'blur(8px)',
                            transition: 'background 0.2s'
                        }}>
                            <div style={{
                                width: '44px', height: '44px', borderRadius: '12px',
                                backgroundColor: f.bg,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                flexShrink: 0
                            }}>
                                <f.icon size={20} color={f.color} strokeWidth={2.5} />
                            </div>
                            <div>
                                <div style={{ fontWeight: '700', color: '#fff', fontSize: '0.95rem', marginBottom: '2px' }}>
                                    {f.title}
                                </div>
                                <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.45)', fontWeight: '500' }}>
                                    {f.desc}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div style={{
                    marginTop: '40px',
                    opacity: visible ? 1 : 0,
                    transform: visible ? 'translateY(0)' : 'translateY(24px)',
                    transition: 'all 0.7s ease 0.3s',
                }}>
                    <Link href="/login" style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                        width: '100%', padding: '18px 28px',
                        backgroundColor: '#D4FF00', borderRadius: '999px',
                        fontWeight: '800', fontSize: '1.05rem', color: '#000',
                        textDecoration: 'none',
                        boxShadow: '0 0 32px rgba(212,255,0,0.3)',
                        transition: 'all 0.2s',
                    }}>
                        Get Started <ArrowRight size={20} strokeWidth={2.5} />
                    </Link>
                    <Link href="/login" style={{
                        display: 'block', textAlign: 'center', marginTop: '16px',
                        fontSize: '0.9rem', color: 'rgba(255,255,255,0.4)',
                        fontWeight: '600', textDecoration: 'none'
                    }}>
                        Already have an account? <span style={{ color: '#D4FF00' }}>Sign In</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}

"use client";

import Link from "next/link";
import { ArrowLeft, Bell, BellRing, Settings, Circle, Megaphone, Smartphone, Award } from "lucide-react";
import { useState } from "react";

type Notification = {
    id: number;
    type: 'payment' | 'payout' | 'request';
    title: string;
    message: string;
    time: string;
    read: boolean;
};

const INITIAL_NOTIFICATIONS: Notification[] = [
    { id: 1, type: 'payment', title: 'Upcoming Payment', message: 'Your ₹2,000 contribution for Office ROSCA is due in 3 days.', time: '2h ago', read: false },
    { id: 2, type: 'payout', title: 'Payout Announced', message: 'Rahul Kumar won the pot for Family Circle this month.', time: '1d ago', read: true },
    { id: 3, type: 'request', title: 'Join Request', message: 'Sneha requested to join Office ROSCA.', time: '2d ago', read: true }
];

export default function Notifications() {
    const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);

    const markAllRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const getIcon = (type: Notification['type'], read: boolean) => {
        const style = { width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 };
        if (type === 'payment') {
            return (
                <div style={{ ...style, backgroundColor: read ? 'var(--input-bg)' : 'rgba(255,59,48,0.08)' }}>
                    <BellRing size={20} color={read ? 'var(--text-secondary)' : '#FF3B30'} />
                </div>
            );
        }
        if (type === 'payout') {
            return (
                <div style={{ ...style, backgroundColor: read ? 'var(--input-bg)' : 'rgba(52,199,89,0.08)' }}>
                    <Award size={20} color={read ? 'var(--text-secondary)' : '#34C759'} />
                </div>
            );
        }
        return (
            <div style={{ ...style, backgroundColor: read ? 'var(--input-bg)' : 'rgba(91,92,255,0.08)' }}>
                <Megaphone size={20} color={read ? 'var(--text-secondary)' : '#5B5CFF'} />
            </div>
        );
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-color)', fontFamily: 'var(--font-family)' }}>
            
            {/* Header */}
            <div style={{
                background: 'linear-gradient(160deg, #1A1A1A 0%, #111 100%)',
                padding: '48px 20px 28px',
                position: 'relative', overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute', top: '-40px', right: '-40px', width: '160px', height: '160px',
                    background: 'radial-gradient(circle, rgba(212,255,0,0.1) 0%, transparent 70%)',
                    borderRadius: '50%', pointerEvents: 'none'
                }} />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Link href="/dashboard" style={{
                            width: '40px', height: '40px', borderRadius: '50%',
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff'
                        }}>
                            <ArrowLeft size={20} strokeWidth={2.5} />
                        </Link>
                        <div>
                            <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', fontWeight: '700', letterSpacing: '0.08em' }}>UPDATES</div>
                            <h1 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#fff', letterSpacing: '-0.02em', marginBottom: 0 }}>
                                Notifications
                            </h1>
                        </div>
                    </div>
                    <button style={{
                        width: '40px', height: '40px', borderRadius: '50%',
                        backgroundColor: 'rgba(255,255,255,0.1)', border: 'none',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer'
                    }}>
                        <Settings size={20} />
                    </button>
                </div>
            </div>

            {/* List */}
            <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-secondary)', letterSpacing: '0.04em' }}>
                        {unreadCount > 0 ? `${unreadCount} UNREAD` : 'ALL READ'}
                    </span>
                    {unreadCount > 0 && (
                        <button onClick={markAllRead} style={{
                            background: 'none', border: 'none', color: 'var(--primary-accent)',
                            fontSize: '0.8rem', fontWeight: '800', cursor: 'pointer', padding: 0
                        }}>
                            Mark all read
                        </button>
                    )}
                </div>

                {notifications.map(notif => (
                    <div key={notif.id} style={{
                        display: 'flex', gap: '14px', padding: '16px 18px', borderRadius: '20px',
                        backgroundColor: 'var(--card-bg)', border: '1px solid rgba(0,0,0,0.04)',
                        boxShadow: 'var(--shadow-sm)', position: 'relative'
                    }}>
                        {getIcon(notif.type, notif.read)}
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                                <span style={{
                                    fontWeight: '800', fontSize: '0.9rem',
                                    color: notif.read ? 'var(--text-primary)' : 'var(--primary-accent)'
                                }}>{notif.title}</span>
                                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '600' }}>{notif.time}</span>
                            </div>
                            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: 0, fontWeight: '500' }}>{notif.message}</p>
                        </div>
                        {!notif.read && (
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary-accent)', flexShrink: 0, alignSelf: 'center' }} />
                        )}
                    </div>
                ))}

                {notifications.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '60px 24px', backgroundColor: 'var(--card-bg)', borderRadius: '24px' }}>
                        <Bell size={40} color="var(--text-muted)" style={{ opacity: 0.5, margin: '0 auto 16px' }} />
                        <p style={{ fontWeight: '700', color: 'var(--text-secondary)' }}>You're all caught up!</p>
                    </div>
                )}
            </div>

        </div>
    );
}

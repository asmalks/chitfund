"use client";

import { useState } from "react";
import { ArrowLeft, Calendar as CalendarIcon, ChevronLeft, ChevronRight, IndianRupee, MessageCircle, Info } from "lucide-react";
import Link from "next/link";

type Event = {
    type: 'due' | 'payout';
    groupName: string;
    description: string;
    amount: number;
};

type DayEvents = Record<number, Event[]>;

const MOCK_EVENTS: DayEvents = {
    3: [{ type: 'due', groupName: 'Family Savings Circle', description: 'Monthly Contribution Due', amount: 5000 }],
    5: [
        { type: 'due', groupName: 'Office ROSCA 2026', description: 'Monthly Contribution Due', amount: 2000 },
        { type: 'payout', groupName: 'Family Savings Circle', description: 'Payout Recipient: You', amount: 60000 }
    ],
    10: [{ type: 'payout', groupName: 'Friends Holiday Fund', description: 'Payout Recipient: Member 4', amount: 24000 }],
    15: [
        { type: 'due', groupName: 'Friends Holiday Fund', description: 'Monthly Contribution Due', amount: 3000 },
        { type: 'payout', groupName: 'Office ROSCA 2026', description: 'Payout Recipient: You', amount: 20000 }
    ],
    20: [{ type: 'due', groupName: 'Family Savings Circle', description: 'Monthly Contribution Due', amount: 5000 }]
};

export default function CalendarSystem() {
    const [currentMonth, setCurrentMonth] = useState("September 2026");
    const [selectedDay, setSelectedDay] = useState<number | null>(5);
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // 30 days starting on Tuesday (offset 2)
    const offset = 2;
    const grid = Array.from({ length: 35 }, (_, i) => {
        const dayDate = i - offset + 1;
        return dayDate > 0 && dayDate <= 30 ? dayDate : null;
    });

    const activeEvents = selectedDay ? MOCK_EVENTS[selectedDay] || [] : [];

    const handleSendWhatsApp = (groupName: string, amount: number) => {
        const text = `Reminder: Contribution of ₹${amount.toLocaleString('en-IN')} for the group "${groupName}" is due. Please pay as soon as possible.`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-color)', fontFamily: 'var(--font-family)', display: 'flex', flexDirection: 'column' }}>
            
            {/* Header */}
            <div style={{
                background: 'linear-gradient(160deg, #1A1A1A 0%, #111 100%)',
                padding: '48px 20px 28px',
                position: 'relative', overflow: 'hidden', flexShrink: 0
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
                            <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', fontWeight: '700', letterSpacing: '0.08em' }}>MILESTONES</div>
                            <h1 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#fff', letterSpacing: '-0.02em', marginBottom: 0 }}>
                                Payment Calendar
                            </h1>
                        </div>
                    </div>
                    <button style={{
                        width: '40px', height: '40px', borderRadius: '50%',
                        backgroundColor: 'rgba(255,255,255,0.1)', border: 'none',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer'
                    }}>
                        <CalendarIcon size={20} />
                    </button>
                </div>
            </div>

            {/* Main scrollable body */}
            <div style={{ padding: '20px', paddingBottom: '360px', display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, overflowY: 'auto' }}>
                
                {/* Month Navigation card */}
                <div style={{
                    backgroundColor: 'var(--card-bg)', borderRadius: '24px', padding: '20px',
                    boxShadow: 'var(--shadow-sm)', border: '1px solid rgba(0,0,0,0.04)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <button style={{ border: 'none', background: 'transparent', color: 'var(--text-primary)', cursor: 'pointer' }}>
                            <ChevronLeft size={20} strokeWidth={2.5} />
                        </button>
                        <h2 style={{ fontSize: '1.1rem', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
                            {currentMonth}
                        </h2>
                        <button style={{ border: 'none', background: 'transparent', color: 'var(--text-primary)', cursor: 'pointer' }}>
                            <ChevronRight size={20} strokeWidth={2.5} />
                        </button>
                    </div>

                    {/* Days of Week Headers */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', textAlign: 'center', marginBottom: '12px' }}>
                        {days.map(d => (
                            <div key={d} style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase' }}>
                                {d.charAt(0)}
                            </div>
                        ))}
                    </div>

                    {/* Days Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}>
                        {grid.map((day, i) => {
                            if (!day) return <div key={`empty-${i}`} />;
                            
                            const evs = MOCK_EVENTS[day] || [];
                            const hasDue = evs.some(e => e.type === 'due');
                            const hasPayout = evs.some(e => e.type === 'payout');
                            const isSelected = selectedDay === day;

                            return (
                                <button
                                    key={`day-${day}`}
                                    onClick={() => setSelectedDay(day)}
                                    style={{
                                        height: '42px', width: '100%', borderRadius: '12px', border: 'none',
                                        backgroundColor: isSelected
                                            ? '#1A1A1A'
                                            : 'var(--bg-color)',
                                        color: isSelected
                                            ? '#fff'
                                            : 'var(--text-primary)',
                                        fontWeight: '800', fontSize: '0.88rem',
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                        position: 'relative', cursor: 'pointer', transition: 'all 0.2s',
                                        fontFamily: 'var(--font-family)'
                                    }}
                                >
                                    <span>{day}</span>
                                    {/* Indicator Dots */}
                                    <div style={{ display: 'flex', gap: '3px', position: 'absolute', bottom: '4px' }}>
                                        {hasDue && <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#FF3B30' }} />}
                                        {hasPayout && <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#34C759' }} />}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Legend indicator */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#FF3B30' }} />
                        <span>Dues</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#34C759' }} />
                        <span>Payouts</span>
                    </div>
                </div>

                {/* Month Summary card */}
                <div style={{
                    backgroundColor: 'var(--card-bg)', borderRadius: '24px', padding: '20px',
                    boxShadow: 'var(--shadow-sm)', border: '1px solid rgba(0,0,0,0.04)'
                }}>
                    <h3 style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-secondary)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '12px' }}>
                        Month Summary
                    </h3>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <div style={{ flex: 1, backgroundColor: 'var(--bg-color)', padding: '12px 16px', borderRadius: '14px' }}>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '600' }}>Total Due</div>
                            <div style={{ fontSize: '1.2rem', fontWeight: '900', color: '#FF3B30', marginTop: '2px' }}>₹15,000</div>
                        </div>
                        <div style={{ flex: 1, backgroundColor: 'var(--bg-color)', padding: '12px 16px', borderRadius: '14px' }}>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '600' }}>Total Payout</div>
                            <div style={{ fontSize: '1.2rem', fontWeight: '900', color: '#34C759', marginTop: '2px' }}>₹80,000</div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Bottom Sheet Modal displaying events for selected day */}
            {selectedDay && (
                <div style={{
                    position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
                    width: '100%', maxWidth: '480px', backgroundColor: 'var(--card-bg)',
                    borderTopLeftRadius: '32px', borderTopRightRadius: '32px',
                    boxShadow: '0 -8px 32px rgba(0,0,0,0.15)', padding: '24px', zIndex: 100,
                    borderTop: '1.5px solid var(--input-border)', display: 'flex', flexDirection: 'column', gap: '16px'
                }}>
                    {/* Drag handle bar */}
                    <div style={{ width: '40px', height: '5px', backgroundColor: 'var(--input-border)', borderRadius: '999px', margin: '0 auto 4px' }} />
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h3 style={{ fontSize: '1.4rem', fontWeight: '950', color: 'var(--text-primary)', margin: 0 }}>
                                Sep {selectedDay}, 2026
                            </h3>
                            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: '600', marginTop: '2px' }}>
                                {activeEvents.length} Active Event{activeEvents.length !== 1 ? 's' : ''}
                            </p>
                        </div>
                    </div>

                    {/* Events items list */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {activeEvents.map((ev, i) => (
                            <div key={i} style={{
                                backgroundColor: 'var(--bg-color)', borderRadius: '20px', padding: '16px',
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                border: '1px solid rgba(0,0,0,0.04)'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{
                                        width: '40px', height: '40px', borderRadius: '12px',
                                        backgroundColor: ev.type === 'due' ? 'rgba(255,59,48,0.08)' : 'rgba(52,199,89,0.08)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                                    }}>
                                        {ev.type === 'due' ? (
                                            <IndianRupee size={20} color="#FF3B30" strokeWidth={2.5} />
                                        ) : (
                                            <CalendarIcon size={20} color="#34C759" strokeWidth={2.5} />
                                        )}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: '800', fontSize: '0.9rem', color: 'var(--text-primary)' }}>{ev.groupName}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '600', marginTop: '1px' }}>{ev.description}</div>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{
                                        fontWeight: '900', fontSize: '1.05rem',
                                        color: ev.type === 'due' ? '#FF3B30' : '#34C759'
                                    }}>
                                        {ev.type === 'due' ? '-' : '+'}₹{ev.amount.toLocaleString('en-IN')}
                                    </div>
                                    <span style={{
                                        fontSize: '0.65rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.04em',
                                        color: ev.type === 'due' ? '#FF3B30' : '#34C759',
                                        backgroundColor: ev.type === 'due' ? 'rgba(255,59,48,0.1)' : 'rgba(52,199,89,0.1)',
                                        padding: '3px 8px', borderRadius: '999px', display: 'inline-block', marginTop: '4px'
                                    }}>
                                        {ev.type}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {activeEvents.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--text-secondary)' }}>
                                <Info size={24} style={{ margin: '0 auto 8px', opacity: 0.5 }} />
                                <p style={{ fontSize: '0.85rem', fontWeight: '600' }}>No scheduled payouts or dues today.</p>
                            </div>
                        )}
                    </div>

                    {/* WhatsApp Action button if has dues */}
                    {activeEvents.some(e => e.type === 'due') && (
                        <button
                            onClick={() => handleSendWhatsApp(activeEvents[0].groupName, activeEvents[0].amount)}
                            style={{
                                width: '100%', padding: '16px', borderRadius: '16px', border: 'none',
                                backgroundColor: '#25D366', color: '#fff', fontWeight: '800', fontSize: '0.95rem',
                                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                fontFamily: 'var(--font-family)', transition: 'all 0.2s',
                                boxShadow: '0 4px 12px rgba(37,211,102,0.15)'
                            }}
                        >
                            <MessageCircle size={20} fill="#fff" stroke="none" />
                            <span>Send WhatsApp Reminder</span>
                        </button>
                    )}
                </div>
            )}

        </div>
    );
}

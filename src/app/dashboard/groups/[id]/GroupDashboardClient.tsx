"use client";

import { useState } from "react";
import Link from "next/link";
import {
    ArrowLeft, Crown, Users, UserPlus, ChevronRight,
    Check, Clock, X, AlertCircle, TrendingUp, Share2, MessageSquare
} from "lucide-react";

type Member = { id: string; user_id: string; status: string; users?: { name?: string; phone?: string } };
type Payment = { id: string; user_id: string; cycle_month: number; status: string; amount: number; paid_at?: string };
type Group = {
    id: string; name: string; admin_id: string; monthly_amount: number;
    duration_months: number; start_date: string; max_members: number; status: string;
};

const TABS = ['Overview', 'Ledger', 'Members', 'Payouts'] as const;
type Tab = typeof TABS[number];

function StatusDot({ status }: { status: string }) {
    const map: Record<string, string> = {
        paid: '#34C759', overdue: '#FF3B30', due: '#FF9F0A',
        pending_verification: '#FFCC00', default: '#ddd'
    };
    const color = map[status] || map.default;
    if (status === 'paid') return <Check size={16} color={color} strokeWidth={3} />;
    if (status === 'pending_verification') return <Clock size={16} color={color} strokeWidth={2.5} />;
    if (status === 'due' || status === 'overdue') return (
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: color }} />
    );
    return <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#E5E7EB' }} />;
}

export default function GroupDashboardClient({ group, isAdmin, membership, initialMembers, initialPayments }: {
    group: Group; isAdmin: boolean; membership: any; initialMembers: Member[]; initialPayments: Payment[];
}) {
    const [tab, setTab] = useState<Tab>('Overview');

    const approvedMembers = initialMembers.filter(m => m.status === 'approved');
    const pendingMembers = initialMembers.filter(m => m.status === 'pending');
    const cycles = Array.from({ length: group.duration_months }, (_, i) => i + 1);
    const totalPot = group.monthly_amount * group.max_members;

    // Current cycle: find latest cycle with any payment
    const currentCycle = Math.max(0, ...initialPayments.map(p => p.cycle_month));
    const paidThisCycle = initialPayments.filter(p => p.cycle_month === currentCycle && p.status === 'paid').length;
    const collectionProgress = approvedMembers.length > 0 ? (paidThisCycle / approvedMembers.length) * 100 : 0;

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-color)', fontFamily: 'var(--font-family)' }}>
            <div className="container" style={{ padding: 0, minHeight: 'auto' }}>

            {/* Hero Header */}
            <div style={{
                background: 'linear-gradient(160deg, #1A1A1A 0%, #111 100%)',
                padding: '48px 20px 32px',
                position: 'relative', overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute', top: '-60px', right: '-60px', width: '220px', height: '220px',
                    background: 'radial-gradient(circle, rgba(212,255,0,0.12) 0%, transparent 70%)',
                    borderRadius: '50%', pointerEvents: 'none'
                }} />

                {/* Back + Actions */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', position: 'relative', zIndex: 1 }}>
                    <Link href="/dashboard/groups" style={{
                        width: '40px', height: '40px', borderRadius: '50%',
                        backgroundColor: 'rgba(255,255,255,0.1)', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', color: '#fff'
                    }}>
                        <ArrowLeft size={20} strokeWidth={2.5} />
                    </Link>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <Link href={`/dashboard/groups/${group.id}/chat`} style={{
                            width: '40px', height: '40px', borderRadius: '50%',
                            backgroundColor: 'rgba(255,255,255,0.1)', display: 'flex',
                            alignItems: 'center', justifyContent: 'center', color: '#fff'
                        }}>
                            <MessageSquare size={18} strokeWidth={2.5} />
                        </Link>
                        <Link href={`/dashboard/groups/${group.id}/invite`} style={{
                            width: '40px', height: '40px', borderRadius: '50%',
                            backgroundColor: 'rgba(255,255,255,0.1)', display: 'flex',
                            alignItems: 'center', justifyContent: 'center', color: '#fff'
                        }}>
                            <Share2 size={18} strokeWidth={2.5} />
                        </Link>
                    </div>
                </div>

                {/* Group Name + Pot */}
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        {isAdmin && <Crown size={16} color="var(--warning)" />}
                        <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                            {isAdmin ? 'Admin' : 'Member'}
                        </span>
                    </div>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: '900', color: '#fff', letterSpacing: '-0.02em', marginBottom: '6px' }}>
                        {group.name}
                    </h1>
                    <div style={{ fontSize: '2.8rem', fontWeight: '900', color: 'var(--text-light)', letterSpacing: '-0.03em', lineHeight: 1, marginBottom: '16px' }}>
                        ₹{totalPot.toLocaleString('en-IN')}
                        <span style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.4)', fontWeight: '600', marginLeft: '6px' }}>Pot</span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{
                            padding: '5px 14px', borderRadius: '999px',
                            backgroundColor: group.status === 'active' ? 'rgba(52,199,89,0.2)' : 'rgba(255,204,0,0.2)',
                            color: group.status === 'active' ? '#34C759' : '#FFCC00',
                            fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.06em'
                        }}>{group.status}</span>
                        <span style={{
                            padding: '5px 14px', borderRadius: '999px',
                            backgroundColor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)',
                            fontSize: '0.75rem', fontWeight: '700'
                        }}>
                            {currentCycle > 0 ? `Cycle ${currentCycle}` : 'Not Started'} of {group.duration_months}
                        </span>
                    </div>
                </div>
            </div>

            {/* Stat Pills */}
            <div style={{ display: 'flex', gap: '12px', padding: '16px 20px', overflow: 'auto' }}>
                {[
                    { label: 'Monthly', value: `₹${group.monthly_amount.toLocaleString('en-IN')}`, color: 'var(--text-primary)' },
                    { label: 'Members', value: `${approvedMembers.length}/${group.max_members}`, color: 'var(--text-primary)' },
                    { label: 'Duration', value: `${group.duration_months}m`, color: 'var(--text-primary)' },
                ].map(s => (
                    <div key={s.label} style={{
                        backgroundColor: 'var(--card-bg)', borderRadius: '16px', padding: '14px 18px',
                        boxShadow: 'var(--shadow-sm)', border: '1px solid rgba(0,0,0,0.04)', flexShrink: 0
                    }}>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '4px' }}>{s.label}</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: '800', color: s.color }}>{s.value}</div>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div style={{ padding: '0 20px', marginBottom: '4px' }}>
                <div style={{
                    backgroundColor: 'var(--card-bg)', borderRadius: '16px', padding: '4px',
                    display: 'flex', gap: '2px', boxShadow: 'var(--shadow-sm)'
                }}>
                    {TABS.map(t => (
                        <button key={t} onClick={() => setTab(t)} style={{
                            flex: 1, padding: '10px 4px', borderRadius: '12px', border: 'none',
                            backgroundColor: tab === t ? 'var(--primary-accent)' : 'transparent',
                            color: tab === t ? '#fff' : 'var(--text-secondary)',
                            fontWeight: '700', fontSize: '0.78rem', cursor: 'pointer',
                            transition: 'all 0.2s', fontFamily: 'var(--font-family)'
                        }}>{t}</button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            <div style={{ padding: '16px 20px 120px' }}>

                {/* ── OVERVIEW TAB ── */}
                {tab === 'Overview' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                        {/* Collection Progress */}
                        {currentCycle > 0 ? (
                            <div style={{ backgroundColor: 'var(--card-bg)', borderRadius: '24px', padding: '22px', boxShadow: 'var(--shadow-sm)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                    <h3 style={{ fontWeight: '800', fontSize: '1rem' }}>Cycle {currentCycle} Collection</h3>
                                    <span style={{
                                        padding: '4px 12px', borderRadius: '999px',
                                        backgroundColor: 'rgba(52,199,89,0.1)', color: '#1A7F37',
                                        fontSize: '0.72rem', fontWeight: '800'
                                    }}>Active</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '10px' }}>
                                    <span style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--text-primary)' }}>
                                        {paidThisCycle}<span style={{ fontSize: '1.1rem', color: 'var(--text-muted)', fontWeight: '600' }}>/{approvedMembers.length}</span>
                                    </span>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '700' }}>Paid</span>
                                </div>
                                <div style={{ height: '8px', backgroundColor: 'var(--input-bg)', borderRadius: '999px', overflow: 'hidden', marginBottom: '8px' }}>
                                    <div style={{
                                        height: '100%', width: `${collectionProgress}%`,
                                        backgroundColor: 'var(--primary-accent)', borderRadius: '999px',
                                        transition: 'width 0.5s ease'
                                    }} />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                                    <span>Collected: ₹{(paidThisCycle * group.monthly_amount).toLocaleString('en-IN')}</span>
                                    <span>Target: ₹{(approvedMembers.length * group.monthly_amount).toLocaleString('en-IN')}</span>
                                </div>
                            </div>
                        ) : (
                            <div style={{
                                backgroundColor: 'var(--card-bg)', borderRadius: '24px', padding: '40px 24px',
                                textAlign: 'center', border: '2px dashed var(--input-border)'
                            }}>
                                <TrendingUp size={40} color="var(--text-muted)" strokeWidth={1.5} style={{ margin: '0 auto 16px' }} />
                                <h3 style={{ fontWeight: '800', fontSize: '1.1rem', marginBottom: '8px' }}>Cycle Not Started</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '500' }}>
                                    Waiting for all members to join.
                                </p>
                            </div>
                        )}

                        {/* Quick Actions */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            {isAdmin ? (
                                <>
                                    <Link href={`/dashboard/groups/${group.id}/members`} style={{ textDecoration: 'none' }}>
                                        <div style={{ backgroundColor: 'var(--card-bg)', borderRadius: '20px', padding: '18px', boxShadow: 'var(--shadow-sm)', textAlign: 'center', border: '1px solid rgba(0,0,0,0.01)' }}>
                                            <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: 'rgba(26,104,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                                                <Users size={20} color="var(--primary-accent)" />
                                            </div>
                                            <div style={{ fontWeight: '700', fontSize: '0.85rem', color: 'var(--text-primary)' }}>Members</div>
                                            {pendingMembers.length > 0 && (
                                                <div style={{ marginTop: '4px', fontSize: '0.72rem', color: 'var(--warning)', fontWeight: '700' }}>
                                                    {pendingMembers.length} pending
                                                </div>
                                            )}
                                        </div>
                                    </Link>
                                    <Link href={`/dashboard/groups/${group.id}/payout/1`} style={{ textDecoration: 'none' }}>
                                        <div style={{ backgroundColor: 'var(--card-bg-dark)', borderRadius: '20px', padding: '18px', boxShadow: 'var(--shadow-sm)', textAlign: 'center' }}>
                                            <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: 'rgba(26,104,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                                                <TrendingUp size={20} color="var(--primary-accent)" />
                                            </div>
                                            <div style={{ fontWeight: '700', fontSize: '0.85rem', color: '#fff' }}>Payouts</div>
                                        </div>
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link href={`/dashboard/groups/${group.id}/pay/1`} style={{ textDecoration: 'none' }}>
                                        <div style={{ backgroundColor: 'var(--card-bg-dark)', borderRadius: '20px', padding: '18px', boxShadow: 'var(--shadow-sm)', textAlign: 'center' }}>
                                            <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: 'rgba(26,104,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                                                <Check size={20} color="var(--primary-accent)" />
                                            </div>
                                            <div style={{ fontWeight: '700', fontSize: '0.85rem', color: '#fff' }}>Pay Dues</div>
                                        </div>
                                    </Link>
                                    <Link href={`/dashboard/groups/${group.id}/invite`} style={{ textDecoration: 'none' }}>
                                        <div style={{ backgroundColor: 'var(--card-bg)', borderRadius: '20px', padding: '18px', boxShadow: 'var(--shadow-sm)', textAlign: 'center', border: '1px solid rgba(0,0,0,0.01)' }}>
                                            <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: 'rgba(26,104,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                                                <UserPlus size={20} color="var(--primary-accent)" />
                                            </div>
                                            <div style={{ fontWeight: '700', fontSize: '0.85rem', color: 'var(--text-primary)' }}>Invite</div>
                                        </div>
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Pending approvals alert */}
                        {isAdmin && pendingMembers.length > 0 && (
                            <Link href={`/dashboard/groups/${group.id}/members`} style={{ textDecoration: 'none' }}>
                                <div style={{
                                    backgroundColor: 'rgba(255,159,10,0.08)', borderRadius: '20px', padding: '16px 20px',
                                    border: '1px solid rgba(255,159,10,0.2)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: 'rgba(255,159,10,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <AlertCircle size={20} color="#FF9F0A" />
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: '800', fontSize: '0.9rem' }}>{pendingMembers.length} Join Request{pendingMembers.length > 1 ? 's' : ''}</div>
                                            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: '500' }}>Tap to approve or reject</div>
                                        </div>
                                    </div>
                                    <ChevronRight size={20} color="var(--text-muted)" />
                                </div>
                            </Link>
                        )}
                    </div>
                )}

                {/* ── LEDGER TAB ── */}
                {tab === 'Ledger' && (
                    <div>
                        {approvedMembers.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '48px 24px', backgroundColor: 'var(--card-bg)', borderRadius: '24px' }}>
                                <p style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>No members yet.</p>
                            </div>
                        ) : (
                            <div style={{ backgroundColor: 'var(--card-bg)', borderRadius: '24px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: `${180 + cycles.length * 52}px` }}>
                                        <thead>
                                            <tr style={{ backgroundColor: '#F8F9FA' }}>
                                                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-secondary)', letterSpacing: '0.05em', borderBottom: '1px solid var(--input-border)', position: 'sticky', left: 0, backgroundColor: '#F8F9FA', zIndex: 1 }}>
                                                    MEMBER
                                                </th>
                                                {cycles.map(c => (
                                                    <th key={c} style={{
                                                        padding: '14px 8px', textAlign: 'center', fontSize: '0.72rem',
                                                        fontWeight: '800', color: c === currentCycle ? 'var(--text-primary)' : 'var(--text-muted)',
                                                        letterSpacing: '0.05em', borderBottom: '1px solid var(--input-border)',
                                                        backgroundColor: c === currentCycle ? 'rgba(212,255,0,0.08)' : '#F8F9FA'
                                                    }}>
                                                        M{c}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {approvedMembers.map((member, idx) => (
                                                <tr key={member.id} style={{ backgroundColor: idx % 2 === 0 ? '#fff' : 'rgba(0,0,0,0.01)' }}>
                                                    <td style={{
                                                        padding: '14px 16px', borderBottom: '1px solid var(--input-border)',
                                                        fontWeight: '700', color: 'var(--text-primary)', fontSize: '0.88rem',
                                                        position: 'sticky', left: 0,
                                                        backgroundColor: idx % 2 === 0 ? '#fff' : '#FAFAFA', zIndex: 1, whiteSpace: 'nowrap'
                                                    }}>
                                                        {member.users?.name || member.users?.phone?.slice(-4) || 'Unknown'}
                                                        {member.user_id === group.admin_id && ' 👑'}
                                                    </td>
                                                    {cycles.map(c => {
                                                        const p = initialPayments.find(pay => pay.user_id === member.user_id && pay.cycle_month === c);
                                                        return (
                                                            <td key={c} style={{
                                                                padding: '14px 8px', textAlign: 'center',
                                                                borderBottom: '1px solid var(--input-border)',
                                                                backgroundColor: c === currentCycle ? 'rgba(212,255,0,0.04)' : 'transparent'
                                                            }}>
                                                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                                    <StatusDot status={p?.status || 'none'} />
                                                                </div>
                                                            </td>
                                                        );
                                                    })}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div style={{ padding: '12px 16px', borderTop: '1px solid var(--input-border)', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                                    {[
                                        { icon: <Check size={12} color="#34C759" strokeWidth={3} />, label: 'Paid' },
                                        { icon: <Clock size={12} color="#FFCC00" strokeWidth={2.5} />, label: 'Pending' },
                                        { icon: <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#FF9F0A' }} />, label: 'Due' },
                                        { icon: <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#E5E7EB' }} />, label: 'Upcoming' },
                                    ].map(l => (
                                        <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            {l.icon}
                                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '600' }}>{l.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* ── MEMBERS TAB ── */}
                {tab === 'Members' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {pendingMembers.length > 0 && (
                            <div style={{ marginBottom: '8px' }}>
                                <h3 style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-secondary)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '10px' }}>
                                    Pending ({pendingMembers.length})
                                </h3>
                                {pendingMembers.map(m => (
                                    <div key={m.id} style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                        backgroundColor: 'var(--card-bg)', borderRadius: '18px', padding: '14px 18px',
                                        marginBottom: '8px', boxShadow: 'var(--shadow-sm)',
                                        border: '1px solid rgba(255,159,10,0.15)'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(255,159,10,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', color: '#FF9F0A' }}>
                                                {(m.users?.name || 'U').charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>{m.users?.name || m.users?.phone}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Wants to join</div>
                                            </div>
                                        </div>
                                        {isAdmin && (
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button style={{ width: '36px', height: '36px', borderRadius: '50%', border: 'none', backgroundColor: 'rgba(52,199,89,0.12)', color: '#1A7F37', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <Check size={18} strokeWidth={2.5} />
                                                </button>
                                                <button style={{ width: '36px', height: '36px', borderRadius: '50%', border: 'none', backgroundColor: 'rgba(255,59,48,0.12)', color: '#D62319', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <X size={18} strokeWidth={2.5} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                        <h3 style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-secondary)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '10px' }}>
                            Approved ({approvedMembers.length})
                        </h3>
                        {approvedMembers.map((m, idx) => (
                            <div key={m.id} style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                backgroundColor: 'var(--card-bg)', borderRadius: '18px', padding: '14px 18px',
                                boxShadow: 'var(--shadow-sm)', border: '1px solid rgba(0,0,0,0.04)'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{
                                        width: '40px', height: '40px', borderRadius: '50%',
                                        background: `hsl(${(idx * 47) % 360}, 65%, 60%)`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontWeight: '800', color: '#fff', fontSize: '0.9rem'
                                    }}>
                                        {(m.users?.name || 'U').charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>
                                            {m.users?.name || m.users?.phone}
                                            {m.user_id === group.admin_id && ' 👑'}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{m.users?.phone}</div>
                                    </div>
                                </div>
                                <span style={{ padding: '4px 12px', borderRadius: '999px', backgroundColor: 'rgba(52,199,89,0.1)', color: '#1A7F37', fontSize: '0.72rem', fontWeight: '800' }}>
                                    Active
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                {/* ── PAYOUTS TAB ── */}
                {tab === 'Payouts' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {cycles.map(c => {
                            return (
                                <Link key={c} href={isAdmin ? `/dashboard/groups/${group.id}/payout/${c}` : '#'} style={{ textDecoration: 'none' }}>
                                    <div style={{
                                        backgroundColor: 'var(--card-bg)', borderRadius: '18px', padding: '16px 20px',
                                        boxShadow: 'var(--shadow-sm)', border: '1px solid rgba(0,0,0,0.04)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                            <div style={{
                                                width: '44px', height: '44px', borderRadius: '14px',
                                                backgroundColor: c < currentCycle ? 'rgba(52,199,89,0.1)' : c === currentCycle ? 'rgba(212,255,0,0.1)' : 'var(--bg-color)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontWeight: '800', fontSize: '0.9rem',
                                                color: c < currentCycle ? '#1A7F37' : c === currentCycle ? '#8A9A00' : 'var(--text-muted)'
                                            }}>
                                                M{c}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-primary)' }}>Month {c} Payout</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                    ₹{totalPot.toLocaleString('en-IN')} pool
                                                </div>
                                            </div>
                                        </div>
                                        <span style={{
                                            padding: '4px 12px', borderRadius: '999px', fontSize: '0.72rem', fontWeight: '800',
                                            backgroundColor: c < currentCycle ? 'rgba(52,199,89,0.08)' : c === currentCycle ? 'rgba(26,104,255,0.08)' : 'rgba(0,0,0,0.04)',
                                            color: c < currentCycle ? 'var(--success)' : c === currentCycle ? 'var(--primary-accent)' : 'var(--text-muted)'
                                        }}>
                                            {c < currentCycle ? 'Done' : c === currentCycle ? 'Current' : 'Upcoming'}
                                        </span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    </div>
    );
}

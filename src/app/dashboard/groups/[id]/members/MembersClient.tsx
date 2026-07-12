"use client";

import { useState } from "react";
import { ShieldCheck, Clock, UserCheck, UserMinus, Search, Filter, MessageCircle, AlertCircle, Trash2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function MembersClient({ groupId, initialPending, initialApproved }: {
    groupId: string;
    initialPending: any[];
    initialApproved: any[];
}) {
    const [pending, setPending] = useState(initialPending);
    const [approved, setApproved] = useState(initialApproved);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState<string | null>(null);

    const supabase = createClient();
    const isDev = process.env.NEXT_PUBLIC_DEV_BYPASS === 'true';

    const handleApprove = async (id: string) => {
        setLoading(id);
        try {
            if (!isDev) {
                const { error } = await supabase
                    .from('group_members')
                    .update({ status: 'approved' })
                    .eq('id', id);
                if (error) throw error;
            }

            const item = pending.find(p => p.id === id);
            if (item) {
                setPending(pending.filter(p => p.id !== id));
                setApproved([...approved, { ...item, status: 'approved', paid: false }]);
            }
        } catch (err) {
            console.error("Approve error:", err);
            alert("Failed to approve member.");
        } finally {
            setLoading(null);
        }
    };

    const handleDecline = async (id: string) => {
        setLoading(id);
        try {
            if (!isDev) {
                const { error } = await supabase
                    .from('group_members')
                    .delete()
                    .eq('id', id);
                if (error) throw error;
            }
            setPending(pending.filter(p => p.id !== id));
        } catch (err) {
            console.error("Decline error:", err);
            alert("Failed to decline request.");
        } finally {
            setLoading(null);
        }
    };

    const handleRemove = async (id: string) => {
        if (!confirm("Are you sure you want to remove this member?")) return;
        setLoading(id);
        try {
            if (!isDev) {
                const { error } = await supabase
                    .from('group_members')
                    .delete()
                    .eq('id', id);
                if (error) throw error;
            }
            setApproved(approved.filter(a => a.id !== id));
        } catch (err) {
            console.error("Remove error:", err);
            alert("Failed to remove member.");
        } finally {
            setLoading(null);
        }
    };

    const filteredApproved = approved.filter(a =>
        a.users?.name?.toLowerCase().includes(search.toLowerCase()) ||
        a.users?.phone?.includes(search)
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Join Requests Section */}
            {pending.length > 0 && (
                <div>
                    <h3 style={{
                        fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-secondary)',
                        letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '12px'
                    }}>
                        Join Requests ({pending.length})
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {pending.map(req => (
                            <div key={req.id} style={{
                                backgroundColor: 'var(--card-bg)', borderRadius: '20px', padding: '18px',
                                border: '1px solid rgba(0,0,0,0.04)', boxShadow: 'var(--shadow-sm)'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                    <div>
                                        <div style={{ fontWeight: '800', fontSize: '1rem', color: 'var(--text-primary)' }}>{req.users?.name}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600', marginTop: '2px' }}>
                                            {req.time || 'Just now'} · {req.users?.phone}
                                        </div>
                                    </div>
                                    <span style={{
                                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                                        padding: '4px 10px', borderRadius: '999px',
                                        backgroundColor: req.kyc_status === 'verified' ? 'rgba(52,199,89,0.1)' : 'rgba(255,159,10,0.1)',
                                        color: req.kyc_status === 'verified' ? '#1A7F37' : '#FF9F0A',
                                        fontSize: '0.68rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.04em'
                                    }}>
                                        {req.kyc_status === 'verified' ? <ShieldCheck size={12} /> : <Clock size={12} />}
                                        {req.kyc_status === 'verified' ? 'KYC Verified' : 'KYC Pending'}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button onClick={() => handleApprove(req.id)} style={{
                                        flex: 1, padding: '12px', borderRadius: '12px', border: 'none',
                                        backgroundColor: '#1A1A1A', color: '#fff', fontWeight: '800',
                                        fontSize: '0.85rem', cursor: 'pointer', fontFamily: 'var(--font-family)',
                                        transition: 'all 0.2s'
                                    }}>
                                        Approve
                                    </button>
                                    <button onClick={() => handleDecline(req.id)} style={{
                                        flex: 1, padding: '12px', borderRadius: '12px', border: '1.5px solid var(--input-border)',
                                        backgroundColor: 'transparent', color: 'var(--text-secondary)', fontWeight: '800',
                                        fontSize: '0.85rem', cursor: 'pointer', fontFamily: 'var(--font-family)',
                                        transition: 'all 0.2s'
                                    }}>
                                        Decline
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Approved Members List */}
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <h3 style={{
                        fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-secondary)',
                        letterSpacing: '0.08em', textTransform: 'uppercase', margin: 0
                    }}>
                        Approved Members ({approved.length})
                    </h3>
                </div>

                {/* Search Bar */}
                <div style={{
                    backgroundColor: 'var(--input-bg)', borderRadius: '16px',
                    border: '1.5px solid var(--input-border)', padding: '12px 16px',
                    display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px'
                }}>
                    <Search size={18} color="var(--text-muted)" />
                    <input
                        type="text" placeholder="Search members..."
                        value={search} onChange={e => setSearch(e.target.value)}
                        style={{
                            border: 'none', outline: 'none', background: 'transparent',
                            width: '100%', color: 'var(--text-primary)', fontSize: '0.92rem',
                            fontWeight: '600', fontFamily: 'var(--font-family)'
                        }}
                    />
                </div>

                {/* Members Grid */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {filteredApproved.map((member, idx) => (
                        <div key={member.id} style={{
                            backgroundColor: 'var(--card-bg)', borderRadius: '20px', padding: '14px 16px',
                            boxShadow: 'var(--shadow-sm)', border: '1px solid rgba(0,0,0,0.04)',
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{
                                    width: '42px', height: '42px', borderRadius: '50%',
                                    backgroundColor: `hsl(${(idx * 57) % 360}, 65%, 62%)`,
                                    color: '#fff', fontWeight: '800', fontSize: '0.95rem',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    {(member.users?.name || 'U').charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <span style={{ fontWeight: '800', fontSize: '0.92rem' }}>{member.users?.name}</span>
                                        {member.kyc_status === 'verified' && <ShieldCheck size={14} color="var(--primary-accent)" />}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                                        <span style={{
                                            width: '6px', height: '6px', borderRadius: '50%',
                                            backgroundColor: member.paid ? '#34C759' : '#FF3B30'
                                        }} />
                                        <span style={{ fontSize: '0.75rem', color: member.paid ? '#34C759' : '#FF3B30', fontWeight: '700' }}>
                                            {member.paid ? 'Contribution Paid' : 'Payment Overdue'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                {!member.paid && (
                                    <button onClick={() => alert('Reminder sent!')} style={{
                                        width: '36px', height: '36px', borderRadius: '50%', border: 'none',
                                        backgroundColor: 'rgba(37,211,102,0.1)', color: '#25D366',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                                    }} title="Send WhatsApp Reminder">
                                        <MessageCircle size={18} fill="#25D366" stroke="none" />
                                    </button>
                                )}
                                {member.user_id !== 'dev-user-mock' && (
                                    <button onClick={() => handleRemove(member.id)} style={{
                                        width: '36px', height: '36px', borderRadius: '50%', border: 'none',
                                        backgroundColor: 'rgba(255,59,48,0.08)', color: '#FF3B30',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                                    }} title="Remove Member">
                                        <Trash2 size={18} />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                    {filteredApproved.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                            No members found.
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
}

import Link from "next/link";
import { ArrowRight, Users, Wallet, TrendingUp, Bell, Crown, ChevronRight, AlertCircle } from "lucide-react";
import { redirect } from "next/navigation";

// Mock data for dev bypass mode
const MOCK_GROUPS = [
    { id: 'mock-1', name: 'Family Savings Circle', status: 'active', monthly_amount: 5000, max_members: 12, duration_months: 12, is_admin: true },
    { id: 'mock-2', name: 'Office ROSCA 2026', status: 'active', monthly_amount: 2000, max_members: 10, duration_months: 10, is_admin: false },
    { id: 'mock-3', name: 'Friends Holiday Fund', status: 'upcoming', monthly_amount: 3000, max_members: 8, duration_months: 8, is_admin: false },
];
const MOCK_DUE = [
    { id: 'p1', group_id: 'mock-2', cycle_month: 3, amount: 2000, status: 'due', due_date: new Date().toISOString(), groups: { name: 'Office ROSCA 2026' } },
];

async function getData() {
    const isDev = process.env.NEXT_PUBLIC_DEV_BYPASS === 'true';
    if (isDev) {
        return {
            profile: { name: 'Demo User' },
            allGroups: MOCK_GROUPS,
            duePayments: MOCK_DUE,
            unreadCount: 2,
        };
    }

    // Real Supabase fetch
    const { createClient } = await import("@/utils/supabase/server");
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    const { data: profile } = await supabase.from('users').select('name').eq('id', user.id).single();
    const { data: adminGroups } = await supabase.from('groups').select('*').eq('admin_id', user.id);
    const { data: memberData } = await supabase.from('group_members').select('group_id, status, groups(*)').eq('user_id', user.id).eq('status', 'approved');
    const allGroups = [
        ...(adminGroups || []).map(g => ({ ...g, is_admin: true })),
        ...(memberData || []).map(m => ({ ...(m.groups as any), is_admin: false })).filter(g => g?.admin_id !== user.id)
    ];
    const { data: duePayments } = await supabase.from('payments').select('*, groups(name, monthly_amount)').eq('user_id', user.id).in('status', ['due', 'overdue']).order('due_date', { ascending: true });
    const { count: unreadCount } = await supabase.from('notifications').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('read_status', false);

    return { profile, allGroups, duePayments: duePayments || [], unreadCount: unreadCount || 0 };
}

export default async function Home() {
    const { profile, allGroups, duePayments, unreadCount } = await getData();

    const activeGroups = allGroups.filter((g: any) => g.status === 'active');
    const totalPot = allGroups.reduce((sum: number, g: any) => sum + ((g.monthly_amount || 0) * (g.max_members || 0)), 0);
    const firstName = profile?.name?.split(' ')[0] || 'there';

    return (
        <main className="container" style={{ paddingBottom: '120px', paddingTop: '10px' }}>

            {/* Portfolio Hero Card */}
            <div className="card card-dark" style={{
                position: 'relative', overflow: 'hidden',
                padding: '28px 24px', marginBottom: '20px',
            }}>
                <div style={{
                    position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px',
                    background: 'radial-gradient(circle, rgba(26,104,255,0.2) 0%, rgba(0,0,0,0) 70%)',
                    borderRadius: '50%', pointerEvents: 'none'
                }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', fontWeight: '700', letterSpacing: '0.08em' }}>
                            TOTAL SAVINGS POT
                        </span>
                        <span className="badge" style={{
                            backgroundColor: 'rgba(52, 199, 89, 0.2)', color: '#34C759', fontSize: '0.68rem', fontWeight: '800', padding: '4px 10px'
                        }}>ACTIVE</span>
                    </div>
                    <div style={{ fontSize: '2.8rem', fontWeight: '900', color: 'var(--text-light)', letterSpacing: '-0.03em', lineHeight: 1, marginBottom: '20px' }}>
                        ₹{totalPot.toLocaleString('en-IN')}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <Link href="/dashboard/groups" style={{
                            padding: '14px', borderRadius: '14px', display: 'block', textAlign: 'center',
                            backgroundColor: 'rgba(255,255,255,0.08)', color: '#fff',
                            fontWeight: '700', fontSize: '0.9rem', textDecoration: 'none',
                            transition: 'background 0.2s', border: '1px solid rgba(255,255,255,0.05)'
                        }}>My Groups</Link>
                        <Link href="/dashboard/groups/create" style={{
                            padding: '14px', borderRadius: '14px', display: 'block', textAlign: 'center',
                            backgroundColor: '#FFFFFF', color: '#161920',
                            fontWeight: '800', fontSize: '0.9rem', textDecoration: 'none',
                            transition: 'transform 0.1s'
                        }}>New Group</Link>
                    </div>
                </div>
            </div>

            {/* Stat Pills */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '28px' }}>
                <div className="card" style={{ marginBottom: 0, padding: '18px 20px' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '6px' }}>Pending Dues</div>
                    <div style={{ fontSize: '1.6rem', fontWeight: '900', color: (duePayments?.length || 0) > 0 ? 'var(--danger)' : 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                        {(duePayments?.length || 0) > 0 ? `₹${((duePayments as any[]).reduce((s, p) => s + (p.amount || 0), 0)).toLocaleString('en-IN')}` : '₹0'}
                    </div>
                    {(duePayments?.length || 0) > 0 && (
                        <div style={{ fontSize: '0.72rem', color: 'var(--danger)', fontWeight: '700', marginTop: '4px' }}>
                            {duePayments?.length} due
                        </div>
                    )}
                </div>
                <div className="card" style={{ marginBottom: 0, padding: '18px 20px' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '6px' }}>Active Groups</div>
                    <div style={{ fontSize: '1.6rem', fontWeight: '900', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>{activeGroups.length}</div>
                    <div style={{ fontSize: '0.72rem', color: activeGroups.length > 0 ? 'var(--success)' : 'var(--text-muted)', fontWeight: '700', marginTop: '4px' }}>
                        {activeGroups.length > 0 ? 'All running' : 'None active'}
                    </div>
                </div>
            </div>

            {/* My Groups quick view */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <h2 className="heading-2" style={{ marginBottom: 0 }}>My Groups</h2>
                <Link href="/dashboard/groups" style={{ fontSize: '0.8rem', color: 'var(--primary-accent)', fontWeight: '700' }}>View all →</Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
                {allGroups.slice(0, 3).map((group: any) => (
                    <Link key={group.id} href={`/dashboard/groups/${group.id}`} style={{ textDecoration: 'none' }}>
                        <div style={{
                            backgroundColor: 'var(--card-bg)', borderRadius: '20px', padding: '16px 18px',
                            boxShadow: 'var(--shadow-sm)', border: '1px solid rgba(0,0,0,0.02)',
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            position: 'relative', overflow: 'hidden'
                        }}>
                            <div style={{
                                position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px',
                                backgroundColor: group.status === 'active' ? 'var(--success)' : 'var(--warning)'
                            }} />
                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', paddingLeft: '8px' }}>
                                <div style={{
                                    width: '42px', height: '42px', borderRadius: '14px',
                                    backgroundColor: group.is_admin ? 'rgba(255,204,0,0.08)' : 'rgba(26,104,255,0.06)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                                }}>
                                    {group.is_admin
                                        ? <Crown size={20} color="var(--warning)" strokeWidth={2} />
                                        : <Users size={20} color="var(--primary-accent)" strokeWidth={2} />}
                                </div>
                                <div>
                                    <div style={{ fontWeight: '800', fontSize: '0.9rem', color: 'var(--text-primary)' }}>{group.name}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>₹{group.monthly_amount?.toLocaleString('en-IN')}/mo · {group.max_members}m</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span className={`badge ${group.status === 'active' ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.65rem' }}>
                                    {group.status}
                                </span>
                                <ChevronRight size={16} color="var(--text-muted)" />
                            </div>
                        </div>
                    </Link>
                ))}
                {allGroups.length === 0 && (
                    <Link href="/dashboard/groups/create" style={{ textDecoration: 'none' }}>
                        <div style={{
                            backgroundColor: 'var(--card-bg)', borderRadius: '20px', padding: '32px',
                            textAlign: 'center', border: '2px dashed var(--input-border)'
                        }}>
                            <p style={{ fontWeight: '700', color: 'var(--text-secondary)' }}>No groups yet — create one!</p>
                        </div>
                    </Link>
                )}
            </div>

            {/* Upcoming Payments */}
            <h2 className="heading-2">Upcoming Payments</h2>
            <div className="card" style={{ padding: '8px 16px', marginBottom: '24px' }}>
                {(duePayments && duePayments.length > 0) ? (
                    (duePayments as any[]).slice(0, 4).map((p: any) => (
                        <Link key={p.id} href={`/dashboard/groups/${p.group_id}/pay/${p.cycle_month}`} style={{ textDecoration: 'none' }}>
                            <div className="flex-between" style={{ padding: '14px 0', borderBottom: '1px solid rgba(0,0,0,0.03)' }}>
                                <div className="flex-row gap-md">
                                    <div style={{
                                        width: '42px', height: '42px', borderRadius: '14px',
                                        backgroundColor: 'rgba(255,59,48,0.06)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontWeight: '800', fontSize: '0.9rem', color: 'var(--danger)'
                                    }}>
                                        {(p.groups?.name || 'G').charAt(0)}
                                    </div>
                                    <div className="flex-col">
                                        <span style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-primary)' }}>{p.groups?.name || 'Group'}</span>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
                                            Cycle {p.cycle_month}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex-col" style={{ alignItems: 'flex-end' }}>
                                    <span style={{ fontWeight: '800', fontSize: '1rem', color: 'var(--text-primary)' }}>₹{(p.amount || 0).toLocaleString('en-IN')}</span>
                                    <span style={{ color: 'var(--danger)', fontSize: '0.72rem', fontWeight: '800', letterSpacing: '0.05em' }}>PAY NOW</span>
                                </div>
                            </div>
                        </Link>
                    ))
                ) : (
                    <div style={{ padding: '28px 16px', textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🎉</div>
                        <p style={{ fontWeight: '700', fontSize: '0.9rem', marginBottom: '4px', color: 'var(--text-primary)' }}>All Caught Up!</p>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', fontWeight: '500' }}>No pending payments.</p>
                    </div>
                )}
            </div>
        </main>
    );
}

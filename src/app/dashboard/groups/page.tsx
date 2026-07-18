import Link from "next/link";
import { PlusCircle, Crown, User, ChevronRight, Users } from "lucide-react";

function statusColor(status: string) {
    if (status === 'active') return { bg: 'rgba(52,199,89,0.08)', text: 'var(--success)', label: 'Active', bar: 'var(--success)' };
    if (status === 'completed') return { bg: 'rgba(142,150,166,0.12)', text: 'var(--text-muted)', label: 'Completed', bar: 'var(--text-muted)' };
    return { bg: 'rgba(255,204,0,0.08)', text: 'var(--warning)', label: 'Upcoming', bar: 'var(--warning)' };
}

// Mock data for dev bypass mode
const MOCK_GROUPS = [
    { id: 'mock-1', name: 'Family Savings Circle', status: 'active', monthly_amount: 5000, max_members: 12, duration_months: 12, is_admin: true },
    { id: 'mock-2', name: 'Office ROSCA 2026', status: 'active', monthly_amount: 2000, max_members: 10, duration_months: 10, is_admin: false, membership_status: 'approved' },
    { id: 'mock-3', name: 'Friends Holiday Fund', status: 'upcoming', monthly_amount: 3000, max_members: 8, duration_months: 8, is_admin: false, membership_status: 'pending' },
];

async function getGroupsData() {
    const isDev = process.env.NEXT_PUBLIC_DEV_BYPASS === 'true';
    if (isDev) {
        return {
            adminGroups: MOCK_GROUPS.filter(g => g.is_admin),
            joinedGroups: MOCK_GROUPS.filter(g => !g.is_admin),
            allGroups: MOCK_GROUPS
        };
    }

    // Real Supabase
    const { createClient } = await import("@/utils/supabase/server");
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { adminGroups: [], joinedGroups: [], allGroups: [] };
    }

    const { data: adminGroups } = await supabase
        .from('groups')
        .select('*')
        .eq('admin_id', user.id)
        .order('created_at', { ascending: false });

    const { data: memberGroupsData } = await supabase
        .from('group_members')
        .select('group_id, status, groups(*)')
        .eq('user_id', user.id);

    const joinedGroups = memberGroupsData
        ? memberGroupsData
            .filter(mg => (mg.groups as any)?.admin_id !== user.id)
            .map(mg => ({ ...(mg.groups as any), membership_status: mg.status }))
        : [];

    const allGroups = [
        ...(adminGroups || []).map(g => ({ ...g, is_admin: true })),
        ...joinedGroups.map((g: any) => ({ ...g, is_admin: false }))
    ];

    return {
        adminGroups: (adminGroups || []).map(g => ({ ...g, is_admin: true })),
        joinedGroups: joinedGroups.map((g: any) => ({ ...g, is_admin: false })),
        allGroups
    };
}

export default async function GroupsList() {
    const { adminGroups, joinedGroups, allGroups } = await getGroupsData();

    const activeCount = allGroups.filter(g => g.status === 'active').length;
    const totalPot = allGroups.reduce((sum, g) => sum + (g.monthly_amount * g.max_members), 0);

    return (
        <div className="container" style={{ paddingBottom: '120px' }}>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', marginTop: '8px' }}>
                <div>
                    <h1 className="heading-1" style={{ marginBottom: '2px' }}>My Groups</h1>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
                        {allGroups.length} circles · {activeCount} active
                    </p>
                </div>
                <Link href="/dashboard/groups/create" style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '10px 18px', borderRadius: '999px',
                    backgroundColor: 'var(--primary-accent)', color: '#fff',
                    fontWeight: '700', fontSize: '0.875rem', textDecoration: 'none'
                }}>
                    <PlusCircle size={16} strokeWidth={2.5} /> New
                </Link>
            </div>

            {/* Summary Banner */}
            {allGroups.length > 0 && (
                <div className="card card-dark" style={{
                    position: 'relative', overflow: 'hidden',
                    padding: '24px', marginBottom: '24px',
                }}>
                    <div style={{
                        position: 'absolute', top: '-40px', right: '-40px', width: '180px', height: '180px',
                        background: 'radial-gradient(circle, rgba(26,104,255,0.2) 0%, transparent 70%)',
                        borderRadius: '50%', pointerEvents: 'none'
                    }} />
                    <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', fontWeight: '700', letterSpacing: '0.08em', marginBottom: '6px' }}>
                        TOTAL POT VALUE
                    </div>
                    <div style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--text-light)', letterSpacing: '-0.02em', marginBottom: '12px' }}>
                        ₹{totalPot.toLocaleString('en-IN')}
                    </div>
                    <div style={{ display: 'flex', gap: '16px' }}>
                        <div style={{
                            backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '12px',
                            padding: '10px 16px', flex: 1
                        }}>
                            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', fontWeight: '600' }}>Groups</div>
                            <div style={{ fontSize: '1.3rem', fontWeight: '800', color: '#fff' }}>{allGroups.length}</div>
                        </div>
                        <div style={{
                            backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '12px',
                            padding: '10px 16px', flex: 1
                        }}>
                            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', fontWeight: '600' }}>Active</div>
                            <div style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--success)' }}>{activeCount}</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Filter Chips */}
            {allGroups.length > 0 && (
                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', marginBottom: '20px' }}>
                    {['All', 'Active', 'Upcoming', 'Completed'].map(f => (
                        <span key={f} style={{
                            padding: '7px 18px', borderRadius: '999px', flexShrink: 0,
                            backgroundColor: f === 'All' ? 'var(--primary-accent)' : 'var(--card-bg)',
                            color: f === 'All' ? '#fff' : 'var(--text-secondary)',
                            fontSize: '0.82rem', fontWeight: '700',
                            boxShadow: 'var(--shadow-sm)', cursor: 'pointer',
                            border: '1px solid rgba(0,0,0,0.015)'
                        }}>{f}</span>
                    ))}
                </div>
            )}

            {/* Groups you Manage */}
            {adminGroups && adminGroups.length > 0 && (
                <>
                    <h2 style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-secondary)', letterSpacing: '0.08em', marginBottom: '12px', textTransform: 'uppercase' }}>
                        Groups You Manage
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
                        {adminGroups.map(group => {
                            const s = statusColor(group.status);
                            const pot = group.monthly_amount * group.max_members;
                            return (
                                <Link key={group.id} href={`/dashboard/groups/${group.id}`} style={{ textDecoration: 'none', display: 'block' }}>
                                    <div style={{
                                        backgroundColor: 'var(--card-bg)', borderRadius: '20px',
                                        overflow: 'hidden', boxShadow: 'var(--shadow-sm)',
                                        border: '1px solid rgba(0,0,0,0.02)',
                                        position: 'relative', transition: 'transform 0.2s, box-shadow 0.2s',
                                    }}>
                                        {/* Status left bar */}
                                        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', backgroundColor: s.bar }} />
                                        <div style={{ padding: '18px 20px 18px 24px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <div style={{
                                                        width: '44px', height: '44px', borderRadius: '14px',
                                                        backgroundColor: 'rgba(255,204,0,0.1)',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        flexShrink: 0
                                                    }}>
                                                        <Crown size={20} color="#B28E00" strokeWidth={2} />
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: '800', fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '2px' }}>
                                                            {group.name}
                                                        </div>
                                                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                                                            {group.max_members} members · {group.duration_months} months
                                                        </div>
                                                    </div>
                                                </div>
                                                <span style={{
                                                    padding: '4px 12px', borderRadius: '999px',
                                                    backgroundColor: s.bg, color: s.text,
                                                    fontSize: '0.72rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em'
                                                }}>{s.label}</span>
                                            </div>
                                            <div style={{
                                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                                paddingTop: '14px', borderTop: '1px solid var(--input-border)'
                                            }}>
                                                <div>
                                                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '2px' }}>Monthly Due</div>
                                                    <div style={{ fontWeight: '800', fontSize: '1rem', color: 'var(--text-primary)' }}>₹{group.monthly_amount.toLocaleString('en-IN')}</div>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '2px' }}>Pot Value</div>
                                                    <div style={{ fontWeight: '800', fontSize: '1rem', color: 'var(--primary-accent)' }}>₹{pot.toLocaleString('en-IN')}</div>
                                                </div>
                                                <ChevronRight size={20} color="var(--text-muted)" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </>
            )}

            {/* Groups you've joined */}
            {joinedGroups.length > 0 && (
                <>
                    <h2 style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-secondary)', letterSpacing: '0.08em', marginBottom: '12px', textTransform: 'uppercase' }}>
                        Joined Circles
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
                        {joinedGroups.map((group: any) => {
                            const s = statusColor(group.status);
                            const pot = group.monthly_amount * group.max_members;
                            const isDue = group.membership_status === 'approved' && group.status === 'active';
                            return (
                                <Link key={group.id} href={`/dashboard/groups/${group.id}`} style={{ textDecoration: 'none', display: 'block' }}>
                                    <div style={{
                                        backgroundColor: 'var(--card-bg)', borderRadius: '20px', overflow: 'hidden',
                                        boxShadow: 'var(--shadow-sm)', border: '1px solid rgba(0,0,0,0.02)',
                                        position: 'relative'
                                    }}>
                                        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', backgroundColor: isDue ? '#FF3B30' : s.bar }} />
                                        <div style={{ padding: '18px 20px 18px 24px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <div style={{
                                                        width: '44px', height: '44px', borderRadius: '14px',
                                                        backgroundColor: 'rgba(26,104,255,0.06)',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                                                    }}>
                                                        <User size={20} color="var(--primary-accent)" strokeWidth={2} />
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: '800', fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '2px' }}>
                                                            {group.name}
                                                        </div>
                                                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                                                            {group.max_members} members · {group.duration_months} months
                                                        </div>
                                                    </div>
                                                </div>
                                                <span style={{
                                                    padding: '4px 12px', borderRadius: '999px',
                                                    backgroundColor: group.membership_status === 'pending' ? 'rgba(255,204,0,0.12)' : s.bg,
                                                    color: group.membership_status === 'pending' ? '#B28E00' : s.text,
                                                    fontSize: '0.72rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em'
                                                }}>
                                                    {group.membership_status === 'pending' ? 'Pending' : s.label}
                                                </span>
                                            </div>
                                            <div style={{
                                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                                paddingTop: '14px', borderTop: '1px solid var(--input-border)'
                                            }}>
                                                <div>
                                                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '2px' }}>Monthly Due</div>
                                                    <div style={{ fontWeight: '800', fontSize: '1rem', color: 'var(--text-primary)' }}>₹{group.monthly_amount.toLocaleString('en-IN')}</div>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '2px' }}>Pot Value</div>
                                                    <div style={{ fontWeight: '800', fontSize: '1rem', color: 'var(--primary-accent)' }}>₹{pot.toLocaleString('en-IN')}</div>
                                                </div>
                                                <ChevronRight size={20} color="var(--text-muted)" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </>
            )}

            {/* Empty State */}
            {allGroups.length === 0 && (
                <div style={{
                    textAlign: 'center', padding: '60px 24px',
                    backgroundColor: 'var(--card-bg)', borderRadius: '24px',
                    border: '2px dashed var(--input-border)'
                }}>
                    <div style={{
                        width: '72px', height: '72px', borderRadius: '50%',
                        backgroundColor: 'rgba(26,104,255,0.08)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 20px'
                    }}>
                        <Users size={32} color="var(--primary-accent)" strokeWidth={2} />
                    </div>
                    <h3 style={{ fontWeight: '800', fontSize: '1.2rem', marginBottom: '8px' }}>No Groups Yet</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '28px', fontWeight: '500' }}>
                        Create your first savings circle or join one with an invite link.
                    </p>
                    <Link href="/dashboard/groups/create" style={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                        padding: '14px 28px', borderRadius: '999px',
                        backgroundColor: 'var(--primary-accent)', color: 'var(--text-light)',
                        fontWeight: '800', fontSize: '0.95rem', textDecoration: 'none'
                    }}>
                        <PlusCircle size={18} strokeWidth={2.5} /> Create a Group
                    </Link>
                </div>
            )}
        </div>
    );
}

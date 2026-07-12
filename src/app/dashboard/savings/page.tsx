import { Wallet, TrendingUp, AlertCircle, ArrowRight, ArrowLeft, Users, ChevronRight, CheckCircle } from "lucide-react";
import Link from "next/link";

async function getSavingsData() {
    const isDev = process.env.NEXT_PUBLIC_DEV_BYPASS === 'true';
    if (isDev) {
        return {
            totalSaved: 45000,
            totalDue: 5000,
            nextDueDate: "Oct 25",
            daysLeft: 4,
            activeGroups: [
                { id: 'mock-2', name: 'Office ROSCA 2026', installment: 2000, progress: '8/10 months', status: 'due' },
                { id: 'mock-1', name: 'Family Savings Circle', installment: 5000, progress: '2/12 months', status: 'due' },
                { id: 'mock-3', name: 'Friends Holiday Fund', installment: 3000, progress: '5/8 months', status: 'paid' },
            ]
        };
    }

    // Real Supabase data fallback
    const { createClient } = await import("@/utils/supabase/server");
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { totalSaved: 0, totalDue: 0, nextDueDate: "—", daysLeft: 0, activeGroups: [] };
    }

    // Fetch payments made by user
    const { data: payments } = await supabase.from('payments').select('amount, status').eq('user_id', user.id);
    const totalSaved = payments?.filter(p => p.status === 'paid').reduce((s, p) => s + (p.amount || 0), 0) || 0;
    const totalDue = payments?.filter(p => p.status === 'due' || p.status === 'overdue').reduce((s, p) => s + (p.amount || 0), 0) || 0;

    return {
        totalSaved,
        totalDue,
        nextDueDate: "Oct 25",
        daysLeft: 4,
        activeGroups: []
    };
}

export default async function SavingsPortfolio() {
    const { totalSaved, totalDue, nextDueDate, daysLeft, activeGroups } = await getSavingsData();

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-color)', fontFamily: 'var(--font-family)' }}>
            
            {/* Dark Header */}
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', position: 'relative', zIndex: 1 }}>
                    <Link href="/dashboard" style={{
                        width: '40px', height: '40px', borderRadius: '50%',
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff'
                    }}>
                        <ArrowLeft size={20} strokeWidth={2.5} />
                    </Link>
                    <div>
                        <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', fontWeight: '700', letterSpacing: '0.08em' }}>PORTFOLIO</div>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#fff', letterSpacing: '-0.02em' }}>My Savings</h1>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div style={{ padding: '20px', paddingBottom: '120px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                {/* Total Saved Hero Card */}
                <div style={{
                    backgroundColor: 'var(--card-bg)', borderRadius: '24px', padding: '24px',
                    boxShadow: 'var(--shadow-sm)', border: '1px solid rgba(0,0,0,0.04)',
                    position: 'relative', overflow: 'hidden'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '700', letterSpacing: '0.04em' }}>
                            TOTAL AMOUNT SAVED
                        </span>
                        <div style={{
                            width: '36px', height: '36px', borderRadius: '50%',
                            backgroundColor: 'rgba(212,255,0,0.15)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000'
                        }}>
                            <Wallet size={18} color="var(--primary-accent)" strokeWidth={2} />
                        </div>
                    </div>
                    <div style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1, marginBottom: '10px' }}>
                        ₹{totalSaved.toLocaleString('en-IN')}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#34C759', fontSize: '0.82rem', fontWeight: '800' }}>
                        <TrendingUp size={16} strokeWidth={2.5} />
                        <span>+12% growth this cycle</span>
                    </div>
                </div>

                {/* Due Metric Cards Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div style={{
                        backgroundColor: 'var(--card-bg)', borderRadius: '20px', padding: '18px',
                        boxShadow: 'var(--shadow-sm)', border: '1px solid rgba(0,0,0,0.04)'
                    }}>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: '700', letterSpacing: '0.04em' }}>TOTAL DUE</span>
                        <div style={{ fontSize: '1.4rem', fontWeight: '900', color: '#FF3B30', marginTop: '6px', marginBottom: '8px' }}>
                            ₹{totalDue.toLocaleString('en-IN')}
                        </div>
                        <div style={{ height: '5px', backgroundColor: 'var(--bg-color)', borderRadius: '999px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: '40%', backgroundColor: '#FF3B30', borderRadius: '999px' }} />
                        </div>
                    </div>
                    
                    <div style={{
                        backgroundColor: 'var(--card-bg)', borderRadius: '20px', padding: '18px',
                        boxShadow: 'var(--shadow-sm)', border: '1px solid rgba(0,0,0,0.04)'
                    }}>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: '700', letterSpacing: '0.04em' }}>NEXT DUE DATE</span>
                        <div style={{ fontSize: '1.4rem', fontWeight: '900', color: 'var(--text-primary)', marginTop: '6px' }}>
                            {nextDueDate}
                        </div>
                        <span style={{ fontSize: '0.72rem', color: '#FF9F0A', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            In {daysLeft} Days
                        </span>
                    </div>
                </div>

                {/* Active Circles Section */}
                <h3 style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-secondary)', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '10px' }}>
                    Active Circles Dues
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {activeGroups.map((group: any) => (
                        <div key={group.id} style={{
                            backgroundColor: 'var(--card-bg)', borderRadius: '20px', padding: '16px 18px',
                            boxShadow: 'var(--shadow-sm)', border: '1px solid rgba(0,0,0,0.04)',
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                <div style={{
                                    width: '42px', height: '42px', borderRadius: '14px',
                                    backgroundColor: group.status === 'due' ? 'rgba(255,59,48,0.08)' : 'rgba(52,199,89,0.08)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                                }}>
                                    {group.status === 'due'
                                        ? <AlertCircle size={20} color="#FF3B30" strokeWidth={2} />
                                        : <CheckCircle size={20} color="#34C759" strokeWidth={2} />}
                                </div>
                                <div>
                                    <div style={{ fontWeight: '800', fontSize: '0.9rem', color: 'var(--text-primary)' }}>{group.name}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
                                        ₹{group.installment.toLocaleString('en-IN')} · {group.progress}
                                    </div>
                                </div>
                            </div>
                            
                            {group.status === 'due' ? (
                                <Link href={`/dashboard/groups/${group.id}/pay/1`} style={{
                                    backgroundColor: '#1A1A1A', color: '#fff', textDecoration: 'none',
                                    padding: '8px 16px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '800'
                                }}>
                                    Pay Now
                                </Link>
                            ) : (
                                <span style={{
                                    backgroundColor: 'rgba(52,199,89,0.12)', color: '#34C759',
                                    padding: '5px 12px', borderRadius: '999px', fontSize: '0.72rem', fontWeight: '800', textTransform: 'uppercase'
                                }}>
                                    Paid
                                </span>
                            )}
                        </div>
                    ))}
                </div>

                {/* Referral Invite Card */}
                <div style={{
                    background: 'linear-gradient(135deg, #1A1A1A 0%, #000000 100%)',
                    borderRadius: '24px', padding: '24px', color: '#fff',
                    position: 'relative', overflow: 'hidden', marginTop: '10px'
                }}>
                    <div style={{
                        position: 'absolute', top: '-40px', right: '-40px', width: '120px', height: '120px',
                        background: 'radial-gradient(circle, rgba(212,255,0,0.15) 0%, transparent 70%)',
                        borderRadius: '50%', pointerEvents: 'none'
                    }} />
                    <h4 style={{ fontSize: '1.1rem', fontWeight: '900', color: '#D4FF00', marginBottom: '6px' }}>Invite Friends</h4>
                    <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)', fontWeight: '500', marginBottom: '20px', lineHeight: 1.4 }}>
                        Earn cash rewards and higher savings yields for every friend who starts a new savings group.
                    </p>
                    <button style={{
                        width: '100%', padding: '14px', borderRadius: '14px', border: 'none',
                        backgroundColor: '#fff', color: '#000', fontWeight: '800', fontSize: '0.88rem',
                        cursor: 'pointer', fontFamily: 'var(--font-family)'
                    }}>
                        Refer & Earn Now
                    </button>
                </div>

            </div>
        </div>
    );
}

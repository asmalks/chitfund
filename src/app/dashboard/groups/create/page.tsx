"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Users, Coins, CalendarDays, ChevronRight, Check } from "lucide-react";
import Link from "next/link";

type Step = 1 | 2 | 3 | 4;

const STEPS = [
    { step: 1 as Step, label: 'Group Name', icon: Users },
    { step: 2 as Step, label: 'Financials', icon: Coins },
    { step: 3 as Step, label: 'Schedule', icon: CalendarDays },
    { step: 4 as Step, label: 'Review', icon: Check },
];

const inputStyle = {
    width: '100%', padding: '16px 18px',
    borderRadius: '16px', border: '1.5px solid var(--input-border)',
    backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)',
    fontSize: '1rem', outline: 'none', fontWeight: '600',
    fontFamily: 'var(--font-family)', transition: 'border-color 0.2s'
};

const labelStyle = {
    display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)',
    marginBottom: '8px', fontWeight: '800', letterSpacing: '0.06em', textTransform: 'uppercase' as const
};

export default function CreateGroup() {
    const router = useRouter();
    const supabase = createClient();

    const [step, setStep] = useState<Step>(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        monthly_amount: "",
        max_members: "",
        duration_months: "",
        start_date: "",
    });

    const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const canProceed = () => {
        if (step === 1) return formData.name.trim().length >= 3;
        if (step === 2) return Number(formData.monthly_amount) >= 100 && Number(formData.max_members) >= 2;
        if (step === 3) return formData.duration_months && formData.start_date;
        return true;
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError("");
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Not authenticated");

            const { data: group, error: groupError } = await supabase
                .from('groups')
                .insert({
                    admin_id: user.id,
                    name: formData.name,
                    monthly_amount: parseFloat(formData.monthly_amount),
                    duration_months: parseInt(formData.duration_months),
                    start_date: formData.start_date,
                    max_members: parseInt(formData.max_members),
                    status: 'upcoming'
                })
                .select().single();

            if (groupError) throw groupError;

            await supabase.from('group_members').insert({
                group_id: group.id, user_id: user.id, status: 'approved'
            });

            router.push(`/dashboard/groups/${group.id}`);
        } catch (err: any) {
            setError(err.message || "Failed to create group.");
        } finally {
            setLoading(false);
        }
    };

    const totalPot = Number(formData.monthly_amount || 0) * Number(formData.max_members || 0);

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
                    <Link href="/dashboard/groups" style={{
                        width: '40px', height: '40px', borderRadius: '50%',
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff'
                    }}>
                        <ArrowLeft size={20} strokeWidth={2.5} />
                    </Link>
                    <div>
                        <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', fontWeight: '700', letterSpacing: '0.08em' }}>NEW SAVINGS CIRCLE</div>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#fff', letterSpacing: '-0.02em' }}>Create Group</h1>
                    </div>
                </div>

                {/* Step Indicator */}
                <div style={{ display: 'flex', gap: '8px', position: 'relative', zIndex: 1 }}>
                    {STEPS.map(s => (
                        <div key={s.step} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                            <div style={{
                                height: '4px', width: '100%', borderRadius: '999px',
                                backgroundColor: step >= s.step ? '#D4FF00' : 'rgba(255,255,255,0.15)',
                                transition: 'background 0.3s'
                            }} />
                            <span style={{
                                fontSize: '0.65rem', fontWeight: '700',
                                color: step >= s.step ? '#D4FF00' : 'rgba(255,255,255,0.3)',
                                letterSpacing: '0.04em'
                            }}>
                                {s.label.toUpperCase()}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Form Content */}
            <div style={{ padding: '24px 20px', paddingBottom: '120px' }}>

                {/* STEP 1: Group Name */}
                {step === 1 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ backgroundColor: 'var(--card-bg)', borderRadius: '24px', padding: '28px 22px', boxShadow: 'var(--shadow-sm)' }}>
                            <h2 style={{ fontWeight: '900', fontSize: '1.3rem', marginBottom: '6px' }}>Name your circle</h2>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', fontWeight: '500', marginBottom: '24px' }}>
                                Give your savings group a memorable name.
                            </p>
                            <div>
                                <label style={labelStyle}>Group Name</label>
                                <input
                                    type="text" name="name" value={formData.name}
                                    onChange={handle} placeholder="e.g. Family Savings Circle"
                                    style={inputStyle} autoFocus
                                />
                            </div>
                        </div>

                        {/* Popular name suggestions */}
                        <div>
                            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', letterSpacing: '0.06em', marginBottom: '12px' }}>SUGGESTIONS</p>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {['Office ROSCA', 'Family Circle', 'Friends Fund', 'Community Pot'].map(s => (
                                    <button key={s} onClick={() => setFormData({ ...formData, name: s })} style={{
                                        padding: '8px 16px', borderRadius: '999px',
                                        backgroundColor: formData.name === s ? '#1A1A1A' : 'var(--card-bg)',
                                        color: formData.name === s ? '#fff' : 'var(--text-secondary)',
                                        fontWeight: '700', fontSize: '0.82rem', border: 'none', cursor: 'pointer',
                                        boxShadow: 'var(--shadow-sm)', fontFamily: 'var(--font-family)'
                                    }}>{s}</button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 2: Financials */}
                {step === 2 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ backgroundColor: 'var(--card-bg)', borderRadius: '24px', padding: '28px 22px', boxShadow: 'var(--shadow-sm)' }}>
                            <h2 style={{ fontWeight: '900', fontSize: '1.3rem', marginBottom: '6px' }}>Set the financials</h2>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', fontWeight: '500', marginBottom: '24px' }}>
                                How much does each member contribute monthly?
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div>
                                    <label style={labelStyle}>Monthly Contribution (₹)</label>
                                    <input type="number" name="monthly_amount" value={formData.monthly_amount} onChange={handle}
                                        min="100" placeholder="5000" style={inputStyle} />
                                </div>
                                <div>
                                    <label style={labelStyle}>Max Members</label>
                                    <input type="number" name="max_members" value={formData.max_members} onChange={handle}
                                        min="2" max="100" placeholder="12" style={inputStyle} />
                                </div>
                            </div>
                        </div>

                        {/* Live pot preview */}
                        {totalPot > 0 && (
                            <div style={{
                                backgroundColor: '#1A1A1A', borderRadius: '20px', padding: '20px 22px',
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                            }}>
                                <div>
                                    <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)', fontWeight: '700', letterSpacing: '0.06em', marginBottom: '4px' }}>MONTHLY POT SIZE</div>
                                    <div style={{ fontSize: '2rem', fontWeight: '900', color: '#D4FF00', letterSpacing: '-0.02em' }}>
                                        ₹{totalPot.toLocaleString('en-IN')}
                                    </div>
                                </div>
                                <div style={{
                                    width: '56px', height: '56px', borderRadius: '50%',
                                    backgroundColor: 'rgba(212,255,0,0.1)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <Users size={24} color="#D4FF00" strokeWidth={2} />
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* STEP 3: Schedule */}
                {step === 3 && (
                    <div style={{ backgroundColor: 'var(--card-bg)', borderRadius: '24px', padding: '28px 22px', boxShadow: 'var(--shadow-sm)' }}>
                        <h2 style={{ fontWeight: '900', fontSize: '1.3rem', marginBottom: '6px' }}>Set the schedule</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', fontWeight: '500', marginBottom: '24px' }}>
                            How long and when does the circle run?
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label style={labelStyle}>Duration (Months)</label>
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                                    {[6, 12, 18, 24].map(d => (
                                        <button key={d} onClick={() => setFormData({ ...formData, duration_months: d.toString() })} style={{
                                            padding: '10px 20px', borderRadius: '999px',
                                            backgroundColor: formData.duration_months === d.toString() ? '#1A1A1A' : 'var(--bg-color)',
                                            color: formData.duration_months === d.toString() ? '#D4FF00' : 'var(--text-secondary)',
                                            fontWeight: '800', fontSize: '0.88rem', border: 'none', cursor: 'pointer',
                                            fontFamily: 'var(--font-family)'
                                        }}>{d}m</button>
                                    ))}
                                </div>
                                <input type="number" name="duration_months" value={formData.duration_months} onChange={handle}
                                    min="2" max="60" placeholder="Custom months..." style={inputStyle} />
                            </div>
                            <div>
                                <label style={labelStyle}>Start Date</label>
                                <input type="date" name="start_date" value={formData.start_date} onChange={handle} style={inputStyle} />
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 4: Review */}
                {step === 4 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ backgroundColor: '#1A1A1A', borderRadius: '24px', padding: '28px 22px', position: 'relative', overflow: 'hidden' }}>
                            <div style={{
                                position: 'absolute', top: '-30px', right: '-30px', width: '120px', height: '120px',
                                background: 'radial-gradient(circle, rgba(212,255,0,0.12) 0%, transparent 70%)',
                                borderRadius: '50%', pointerEvents: 'none'
                            }} />
                            <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', fontWeight: '700', letterSpacing: '0.08em', marginBottom: '6px' }}>TOTAL POT</div>
                            <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#D4FF00', letterSpacing: '-0.03em', marginBottom: '4px' }}>
                                ₹{totalPot.toLocaleString('en-IN')}
                            </div>
                            <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#fff' }}>{formData.name}</div>
                        </div>

                        <div style={{ backgroundColor: 'var(--card-bg)', borderRadius: '24px', padding: '22px', boxShadow: 'var(--shadow-sm)' }}>
                            {[
                                { label: 'Monthly Amount', value: `₹${Number(formData.monthly_amount).toLocaleString('en-IN')}` },
                                { label: 'Max Members', value: formData.max_members },
                                { label: 'Duration', value: `${formData.duration_months} months` },
                                { label: 'Start Date', value: formData.start_date ? new Date(formData.start_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—' },
                            ].map((row, i, arr) => (
                                <div key={row.label} style={{
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    padding: '14px 0',
                                    borderBottom: i < arr.length - 1 ? '1px solid var(--input-border)' : 'none'
                                }}>
                                    <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', fontWeight: '600' }}>{row.label}</span>
                                    <span style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--text-primary)' }}>{row.value}</span>
                                </div>
                            ))}
                        </div>

                        {error && (
                            <div style={{
                                backgroundColor: 'rgba(255,59,48,0.08)', color: '#FF3B30', padding: '14px 16px',
                                borderRadius: '16px', fontSize: '0.85rem', fontWeight: '600',
                                border: '1px solid rgba(255,59,48,0.2)'
                            }}>{error}</div>
                        )}
                    </div>
                )}

                {/* Navigation */}
                <div style={{ display: 'flex', gap: '12px', marginTop: '28px' }}>
                    {step > 1 && (
                        <button onClick={() => setStep((step - 1) as Step)} style={{
                            width: '52px', height: '52px', borderRadius: '50%', border: 'none',
                            backgroundColor: 'var(--card-bg)', display: 'flex', alignItems: 'center',
                            justifyContent: 'center', cursor: 'pointer', boxShadow: 'var(--shadow-sm)',
                            fontFamily: 'var(--font-family)'
                        }}>
                            <ArrowLeft size={20} strokeWidth={2.5} color="var(--text-primary)" />
                        </button>
                    )}
                    <button
                        onClick={step < 4 ? () => setStep((step + 1) as Step) : handleSubmit}
                        disabled={!canProceed() || loading}
                        style={{
                            flex: 1, padding: '16px 24px', borderRadius: '999px', border: 'none',
                            backgroundColor: canProceed() && !loading ? '#1A1A1A' : '#ccc',
                            color: canProceed() && !loading ? '#fff' : '#999',
                            fontWeight: '800', fontSize: '1rem', cursor: canProceed() && !loading ? 'pointer' : 'not-allowed',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                            fontFamily: 'var(--font-family)', transition: 'all 0.2s'
                        }}>
                        {loading ? 'Creating...' : step < 4 ? (
                            <><span>Continue</span><ArrowRight size={18} strokeWidth={2.5} /></>
                        ) : (
                            <><Check size={18} strokeWidth={2.5} /><span>Create Group</span></>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { CheckCircle, Smartphone, Wallet, Building2, Camera, ChevronRight, Shield } from "lucide-react";

type PaymentMethod = 'upi' | 'cash' | 'bank_transfer';

const METHODS = [
    { id: 'upi' as PaymentMethod, icon: Smartphone, label: 'UPI Payment', desc: 'PhonePe, GPay, Paytm, etc.', color: '#5B5CFF' },
    { id: 'cash' as PaymentMethod, icon: Wallet, label: 'Cash Payment', desc: 'Handover to admin directly', color: '#FF9F0A' },
    { id: 'bank_transfer' as PaymentMethod, icon: Building2, label: 'Bank Transfer', desc: 'NEFT / IMPS / RTGS', color: '#34C759' },
];

export default function PaymentActionClient({ groupId, cycleMonth, amount }: {
    groupId: string; cycleMonth: number; amount: number;
}) {
    const [method, setMethod] = useState<PaymentMethod>('upi');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [step, setStep] = useState<'method' | 'confirm'>('method');

    const router = useRouter();
    const supabase = createClient();

    const handlePay = async () => {
        setLoading(true);
        setError("");

        try {
            await new Promise(res => setTimeout(res, 1500));

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Not authenticated");

            const { error: upsertError } = await supabase
                .from('payments')
                .upsert({
                    group_id: groupId,
                    user_id: user.id,
                    cycle_month: cycleMonth,
                    amount: amount,
                    status: method === 'upi' ? 'paid' : 'pending_verification',
                    payment_method: method,
                    due_date: new Date().toISOString(),
                    paid_at: new Date().toISOString()
                }, { onConflict: 'group_id, user_id, cycle_month' });

            if (upsertError) throw upsertError;
            setSuccess(true);
            setTimeout(() => {
                router.push(`/dashboard/groups/${groupId}`);
                router.refresh();
            }, 2500);

        } catch (err: any) {
            setError(err.message || "Payment failed");
        } finally {
            setLoading(false);
        }
    };

    // Success Screen
    if (success) {
        return (
            <div style={{
                minHeight: '100vh', backgroundColor: '#0A0A0A',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', padding: '32px 24px', textAlign: 'center',
                position: 'relative', overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
                    width: '400px', height: '400px',
                    background: 'radial-gradient(circle, rgba(52,199,89,0.15) 0%, transparent 70%)',
                    borderRadius: '50%', pointerEvents: 'none'
                }} />
                <div style={{
                    width: '100px', height: '100px', borderRadius: '50%',
                    backgroundColor: 'rgba(52,199,89,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 28px', position: 'relative', zIndex: 1
                }}>
                    <CheckCircle size={52} color="#34C759" strokeWidth={2} />
                </div>
                <h1 style={{ fontSize: '2rem', fontWeight: '900', color: '#fff', marginBottom: '10px', position: 'relative', zIndex: 1 }}>
                    Payment Submitted!
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1rem', fontWeight: '500', marginBottom: '8px', position: 'relative', zIndex: 1 }}>
                    ₹{amount.toLocaleString('en-IN')} · Cycle {cycleMonth}
                </p>
                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem', fontWeight: '500', position: 'relative', zIndex: 1 }}>
                    {method === 'upi' ? 'Marked as paid.' : 'Awaiting admin verification.'}
                </p>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {/* Payment Amount Card */}
            <div style={{
                backgroundColor: 'var(--card-bg-dark)', borderRadius: '20px', padding: '24px 20px',
                marginBottom: '20px', textAlign: 'center', position: 'relative', overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute', top: '-30px', right: '-30px', width: '120px', height: '120px',
                    background: 'radial-gradient(circle, rgba(26,104,255,0.15) 0%, transparent 70%)',
                    borderRadius: '50%', pointerEvents: 'none'
                }} />
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', fontWeight: '700', letterSpacing: '0.08em', marginBottom: '6px' }}>
                    AMOUNT DUE
                </div>
                <div style={{ fontSize: '3rem', fontWeight: '900', color: 'var(--primary-accent)', letterSpacing: '-0.03em', lineHeight: 1 }}>
                    ₹{amount.toLocaleString('en-IN')}
                </div>
                <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)', fontWeight: '600', marginTop: '8px' }}>
                    Cycle {cycleMonth} Payment
                </div>
            </div>

            {/* Method Selection */}
            <h3 style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-secondary)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '12px' }}>
                Payment Method
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                {METHODS.map(m => (
                    <button key={m.id} onClick={() => setMethod(m.id)} style={{
                        display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 18px',
                        backgroundColor: 'var(--card-bg)', borderRadius: '18px', border: 'none', cursor: 'pointer',
                        outline: method === m.id ? `2px solid ${m.color}` : '2px solid transparent',
                        boxShadow: method === m.id ? `0 0 0 4px ${m.color}18` : 'var(--shadow-sm)',
                        transition: 'all 0.2s', textAlign: 'left', fontFamily: 'var(--font-family)'
                    }}>
                        <div style={{
                            width: '44px', height: '44px', borderRadius: '14px', flexShrink: 0,
                            backgroundColor: method === m.id ? `${m.color}18` : 'var(--bg-color)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'background 0.2s'
                        }}>
                            <m.icon size={22} color={method === m.id ? m.color : 'var(--text-secondary)'} strokeWidth={2} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: '800', fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '2px' }}>{m.label}</div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '500' }}>{m.desc}</div>
                        </div>
                        <div style={{
                            width: '20px', height: '20px', borderRadius: '50%',
                            border: `2px solid ${method === m.id ? m.color : 'var(--input-border)'}`,
                            backgroundColor: method === m.id ? m.color : 'transparent',
                            transition: 'all 0.2s', flexShrink: 0
                        }} />
                    </button>
                ))}
            </div>

            {/* Proof Upload hint for cash/bank */}
            {(method === 'cash' || method === 'bank_transfer') && (
                <div style={{
                    backgroundColor: 'rgba(255,159,10,0.06)', borderRadius: '16px', padding: '14px 18px',
                    display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px',
                    border: '1px solid rgba(255,159,10,0.15)'
                }}>
                    <Camera size={20} color="#FF9F0A" />
                    <div>
                        <div style={{ fontWeight: '700', fontSize: '0.85rem' }}>Upload Proof (Optional)</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '500' }}>
                            Add screenshot for faster verification
                        </div>
                    </div>
                </div>
            )}

            {error && (
                <div style={{
                    backgroundColor: 'rgba(255,59,48,0.1)', color: '#FF3B30', padding: '12px 16px',
                    borderRadius: '14px', fontSize: '0.85rem', marginBottom: '16px', fontWeight: '600',
                    border: '1px solid rgba(255,59,48,0.2)'
                }}>
                    {error}
                </div>
            )}

            {/* Submit */}
            <button onClick={handlePay} disabled={loading} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                width: '100%', padding: '18px',
                backgroundColor: loading ? 'var(--text-muted)' : 'var(--primary-accent)', color: 'var(--text-light)',
                borderRadius: '999px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: '800', fontSize: '1rem', fontFamily: 'var(--font-family)',
                transition: 'all 0.2s', boxShadow: loading ? 'none' : '0 4px 20px rgba(26,104,255,0.15)'
            }}>
                {loading ? (
                    <>Processing...</>
                ) : (
                    <>
                        <Shield size={18} strokeWidth={2.5} />
                        Confirm ₹{amount.toLocaleString('en-IN')} Payment
                    </>
                )}
            </button>
            <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '12px', fontWeight: '500' }}>
                {method === 'upi' ? 'Your payment is secured and encrypted.' : 'Admin will verify and mark your payment.'}
            </p>
        </div>
    );
}

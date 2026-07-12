"use client";

import Link from "next/link";
import { ArrowLeft, Check, Sparkles, Building2 } from "lucide-react";

export default function Pricing() {
    return (
        <div className="container flex-col" style={{ paddingBottom: '120px' }}>
            <div className="flex-row gap-sm mb-lg mt-md">
                <Link href="/dashboard" style={{ color: 'var(--text-primary)' }}>
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="heading-1" style={{ marginBottom: 0 }}>Upgrade Plan</h1>
            </div>

            {/* Free Plan */}
            <div className="card mb-md" style={{ border: '2px solid var(--input-bg)', padding: '32px 24px', boxShadow: 'none' }}>
                <h2 className="heading-2" style={{ color: 'var(--text-secondary)' }}>Basic Saver</h2>
                <div style={{ fontSize: '2.5rem', fontWeight: '800', margin: '8px 0 24px', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
                    Free
                </div>
                <div className="flex-col gap-sm mb-lg">
                    <div className="flex-row gap-sm text-secondary" style={{ fontSize: '0.95rem', fontWeight: '500' }}><Check size={20} color="var(--success)" strokeWidth={3} /> Manage 1 Group</div>
                    <div className="flex-row gap-sm text-secondary" style={{ fontSize: '0.95rem', fontWeight: '500' }}><Check size={20} color="var(--success)" strokeWidth={3} /> Join up to 3 Groups</div>
                    <div className="flex-row gap-sm text-secondary" style={{ fontSize: '0.95rem', fontWeight: '500' }}><Check size={20} color="var(--success)" strokeWidth={3} /> Standard Email Support</div>
                </div>
                <button className="btn btn-secondary" disabled style={{ opacity: 0.5 }}>Current Plan</button>
            </div>

            {/* Pro Plan */}
            <div className="card mb-md" style={{ border: '3px solid var(--primary-accent)', position: 'relative', overflow: 'hidden', padding: '32px 24px', boxShadow: '0 12px 40px rgba(212,255,0,0.15)' }}>
                <div style={{ position: 'absolute', top: 0, right: 0, backgroundColor: 'var(--primary-accent)', color: '#000', padding: '6px 16px', fontSize: '0.75rem', fontWeight: '800', borderBottomLeftRadius: '16px' }}>
                    MOST POPULAR
                </div>
                <h2 className="heading-2" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
                    <Sparkles color="var(--primary-accent)" size={24} /> Pro Manager
                </h2>
                <div style={{ fontSize: '2.5rem', fontWeight: '800', margin: '8px 0 24px', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                    ₹99<span style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: '600' }}> / month</span>
                </div>
                <div className="flex-col gap-sm mb-lg">
                    <div className="flex-row gap-sm text-primary" style={{ fontSize: '0.95rem', fontWeight: '600' }}><Check size={20} color="var(--primary-accent)" strokeWidth={3} /> Manage up to 5 Groups</div>
                    <div className="flex-row gap-sm text-primary" style={{ fontSize: '0.95rem', fontWeight: '600' }}><Check size={20} color="var(--primary-accent)" strokeWidth={3} /> Join up to 20 Groups</div>
                    <div className="flex-row gap-sm text-primary" style={{ fontSize: '0.95rem', fontWeight: '600' }}><Check size={20} color="var(--primary-accent)" strokeWidth={3} /> Automated WhatsApp API Reminders</div>
                    <div className="flex-row gap-sm text-primary" style={{ fontSize: '0.95rem', fontWeight: '600' }}><Check size={20} color="var(--primary-accent)" strokeWidth={3} /> Priority Support</div>
                </div>
                <button className="btn btn-primary" style={{ backgroundColor: 'var(--primary-accent)', color: '#000', border: 'none' }}>Upgrade to Pro</button>
            </div>

            {/* Enterprise Plan */}
            <div className="card mb-md" style={{ backgroundColor: '#111111', padding: '32px 24px' }}>
                <h2 className="heading-2" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fff' }}>
                    <Building2 color="#fff" size={24} /> Community Leader
                </h2>
                <div style={{ fontSize: '2.5rem', fontWeight: '800', margin: '8px 0 24px', color: '#fff', letterSpacing: '-0.02em' }}>
                    ₹499<span style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.6)', fontWeight: '600' }}> / month</span>
                </div>
                <div className="flex-col gap-sm mb-lg">
                    <div className="flex-row gap-sm" style={{ fontSize: '0.95rem', fontWeight: '500', color: 'rgba(255,255,255,0.9)' }}><Check size={20} color="var(--success)" strokeWidth={3} /> Unlimited Groups Managed</div>
                    <div className="flex-row gap-sm" style={{ fontSize: '0.95rem', fontWeight: '500', color: 'rgba(255,255,255,0.9)' }}><Check size={20} color="var(--success)" strokeWidth={3} /> Unlimited Groups Joined</div>
                    <div className="flex-row gap-sm" style={{ fontSize: '0.95rem', fontWeight: '500', color: 'rgba(255,255,255,0.9)' }}><Check size={20} color="var(--success)" strokeWidth={3} /> Custom Branding (White-label)</div>
                </div>
                <button className="btn btn-secondary" style={{ backgroundColor: '#fff', color: '#000', border: 'none' }}>Contact Sales</button>
            </div>

        </div>
    );
}

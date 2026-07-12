"use client";

import { useState } from "react";
import { Bell, MessageSquare, Shield, Lock, HelpCircle, FileText, LogOut, ChevronRight, Globe, Fingerprint } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SettingsClient() {
    const [push, setPush] = useState(true);
    const [whatsapp, setWhatsapp] = useState(false);
    const [biometric, setBiometric] = useState(true);
    const router = useRouter();

    const handleLogout = () => {
        router.push("/login");
    };

    const toggleStyle = (checked: boolean) => ({
        width: '50px', height: '28px', borderRadius: '999px',
        backgroundColor: checked ? 'var(--primary-accent)' : 'var(--input-border)',
        position: 'relative' as const, cursor: 'pointer', border: 'none',
        display: 'flex', alignItems: 'center', padding: '2px', transition: 'background-color 0.2s'
    });

    const circleStyle = (checked: boolean) => ({
        width: '24px', height: '24px', borderRadius: '50%',
        backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        transform: checked ? 'translateX(22px)' : 'translateX(0)',
        transition: 'transform 0.2s'
    });

    const itemStyle = {
        display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 20px',
        cursor: 'pointer', transition: 'background 0.2s', borderBottom: '1px solid var(--input-border)'
    };

    const iconBoxStyle = (bgColor: string) => ({
        width: '40px', height: '40px', borderRadius: '12px',
        backgroundColor: bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
    });

    return (
        <div>
            
            {/* Preferences Group */}
            <h3 style={{
                fontSize: '0.78rem', fontWeight: '800', color: 'var(--text-secondary)',
                letterSpacing: '0.08em', textTransform: 'uppercase', padding: '20px 20px 8px'
            }}>Preferences</h3>

            <div style={itemStyle}>
                <div style={iconBoxStyle('rgba(91,92,255,0.1)')}>
                    <Bell size={20} color="#5B5CFF" />
                </div>
                <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '800', fontSize: '0.92rem', color: 'var(--text-primary)' }}>Push Notifications</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '500', marginTop: '1px' }}>Receive updates about your circles</div>
                </div>
                <button onClick={() => setPush(!push)} style={toggleStyle(push)}>
                    <div style={circleStyle(push)} />
                </button>
            </div>

            <div style={itemStyle}>
                <div style={iconBoxStyle('rgba(52,199,89,0.1)')}>
                    <MessageSquare size={20} color="#34C759" />
                </div>
                <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '800', fontSize: '0.92rem', color: 'var(--text-primary)' }}>WhatsApp Reminders</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '500', marginTop: '1px' }}>Get payment alerts on WhatsApp</div>
                </div>
                <button onClick={() => setWhatsapp(!whatsapp)} style={toggleStyle(whatsapp)}>
                    <div style={circleStyle(whatsapp)} />
                </button>
            </div>

            <div style={itemStyle}>
                <div style={iconBoxStyle('rgba(212,255,0,0.15)')}>
                    <Globe size={20} color="var(--primary-accent)" />
                </div>
                <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '800', fontSize: '0.92rem', color: 'var(--text-primary)' }}>Language</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '700' }}>English (US)</span>
                    <ChevronRight size={16} color="var(--text-muted)" />
                </div>
            </div>

            {/* Security Group */}
            <h3 style={{
                fontSize: '0.78rem', fontWeight: '800', color: 'var(--text-secondary)',
                letterSpacing: '0.08em', textTransform: 'uppercase', padding: '24px 20px 8px'
            }}>Security</h3>

            <div style={itemStyle}>
                <div style={iconBoxStyle('rgba(168,85,247,0.1)')}>
                    <Fingerprint size={20} color="#A855F7" />
                </div>
                <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '800', fontSize: '0.92rem', color: 'var(--text-primary)' }}>Biometric Lock</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '500', marginTop: '1px' }}>Require FaceID to open app</div>
                </div>
                <button onClick={() => setBiometric(!biometric)} style={toggleStyle(biometric)}>
                    <div style={circleStyle(biometric)} />
                </button>
            </div>

            <div style={itemStyle}>
                <div style={iconBoxStyle('rgba(100,116,139,0.1)')}>
                    <Lock size={20} color="var(--text-secondary)" />
                </div>
                <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '800', fontSize: '0.92rem', color: 'var(--text-primary)' }}>Change Password</div>
                </div>
                <ChevronRight size={16} color="var(--text-muted)" />
            </div>

            {/* Support Group */}
            <h3 style={{
                fontSize: '0.78rem', fontWeight: '800', color: 'var(--text-secondary)',
                letterSpacing: '0.08em', textTransform: 'uppercase', padding: '24px 20px 8px'
            }}>Support</h3>

            <div style={itemStyle}>
                <div style={iconBoxStyle('rgba(249,115,22,0.1)')}>
                    <HelpCircle size={20} color="#F97316" />
                </div>
                <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '800', fontSize: '0.92rem', color: 'var(--text-primary)' }}>Help & Support</div>
                </div>
                <ChevronRight size={16} color="var(--text-muted)" />
            </div>

            <div style={itemStyle}>
                <div style={iconBoxStyle('rgba(100,116,139,0.1)')}>
                    <FileText size={20} color="var(--text-secondary)" />
                </div>
                <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '800', fontSize: '0.92rem', color: 'var(--text-primary)' }}>Terms & Privacy Policy</div>
                </div>
                <ChevronRight size={16} color="var(--text-muted)" />
            </div>

            {/* Logout Action */}
            <div style={{ padding: '32px 20px 12px' }}>
                <button onClick={handleLogout} style={{
                    width: '100%', padding: '14px', borderRadius: '16px', border: '1.5px solid var(--input-border)',
                    backgroundColor: 'transparent', color: '#FF3B30', fontWeight: '800', fontSize: '0.95rem',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    fontFamily: 'var(--font-family)', transition: 'all 0.2s'
                }}>
                    <LogOut size={18} />
                    <span>Logout</span>
                </button>
                <p style={{ textAlign: 'center', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '16px', fontWeight: '600' }}>
                    Version 2.4.0 (Build 1024)
                </p>
            </div>

        </div>
    );
}

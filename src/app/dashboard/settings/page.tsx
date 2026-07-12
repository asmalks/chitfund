import Link from "next/link";
import { ArrowLeft, User, Bell, MessageSquare, Language, Shield, Lock, HelpCircle, FileText, LogOut, ChevronRight } from "lucide-react";
import SettingsClient from "./SettingsClient";

export default async function SettingsPage() {
    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-color)', fontFamily: 'var(--font-family)' }}>
            
            {/* Header */}
            <div style={{
                background: 'linear-gradient(160deg, #1A1A1A 0%, #111 100%)',
                padding: '48px 20px 28px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Link href="/dashboard" style={{
                        width: '40px', height: '40px', borderRadius: '50%',
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff'
                    }}>
                        <ArrowLeft size={20} strokeWidth={2.5} />
                    </Link>
                    <div>
                        <h1 style={{ fontSize: '1.4rem', fontWeight: '900', color: '#fff', letterSpacing: '-0.02em', marginBottom: 0 }}>
                            Settings
                        </h1>
                    </div>
                </div>
            </div>

            {/* Profile Info */}
            <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', borderBottom: '1px solid var(--input-border)' }}>
                <div style={{
                    width: '80px', height: '80px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #5B5CFF 0%, #FF9F0A 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: '12px', boxShadow: 'var(--shadow-sm)'
                }}>
                    <User size={36} color="#fff" />
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>Alex Johnson</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px', fontWeight: '600' }}>alex.j@example.com</p>
            </div>

            {/* Interactive settings list */}
            <div style={{ paddingBottom: '120px' }}>
                <SettingsClient />
            </div>

        </div>
    );
}

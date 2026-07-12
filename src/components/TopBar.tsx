"use client";

import { Bell, User } from "lucide-react";
import Link from "next/link";

export default function TopBar({ userName }: { userName?: string }) {
    // Use a fallback initial if name is not available
    const initial = userName ? userName.charAt(0).toUpperCase() : <User size={18} />;

    return (
        <header style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '16px 24px', backgroundColor: 'var(--bg-color)', /* Blends with bg */
            position: 'sticky', top: 0, zIndex: 40
        }}>
            <div className="flex-row gap-sm">
                <Link href="/profile" style={{
                    width: '44px', height: '44px', borderRadius: '50%',
                    backgroundColor: 'var(--primary-accent)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    color: 'var(--secondary-accent)', fontWeight: '800',
                    fontSize: '1.2rem', boxShadow: 'var(--shadow-sm)'
                }}>
                    {initial}
                </Link>
                <div className="flex-col">
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Welcome back</span>
                    <span style={{ fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>{userName || 'User'}</span>
                </div>
            </div>

            <Link href="/notifications" style={{
                position: 'relative',
                backgroundColor: 'var(--card-bg)',
                width: '44px', height: '44px', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: 'var(--shadow-sm)', color: 'var(--text-primary)'
            }}>
                <Bell size={20} strokeWidth={2.5} />
                <span style={{
                    position: 'absolute', top: 12, right: 12,
                    width: '8px', height: '8px', borderRadius: '50%',
                    backgroundColor: 'var(--danger)',
                    border: '2px solid var(--card-bg)'
                }}></span>
            </Link>
        </header>
    );
}

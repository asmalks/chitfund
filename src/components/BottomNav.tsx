"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Wallet, Users, Calendar, User } from "lucide-react";

export default function BottomNav() {
    const pathname = usePathname();

    const tabs = [
        { name: "Home", href: "/dashboard", icon: LayoutDashboard },
        { name: "My Savings", href: "/dashboard/savings", icon: Wallet },
        { name: "Groups", href: "/dashboard/groups", icon: Users },
        { name: "Calendar", href: "/dashboard/calendar", icon: Calendar },
        { name: "Profile", href: "/dashboard/settings", icon: User },
    ];

    return (
        <nav style={{
            position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
            backgroundColor: 'var(--secondary-accent)', // Jet black
            borderRadius: 'var(--btn-radius)', // Pill shape
            padding: '12px 24px',
            display: 'flex', justifyContent: 'space-between',
            zIndex: 50,
            width: 'calc(100% - 48px)', // Float with margins
            maxWidth: '400px', // Don't let it stretch too wide on tablets
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
        }}>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {tabs.map((tab) => {
                    const isActive = pathname === tab.href || (tab.href !== "/dashboard" && pathname.startsWith(tab.href));
                    const Icon = tab.icon;

                    return (
                        <Link key={tab.name} href={tab.href} style={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                            color: isActive ? 'var(--primary-accent)' : 'var(--text-muted)'
                        }}>
                            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                            <span style={{ fontSize: '0.65rem', fontWeight: isActive ? '700' : '500', opacity: isActive ? 1 : 0.7 }}>{tab.name}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}

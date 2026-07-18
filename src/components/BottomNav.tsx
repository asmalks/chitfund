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
        <nav className="bottom-nav">
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {tabs.map((tab) => {
                    const isActive = pathname === tab.href || (tab.href !== "/dashboard" && pathname.startsWith(tab.href));
                    const Icon = tab.icon;

                    return (
                        <Link key={tab.name} href={tab.href} className={`bottom-nav-link ${isActive ? 'active' : ''}`}>
                            <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                            <span style={{ fontSize: '0.65rem', fontWeight: isActive ? '700' : '600' }}>{tab.name}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}

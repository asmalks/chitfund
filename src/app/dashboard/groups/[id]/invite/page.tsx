import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, QrCode, Copy, Send, Share2, Coins } from "lucide-react";
import InviteClient from "./InviteClient";

// Mock data for dev bypass
const MOCK_GROUPS_MAP: Record<string, any> = {
    'mock-1': { id: 'mock-1', name: 'Family Savings Circle', monthly_amount: 5000 },
    'mock-2': { id: 'mock-2', name: 'Office ROSCA 2026', monthly_amount: 2000 },
    'mock-3': { id: 'mock-3', name: 'Friends Holiday Fund', monthly_amount: 3000 }
};

export default async function InvitePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const isDev = process.env.NEXT_PUBLIC_DEV_BYPASS === 'true';

    let group = null;

    if (isDev) {
        group = MOCK_GROUPS_MAP[id] || MOCK_GROUPS_MAP['mock-1'];
    } else {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) redirect("/login");

        const { data } = await supabase.from('groups').select('*').eq('id', id).single();
        group = data;
    }

    if (!group) {
        return (
            <div className="container" style={{ textAlign: 'center', marginTop: '100px' }}>
                <h2 className="heading-2">Group Not Found</h2>
                <Link href="/dashboard/groups" className="btn btn-secondary mt-md">Back to Groups</Link>
            </div>
        );
    }

    const inviteLink = `rosca.app/join/${group.id}`;

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-color)', fontFamily: 'var(--font-family)' }}>
            
            {/* Header */}
            <div style={{
                background: 'linear-gradient(160deg, #1A1A1A 0%, #111 100%)',
                padding: '48px 20px 28px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Link href={`/dashboard/groups/${id}`} style={{
                        width: '40px', height: '40px', borderRadius: '50%',
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff'
                    }}>
                        <ArrowLeft size={20} strokeWidth={2.5} />
                    </Link>
                    <div>
                        <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', fontWeight: '700', letterSpacing: '0.06em' }}>
                            {group.name}
                        </div>
                        <h1 style={{ fontSize: '1.4rem', fontWeight: '900', color: '#fff', letterSpacing: '-0.02em', marginBottom: 0 }}>
                            Invite Members
                        </h1>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
                
                {/* QR Code Container */}
                <div style={{
                    backgroundColor: 'var(--card-bg)', borderRadius: '24px', padding: '32px',
                    boxShadow: 'var(--shadow-sm)', border: '1px solid rgba(0,0,0,0.04)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px',
                    width: '100%', maxWidth: '320px', position: 'relative'
                }}>
                    {/* Decorative Corner Borders */}
                    <div style={{ position: 'absolute', top: 12, left: 12, width: '20px', height: '20px', borderTop: '3px solid #D4FF00', borderLeft: '3px solid #D4FF00', borderTopLeftRadius: '6px' }} />
                    <div style={{ position: 'absolute', top: 12, right: 12, width: '20px', height: '20px', borderTop: '3px solid #D4FF00', borderRight: '3px solid #D4FF00', borderTopRightRadius: '6px' }} />
                    <div style={{ position: 'absolute', bottom: 12, left: 12, width: '20px', height: '20px', borderBottom: '3px solid #D4FF00', borderLeft: '3px solid #D4FF00', borderBottomLeftRadius: '6px' }} />
                    <div style={{ position: 'absolute', bottom: 12, right: 12, width: '20px', height: '20px', borderBottom: '3px solid #D4FF00', borderRight: '3px solid #D4FF00', borderBottomRightRadius: '6px' }} />
                    
                    <div style={{
                        width: '180px', height: '180px', backgroundColor: '#fff', borderRadius: '12px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px'
                    }}>
                        {/* Generates a nice visual representation of QR Code */}
                        <QrCode size={148} color="#1A1A1A" strokeWidth={1.5} />
                    </div>
                    
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontWeight: '800', fontSize: '1rem', color: 'var(--text-primary)' }}>Scan to Join</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px', fontWeight: '500' }}>
                            Scan QR code with your phone camera to join
                        </div>
                    </div>
                </div>

                {/* Amount Pill */}
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '8px 16px', borderRadius: '999px',
                    backgroundColor: 'rgba(212,255,0,0.1)', border: '1px solid rgba(212,255,0,0.2)',
                }}>
                    <Coins size={16} color="var(--primary-accent)" />
                    <span style={{ fontSize: '0.82rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                        ₹{group.monthly_amount.toLocaleString('en-IN')} Monthly Contribution
                    </span>
                </div>

                <InviteClient inviteLink={inviteLink} />

            </div>
        </div>
    );
}

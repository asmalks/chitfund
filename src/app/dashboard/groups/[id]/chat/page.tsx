import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MoreVertical, Megaphone, Send, Image, Smile } from "lucide-react";
import ChatClient from "./ChatClient";

// Mock data for dev bypass
const MOCK_GROUPS_MAP: Record<string, any> = {
    'mock-1': { id: 'mock-1', name: 'Family Savings Circle', members_count: 12 },
    'mock-2': { id: 'mock-2', name: 'Office ROSCA 2026', members_count: 10 }
};

export default async function ChatPage({ params }: { params: Promise<{ id: string }> }) {
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

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-color)', fontFamily: 'var(--font-family)', display: 'flex', flexDirection: 'column' }}>
            
            {/* Header */}
            <div style={{
                background: 'linear-gradient(160deg, #1A1A1A 0%, #111 100%)',
                padding: '48px 20px 18px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                borderBottom: '1px solid var(--input-border)', shrink: 0
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
                        <h1 style={{ fontSize: '1.2rem', fontWeight: '950', color: '#fff', letterSpacing: '-0.02em', marginBottom: '2px' }}>
                            {group.name}
                        </h1>
                        <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', fontWeight: '700' }}>
                            {group.members_count || group.max_members || 12} Members · Active
                        </div>
                    </div>
                </div>
                <button style={{
                    width: '40px', height: '40px', borderRadius: '50%',
                    backgroundColor: 'rgba(255,255,255,0.1)', border: 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer'
                }}>
                    <MoreVertical size={20} />
                </button>
            </div>

            {/* Pinned Announcement */}
            <div style={{
                backgroundColor: 'var(--card-bg)', borderBottom: '1px solid var(--input-border)',
                padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer'
            }}>
                <div style={{
                    width: '36px', height: '36px', borderRadius: '10px',
                    backgroundColor: 'rgba(91,92,255,0.1)', color: '#5B5CFF',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                    <Megaphone size={18} strokeWidth={2.5} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontWeight: '800', fontSize: '0.85rem' }}>New Payment Schedule</span>
                        <span style={{
                            padding: '2px 6px', borderRadius: '4px', fontSize: '0.62rem', fontWeight: '900',
                            backgroundColor: 'rgba(255,159,10,0.12)', color: '#FF9F0A', textTransform: 'uppercase', letterSpacing: '0.04em'
                        }}>Pinned</span>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '2px' }}>
                        Admin pinned this update: "Please complete M4 draw payments by Friday."
                    </p>
                </div>
            </div>

            {/* Chat Client */}
            <ChatClient groupId={id} />

        </div>
    );
}

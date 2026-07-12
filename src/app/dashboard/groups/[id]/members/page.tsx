import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Users, ShieldCheck, Clock, UserCheck, UserMinus, Search, Filter } from "lucide-react";
import MembersClient from "./MembersClient";

// Mock data for dev bypass
const MOCK_GROUPS_MAP: Record<string, any> = {
    'mock-1': { id: 'mock-1', name: 'Family Savings Circle' },
    'mock-2': { id: 'mock-2', name: 'Office ROSCA 2026' }
};

const MOCK_PENDING = [
    { id: 'req-1', user_id: 'sarah-jones', users: { name: 'Sarah Jones', phone: '+918888888888' }, kyc_status: 'verified', time: '2 hours ago' },
    { id: 'req-2', user_id: 'michael-chen', users: { name: 'Michael Chen', phone: '+917777777777' }, kyc_status: 'pending', time: '5 hours ago' }
];

const MOCK_APPROVED = [
    { id: 'm-1', user_id: 'dev-user-mock', status: 'approved', users: { name: 'Demo User (Admin)', phone: '+919999999999' }, paid: true, kyc_status: 'verified' },
    { id: 'm-2', user_id: 'emily-davis', status: 'approved', users: { name: 'Emily Davis', phone: '+916666666666' }, paid: true, kyc_status: 'verified' },
    { id: 'm-3', user_id: 'james-wilson', status: 'approved', users: { name: 'James Wilson', phone: '+915555555555' }, paid: false, kyc_status: 'verified' },
    { id: 'm-4', user_id: 'linda-taylor', status: 'approved', users: { name: 'Linda Taylor', phone: '+914444444444' }, paid: true, kyc_status: 'none' }
];

export default async function MembersPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const isDev = process.env.NEXT_PUBLIC_DEV_BYPASS === 'true';

    let group = null;
    let pending = [];
    let approved = [];

    if (isDev) {
        group = MOCK_GROUPS_MAP[id] || MOCK_GROUPS_MAP['mock-1'];
        pending = MOCK_PENDING;
        approved = MOCK_APPROVED;
    } else {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) redirect("/login");

        const { data } = await supabase.from('groups').select('*').eq('id', id).single();
        group = data;

        // Fetch members
        const { data: allMembers } = await supabase.from('group_members').select('*, users(*)').eq('group_id', id);
        pending = allMembers?.filter(m => m.status === 'pending') || [];
        approved = allMembers?.filter(m => m.status === 'approved') || [];
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
                            Members Management
                        </h1>
                    </div>
                </div>
            </div>

            {/* Client Interactivity */}
            <div style={{ padding: '20px', paddingBottom: '120px' }}>
                <MembersClient groupId={id} initialPending={pending} initialApproved={approved} />
            </div>

        </div>
    );
}

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, HelpCircle } from "lucide-react";
import WinnerClient from "./WinnerClient";

// Mock data for dev bypass
const MOCK_GROUPS_MAP: Record<string, any> = {
    'mock-1': { id: 'mock-1', name: 'Family Savings Circle', monthly_amount: 5000, max_members: 12 },
    'mock-2': { id: 'mock-2', name: 'Office ROSCA 2026', monthly_amount: 2000, max_members: 10 }
};

const MOCK_ELIGIBLE = [
    { id: 'm-1', name: 'Alex Johnson', users: { name: 'Alex Johnson' }, status: 'paid', prior_wins: 0, avatar: 'AJ' },
    { id: 'm-2', name: 'Sarah Miller', users: { name: 'Sarah Miller' }, status: 'paid', prior_wins: 0, avatar: 'SM' },
    { id: 'm-3', name: 'Michael Chen', users: { name: 'Michael Chen' }, status: 'paid', prior_wins: 0, avatar: 'MC' },
    { id: 'm-4', name: 'Emily Davis', users: { name: 'Emily Davis' }, status: 'paid', prior_wins: 0, avatar: 'ED' },
    { id: 'm-5', name: 'James Wilson', users: { name: 'James Wilson' }, status: 'paid', prior_wins: 0, avatar: 'JW' }
];

export default async function WinnerPage({ params }: { params: Promise<{ id: string, cycle: string }> }) {
    const { id, cycle } = await params;
    const isDev = process.env.NEXT_PUBLIC_DEV_BYPASS === 'true';

    let group = null;
    let eligible = [];

    if (isDev) {
        group = MOCK_GROUPS_MAP[id] || MOCK_GROUPS_MAP['mock-1'];
        eligible = MOCK_ELIGIBLE;
    } else {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) redirect("/login");

        const { data } = await supabase.from('groups').select('*').eq('id', id).single();
        group = data;

        // Fetch eligible members (approved and paid this cycle)
        const { data: allMembers } = await supabase.from('group_members').select('*, users(*)').eq('group_id', id);
        eligible = allMembers?.filter(m => m.status === 'approved') || [];
    }

    if (!group) {
        return (
            <div className="container" style={{ textAlign: 'center', marginTop: '100px' }}>
                <h2 className="heading-2">Group Not Found</h2>
                <Link href="/dashboard/groups" className="btn btn-secondary mt-md">Back to Groups</Link>
            </div>
        );
    }

    const totalPot = group.monthly_amount * group.max_members;

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-color)', fontFamily: 'var(--font-family)' }}>
            
            {/* Header */}
            <div style={{
                background: 'linear-gradient(160deg, #1A1A1A 0%, #111 100%)',
                padding: '48px 20px 28px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
                                Cycle #{cycle} Draw
                            </h1>
                        </div>
                    </div>
                    <button style={{
                        width: '40px', height: '40px', borderRadius: '50%',
                        backgroundColor: 'rgba(255,255,255,0.1)', border: 'none',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer'
                    }}>
                        <HelpCircle size={20} />
                    </button>
                </div>
            </div>

            {/* Winner Draw Client Content */}
            <div style={{ padding: '20px', paddingBottom: '120px' }}>
                <WinnerClient groupId={id} cycle={parseInt(cycle)} totalPot={totalPot} initialEligible={eligible} />
            </div>

        </div>
    );
}

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import JoinRequestForm from "./JoinRequestForm";
import GroupDashboardClient from "./GroupDashboardClient";

// Mock data for dev bypass mode
const MOCK_GROUPS_MAP: Record<string, any> = {
    'mock-1': {
        id: 'mock-1',
        name: 'Family Savings Circle',
        status: 'active',
        monthly_amount: 5000,
        max_members: 12,
        duration_months: 12,
        admin_id: 'dev-user-mock',
        start_date: new Date().toISOString()
    },
    'mock-2': {
        id: 'mock-2',
        name: 'Office ROSCA 2026',
        status: 'active',
        monthly_amount: 2000,
        max_members: 10,
        duration_months: 10,
        admin_id: 'some-other-admin',
        start_date: new Date().toISOString()
    },
    'mock-3': {
        id: 'mock-3',
        name: 'Friends Holiday Fund',
        status: 'upcoming',
        monthly_amount: 3000,
        max_members: 8,
        duration_months: 8,
        admin_id: 'some-other-admin',
        start_date: new Date().toISOString()
    }
};

const MOCK_MEMBERS = [
    { id: 'm-1', group_id: 'mock-1', user_id: 'dev-user-mock', status: 'approved', users: { name: 'Demo User', phone: '+919999999999' } },
    { id: 'm-2', group_id: 'mock-1', user_id: 'u-2', status: 'approved', users: { name: 'Sarah Jones', phone: '+918888888888' } },
    { id: 'm-3', group_id: 'mock-1', user_id: 'u-3', status: 'approved', users: { name: 'Michael Chen', phone: '+917777777777' } },
    { id: 'm-4', group_id: 'mock-1', user_id: 'u-4', status: 'approved', users: { name: 'Emily Davis', phone: '+916666666666' } }
];

const MOCK_PAYMENTS = [
    { id: 'p-1', group_id: 'mock-1', user_id: 'dev-user-mock', cycle_month: 1, amount: 5000, status: 'paid', payment_method: 'upi', paid_at: new Date().toISOString() },
    { id: 'p-2', group_id: 'mock-1', user_id: 'u-2', cycle_month: 1, amount: 5000, status: 'paid', payment_method: 'upi', paid_at: new Date().toISOString() },
    { id: 'p-3', group_id: 'mock-1', user_id: 'u-3', cycle_month: 1, amount: 5000, status: 'paid', payment_method: 'upi', paid_at: new Date().toISOString() },
    { id: 'p-4', group_id: 'mock-1', user_id: 'dev-user-mock', cycle_month: 2, amount: 5000, status: 'paid', payment_method: 'upi', paid_at: new Date().toISOString() }
];

export default async function GroupPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const isDev = process.env.NEXT_PUBLIC_DEV_BYPASS === 'true';

    if (isDev) {
        const group = MOCK_GROUPS_MAP[id] || MOCK_GROUPS_MAP['mock-1'];
        const userId = 'dev-user-mock';
        const isAdmin = group.admin_id === userId;
        const membership = { status: 'approved', user_id: userId };
        
        return (
            <GroupDashboardClient 
                group={group} 
                isAdmin={isAdmin} 
                membership={membership as any} 
                initialMembers={MOCK_MEMBERS} 
                initialPayments={MOCK_PAYMENTS} 
            />
        );
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");
    const userId = user.id;

    // Fetch group details
    const { data: group, error: groupError } = await supabase
        .from('groups')
        .select('*')
        .eq('id', id)
        .single();

    if (!group || groupError) {
        console.error('Group fetch error:', groupError, 'ID:', id);
        return (
            <div className="container" style={{ textAlign: 'center', marginTop: '100px' }}>
                <h2 className="heading-2">Group Not Found</h2>
                <p style={{ color: 'var(--text-secondary)', margin: '16px 0' }}>{groupError?.message || 'The group may have been deleted.'}</p>
                <Link href="/dashboard/groups" className="btn btn-secondary mt-md">Back to Groups</Link>
            </div>
        );
    }

    // Check membership status
    const { data: membership } = await supabase
        .from('group_members')
        .select('*')
        .eq('group_id', group.id)
        .eq('user_id', userId)
        .single();

    const isAdmin = group.admin_id === userId;
    const isApprovedMember = membership?.status === 'approved';

    if (!isAdmin && !isApprovedMember) {
        return (
            <div className="container" style={{ paddingBottom: '120px' }}>
                <div className="flex-row gap-sm mb-md mt-md">
                    <Link href="/dashboard/groups" style={{ color: 'var(--text-primary)' }}>
                        <ArrowLeft size={24} />
                    </Link>
                    <h1 className="heading-1" style={{ marginBottom: 0 }}>Join Group</h1>
                </div>

                <div className="card" style={{ textAlign: 'center' }}>
                    <h2 className="heading-2" style={{ color: 'var(--text-light)' }}>{group.name}</h2>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', margin: '24px 0', padding: '16px', backgroundColor: 'var(--card-bg-light)', borderRadius: '12px' }}>
                        <div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Pot Size</div>
                            <div style={{ fontWeight: '700', fontSize: '1.2rem', color: 'var(--primary-accent)' }}>₹{group.monthly_amount * group.max_members}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Monthly</div>
                            <div style={{ fontWeight: '700', fontSize: '1.2rem' }}>₹{group.monthly_amount}</div>
                        </div>
                    </div>

                    <JoinRequestForm groupId={group.id} membershipStatus={membership?.status} />
                </div>
            </div>
        );
    }

    // Fetch All Members
    const { data: members } = await supabase
        .from('group_members')
        .select('*, users(name, phone)')
        .eq('group_id', group.id);

    // Fetch All Payments
    const { data: payments } = await supabase
        .from('payments')
        .select('*')
        .eq('group_id', group.id);

    return <GroupDashboardClient group={group} isAdmin={isAdmin} membership={membership} initialMembers={members || []} initialPayments={payments || []} />;
}

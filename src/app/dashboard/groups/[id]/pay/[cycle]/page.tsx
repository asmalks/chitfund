import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import PaymentActionClient from "./PaymentActionClient";

// Mock data for dev bypass
const MOCK_GROUPS_MAP: Record<string, any> = {
    'mock-1': { id: 'mock-1', name: 'Family Savings Circle', monthly_amount: 5000 },
    'mock-2': { id: 'mock-2', name: 'Office ROSCA 2026', monthly_amount: 2000 },
    'mock-3': { id: 'mock-3', name: 'Friends Holiday Fund', monthly_amount: 3000 }
};

export default async function PaymentPage({ params }: { params: Promise<{ id: string, cycle: string }> }) {
    const { id, cycle } = await params;
    const isDev = process.env.NEXT_PUBLIC_DEV_BYPASS === 'true';

    if (isDev) {
        const group = MOCK_GROUPS_MAP[id] || MOCK_GROUPS_MAP['mock-1'];
        return (
            <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-color)' }}>
                {/* Header */}
                <div style={{
                    background: 'linear-gradient(160deg, #1A1A1A 0%, #111 100%)',
                    padding: '48px 20px 28px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
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
                                Make Payment
                            </h1>
                        </div>
                    </div>
                </div>

                {/* Payment Client */}
                <div style={{ padding: '20px', paddingBottom: '120px' }}>
                    <PaymentActionClient groupId={id} cycleMonth={parseInt(cycle)} amount={group.monthly_amount} />
                </div>
            </div>
        );
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    const { data: group } = await supabase.from('groups').select('*').eq('id', id).single();

    if (!group) return <div className="container"><p>Group not found.</p></div>;

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-color)' }}>
            {/* Header */}
            <div style={{
                background: 'linear-gradient(160deg, #1A1A1A 0%, #111 100%)',
                padding: '48px 20px 28px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
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
                            Make Payment
                        </h1>
                    </div>
                </div>
            </div>

            {/* Payment Client */}
            <div style={{ padding: '20px', paddingBottom: '120px' }}>
                <PaymentActionClient groupId={id} cycleMonth={parseInt(cycle)} amount={group.monthly_amount} />
            </div>
        </div>
    );
}

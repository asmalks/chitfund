"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Trophy } from "lucide-react";

export default function PayoutSelectorClient({ groupId, cycleMonth, amount, members }: any) {
    const [selectedUser, setSelectedUser] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleAllocate = async () => {
        if (!selectedUser) return;
        setLoading(true);

        try {
            const { error } = await supabase
                .from('payouts')
                .insert({
                    group_id: groupId,
                    user_id: selectedUser,
                    cycle_month: cycleMonth,
                    amount: amount,
                    status: 'completed',
                    completed_at: new Date().toISOString()
                });

            if (error) throw error;

            router.refresh(); // Will flip the server component to "Completed" view
        } catch (err: any) {
            alert(err.message || "Failed to allocate payout");
            setLoading(false);
        }
    };

    return (
        <>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '16px', fontSize: '0.95rem', fontWeight: '600' }}>Select which member receives the pot for this cycle:</p>

            <div className="flex-col gap-sm" style={{ marginBottom: '32px' }}>
                {members.map((m: any) => (
                    <button
                        key={m.id}
                        onClick={() => setSelectedUser(m.user_id)}
                        style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px',
                            backgroundColor: selectedUser === m.user_id ? 'var(--bg-color)' : 'var(--card-bg)',
                            borderRadius: 'var(--border-radius-sm)', border: selectedUser === m.user_id ? '2px solid var(--secondary-accent)' : '2px solid var(--input-border)',
                            cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', boxShadow: selectedUser === m.user_id ? 'none' : 'var(--shadow-sm)'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: selectedUser === m.user_id ? 'var(--secondary-accent)' : 'var(--input-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: selectedUser === m.user_id ? '#fff' : 'var(--text-primary)', fontWeight: '800' }}>
                                {(m.users?.name || "U").charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <div style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '1rem' }}>{m.users?.name || m.users?.phone}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '500' }}>{m.users?.phone}</div>
                            </div>
                        </div>
                        {selectedUser === m.user_id && <Trophy color="var(--primary-accent)" size={24} style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }} />}
                    </button>
                ))}
            </div>

            <button onClick={handleAllocate} disabled={loading || !selectedUser} className="btn btn-secondary">
                {loading ? "Allocating..." : "Confirm & Record Payout"}
            </button>
        </>
    );
}

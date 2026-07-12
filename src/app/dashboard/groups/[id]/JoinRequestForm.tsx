"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Send, CheckCircle } from "lucide-react";

export default function JoinRequestForm({ groupId, membershipStatus }: { groupId: string, membershipStatus?: string }) {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<string | undefined>(membershipStatus);
    const supabase = createClient();

    const handleRequest = async () => {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
            const { error } = await supabase
                .from('group_members')
                .insert({
                    group_id: groupId,
                    user_id: user.id,
                    status: 'pending'
                });

            if (!error) {
                setStatus('pending');
            }
        }
        setLoading(false);
    };

    if (status === 'pending') {
        return (
            <div style={{ padding: '24px', backgroundColor: 'rgba(255, 204, 0, 0.1)', borderRadius: '12px', border: '1px solid var(--warning)' }}>
                <CheckCircle size={32} color="var(--warning)" style={{ margin: '0 auto 16px' }} />
                <h3 style={{ color: 'var(--warning)', marginBottom: '8px' }}>Request Sent</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Waiting for admin approval to join the ledger.</p>
            </div>
        );
    }

    if (status === 'rejected') {
        return (
            <div style={{ padding: '24px', backgroundColor: 'rgba(255, 59, 48, 0.1)', borderRadius: '12px', border: '1px solid var(--danger)' }}>
                <h3 style={{ color: 'var(--danger)', marginBottom: '8px' }}>Request Declined</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>The admin didn't approve your request.</p>
            </div>
        );
    }

    return (
        <button onClick={handleRequest} disabled={loading} className="btn btn-primary" style={{ width: '100%' }}>
            {loading ? "Sending Request..." : "Request to Join"} <Send size={18} style={{ marginLeft: '8px' }} />
        </button>
    );
}

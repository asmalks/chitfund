"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { ArrowRight, User } from "lucide-react";

export default function ProfileSetup() {
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();
    const supabase = createClient();

    // Redirect if profile already set (optional check)
    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (!user) router.push('/login');
        });
    }, [router, supabase]);

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        setLoading(true);
        setError("");

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Not authenticated");

            // Update public.users table
            const { error: updateError } = await supabase
                .from('users')
                .update({ name: name.trim() })
                .eq('id', user.id);

            if (updateError) throw updateError;

            router.push("/dashboard");
        } catch (err: any) {
            setError(err.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container flex-col" style={{ minHeight: '100vh', justifyContent: 'center' }}>
            <div className="card" style={{ padding: '32px 24px' }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{
                        width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--card-bg-light)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
                        color: 'var(--primary-accent)'
                    }}>
                        <User size={28} />
                    </div>
                    <h2 className="heading-2" style={{ color: 'var(--text-light)', marginBottom: '8px' }}>
                        Complete Your Profile
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        What should your ROSCA group members call you?
                    </p>
                </div>

                {error && (
                    <div style={{ backgroundColor: 'var(--danger)', color: '#fff', padding: '12px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '16px', textAlign: 'center' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSaveProfile} className="flex-col gap-md">
                    <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Full Name</label>
                        <input
                            type="text"
                            autoFocus
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Rahul Kumar"
                            style={{
                                width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid var(--card-bg-light)',
                                backgroundColor: 'var(--card-bg-light)', color: 'var(--text-light)', fontSize: '1.1rem',
                                outline: 'none'
                            }}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary mt-md" disabled={loading || name.length < 2}>
                        {loading ? "Saving..." : "Save & Continue"} <ArrowRight size={18} style={{ marginLeft: '8px' }} />
                    </button>
                </form>
            </div>
        </div>
    );
}

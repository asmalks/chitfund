"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { ArrowRight, Lock, Rocket } from "lucide-react";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isSignUp, setIsSignUp] = useState(false);

    const router = useRouter();
    const supabase = createClient();

    // Dev bypass indicator (checks both env and state)
    const isDevEnabled = process.env.NEXT_PUBLIC_DEV_BYPASS === 'true';

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            let result;

            if (isSignUp) {
                result = await supabase.auth.signUp({
                    email: email,
                    password: password,
                });
            } else {
                result = await supabase.auth.signInWithPassword({
                    email: email,
                    password: password,
                });
            }

            if (result.error) throw result.error;

            if (result.data.user) {
                router.push("/dashboard");
                router.refresh();
            }
        } catch (err: any) {
            if (err.message?.includes("Invalid login credentials")) {
                setError("No account found. Try signing up first.");
            } else if (err.message?.includes("User already registered")) {
                setError("Account already exists. Try signing in instead.");
            } else {
                setError(err.message || "Authentication failed. Try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleBypass = () => {
        // Redirect to dashboard immediately using mock bypass
        router.push("/dashboard");
    };

    return (
        <div className="container flex-col" style={{ minHeight: '100vh', justifyContent: 'center' }}>
            <div className="card" style={{ padding: '40px 24px', textAlign: 'center' }}>
                <div style={{ marginBottom: '32px' }}>
                    <div style={{
                        width: '72px', height: '72px', borderRadius: '50%', backgroundColor: 'var(--bg-color)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
                        color: 'var(--secondary-accent)'
                    }}>
                        <Lock size={32} strokeWidth={2.5} />
                    </div>
                    <h2 className="heading-1" style={{ marginBottom: '8px' }}>
                        {isSignUp ? "Create account" : "Welcome back"}
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                        {isSignUp
                            ? "Sign up with email & password to get started."
                            : "Sign in with your email & password."
                        }
                    </p>
                </div>

                {error && (
                    <div style={{ backgroundColor: 'var(--danger)', color: '#fff', padding: '12px', borderRadius: 'var(--border-radius-sm)', fontSize: '0.85rem', marginBottom: '24px' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleAuth} className="flex-col gap-md">
                    <div style={{ textAlign: 'left' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px' }}>Email Address</label>
                        <input
                            type="email"
                            autoFocus
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            style={{
                                width: '100%', padding: '16px', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--input-border)',
                                backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)', fontSize: '1.1rem',
                                outline: 'none', transition: 'border-color 0.2s'
                            }}
                            onFocus={(e) => e.target.style.borderColor = 'var(--secondary-accent)'}
                            onBlur={(e) => e.target.style.borderColor = 'var(--input-border)'}
                            required
                        />
                    </div>
                    <div style={{ textAlign: 'left' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px' }}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Min 6 characters"
                            style={{
                                width: '100%', padding: '16px', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--input-border)',
                                backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)', fontSize: '1.1rem',
                                outline: 'none', transition: 'border-color 0.2s'
                            }}
                            onFocus={(e) => e.target.style.borderColor = 'var(--secondary-accent)'}
                            onBlur={(e) => e.target.style.borderColor = 'var(--input-border)'}
                            minLength={6}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-secondary mt-sm" disabled={loading || !email.includes('@') || password.length < 6}>
                        {loading ? "Please wait..." : (isSignUp ? "Sign Up" : "Sign In")} <ArrowRight size={18} style={{ marginLeft: '8px' }} />
                    </button>
                </form>

                <button type="button" onClick={() => { setIsSignUp(!isSignUp); setError(""); }} style={{
                    background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '20px', cursor: 'pointer', fontWeight: '600'
                }}>
                    {isSignUp ? "Already have an account? Sign In" : "No account? Sign Up"}
                </button>

                {/* Dev Bypass Options */}
                {isDevEnabled && (
                    <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px dashed var(--input-border)' }}>
                        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '12px' }}>
                            DEVELOPMENT BYPASS ACTIVE
                        </p>
                        <button type="button" onClick={handleBypass} style={{
                            width: '100%', padding: '14px', borderRadius: '12px', border: 'none',
                            backgroundColor: 'rgba(212,255,0,0.15)', color: 'var(--primary-accent)',
                            fontWeight: '800', fontSize: '0.9rem', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                            fontFamily: 'var(--font-family)', transition: 'all 0.2s'
                        }}>
                            <Rocket size={16} />
                            <span>Launch in Dev Bypass Mode</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

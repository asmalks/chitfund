"use client";

import { useState } from "react";
import { Copy, Share2, MessageCircle } from "lucide-react";

export default function InviteClient({ inviteLink }: { inviteLink: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(inviteLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleWhatsApp = () => {
        const text = `Join my Savings Circle on ROSCA App! Use this link to sign up: ${inviteLink}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    };

    return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Copy Link Input Bar */}
            <div style={{
                backgroundColor: 'var(--card-bg)', borderRadius: '20px', padding: '18px',
                boxShadow: 'var(--shadow-sm)', border: '1px solid rgba(0,0,0,0.04)',
                width: '100%'
            }}>
                <label style={{
                    display: 'block', fontSize: '0.72rem', color: 'var(--text-secondary)',
                    fontWeight: '800', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px'
                }}>Invite Link</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <div style={{
                        flex: 1, backgroundColor: 'var(--input-bg)', borderRadius: '12px',
                        border: '1px solid var(--input-border)', padding: '12px 14px',
                        fontSize: '0.88rem', color: 'var(--text-primary)', fontWeight: '600',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                    }}>
                        {inviteLink}
                    </div>
                    <button onClick={handleCopy} style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        padding: '0 18px', borderRadius: '12px', border: 'none',
                        backgroundColor: copied ? '#34C759' : '#1A1A1A', color: '#fff',
                        fontWeight: '800', fontSize: '0.85rem', cursor: 'pointer',
                        transition: 'all 0.2s', fontFamily: 'var(--font-family)'
                    }}>
                        <Copy size={16} />
                        <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                </div>
            </div>

            {/* Share Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
                <button onClick={handleWhatsApp} style={{
                    width: '100%', padding: '16px', borderRadius: '16px', border: 'none',
                    backgroundColor: '#25D366', color: '#fff', fontWeight: '800', fontSize: '0.95rem',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                    fontFamily: 'var(--font-family)', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(37,211,102,0.15)'
                }}>
                    <MessageCircle size={20} fill="#fff" stroke="none" />
                    <span>Share via WhatsApp</span>
                </button>

                <button style={{
                    width: '100%', padding: '16px', borderRadius: '16px', border: 'none',
                    backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)', fontWeight: '800', fontSize: '0.95rem',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                    fontFamily: 'var(--font-family)', transition: 'all 0.2s', border: '1px solid rgba(0,0,0,0.04)',
                    boxShadow: 'var(--shadow-sm)'
                }}>
                    <Share2 size={20} />
                    <span>More Options</span>
                </button>
            </div>

            <p style={{ textAlign: 'center', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '8px', lineHeight: 1.4, fontWeight: '500' }}>
                Invitees will need to download the app to join the circle. The invite link will expire in 48 hours.
            </p>
        </div>
    );
}

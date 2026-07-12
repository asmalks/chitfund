"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, MessageCircle, Send } from "lucide-react";

export default function ReminderPreview() {
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    // Mock data for previewing. In production, this would be fetched from DB.
    const targetGroup = "Office ROSCA";
    const dueAmount = 2000;
    const dueDate = "Feb 5";
    const overdueMembersCount = 3;

    const handleSend = () => {
        setLoading(true);
        // Simulate API call to WhatsApp Cloud API or Twilio
        setTimeout(() => {
            setLoading(false);
            setSent(true);
        }, 1500);
    };

    const reminderText = `🔔 *ROSCA Manager Reminder*\n\nHi there! Just a quick reminder that your contribution of *₹${dueAmount}* for *${targetGroup}* is due on *${dueDate}*.\n\nPlease complete your payment via UPI to ensure the pool is ready for this month's winner!`;

    return (
        <div className="container" style={{ paddingBottom: '120px' }}>
            <div className="flex-row gap-sm mb-md mt-md">
                <Link href="/dashboard/groups" style={{ color: 'var(--text-primary)' }}>
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="heading-1" style={{ marginBottom: 0 }}>Send Reminders</h1>
            </div>

            <div className="card mb-md">
                <h2 className="heading-2" style={{ color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MessageCircle color="var(--primary-accent)" /> Message Preview
                </h2>

                <div style={{ backgroundColor: '#ECE5DD', padding: '16px', borderRadius: '12px', color: '#000', margin: '16px 0', fontFamily: 'sans-serif' }}>
                    <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.5, fontSize: '0.95rem' }}>
                        {reminderText}
                    </div>
                    <div style={{ textAlign: 'right', fontSize: '0.7rem', color: '#666', marginTop: '8px' }}>10:42 AM</div>
                </div>

                <div className="flex-between" style={{ padding: '16px', backgroundColor: 'var(--card-bg-light)', borderRadius: '12px', marginBottom: '24px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Target Audience:</span>
                    <span style={{ fontWeight: 'bold' }}><span style={{ color: 'var(--danger)' }}>{overdueMembersCount}</span> Pending Members</span>
                </div>

                {sent ? (
                    <button className="btn btn-secondary" disabled style={{ color: 'var(--success)' }}>
                        Messages Sent Successfully ✓
                    </button>
                ) : (
                    <button onClick={handleSend} disabled={loading} className="btn btn-primary" style={{ backgroundColor: '#25D366', color: '#fff', border: 'none' }}>
                        {loading ? "Sending out via WhatsApp API..." : "Broadcast to Pending Members"} <Send size={18} style={{ marginLeft: '8px' }} />
                    </button>
                )}
            </div>

            <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Pro tip: Upgrade to a <b>Pro</b> subscription to have these sent automatically 3 days before due dates.
            </p>

        </div>
    );
}

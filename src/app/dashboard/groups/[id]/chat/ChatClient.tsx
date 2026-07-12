"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Image, Smile, CheckCheck } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

type Message = {
    id: string;
    senderName: string;
    isAdmin?: boolean;
    isMe: boolean;
    text: string;
    time: string;
    avatarBg?: string;
    attachment?: boolean;
};

const INITIAL_MESSAGES: Message[] = [
    {
        id: 'msg-1',
        senderName: 'Sarah',
        isAdmin: true,
        isMe: false,
        text: 'Hi everyone, just a reminder that the next contribution is due on Friday. Please ensure your wallets are topped up! 💸',
        time: '09:41 AM',
        avatarBg: '#FF9F0A'
    },
    {
        id: 'msg-2',
        senderName: 'Me',
        isMe: true,
        text: "Thanks for the reminder! I've sent mine via UPI.",
        time: '09:42 AM'
    },
    {
        id: 'msg-3',
        senderName: 'John Doe',
        isMe: false,
        text: 'Has anyone else had issues with the bank transfer link? It seems to be loading slowly for me.',
        time: '09:45 AM',
        avatarBg: '#5B5CFF'
    }
];

export default function ChatClient({ groupId }: { groupId: string }) {
    const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
    const [inputText, setInputText] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const supabase = createClient();
    const isDev = process.env.NEXT_PUBLIC_DEV_BYPASS === 'true';

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Fetch messages on mount
    useEffect(() => {
        if (isDev) {
            scrollToBottom();
            return;
        }

        const fetchMessages = async () => {
            try {
                const { data, error } = await supabase
                    .from('group_messages')
                    .select('*, users(name)')
                    .eq('group_id', groupId)
                    .order('created_at', { ascending: true });

                if (error) throw error;

                const { data: { user } } = await supabase.auth.getUser();

                if (data) {
                    const formatted: Message[] = data.map((m: any) => ({
                        id: m.id,
                        senderName: m.user_id === user?.id ? 'Me' : (m.users?.name || 'User'),
                        isMe: m.user_id === user?.id,
                        text: m.text,
                        time: new Date(m.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                    }));
                    setMessages(formatted);
                }
            } catch (err) {
                console.error("Failed to load chat messages from DB:", err);
                // Fall back silently to mock messages
            }
        };

        fetchMessages();

        // Subscribe to real-time updates
        const channel = supabase
            .channel('group_chat_realtime')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'group_messages', filter: `group_id=eq.${groupId}` }, async (payload) => {
                const { data: userData } = await supabase
                    .from('users')
                    .select('name')
                    .eq('id', payload.new.user_id)
                    .single();

                const { data: { user } } = await supabase.auth.getUser();

                const newMsg: Message = {
                    id: payload.new.id,
                    senderName: payload.new.user_id === user?.id ? 'Me' : (userData?.name || 'User'),
                    isMe: payload.new.user_id === user?.id,
                    text: payload.new.text,
                    time: new Date(payload.new.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                };

                setMessages(prev => [...prev, newMsg]);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [groupId, isDev]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!inputText.trim()) return;

        const timestamp = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

        try {
            if (!isDev) {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) throw new Error("Not logged in");

                const { error } = await supabase
                    .from('group_messages')
                    .insert({
                        group_id: groupId,
                        user_id: user.id,
                        text: inputText.trim()
                    });

                if (error) throw error;
            } else {
                // local state update for dev mode
                const newMsg: Message = {
                    id: `msg-${Date.now()}`,
                    senderName: 'Me',
                    isMe: true,
                    text: inputText.trim(),
                    time: timestamp
                };
                setMessages([...messages, newMsg]);
            }

            setInputText("");
        } catch (err) {
            console.error("Failed to send message to DB:", err);
            alert("Could not send message.");
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSend();
    };

    return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            
            {/* Scrollable Messages Area */}
            <div style={{
                flex: 1, overflowY: 'auto', padding: '20px',
                display: 'flex', flexDirection: 'column', gap: '16px',
                backgroundColor: 'var(--bg-color)'
            }}>
                {messages.map(msg => (
                    <div key={msg.id} style={{
                        display: 'flex',
                        justifyContent: msg.isMe ? 'flex-end' : 'flex-start',
                        alignItems: 'flex-end', gap: '8px'
                    }}>
                        {/* Avatar */}
                        {!msg.isMe && (
                            <div style={{
                                width: '32px', height: '32px', borderRadius: '50%',
                                backgroundColor: msg.avatarBg || '#aaa', color: '#fff',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontWeight: '800', fontSize: '0.75rem', flexShrink: 0
                            }}>
                                {msg.senderName.charAt(0).toUpperCase()}
                            </div>
                        )}

                        <div style={{
                            display: 'flex', flexDirection: 'column',
                            alignItems: msg.isMe ? 'flex-end' : 'flex-start',
                            maxWidth: '75%'
                        }}>
                            {/* Sender Info */}
                            {!msg.isMe && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: '4px', marginBottom: '4px' }}>
                                    <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: '700' }}>{msg.senderName}</span>
                                    {msg.isAdmin && (
                                        <span style={{
                                            fontSize: '0.6rem', fontWeight: '900', color: 'var(--primary-accent)',
                                            backgroundColor: 'rgba(212,255,0,0.1)', padding: '2px 6px', borderRadius: '4px'
                                        }}>ADMIN</span>
                                    )}
                                </div>
                            )}

                            {/* Message Bubble */}
                            <div style={{
                                padding: '12px 16px', borderRadius: '18px',
                                borderBottomRightRadius: msg.isMe ? '4px' : '18px',
                                borderBottomLeftRadius: msg.isMe ? '18px' : '4px',
                                backgroundColor: msg.isMe ? '#1A1A1A' : 'var(--card-bg)',
                                color: msg.isMe ? '#fff' : 'var(--text-primary)',
                                boxShadow: 'var(--shadow-sm)',
                                border: msg.isMe ? 'none' : '1px solid rgba(0,0,0,0.04)',
                                wordBreak: 'break-word'
                            }}>
                                <p style={{ fontSize: '0.88rem', lineHeight: 1.4, fontWeight: '500', margin: 0 }}>{msg.text}</p>
                            </div>

                            {/* Time + Status */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px', marginRight: '4px', marginLeft: '4px' }}>
                                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: '600' }}>{msg.time}</span>
                                {msg.isMe && <CheckCheck size={12} color="var(--primary-accent)" />}
                            </div>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Form Bar */}
            <div style={{
                backgroundColor: 'var(--card-bg)', borderTop: '1px solid var(--input-border)',
                padding: '16px 20px 32px', shrink: 0
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button style={{
                        width: '40px', height: '40px', borderRadius: '50%', border: 'none',
                        backgroundColor: 'var(--bg-color)', color: 'var(--text-secondary)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                    }}>
                        <Image size={18} />
                    </button>
                    
                    <div style={{
                        flex: 1, backgroundColor: 'var(--input-bg)', borderRadius: '20px',
                        border: '1.5px solid var(--input-border)', padding: '10px 16px',
                        display: 'flex', alignItems: 'center', gap: '8px'
                    }}>
                        <input
                            type="text" placeholder="Type a message..."
                            value={inputText} onChange={e => setInputText(e.target.value)}
                            onKeyDown={handleKeyDown}
                            style={{
                                border: 'none', outline: 'none', background: 'transparent',
                                width: '100%', color: 'var(--text-primary)', fontSize: '0.88rem',
                                fontWeight: '600', fontFamily: 'var(--font-family)'
                            }}
                        />
                        <button style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}>
                            <Smile size={18} />
                        </button>
                    </div>

                    <button onClick={handleSend} style={{
                        width: '40px', height: '40px', borderRadius: '50%', border: 'none',
                        backgroundColor: '#1A1A1A', color: '#fff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                        transition: 'all 0.2s', boxShadow: 'var(--shadow-sm)'
                    }}>
                        <Send size={16} />
                    </button>
                </div>
            </div>

        </div>
    );
}

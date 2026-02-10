import { useEffect, useRef, useState } from 'react';
import { useMessages } from '../hooks/useMessages';
import { MessageBubble } from './MessageBubble';
import { MessageSquare } from 'lucide-react';
import { getContactId } from '../types';

interface NeuralFeedProps {
    selectedChat: string | null;
}

export const NeuralFeed = ({ selectedChat }: NeuralFeedProps) => {
    const { messages, loading, error } = useMessages();
    const containerRef = useRef<HTMLDivElement>(null);
    const [prevMsgCount, setPrevMsgCount] = useState(0);
    const [isAtBottom, setIsAtBottom] = useState(true);
    const hasInitiallyRendered = useRef(false);

    // Filter messages for selected chat
    const filteredMessages = selectedChat
        ? messages.filter((m) => getContactId(m) === selectedChat)
        : messages;

    // Track if user is at bottom of scroll
    const handleScroll = () => {
        if (containerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
            const atBottom = scrollHeight - scrollTop - clientHeight < 50;
            setIsAtBottom(atBottom);
        }
    };

    // After initial render, scroll to bottom instantly; for new messages, scroll smoothly
    useEffect(() => {
        if (!containerRef.current || filteredMessages.length === 0) return;

        if (!hasInitiallyRendered.current) {
            // First time messages render: instant jump to bottom
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
            hasInitiallyRendered.current = true;
            setPrevMsgCount(filteredMessages.length);
            return;
        }

        const hasNewMessages = filteredMessages.length > prevMsgCount;
        if (hasNewMessages && isAtBottom) {
            containerRef.current.scrollTo({
                top: containerRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }

        setPrevMsgCount(filteredMessages.length);
    }, [filteredMessages.length, isAtBottom, prevMsgCount]);

    if (!selectedChat) {
        return (
            <div className="flex-1 flex items-center justify-center bg-white">
                <div className="text-center">
                    <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6 border border-red-100 shadow-sm">
                        <MessageSquare size={40} className="text-red-500" />
                    </div>
                    <h3 className="text-slate-900 text-2xl font-bold mb-2">CRM Agent</h3>
                    <p className="text-slate-500 text-sm max-w-xs mx-auto">
                        Ready to assist. Select a conversation to manage your outreach.
                    </p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center bg-white">
                <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex-1 flex items-center justify-center bg-white px-4">
                <div className="text-red-600 text-sm font-bold bg-red-50 px-5 py-3 rounded-xl border border-red-200 shadow-sm text-center">
                    ⚠️ {error}
                </div>
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto px-4 py-6 space-y-4"
            style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2364748b' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                backgroundColor: '#f8fafc'
            }}
        >
            {filteredMessages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                    <div className="text-center bg-white/50 backdrop-blur-sm p-8 rounded-3xl border border-slate-200/50">
                        <div className="text-5xl mb-4">✨</div>
                        <p className="text-slate-500 font-medium italic">Start the conversation</p>
                    </div>
                </div>
            ) : (
                filteredMessages.map((msg) => (
                    <MessageBubble key={msg.id || msg.mid} message={msg} />
                ))
            )}
        </div>
    );
};

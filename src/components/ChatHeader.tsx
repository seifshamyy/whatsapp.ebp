import { useState } from 'react';
import { ArrowLeft, MoreVertical, User } from 'lucide-react';

interface ChatHeaderProps {
    contactId: string | null;
    onBack?: () => void;
    showBackButton?: boolean;
    isEnabled?: boolean;
    onToggle?: (enabled: boolean) => void;
}

export const ChatHeader = ({ contactId, onBack, showBackButton, isEnabled = true, onToggle }: ChatHeaderProps) => {
    const [enabled, setEnabled] = useState(isEnabled);

    const handleToggle = () => {
        const newState = !enabled;
        setEnabled(newState);
        onToggle?.(newState);
    };

    if (!contactId) return null;

    return (
        <div
            className="px-2 flex items-center justify-between border-b border-[#25D366]/20 bg-[#0a0a0a] flex-shrink-0"
            style={{
                height: '52px',
                minHeight: '52px',
            }}
        >
            <div className="flex items-center gap-2 min-w-0 flex-1">
                {/* Back Button - Always visible on mobile */}
                {showBackButton && (
                    <button
                        onClick={onBack}
                        className="p-2 -ml-1 rounded-full hover:bg-white/10 text-[#25D366] active:bg-white/20"
                    >
                        <ArrowLeft size={22} />
                    </button>
                )}

                {/* Avatar */}
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#25D366] to-[#128C7E] flex items-center justify-center flex-shrink-0">
                    <User size={18} className="text-black" />
                </div>

                {/* Contact Info */}
                <div className="min-w-0 flex-1">
                    <h2 className="text-white font-medium text-sm truncate">+{contactId}</h2>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
                {/* Toggle Switch */}
                <button
                    onClick={handleToggle}
                    className={`relative w-10 h-5 rounded-full transition-all ${enabled ? 'bg-[#25D366]' : 'bg-zinc-600'
                        }`}
                >
                    <div
                        className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${enabled ? 'left-[22px]' : 'left-0.5'
                            }`}
                    />
                </button>

                <button className="p-2 rounded-full hover:bg-white/10 text-zinc-400">
                    <MoreVertical size={18} />
                </button>
            </div>
        </div>
    );
};

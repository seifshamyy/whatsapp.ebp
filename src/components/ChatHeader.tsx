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
                    className={`relative rounded-full transition-all duration-300 ${enabled ? 'bg-[#25D366]' : 'bg-zinc-600'
                        }`}
                    style={{ width: '44px', height: '24px' }}
                >
                    <div
                        className="absolute rounded-full bg-white transition-all duration-300"
                        style={{
                            width: '20px',
                            height: '20px',
                            top: '2px',
                            left: enabled ? '22px' : '2px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                        }}
                    />
                </button>

                <button className="p-2 rounded-full hover:bg-white/10 text-zinc-400">
                    <MoreVertical size={18} />
                </button>
            </div>
        </div>
    );
};

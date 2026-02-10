import { useState, useEffect } from 'react';
import { ChatSidebar } from './components/ChatSidebar';
import { ChatHeader } from './components/ChatHeader';
import { NeuralFeed } from './components/NeuralFeed';
import { OutboundHub } from './components/OutboundHub';
import { useMessages } from './hooks/useMessages';
import { WhatsAppMessage } from './types';
import { registerServiceWorker } from './lib/pushNotifications';

function App() {
    const [selectedChat, setSelectedChat] = useState<string | null>(null);
    const [showMobileChat, setShowMobileChat] = useState(false);
    const { addLocalMessage, refetch } = useMessages();

    useEffect(() => {
        // Just register the SW on load — permission is requested via user gesture
        registerServiceWorker();
    }, []);

    const handleSelectChat = (contactId: string) => {
        setSelectedChat(contactId);
        setShowMobileChat(true);
    };

    const handleBack = () => {
        setShowMobileChat(false);
        setSelectedChat(null);
    };

    const handleMessageSent = (message: Partial<WhatsAppMessage>) => {
        addLocalMessage(message);
        setTimeout(() => refetch(), 500);
    };

    return (
        <div className="w-full h-full overflow-hidden bg-white">
            {/* 
              Mobile: Sliding container (200vw width)
              Desktop: Normal Flex container (100% width)
            */}
            <div
                className="flex h-full transition-transform duration-300 ease-out md:transform-none md:w-full"
                style={{
                    // On mobile, we need 2 screens width. On desktop, we let CSS handle it (w-full).
                    width: window.innerWidth < 768 ? '200vw' : '100%',
                    transform: window.innerWidth < 768
                        ? (showMobileChat ? 'translateX(-50%)' : 'translateX(0)')
                        : 'none',
                }}
            >
                {/* Sidebar: 50% width on mobile (1 screen), fixed width on desktop */}
                <div className="w-[50%] md:w-80 lg:w-96 h-full flex-shrink-0">
                    <ChatSidebar
                        onSelectChat={handleSelectChat}
                        selectedChat={selectedChat}
                    />
                </div>

                {/* Chat Area: 50% width on mobile (1 screen), flex-1 on desktop */}
                <div className="w-[50%] md:flex-1 h-full flex flex-col bg-white min-w-0">
                    {selectedChat ? (
                        <>
                            <ChatHeader
                                contactId={selectedChat}
                                onBack={handleBack}
                                showBackButton={true}
                            />
                            <NeuralFeed selectedChat={selectedChat} />
                            <OutboundHub recipientId={selectedChat} onMessageSent={handleMessageSent} />
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center bg-white">
                            <div className="text-center px-4">
                                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-red-50 flex items-center justify-center border border-red-100">
                                    <svg viewBox="0 0 24 24" width="40" className="text-red-500" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                    </svg>
                                </div>
                                <h2 className="text-slate-900 text-2xl font-bold mb-2">CRM Agent</h2>
                                <p className="text-slate-500 text-sm">Select a conversation to get started</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default App;

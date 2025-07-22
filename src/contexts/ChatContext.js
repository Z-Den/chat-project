// ChatContext.js
import { createContext, useContext, useState, useEffect } from 'react';

const ChatContext = createContext();

export function ChatProvider({ children }) {
    const [chats, setChats] = useState(() => {
        const savedChats = localStorage.getItem('chats');
        return savedChats ? JSON.parse(savedChats) : [
            { id: 1, title: 'Новый чат 1', messages: [] },
        ];
    });

    const [activeChat, setActiveChat] = useState(() => {
        return chats.length > 0 ? chats[0].id : null;
    });

    // Сохраняем чаты в localStorage
    useEffect(() => {
        localStorage.setItem('chats', JSON.stringify(chats));
    }, [chats]);

    const addMessage = (chatId, message, isUser = true) => {
        const newMessage = {
            id: Date.now(),
            text: message,
            isUser,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setChats(prevChats => prevChats.map(chat => {
            if (chat.id === chatId) {
                const title = chat.messages.length === 0
                    ? message.slice(0, 30) + (message.length > 30 ? '...' : '')
                    : chat.title;

                return {
                    ...chat,
                    title,
                    messages: [...chat.messages, newMessage]
                };
            }
            return chat;
        }));
    };

    const addChat = () => {
        const newChat = {
            id: Date.now(),
            title: `Новый чат ${chats.length + 1}`,
            messages: []
        };
        setChats(prev => [...prev, newChat]);
        setActiveChat(newChat.id);
        return newChat.id;
    };

    const updateChatTitle = (chatId, newTitle) => {
        setChats(prevChats => prevChats.map(chat => {
            if (chat.id === chatId) {
                return {
                    ...chat,
                    title: newTitle.trim() || `Чат без имени`
                };
            }
            return chat;
        }));
    };

    const deleteChat = (chatId) => {
        setChats(prevChats => {
            const updatedChats = prevChats.filter(chat => chat.id !== chatId);

            if (activeChat === chatId) {
                setActiveChat(updatedChats.length > 0 ? updatedChats[0].id : null);
            }

            return updatedChats;
        });
    };

    const value = {
        chats,
        activeChat,
        setActiveChat,
        addMessage,
        addChat,
        updateChatTitle,
        deleteChat,
        getActiveChat: () => chats.find(chat => chat.id === activeChat) || chats[0]
    };

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );

}

export function useChat() {
    return useContext(ChatContext);
}
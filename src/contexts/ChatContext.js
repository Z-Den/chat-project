// ChatContext.js
import { createContext, useContext, useState, useEffect } from 'react';

const ChatContext = createContext();

export function ChatProvider({ children }) {
    const [isLoading, setIsLoading] = useState(false);

    const [chats, setChats] = useState(() => {
        const savedChats = localStorage.getItem('chats');
        return savedChats ? JSON.parse(savedChats) : [
            { id: 1, title: 'New chat 1', messages: [] },
        ];
    });

    const [activeChat, setActiveChat] = useState(() => {
        return chats.length > 0 ? chats[0].id : null;
    });

    // Сохраняем чаты в localStorage
    useEffect(() => {
        localStorage.setItem('chats', JSON.stringify(chats));
    }, [chats]);

    const generatedResponse = async (chatId, userMessage) => {
        setIsLoading(true);

        try {
            const currentChat = chats.find(chat => chat.id === chatId);
            const messagesForContext = currentChat.messages
                .slice(-6)
                .map(msg => ({
                    role: msg.isUser ? 'user' : 'bot',
                    content: msg.text
                }));

            messagesForContext.push({ role: 'user', content: userMessage });

            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.REACT_APP_OPENROUTER_API_KEY}`,
                    'HTTP-Referer': 'http://localhost:3000', // Замените на ваш URL
                    'X-Title': 'Zen-AI', // Название вашего приложения
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: "meta-llama/llama-3-8b-instruct",
                    messages: messagesForContext
                })
            });

            const data = await response.json();
            console.log(data);
            const aiResponse = data.choices[0].message.content;

            addMessage(chatId, aiResponse, false);
        } catch (error) {
            console.error("OpenRouter error:", error);
            addMessage(chatId, "Error connection with AI. Try again later.", false);
        } finally {
            setIsLoading(false);
        }
    };

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
                    ? message.slice(0, 50) + (message.length > 50 ? '...' : '')
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
            title: `New chat ${chats.length + 1}`,
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
                    title: newTitle.trim() || `Nameless chat`
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
        getActiveChat: () => chats.find(chat => chat.id === activeChat) || chats[0],
        generatedResponse,
        isLoading
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
import {createContext, useContext, useEffect, useState} from 'react';

const ChatContext = createContext();

export function ChatProvider({ children }) {
    const [isLoading, setIsLoading] = useState(false);

    const [chats, setChats] = useState(() => {
        const savedChats = localStorage.getItem('chats');
        return savedChats ? JSON.parse(savedChats) : [
            { id: 1, title: 'New chat', messages: [] },
        ];
    });

    const [activeChatId, setActiveChatId] = useState(() => {
        return chats.length > 0 ? chats[0].id : null;
    });

    // Сохраняем чаты в localStorage
    useEffect(() => {
        localStorage.setItem('chats', JSON.stringify(chats));
    }, [chats]);

    const makeRequest = async (messagesForContext) => {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.REACT_APP_OPENROUTER_API_KEY}`,
                'HTTP-Referer': 'http://localhost:3000',
                'X-Title': 'Zen-AI',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "meta-llama/llama-3-8b-instruct",
                messages: messagesForContext
            })
        });

        const json = await response.json();

        return json.choices[0].message.content;
    }

    const generatedResponse = async (chatId, userMessage) => {
        setIsLoading(true);

        try {
            const currentChat = chats.find(chat => chat.id === chatId);
            const messagesForContext = currentChat.messages
                .slice(-6)
                .map(msg => ({
                    role: msg.isUser ? 'user' : 'assistant',
                    content: msg.text
                }));

            messagesForContext.push({ role: 'user', content: userMessage });

            const response = await makeRequest(messagesForContext);

            addMessage(chatId, response, false);
        } catch (error) {
            console.error("OpenRouter error:", error);
            addMessage(chatId, "Error connection with AI. Try again later.", false);
        } finally {
            setIsLoading(false);
        }
    };

    const generateTitle = async (message) => {
        const messagesForContext = [{ role: 'user', content: message}];

        messagesForContext.push({ role: 'user', content: 'Summarize as shortly as possible the topic of this conversation ' +
                                                         'in strictly 25-50 characters.' +
                                                         'Without any unnecessary quotes' });

        return await makeRequest(messagesForContext);
    }

    const addMessage = async (chatId, message, isUser = true) => {
        const newMessage = {
            id: Date.now(),
            text: message,
            isUser,
            timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})
        };

        let isZeroMessages = false;

        setChats(prevChats => prevChats.map(chat => {
            if (chat.id === chatId) {
                isZeroMessages = chat.messages.length === 0;
                return {
                    ...chat,
                    messages: [...chat.messages, newMessage]
                };
            }
            return chat;
        }));

        if (isZeroMessages) {
            try {
                const newTitle = await generateTitle(message);
                updateChatTitle(chatId, newTitle);
            } catch (error) {
                console.error("Error generating title:", error);
            }
        }
    };

    const addChat = () => {
        const newChat = {
            id: Date.now(),
            title: `New chat ${chats.length + 1}`,
            messages: []
        };
        setChats(prev => [newChat, ...prev ]);
        setActiveChatId(newChat.id);
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

            if (activeChatId === chatId) {
                setActiveChatId(updatedChats.length > 0 ? updatedChats[0].id : null);
            }

            return updatedChats;
        });
    };

    const value = {
        chats,
        activeChatId,
        setActiveChatId,
        addMessage,
        addChat,
        updateChatTitle,
        deleteChat,
        getActiveChat: () => chats.find(chat => chat.id === activeChatId) || chats[0],
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
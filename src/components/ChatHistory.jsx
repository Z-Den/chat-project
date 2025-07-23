import { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from "rehype-highlight";

import '../styles/blocks/chatHistory/chatHistory.css'


export function ChatHistory({ messages, isLoading }) {
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const PreWithHeader = ({ children, ...props }) => {
        const language = props['data-language'] ||
            (children?.props?.className?.replace('hljs language-', '') || 'text');

        return (
            <div className="code-block-wrapper">
                <div className="code-language">{language}</div>
                <pre {...props}>
                    {children}
                </pre>
            </div>
        );
    };

    return (
        <div className="chat-history">
            {messages.length === 0 ? (
                <div className="empty-chat">Начните общение прямо сейчас!</div>
            ) : (
                <>
                    {messages.map(msg => (
                        <div key={msg.id} className={`message ${msg.isUser ? 'user' : 'bot'}`}>
                            <div className="message-content">
                                {msg.isUser ? (
                                    msg.text
                                ) : (
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        rehypePlugins={[rehypeHighlight]}
                                        components={{
                                            pre: PreWithHeader
                                        }}
                                    >
                                        {msg.text}
                                    </ReactMarkdown>
                                )}
                            </div>
                            <div className="message-time">{msg.timestamp}</div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="message bot">
                            <div className="message-content typing-indicator">
                                <span></span><span></span><span></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </>
            )}
        </div>
    );
}
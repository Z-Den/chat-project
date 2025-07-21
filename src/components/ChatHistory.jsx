import '../styles/blocks/chatHistory/chatHistory.css'

export function ChatHistory({ messages }) {
    return (
        <div className="chat-history">
            {messages.length === 0 ? (
                <div className="empty-chat">Начните новый диалог</div>
            ) : (
                messages.map(msg => (
                    <div key={msg.id} className={`message ${msg.isUser ? 'user' : 'bot'}`}>
                        <div className="message-content">{msg.text}</div>
                        <div className="message-time">{msg.timestamp}</div>
                    </div>
                ))
            )}
        </div>
    );
}
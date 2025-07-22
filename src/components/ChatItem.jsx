// ChatItem.jsx
import { useState } from 'react';
import '../styles/blocks/chatsList/__item/chatsList__item.css';
import { useChat } from '../contexts/ChatContext';

export function ChatItem({ chat, isActive, onClick }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(chat.title);
    const { updateChatTitle, deleteChat } = useChat();

    const handleEdit = (e) => {
        e.stopPropagation();
        setIsEditing(true);
    };

    const handleSave = (e) => {
        e.stopPropagation();
        updateChatTitle(chat.id, editValue);
        setIsEditing(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSave(e);
        }
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        deleteChat(chat.id);
    };

    return (
        <li
            className={`chat-item ${isActive ? 'active' : ''}`}
            onClick={onClick}
        >
            {isEditing ? (
                <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={handleSave}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                    maxLength={15}
                />
            ) : (
                <>
                    <span>{chat.title}</span>
                    <div className="chat-item-actions">
                        <button onClick={handleEdit} className="edit-btn">✏️</button>
                        <button onClick={handleDelete} className="delete-btn">🗑️</button>
                    </div>
                </>
            )}
        </li>
    );
}
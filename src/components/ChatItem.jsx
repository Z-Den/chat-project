import '../styles/blocks/chatsList/__item/chatsList__item.css';


export function ChatItem({ chat, isActive, onClick }) {
    return (
        <li
            className={`chat-item ${isActive ? 'active' : ''}`}
            onClick={onClick}
        >
            {chat.title}
        </li>
    );
}
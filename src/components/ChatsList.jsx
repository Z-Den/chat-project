import {ChatItem} from './ChatItem';

import '../styles/blocks/chatsList/ChatsList.css';
import {useChat} from "../contexts/ChatContext";

export function ChatsList({ onCloseSidebar }) {

    const {
        chats,
        activeChatId,
        setActiveChatId,
    } = useChat();

    return (
        <ul className="chats-list">
            {chats.map(chat => (
                <ChatItem
                    key={chat.id}
                    chat={chat}
                    isActive={chat.id === activeChatId}
                    onClick={() => {
                        setActiveChatId(chat.id)
                        onCloseSidebar()
                    }}
                />
            ))}
        </ul>
    );
}
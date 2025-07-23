import {ChatItem} from './ChatItem';

import '../styles/blocks/chatsList/ChatsList.css';


export function ChatsList({ chats, activeChat, onSelectChat, onCloseSidebar }) {

    return (
        <ul className="chats-list">
            {chats.map(chat => (
                <ChatItem
                    key={chat.id}
                    chat={chat}
                    isActive={chat.id === activeChat}
                    onClick={() => {
                        onSelectChat(chat.id)
                        onCloseSidebar()
                    }}
                />
            ))}
        </ul>
    );
}
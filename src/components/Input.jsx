import {useEffect, useState} from 'react';
import send_white from '../images/send_white.png';
//import send_black from '../images/send_black.png';
import '../styles/blocks/input/Input.css';
import {useChat} from "../contexts/ChatContext";

export function Input(){

    const [message, setMessage] = useState('');

    const {
        generatedResponse,
        addMessage,
        activeChatId,
        getActiveChat
    } = useChat();

    let currentChat = getActiveChat();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim()) {
            handleSendMessage(message);
            setMessage('');
        }
    };

    const handleSendMessage = async (message) => {
        if (!message.trim()) return;

        addMessage(activeChatId, message);

        await generatedResponse(activeChatId, message);
    };

    //DO NOT SWAP THIS USEEFFECTS
    useEffect(() => {
        setMessage(currentChat.input ? currentChat.input : '');
        console.log(currentChat);
    }, [activeChatId, currentChat]);

    useEffect(() => {
        currentChat.input = message;
    }, [currentChat, message]);
    //DO NOT SWAP THIS USEEFFECTS

    return (
        <form className="message-form" onSubmit={handleSubmit}>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Input message..."
            />
            <button type="submit" disabled={!message.trim()}>
                <img src={send_white} alt="Send" />
            </button>
        </form>
    );
}
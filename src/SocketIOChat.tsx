// src/SocketIOChat.tsx
import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

type Message = string;

const socket: Socket = io("https://socket-notification-test.vercel.app/");

interface SocketIOChatProps {
  onNewMessage?: (msg: Message) => void;
}

const SocketIOChat: React.FC<SocketIOChatProps> = ({ onNewMessage }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");

  useEffect(() => {
    socket.on("message", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
      onNewMessage?.(msg); // 🔔 Dispara callback para notificaçãoc
      console.log(msg);
    });

    return () => {
      socket.off("message");
    };
  }, []);

  const sendMessage = () => {
    if (input.trim()) {
      socket.emit("message", input);
      setInput("");
    }
  };

  return (
    <div style={{ marginTop: "2rem" }}>
      <h2>Chat com Socket.IO</h2>
      <div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Digite uma mensagem"
        />
        <button onClick={sendMessage}>Enviar</button>
      </div>
      <ul style={{ marginTop: "1rem" }}>
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
    </div>
  );
};

export default SocketIOChat;

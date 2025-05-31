// src/SocketIOChat.tsx
import React, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

type Message = string;

const SOCKET_SERVER_URL = "https://socket-notification-test.vercel.app";

const SocketIOChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Conecta ao servidor com WebSocket direto
    socketRef.current = io(SOCKET_SERVER_URL, {
      transports: ["websocket"],
    });

    socketRef.current.on("connect", () => {
      console.log("✅ Conectado ao servidor Socket.IO");
    });

    socketRef.current.on("disconnect", () => {
      console.log("❌ Desconectado do servidor Socket.IO");
    });

    socketRef.current.on("message", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (input.trim()) {
      socketRef.current?.emit("message", input);
      setInput("");
    }
  };

  return (
    <div style={{ marginTop: "2rem" }}>
      <h2>Chat com Socket.IO</h2>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Digite uma mensagem"
      />
      <button onClick={sendMessage}>Enviar</button>
      <ul style={{ marginTop: "1rem" }}>
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
    </div>
  );
};

export default SocketIOChat;

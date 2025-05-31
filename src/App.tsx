import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import SocketIOChat from "./SocketIOChat";

function App() {
  const [count, setCount] = useState(0);
  const [notificationPermission, setNotificationPermission] =
    useState<NotificationPermission>("default");
  const [error, setError] = useState<string | null>(null);
  const [isServiceWorkerRegistered, setIsServiceWorkerRegistered] =
    useState(false);
  const [debugInfo, setDebugInfo] = useState<string>("");

  useEffect(() => {
    registerServiceWorker();
    checkNotificationSupport();
  }, []);

  const registerServiceWorker = async () => {
    if ("serviceWorker" in navigator) {
      try {
        console.log("Tentando registrar Service Worker...");
        setDebugInfo("Tentando registrar Service Worker...");

        const registration = await navigator.serviceWorker.register("/sw.js");
        console.log("Service Worker registrado com sucesso:", registration);
        setDebugInfo("Service Worker registrado com sucesso");
        setIsServiceWorkerRegistered(true);

        // Verifica se o Service Worker está ativo
        if (registration.active) {
          console.log("Service Worker está ativo");
          setDebugInfo((prev) => prev + "\nService Worker está ativo");
        }

        // Monitora mudanças no estado do Service Worker
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          console.log("Novo Service Worker encontrado:", newWorker?.state);
          setDebugInfo(
            (prev) =>
              prev + "\nNovo Service Worker encontrado: " + newWorker?.state
          );
        });
      } catch (error) {
        console.error("Erro ao registrar Service Worker:", error);
        setError(
          "Erro ao registrar Service Worker: " + (error as Error).message
        );
        setDebugInfo(
          "Erro ao registrar Service Worker: " + (error as Error).message
        );
      }
    } else {
      setError("Seu navegador não suporta Service Workers");
      setDebugInfo("Navegador não suporta Service Workers");
    }
  };

  const checkNotificationSupport = () => {
    if (!("Notification" in window)) {
      setError("Seu navegador não suporta notificações");
      return;
    }

    if (!("serviceWorker" in navigator)) {
      setError("Seu navegador não suporta Service Workers");
      return;
    }

    setNotificationPermission(Notification.permission);
  };

  const requestNotificationPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);

      if (permission === "granted") {
        // Solicita permissão para notificações push
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey:
            "BKpw-FvlgIxFzijDZHpJoGYZt6Nlq-3Zsb51HnmYP4CD_fLPuBqxDR4AYJhG59vuHh-2n6bpNANZCvlfmKY3MUI",
        });

        console.log("Push Notification subscription:", subscription);
        setDebugInfo(
          (prev) => prev + "\nPush Notification subscription obtida"
        );

        // Mostra uma notificação de teste
        showNotification(
          "Notificações ativadas!",
          "Agora você receberá notificações do nosso app."
        );
      } else {
        setError(
          `Permissão ${permission}. Você precisa permitir as notificações.`
        );
      }
    } catch (error) {
      console.error("Erro:", error);
      setError("Erro ao solicitar permissão: " + (error as Error).message);
      setDebugInfo(
        (prev) =>
          prev + "\nErro ao solicitar permissão: " + (error as Error).message
      );
    }
  };

  const showNotification = async (title: string, body: string) => {
    try {
      if (!isServiceWorkerRegistered) {
        setError("Service Worker não está registrado");
        return;
      }

      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification(title, {
        body,
        icon: viteLogo,
        badge: viteLogo,
      });

      setDebugInfo((prev) => prev + "\nNotificação enviada com sucesso");
    } catch (error) {
      console.error("Erro ao mostrar notificação:", error);
      setError("Erro ao mostrar notificação: " + (error as Error).message);
      setDebugInfo(
        (prev) =>
          prev + "\nErro ao mostrar notificação: " + (error as Error).message
      );
    }
  };

  const handleShowNotification = () => {
    showNotification(
      "Nova notificação!",
      "Esta é uma notificação de teste do nosso aplicativo."
    );
  };

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
        {!isServiceWorkerRegistered && (
          <p style={{ color: "orange", marginTop: "10px" }}>
            Registrando Service Worker...
          </p>
        )}
        {notificationPermission !== "granted" && (
          <button
            onClick={requestNotificationPermission}
            style={{ marginTop: "10px" }}
          >
            Ativar Notificações
          </button>
        )}
        {notificationPermission === "granted" && (
          <button
            onClick={handleShowNotification}
            style={{ marginTop: "10px" }}
          >
            Mostrar Notificação
          </button>
        )}
        <p>Status da permissão: {notificationPermission}</p>
        <div
          style={{
            marginTop: "20px",
            padding: "10px",
            backgroundColor: "#f0f0f0",
            borderRadius: "5px",
            maxHeight: "200px",
            overflow: "auto",
          }}
        >
          <h3>Debug Info:</h3>
          <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
            {debugInfo}
          </pre>
        </div>
        <SocketIOChat
          onNewMessage={(msg) => showNotification("Nova mensagem!", msg)}
        />
      </div>
    </>
  );
}

export default App;

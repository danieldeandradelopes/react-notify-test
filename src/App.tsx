import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const [notificationPermission, setNotificationPermission] =
    useState<NotificationPermission>("default");

  useEffect(() => {
    // Verifica se o navegador suporta notificações
    if ("Notification" in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const requestNotificationPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);

      if (permission === "granted") {
        showNotification(
          "Notificações ativadas!",
          "Agora você receberá notificações do nosso app."
        );
      }
    } catch (error) {
      console.error("Erro ao solicitar permissão:", error);
    }
  };

  const showNotification = (title: string, body: string) => {
    if (notificationPermission === "granted") {
      const notification = new Notification(title, {
        body,
        icon: viteLogo,
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };
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
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;

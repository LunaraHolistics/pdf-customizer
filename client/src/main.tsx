import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { registerServiceWorker, setupOnlineOfflineListeners } from "./lib/serviceWorker";

// Register service worker for PWA
if (import.meta.env.PROD) {
  registerServiceWorker();
}

// Setup online/offline listeners
setupOnlineOfflineListeners(
  () => console.log('App online'),
  () => console.log('App offline')
);

createRoot(document.getElementById("root")!).render(<App />);

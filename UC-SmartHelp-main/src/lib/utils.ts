import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function performLogout() {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const userJson = localStorage.getItem("user");
  const user = userJson ? JSON.parse(userJson) : null;
  const userId = user?.id || user?.userId || user?.user_id;

  // Clear UI/session first so logout feels immediate.
  localStorage.removeItem("uc_guest");
  localStorage.removeItem("user");
  localStorage.removeItem("website_feedback_shown_session");
  localStorage.setItem("theme", "light");
  document.documentElement.classList.remove("dark");
  sessionStorage.removeItem("website_feedback_shown_session");

  // Dispatch reset events before navigation.
  window.dispatchEvent(new Event("chatbot-reset"));
  window.dispatchEvent(new Event("user-logout"));

  // Best-effort audit call, but do not block UX.
  try {
    if (userId) {
      await fetch(`${API_URL}/api/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
        keepalive: true,
      });
    }
  } catch (error) {
    console.error("Error logging out:", error);
  }
  
  // Reload page to home - ensures chatbot widget is completely removed
  window.location.href = "/";
}

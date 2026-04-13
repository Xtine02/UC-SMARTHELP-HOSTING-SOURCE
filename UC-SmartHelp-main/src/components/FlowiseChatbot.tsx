import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const FlowiseChatbot = () => {
  const location = useLocation();
  const [authRefreshKey, setAuthRefreshKey] = useState(0);

  useEffect(() => {
    const refreshChatbot = () => setAuthRefreshKey((v) => v + 1);
    const handleGuestLogout = () => {
      sessionStorage.removeItem("guest_chat_session_id");
      sessionStorage.removeItem("chatbot_last_scope");
      localStorage.removeItem("chatbot_last_scope");
      refreshChatbot();
    };
    window.addEventListener("profile-updated", refreshChatbot);
    window.addEventListener("user-logout", refreshChatbot);
    window.addEventListener("guest-logout", handleGuestLogout);
    return () => {
      window.removeEventListener("profile-updated", refreshChatbot);
      window.removeEventListener("user-logout", refreshChatbot);
      window.removeEventListener("guest-logout", handleGuestLogout);
    };
  }, []);

  useEffect(() => {
    const removeInjectedChatbotUi = () => {
      const selectors = [
        '[id*="flowise"]',
        '[class*="flowise"]',
        "flowise-chatbot",
        'iframe[src*="flowise"]',
        'iframe[id*="chatbot"]',
        'iframe[class*="chatbot"]',
      ];
      const seen = new Set<Element>();
      for (const selector of selectors) {
        document.querySelectorAll(selector).forEach((el) => {
          if (seen.has(el)) return;
          seen.add(el);
          el.remove();
        });
      }
    };

    removeInjectedChatbotUi();

    const dashboardPaths = new Set([
      "/StudentDashboard",
      "/dashboard",
      "/GuestDashboard",
      "/AccountingDashboard",
      "/ScholarshipDashboard",
      "/AdminDashboard",
      "/admin-dashboard",
    ]);

    const isGuest = localStorage.getItem("uc_guest") === "1";
    const userRaw = localStorage.getItem("user");
    let user: any = null;
    try {
      user = userRaw ? JSON.parse(userRaw) : null;
    } catch {
      user = null;
    }
    const accountId = user?.id || user?.userId || user?.user_id || null;
    const accountEmail = (user?.email || "").toString().trim().toLowerCase();
    let accountScope: string | null = null;
    if (isGuest) {
      let guestSessionId = sessionStorage.getItem("guest_chat_session_id");
      if (!guestSessionId) {
        guestSessionId = `guest-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
        sessionStorage.setItem("guest_chat_session_id", guestSessionId);
      }
      accountScope = guestSessionId;
    } else if (accountId || accountEmail) {
      accountScope = `user-${String(accountId || "noid")}-${accountEmail || "noemail"}`;
    }
    const role = (user?.role || "").toString().toLowerCase();
    const isAllowedRole = role === "student" || role === "staff" || role === "admin";
    const isAllowedPath = dashboardPaths.has(location.pathname);

    const prevScopeSession = sessionStorage.getItem("chatbot_last_scope");
    const prevScopePersistent = localStorage.getItem("chatbot_last_scope");
    const prevScope = prevScopeSession || prevScopePersistent;
    const hasScopeChanged = !!prevScope && !!accountScope && prevScope !== accountScope;

    if (hasScopeChanged) {
      removeInjectedChatbotUi();
    }

    if (accountScope) {
      sessionStorage.setItem("chatbot_last_scope", accountScope);
      localStorage.setItem("chatbot_last_scope", accountScope);
    }

    if (!isAllowedPath || (!isGuest && !isAllowedRole) || !accountScope) {
      return;
    }

    const originalFetch = window.fetch.bind(window);
    window.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
      try {
        const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
        const isPredictionCall = url.includes("/api/v1/prediction/8e70e238-a6f4-419d-afae-5a72d0a02247");
        const method = (init?.method || "GET").toUpperCase();

        if (isPredictionCall && method === "POST") {
          const rawBody = init?.body;
          if (typeof rawBody === "string") {
            const parsed = JSON.parse(rawBody || "{}");
            const nextBody = {
              ...parsed,
              overrideConfig: {
                ...(parsed.overrideConfig || {}),
                sessionId: accountScope,
                userId: accountScope,
                user_id: accountScope,
              },
            };
            return originalFetch(input, { ...init, body: JSON.stringify(nextBody) });
          }
        }
      } catch {
        // Fall through to original request on parse/shape errors.
      }
      return originalFetch(input, init);
    }) as typeof window.fetch;

    const script = document.createElement("script");
    script.type = "module";
    script.textContent = `
      import Chatbot from "https://cdn.jsdelivr.net/npm/flowise-embed/dist/web.js";
      Chatbot.init({
        chatflowid: "8e70e238-a6f4-419d-afae-5a72d0a02247",
        apiHost: "http://localhost:3001",
        sessionId: "${accountScope}",
        chatflowConfig: {
          sessionId: "${accountScope}",
          userId: "${accountScope}",
          user_id: "${accountScope}"
        },
        overrideConfig: {
          sessionId: "${accountScope}",
          userId: "${accountScope}",
          user_id: "${accountScope}"
        },
        metadata: {
          userId: "${accountScope}",
          user_id: "${accountScope}",
          sessionId: "${accountScope}"
        },
        observersConfig: {
          on_message: (response) => {
            if (response?.text === "REDIRECT_TICKET") {
              window.dispatchEvent(new Event("open-new-ticket-dialog"));
            }
          },
        },
        theme: {
          button: {
            backgroundColor: "#3B81F6",
            right: 20,
            bottom: 20,
            size: 56,
            dragAndDrop: true,
            iconColor: "white",
            customIconSrc: "https://raw.githubusercontent.com/walkxcode/dashboard-icons/main/svg/google-messages.svg",
            autoWindowOpen: {
              autoOpen: false,
              openDelay: 2,
              autoOpenOnMobile: false,
            },
          },
          tooltip: {
            showTooltip: true,
            tooltipMessage: "Hi There 👋!",
            tooltipBackgroundColor: "black",
            tooltipTextColor: "white",
            tooltipFontSize: 16,
          },
          disclaimer: {
            title: "Disclaimer",
            message: "By using this chatbot, you agree to the <a target='_blank' href='https://flowiseai.com/terms'>Terms & Condition</a>",
            textColor: "black",
            buttonColor: "#3b82f6",
            buttonText: "Start Chatting",
            buttonTextColor: "white",
            blurredBackgroundColor: "rgba(0, 0, 0, 0.4)",
            backgroundColor: "white",
          },
          customCSS: "",
          chatWindow: {
            showTitle: true,
            showAgentMessages: true,
            title: "UC SmartHelp Assistant",
            welcomeMessage: "Hello! Welcome to UC SmartHelp. How can I assist you today?",
            errorMessage: "Sorry, I encountered an error. Please try again.",
            backgroundColor: "#ffffff",
            height: 700,
            width: 400,
            fontSize: 16,
            starterPrompts: [
              "How do I create a ticket?",
              "What departments are available?",
              "How do I check my ticket status?"
            ],
            clearChatOnReload: ${isGuest ? "true" : "false"},
            renderHTML: true,
            botMessage: {
              backgroundColor: "#f7f8ff",
              textColor: "#303235",
              showAvatar: true,
              avatarSrc: "https://raw.githubusercontent.com/zahidkhawaja/langchain-chat-nextjs/main/public/parroticon.png"
            },
            userMessage: {
              backgroundColor: "#3B81F6",
              textColor: "#ffffff",
              showAvatar: true,
              avatarSrc: "https://raw.githubusercontent.com/zahidkhawaja/langchain-chat-nextjs/main/public/usericon.png"
            },
            textInput: {
              placeholder: "Type your question",
              backgroundColor: "#ffffff",
              textColor: "#303235",
              sendButtonColor: "#3B81F6",
              maxChars: 50,
              maxCharsWarningMessage: "You exceeded the characters limit. Please input less than 50 characters.",
              autoFocus: true,
              sendMessageSound: true,
              receiveMessageSound: true
            },
            feedback: { color: "#303235" },
            dateTimeToggle: { date: true, time: true },
            footer: {
              textColor: "#303235",
              text: "Powered by",
              company: "UC SmartHelp",
              companyLink: "https://uc-smarthelp.com"
            }
          }
        },
      });
    `;

    document.body.appendChild(script);

    return () => {
      window.fetch = originalFetch;
      script.remove();
      removeInjectedChatbotUi();
    };
  }, [location.pathname, authRefreshKey]);

  return null;
};

export default FlowiseChatbot;

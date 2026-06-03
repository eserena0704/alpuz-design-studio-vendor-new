import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCatalog } from "@/lib/api";

export const ChatbotLoader = () => {
  const { data } = useQuery({
    queryKey: ["catalog"],
    queryFn: fetchCatalog,
  });

  useEffect(() => {
    const SCRIPT_MARKER = "data-dynamic-injected";

    // Clean up existing injected scripts and widget elements
    const cleanup = () => {
      document.querySelectorAll(`script[${SCRIPT_MARKER}]`).forEach((el) => el.remove());
      // Clean up common elements chatbot widgets leave behind (e.g., aiconvo)
      document.querySelectorAll('[id*="aiconvo"], [class*="aiconvo"]').forEach((el) => el.remove());
    };

    if (data?.chatbotScript) {
      cleanup();

      try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(data.chatbotScript, "text/html");
        const scripts = doc.querySelectorAll("script");

        scripts.forEach((s) => {
          const newScript = document.createElement("script");
          
          // Copy all attributes
          Array.from(s.attributes).forEach((attr) => {
            newScript.setAttribute(attr.name, attr.value);
          });
          
          // Copy inline javascript content if any
          newScript.textContent = s.textContent;
          
          // Mark it so we can clean it up later
          newScript.setAttribute(SCRIPT_MARKER, "true");
          
          // Default to async if not explicitly set
          if (!s.hasAttribute("async")) {
            newScript.async = true;
          }

          document.head.appendChild(newScript);
        });
      } catch (err) {
        console.error("Failed to parse and inject chatbot script:", err);
      }
    } else {
      cleanup();
    }

    return cleanup;
  }, [data?.chatbotScript]);

  return null;
};

export default ChatbotLoader;

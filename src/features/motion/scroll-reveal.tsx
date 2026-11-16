"use client";

import { useEffect } from "react";

/**
 * Revela os elementos `[data-reveal]` quando entram na tela, marcando-os com
 * `data-revealed` (a animação em si é CSS, ver `globals.css`). Cada elemento é
 * revelado uma única vez e deixa de ser observado em seguida.
 */
export function ScrollReveal() {
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>("[data-motion] [data-reveal]:not([data-revealed])");

    const reveal = (element: Element) => element.setAttribute("data-revealed", "");

    if (!("IntersectionObserver" in window)) {
      elements.forEach(reveal);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          reveal(entry.target);
          observer.unobserve(entry.target);
        }
      },
      // Dispara um pouco antes do fim da tela, para a animação não "atrasar".
      { rootMargin: "0px 0px -8% 0px" },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return null;
}

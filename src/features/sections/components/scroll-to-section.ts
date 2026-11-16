"use client";

/**
 * Rola suavemente até uma seção da landing e atualiza a âncora na URL, sem
 * passar pelo roteador (que salta para perto do topo antes de rolar).
 * Retorna `false` quando o link não é uma âncora da página atual.
 */
export function scrollToSection(href: string, pathname: string) {
  if (pathname !== "/" || !href.startsWith("/#")) return false;
  const id = href.slice(2);
  const target = document.getElementById(id);
  if (!target) return false;
  target.scrollIntoView({ behavior: "smooth", block: "start" });
  window.history.pushState(null, "", `#${id}`);
  return true;
}

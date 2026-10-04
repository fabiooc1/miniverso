import { mergeAttributes, Node, type NodeViewRenderer } from "@tiptap/core";
import { getVideoWatchUrl, type VideoContent } from "@/features/video/video";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    video: {
      /** Insere um vídeo do YouTube/Vimeo já validado por `resolveVideo`. */
      setVideo: (video: VideoContent) => ReturnType;
    };
  }
}

const VIDEO_ATTRIBUTES = ["provider", "videoId", "hash", "title", "thumbnailUrl"] as const;

/**
 * Bloco de vídeo externo nos posts. Guarda os mesmos dados do `videoSchema`
 * (provedor e id), nunca um iframe ou HTML.
 */
export function createVideoNode(nodeView?: NodeViewRenderer) {
  return Node.create({
    name: "video",
    group: "block",
    atom: true,
    draggable: true,

    addAttributes() {
      return Object.fromEntries(
        VIDEO_ATTRIBUTES.map((name) => [
          name,
          {
            default: null,
            parseHTML: (element: HTMLElement) => element.getAttribute(`data-${name.toLowerCase()}`),
          },
        ]),
      );
    },

    parseHTML() {
      return [{ tag: "div[data-video]" }];
    },

    // Fora do editor React, vira um link para o vídeo (ex.: ao copiar o conteúdo).
    renderHTML({ HTMLAttributes, node }) {
      const video = node.attrs as VideoContent;
      const data = Object.fromEntries(
        VIDEO_ATTRIBUTES.filter((name) => video[name]).map((name) => [`data-${name.toLowerCase()}`, video[name]]),
      );
      return [
        "div",
        mergeAttributes(HTMLAttributes, data, { "data-video": "" }),
        ["a", { href: getVideoWatchUrl(video), target: "_blank", rel: "noopener noreferrer" }, video.title],
      ];
    },

    addCommands() {
      return {
        setVideo:
          (video) =>
          ({ commands }) =>
            commands.insertContent({ type: this.name, attrs: video }),
      };
    },

    ...(nodeView ? { addNodeView: () => nodeView } : {}),
  });
}

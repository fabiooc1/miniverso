import { renderToReactElement } from "@tiptap/static-renderer/pm/react";
import { VideoEmbed } from "@/features/video/components/video-embed";
import { createRichTextExtensions, parseVideoAttrs, type RichTextNode } from "../lib/rich-text";

const extensions = createRichTextExtensions();

/** Conteúdo do artigo, renderizado no servidor com as mesmas extensões do editor. */
export function PostContent({ content }: { content: RichTextNode }) {
  return (
    <div className="rich-text">
      {renderToReactElement({
        extensions,
        content,
        options: {
          nodeMapping: {
            video({ node }) {
              const video = parseVideoAttrs(node.attrs);
              if (!video) return null;
              return (
                <div className="relative my-2 aspect-video w-full max-w-4xl overflow-hidden rounded-2xl">
                  <VideoEmbed video={video} sizes="(min-width: 896px) 896px, 100vw" />
                </div>
              );
            },
          },
        },
      })}
    </div>
  );
}

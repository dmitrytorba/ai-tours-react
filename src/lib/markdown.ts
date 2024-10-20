import "highlight.js/styles/github.css";
import { Marked, RendererThis, Tokens } from "marked";

export const ANIMATED_TEXT_PLACEHOLDER = "<animated-text-placeholder/>";

const XML_ENTITY_MAP = new Map<string, string>(
  Object.entries({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
    "/": "&#x2F;",
  })
);

function escape_xml(source: string) {
  return String(source).replace(
    /[&<>"'\/]/g,
    (s: string) => XML_ENTITY_MAP.get(s)!
  );
}

const marked = new Marked();
marked.use({
  extensions: [
    {
      name: "link",
      renderer: function (
        this: RendererThis,
        token: Tokens.Generic
      ): string | false | undefined {
        if (!token.text) {
          return;
        }
        if (!token.href) {
          return token.text;
        }
        return `<a href=${token.href}>${token.text}</a>`;
      },
    },
    {
      name: "list",
      renderer: function (
        this: RendererThis,
        token: Tokens.Generic
      ): string | false | undefined {
        if (!token.items) {
          return;
        }
        const body = token.items
          .map((item: any) =>
            token.ordered
              ? `<li class="ordered-list">
                   <span>${item.raw.split(".")[0]}.</span>
                   <div>${this.parser.parse(item.tokens)}</div>
                 </li>`
              : `<li>${this.parser.parse(item.tokens)}</li>`
          )
          .join("");
        return `<ul>${body}</ul>`;
      },
    },
    {
      name: "html",
      level: "inline",
      renderer: function (
        this: RendererThis,
        token: Tokens.Generic
      ): string | false | undefined {
        const position = token.text.lastIndexOf(ANIMATED_TEXT_PLACEHOLDER);
        if (position >= 0) {
          const before = token.text.slice(0, position);
          return escape_xml(before) + ANIMATED_TEXT_PLACEHOLDER;
        }
        return escape_xml(token.text);
      },
    },
  ],
});

export const markdownToHtml = (markdown: string): string => {
  return marked.parse(markdown) as string;
};

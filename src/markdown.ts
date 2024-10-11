import hljs from "highlight.js";
import "highlight.js/styles/github.css";
import { Marked, RendererThis, TokenizerThis, Tokens } from "marked";
import { markedHighlight } from "marked-highlight";

export const BLINKING_CURSOR_DELAY = 15;
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
    /[&<>"'/]/g,
    (s: string) => XML_ENTITY_MAP.get(s)!
  );
}

const marked = new Marked(
  markedHighlight({
    langPrefix: "hljs language-",
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : "plaintext";
      code = code.replace(ANIMATED_TEXT_PLACEHOLDER, "");
      return hljs.highlight(code, { language }).value;
    },
  })
);
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
        // don't escape the animated text placeholder, we need that intact to render differently later on
        const position = token.text.lastIndexOf(ANIMATED_TEXT_PLACEHOLDER);
        if (position >= 0) {
          const before = token.text.slice(0, position);
          return escape_xml(before) + ANIMATED_TEXT_PLACEHOLDER;
        }
        return escape_xml(token.text);
      },
    },
    {
      name: "citation",
      level: "inline",
      start: (src: string): number | void => {
        return src.match(/\s?\(Source: /)?.index;
      },
      tokenizer: function (
        this: TokenizerThis,
        src: string
      ): Tokens.Generic | undefined {
        const match = /^\s?\(Source: (.[^)]*)\)\s?/.exec(src);
        if (match) {
          return {
            type: "citation",
            raw: match[0], // this text is consumed from the source
            citation: match[1].trim(), // store the extracted citation as metadata in the token
          };
        }
      },
      renderer: function (
        this: RendererThis,
        token: Tokens.Generic
      ): string | false | undefined {
        // render the token as a custom <citation> tag.
        return `<citation>${token.citation}</citation>`;
      },
    },
  ],
});

export const markdownToHtml = (markdown: string): string => {
  return marked.parse(markdown) as string;
};

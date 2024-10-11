import parse, { Element, HTMLReactParserOptions } from "html-react-parser";
import DOMPurify, { Config } from "isomorphic-dompurify";
import { RefObject, useEffect, useState } from "react";
import { ANIMATED_TEXT_PLACEHOLDER, BLINKING_CURSOR_DELAY, markdownToHtml } from "./markdown";

interface Props {
  streaming: boolean;
  content: string;
  scrollRef?: RefObject<HTMLElement>;
}

export const MessageContent = ({ streaming, content, scrollRef }: Props) => {
  const [animatedText, setAnimatedText] = useState<string>("");
  const [animatedIndex, setAnimatedIndex] = useState<number>(0);

  useEffect(() => {
    if (!content || !streaming) {
      return;
    }
    if (animatedIndex < content.length) {
      const timeout = setTimeout(() => {
        setAnimatedText((prevText) => prevText + content[animatedIndex]);
        setAnimatedIndex((prevIndex) => prevIndex + 1);
        scrollRef?.current?.scrollIntoView();
      }, BLINKING_CURSOR_DELAY);

      return () => clearTimeout(timeout);
    }
  }, [scrollRef, animatedIndex, animatedText, content, streaming]);

  const sanitizeOptions: Config = {
    // Return a string instead of a parsed DOM tree/elements.
    RETURN_DOM: false,
  };
  const parseOptions: HTMLReactParserOptions = {
    replace: (domNode) => {
      // Transform any <animated-text-placeholder/> tags into <span/>'s
      if (
        domNode instanceof Element &&
        domNode.attribs &&
        domNode.name === "animated-text-placeholder" &&
        domNode.type === "tag"
      ) {
        return <span className="blinking-cursor">|</span>;
      }
    },
  };

  const contentToRender = streaming ? animatedText + ANIMATED_TEXT_PLACEHOLDER : content;
  return parse(DOMPurify.sanitize(markdownToHtml(contentToRender!), sanitizeOptions) as string, parseOptions);
};

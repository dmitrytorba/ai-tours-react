import DOMPurify from "dompurify";
import parse, {
  DOMNode,
  domToReact,
  HTMLReactParserOptions,
} from "html-react-parser";
import { Config } from "isomorphic-dompurify";
import { MapPin, MapPinned } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "./lib/utils";
import {
  ANIMATED_TEXT_PLACEHOLDER,
  BLINKING_CURSOR_DELAY,
  markdownToHtml,
} from "./markdown";

interface Props {
  message: string;
  loading: boolean;
  streaming: boolean;
  stream: string | null;
  isUser?: boolean;
  scrollRef?: React.RefObject<HTMLDivElement>;
}

const sanitizeOptions: Config = {
  ADD_TAGS: ["animated-cursor"],
  RETURN_DOM: false,
};

export const Message = ({
  message,
  loading,
  streaming,
  stream,
  isUser = false,
  scrollRef,
}: Props) => {
  const [animatedText, setAnimatedText] = useState<string>("");
  const [animatedIndex, setAnimatedIndex] = useState<number>(0);

  useEffect(() => {
    if (!stream) {
      return;
    }
    if (animatedIndex < stream.length) {
      const timeout = setTimeout(() => {
        setAnimatedText((prevText) => prevText + stream[animatedIndex]);
        setAnimatedIndex((prevIndex) => prevIndex + 1);
        scrollRef?.current?.scrollIntoView();
      }, BLINKING_CURSOR_DELAY);

      return () => clearTimeout(timeout);
    }
  }, [animatedIndex, animatedText, stream, scrollRef]);

  const parseOptions: HTMLReactParserOptions = {
    replace: (el) => {
      if (el.type === "tag" && el.name === "p") {
        return (
          <p className="py-1">
            {domToReact(el.children as DOMNode[], parseOptions)}
          </p>
        );
      }
      if (el.type === "tag" && el.name === "h3") {
        return (
          <h3 className="py-2 text-lg font-bold">
            {domToReact(el.children as DOMNode[], parseOptions)}
          </h3>
        );
      }
      if (el.type === "tag" && el.name === "animated-cursor") {
        return (
          <span className="inline-block animate-pulse w-4 h-4 ml-1 pt-1">
            <MapPin className="w-4 h-4" />
          </span>
        );
      }
    },
  };

  if (loading && !streaming) {
    return (
      <div className={cn("flex my-2 mr-2")}>
        <div className="bg-gray-900 rounded-full shrink-0 mr-2 w-10 h-10 flex ">
          <div className="flex h-full w-full items-center justify-center">
            <MapPinned className="w-4 h-4" />
          </div>
        </div>
        <div className={cn("animate-pulse bg-gray-900 rounded-full")}>
          <div className="w-20 h-4" />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex my-2 mr-2", isUser ? "justify-end" : "")}>
      {!isUser && (
        <div className="bg-gray-900 rounded-full shrink-0 mr-2 w-10 h-10 flex ">
          <div className="flex h-full w-full items-center justify-center">
            <MapPinned className="w-4 h-4" />
          </div>
        </div>
      )}

      <div
        className={cn("", isUser ? "py-2 px-4 bg-gray-700 rounded-full" : "")}
      >
        {streaming
          ? parse(
              DOMPurify.sanitize(
                markdownToHtml(animatedText + ANIMATED_TEXT_PLACEHOLDER),
                sanitizeOptions
              ) as string,
              parseOptions
            )
          : parse(
              DOMPurify.sanitize(
                markdownToHtml(message),
                sanitizeOptions
              ) as string,
              parseOptions
            )}
      </div>
    </div>
  );
};

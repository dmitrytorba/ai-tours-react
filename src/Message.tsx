import parse, {
  DOMNode,
  domToReact,
  HTMLReactParserOptions,
} from "html-react-parser";
import DOMPurify, { Config } from "isomorphic-dompurify";
import { MapPinned } from "lucide-react";
import { cn } from "./lib/utils";
import { markdownToHtml } from "./markdown";
import { MessageContent } from "./MessageContent";
import { ChatMessageDto } from "./types";

interface Props {
  message: string;
  loading: boolean;
  streaming: boolean;
  stream: ChatMessageDto | null;
  isUser?: boolean;
}

const sanitizeOptions: Config = {
  // Return a string instead of a parsed DOM tree/elements.
  RETURN_DOM: false,
};

export const Message = ({
  message,
  loading,
  streaming,
  stream,
  isUser = false,
}: Props) => {
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
    },
  };

  if (loading) {
    return (
      <div className={cn("flex my-2", isUser ? "justify-end" : "mr-2")}>
        <div
          className={cn(
            "animate-pulse bg-gray-700 rounded-full",
            isUser ? "bg-gray-700" : "bg-gray-900"
          )}
        >
          <div className="w-20 h-4" />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex my-2", isUser ? "justify-end" : "mr-2")}>
      {!isUser && (
        <div className="bg-gray-900 rounded-full shrink-0 mr-2 w-10 h-10 flex ">
          <div className="flex h-full w-full items-center justify-center">
            <MapPinned className="w-4 h-4" />
          </div>
        </div>
      )}
      {streaming ? (
        <MessageContent
          key={stream?.id ?? "streaming"}
          streaming={true}
          content={stream?.content ?? ""}
        />
      ) : (
        <>
          <div
            className={cn(
              "",
              isUser ? "py-2 px-4 bg-gray-700 rounded-full" : ""
            )}
          >
            {parse(
              DOMPurify.sanitize(
                markdownToHtml(message!),
                sanitizeOptions
              ) as string,
              parseOptions
            )}
          </div>
        </>
      )}
    </div>
  );
};

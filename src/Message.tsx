import { MapPinned } from "lucide-react";
import { cn } from "./lib/utils";
import { MessageContent } from "./MessageContent";
import { ChatMessageDto } from "./types";

interface Props {
  message: string;
  loading: boolean;
  streaming: boolean;
  messages: ChatMessageDto[];
  stream: ChatMessageDto | null;
  isUser?: boolean;
}

export const Message = ({
  message,
  loading,
  streaming,
  messages,
  stream,
  isUser = false,
}: Props) => {
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
            {message}
          </div>
        </>
      )}
    </div>
  );
};

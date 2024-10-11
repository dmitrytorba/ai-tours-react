import { MessageContent } from "./MessageContent";
import { ChatMessageDto } from "./types";

interface Props {
  message: string;
  loading: boolean;
  streaming: boolean;
  messages: ChatMessageDto[];
  stream: ChatMessageDto | null;
}

export const Message = ({
  message,
  loading,
  streaming,
  messages,
  stream,
}: Props) => {
  console.log("Message", { message, loading, streaming, messages, stream });
  return (
    <div>
      {streaming ? (
        <MessageContent
          key={stream?.id ?? "streaming"}
          streaming={true}
          content={stream?.content ?? ""}
        />
      ) : (
        <>
          <div>{message}</div>
        </>
      )}
    </div>
  );
};

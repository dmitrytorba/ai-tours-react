import { Fragment } from "react";
import { Message } from "./Message";
import { ChatMessageDto, Role } from "./types";

interface Props {
  loading: boolean;
  streaming: boolean;
  messages: ChatMessageDto[];
  stream: ChatMessageDto | null;
}

export const MessageList = ({
  loading,
  streaming,
  messages,
  stream,
}: Props) => {
  return (
    <div className="flex flex-col gap-2 mb-4 overflow-auto">
      {messages.map((item, index) => (
        <Fragment key={`user-msg-${index}`}>
          <Message
            message={item.content}
            loading={loading}
            streaming={streaming}
            stream={stream}
            isUser={item.role === Role.human}
          />
        </Fragment>
      ))}
    </div>
  );
};

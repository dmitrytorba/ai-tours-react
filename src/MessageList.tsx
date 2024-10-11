import { Fragment } from "react";
import { Message } from "./Message";
import { ChatMessageDto } from "./types";

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
    <div>
      {messages.map((item, index) => (
        <Fragment key={`user-msg-${index}`}>
          <Message
            message={item.content}
            loading={loading}
            streaming={false}
            messages={messages}
            stream={null}
          />
        </Fragment>
      ))}
      <Message
        message={""}
        loading={loading}
        streaming={streaming}
        messages={messages}
        stream={stream}
      />
    </div>
  );
};

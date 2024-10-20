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
    <div className="flex flex-col gap-2 mb-4">
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
        message={
          "This is a test message. It is long and will wrap. Maybe. Okay, it will. We're sure of it. We think. Maybe. Okay, we're not sure. It's a mystery. We'll see. It will wrap. We're sure of it. Maybe. Okay, we're not sure. It's a mystery. We'll see. It will wrap. We're sure of it. Maybe. Okay, we're not sure. It's a mystery. We'll see. It will wrap. We're sure of it. Maybe. Okay, we're not sure. It's a mystery. We'll see. It will wrap. We're sure of it. Maybe. Okay, we're not sure. It's a mystery. We'll see."
        }
        loading={loading}
        streaming={streaming}
        messages={messages}
        stream={stream}
      />

      <Message
        message={"Ok thats cool"}
        loading={loading}
        streaming={streaming}
        messages={messages}
        stream={stream}
        isUser={true}
      />
    </div>
  );
};

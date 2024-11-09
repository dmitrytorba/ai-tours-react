import { Fragment, useEffect, useRef } from "react";
import { Message } from "./Message";
import { ChatMessageDto, Role } from "./types";

interface Props {
  loading: boolean;
  streaming: boolean;
  messages: ChatMessageDto[];
  stream: string | null;
}

export const MessageList = ({
  loading,
  streaming,
  messages,
  stream,
}: Props) => {
  const scrollToDiv = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToDiv.current?.scrollIntoView();
  }, [messages, loading]);

  return (
    <div className="flex flex-col gap-2 mb-4 overflow-auto">
      {messages.map((item, index) => (
        <Fragment key={`user-msg-${index}`}>
          <Message
            message={item.content}
            loading={false}
            streaming={false}
            stream={null}
            isUser={item.role === Role.human}
          />
        </Fragment>
      ))}
      {loading ? (
        <Message
          message={""}
          loading={loading}
          streaming={false}
          stream={null}
          isUser={false}
        />
      ) : null}
      {streaming ? (
        <Message
          message={""}
          loading={false}
          streaming={true}
          stream={stream}
          isUser={false}
          scrollRef={scrollToDiv}
        />
      ) : null}
      <div ref={scrollToDiv} />
    </div>
  );
};

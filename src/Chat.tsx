import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { ReadyStateEvent, SSE, SSEvent } from "sse.js";
import { ChatInput } from "./ChatInput";
import { useMapStore } from "./hooks/useMapStore";
import { MessageList } from "./MessageList";
import { ChatMessageDto, Role } from "./types";

function Chat() {
  const [input, setInput] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [messages, setMessages] = useState<ChatMessageDto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [streaming, setStreaming] = useState<boolean>(false);
  const [stream, setStream] = useState<ChatMessageDto | null>(null);
  const [hasIntro, setHasIntro] = useState<boolean>(false);
  const mapState = useMapStore();

  const registerEventSourceCallbacks = useCallback((eventSource: SSE) => {
    eventSource.addEventListener("on_chain_end", (e: SSEvent) => {
      setMessages((prev) => [
        ...prev,
        { content: e.data, role: Role.ai } as ChatMessageDto,
      ]);
    });

    eventSource.onerror = (e: SSEvent) => {
      console.error(`[onerror] Error Occurred: ${e}`);
    };
    eventSource.onabort = (e: SSEvent) => {
      console.error(`[onabort] Error Occurred: ${e}`);
    };
    eventSource.onreadystatechange = (e: ReadyStateEvent) => {
      // 2 = CLOSED
      // the event source has been closed, we are done streaming
      if (e.readyState === 2) {
        console.log("closed");
        setLoading(false);
        setStreaming(false);
        setStream(null);
      }
    };
  }, []);

  // bridge ChangeEvent for the input HTMLTextAreaElement to updating the input state
  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      setInput(e.target.value);
    },
    []
  );

  const handleSubmit = useCallback(
    (e?: FormEvent<HTMLFormElement>) => {
      setLoading(true);
      e?.preventDefault();

      console.log("handleSubmit", input);
      // ignore empty input
      if (hasIntro && (!input || !input.trim())) {
        return false;
      }

      // add the user prompt to the list of messages
      //   const now = new Date();
      //   dispatch({
      //     type: "submit.prompt",
      //     payload: { date: now, input: input! },
      //   });

      const eventSource = new SSE(`http://localhost:8000/stream/`, {
        start: false, // delay issuing the request until stream() is called.
        method: "POST",
        withCredentials: false,
        payload: JSON.stringify({
          content: hasIntro ? input : "hi",
          user_location: `${mapState.lat},${mapState.lng}`,
          history: messages,
        }),
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      });

      // register callbacks
      registerEventSourceCallbacks(eventSource);

      if (input && input.trim()) {
        setMessages((prev) => [
          ...prev,
          { content: input, role: Role.human } as ChatMessageDto,
        ]);
      }

      // issue request
      eventSource.stream();

      // clear the input
      setInput(null);
    },
    [
      input,
      registerEventSourceCallbacks,
      hasIntro,
      mapState.lat,
      mapState.lng,
      messages,
    ]
  );

  useEffect(() => {
    console.log("useEffect", mapState.lat, mapState.lng, hasIntro);
    if (mapState.hasUpdate && mapState.lat && mapState.lng && !hasIntro) {
      handleSubmit();
      setHasIntro(true);
    }
  }, [mapState.lat, mapState.lng, hasIntro, handleSubmit]);

  return (
    <div className="fixed bottom-0 left-0 min-w-80 w-1/3 h-full text-white p-12 flex flex-col-reverse">
      <div className="p-4 bg-gray-800/[.90] rounded-md w-full max-h-full flex flex-col">
        <MessageList
          loading={loading}
          streaming={streaming}
          messages={messages}
          stream={stream}
        />
        <ChatInput
          isLoading={false}
          input={input ?? ""}
          handleInputChange={handleInputChange}
          formRef={formRef}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}

export default Chat;

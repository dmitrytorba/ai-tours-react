import { ChangeEvent, useRef } from "react";
import useAutosizeTextArea from "./hooks/useAutoresizeTextarea";

interface ChatInputProps {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  input: string;
  formRef: React.RefObject<HTMLFormElement>;
  isLoading: boolean;
  handleInputChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

export const ChatInput = ({
  onSubmit,
  input,
  formRef,
  isLoading,
  handleInputChange,
}: ChatInputProps) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useAutosizeTextArea(textAreaRef.current, input);

  const handleSubmit = () => {
    if (formRef.current) {
      formRef.current.dispatchEvent(
        new Event("submit", { cancelable: true, bubbles: true })
      );
    }
  };

  const handleKeyDown = (event: any) => {
    if (isLoading) {
      return;
    }
    switch (event.key) {
      case "Enter":
        if (formRef.current && !event.getModifierState("Shift")) {
          handleSubmit();
        }
        break;
      default:
        break;
    }
  };
  return (
    <form onSubmit={onSubmit} className="flex gap-2">
      <textarea
        autoFocus
        disabled={isLoading}
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        ref={textAreaRef}
        placeholder="Ask the tour guide..."
        className="flex rounded-full resize-none bg-gray-700 w-full pl-4 pr-8"
      />
      <button>Send</button>
    </form>
  );
};

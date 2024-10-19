import { ChangeEvent, useRef } from "react";

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
    <form onSubmit={onSubmit} className='flex gap-2'>
      <textarea
        autoFocus
        disabled={isLoading}
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        data-testid="embed-chat-input"
        ref={textAreaRef}
        placeholder="Type something here..."
      />
      <button>Send</button>
    </form>
  );
};

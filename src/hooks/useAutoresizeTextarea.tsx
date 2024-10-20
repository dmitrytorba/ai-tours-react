"use client";
import { useEffect } from "react";

// https://medium.com/@oherterich/creating-a-textarea-with-dynamic-height-using-react-and-typescript-5ed2d78d9848
const useAutosizeTextArea = (
  textAreaRef: HTMLTextAreaElement | null,
  value: string
) => {
  useEffect(() => {
    if (textAreaRef) {
      textAreaRef.style.height = "0px";
      const scrollHeight = textAreaRef.scrollHeight;
      textAreaRef.style.height = scrollHeight + "px";
      if (scrollHeight > 54) {
        textAreaRef.style.borderRadius = "0.5rem";
      } else {
        textAreaRef.style.borderRadius = "";
      }
    }
  }, [textAreaRef, value]);
};

export default useAutosizeTextArea;

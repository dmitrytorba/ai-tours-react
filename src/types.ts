export enum Role {
  human = "human",
  ai = "ai",
  tool = "tool",
}

export interface ChatMessageDto {
  id?: string;
  createdAt?: Date;
  role: Role;
  content: string;
}

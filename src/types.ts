export enum Role {
  user = "user",
  system = "system",
  tool = "tool",
}

export interface ChatMessageDto {
  id?: string;
  createdAt?: Date;
  role: Role;
  content: string;
}

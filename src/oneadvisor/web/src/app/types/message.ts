export type MessageType = "success" | "error" | "info" | "warning" | "loading";

export type ShowMessage = (
    type: MessageType,
    content: string,
    duration?: number,
    destroyExistingMessages?: boolean
) => void;

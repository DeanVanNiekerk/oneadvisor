import { message } from "antd";

type MessageType = "success" | "error" | "info" | "warning" | "loading";

export const showMessage = (
    type: MessageType,
    content: string,
    duration = 2,
    destroyExistingMessages = false
) => {
    if (destroyExistingMessages) destroyMessages();

    message[type](content, duration);
};

export const destroyMessages = () => {
    message.destroy();
};

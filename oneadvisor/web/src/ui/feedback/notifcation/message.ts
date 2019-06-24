import { message } from 'antd';

type MessageType = "success" | "error" | "info" | "warning" | "loading";

export const showMessage = (
    type: MessageType,
    content: string,
    duration: number = 2,
    destroyExistingMessages: boolean = false
) => {
    if (destroyExistingMessages) destroyMessages();

    message[type](content, duration);
};

export const destroyMessages = () => {
    message.destroy();
};

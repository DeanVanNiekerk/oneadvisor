import { message } from "antd";

import { MessageType, ShowMessage } from "@/app/types";

export const showMessage: ShowMessage = (
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

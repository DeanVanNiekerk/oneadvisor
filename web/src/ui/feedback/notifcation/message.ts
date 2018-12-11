import { message } from 'antd';

type MessageType = 'success' | 'error' | 'info' | 'warning';

export const showMessage = (
    type: MessageType,
    content: string,
    duration: number = 2
) => {
    message[type](content, duration);
};

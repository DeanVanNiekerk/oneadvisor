import { notification } from "antd";

type NotificationType = "success" | "error" | "info" | "warning";

export const showNotification = (type: NotificationType, title: string, message: string, duration = 6.5) => {
    notification[type]({
        message: title,
        description: message,
        duration: duration,
    });
};

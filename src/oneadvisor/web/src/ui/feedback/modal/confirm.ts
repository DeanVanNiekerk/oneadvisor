import { Modal } from "antd";

import { ConfirmOptions } from "@/app/types";

const defaultOptions: Partial<ConfirmOptions> = {
    title: "Confirm",
    content: "You have unsaved changes are you sure you want to cancel?",
    okText: "Ok",
    cancelText: "Cancel",
};

export const showConfirm = (options: ConfirmOptions) => {
    options = {
        ...defaultOptions,
        ...options,
    };

    Modal.confirm(options);
};

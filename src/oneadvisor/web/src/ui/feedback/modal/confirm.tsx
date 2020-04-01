import { Modal } from "antd";
import { ModalFuncProps } from "antd/lib/modal";
import React from "react";

import { ExclamationCircleOutlined } from "@ant-design/icons";

const defaultOptions: ModalFuncProps = {
    title: "Confirm",
    icon: <ExclamationCircleOutlined />,
    content: "You have unsaved changes are you sure you want to cancel?",
    okText: "Ok",
    cancelText: "Cancel",
};

export const showConfirm = (options: ModalFuncProps) => {
    options = {
        ...defaultOptions,
        ...options,
    };

    Modal.confirm(options);
};

export type ConfirmOptions = {
    title?: string;
    content?: string;
    okText?: string;
    cancelText?: string;
    onCancel?: () => void;
    onOk: () => void;
};

export type ShowConfirm = (options: ConfirmOptions) => void;

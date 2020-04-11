import { Upload as UploadAD } from "antd";
import { RcFile, UploadChangeParam, UploadListType } from "antd/lib/upload/interface";
import React, { useState } from "react";
import { connect } from "react-redux";

import { hasRole, hasUseCase } from "@/app/identity";
import { RootState } from "@/state";
import { roleSelector, tokenSelector, useCaseSelector } from "@/state/auth";
import { UploadOutlined } from "@ant-design/icons";

import { Button } from "../";

type Props = {
    listType?: UploadListType;
    onUploaded?: (response: object) => void;
    onError?: () => void;
    action?: string | ((file: RcFile) => string) | ((file: RcFile) => PromiseLike<string>);
    accept?: string;
    editUseCase?: string;
    editRole?: string;
    readonly?: boolean;
    buttonText?: string;
} & PropsFromState;

const UploadComponent: React.FC<Props> = (props: Props) => {
    const [uploading, setUploading] = useState<boolean>(false);

    let disabled = props.readonly || uploading;

    if (!disabled && props.editUseCase) disabled = !hasUseCase(props.editUseCase, props.useCases);

    if (!disabled && props.editRole) disabled = !hasRole(props.editRole, props.roles);

    const onChange = (info: UploadChangeParam) => {
        if (info.file.status !== "uploading") {
            setUploading(true);
        }

        if (info.file.status === "done") {
            if (props.onUploaded) props.onUploaded(info.file.response);
            setUploading(false);
        } else if (info.file.status === "error") {
            if (props.onError) props.onError();
            setUploading(false);
        }
    };

    return (
        <UploadAD
            //name="file"
            listType={props.listType}
            onChange={onChange}
            action={props.action}
            headers={{
                Authorization: "Bearer " + props.token,
            }}
            disabled={disabled}
            accept={props.accept}
        >
            <Button noLeftMargin={true} type="primary" disabled={disabled}>
                <UploadOutlined /> {props.buttonText ? props.buttonText : "Upload"}
            </Button>
        </UploadAD>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    return {
        token: tokenSelector(state),
        useCases: useCaseSelector(state),
        roles: roleSelector(state),
    };
};

const Upload = connect(mapStateToProps)(UploadComponent);

export { Upload };

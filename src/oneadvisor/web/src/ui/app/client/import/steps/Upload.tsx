import { Upload as UploadAD } from "antd";
import React, { Component } from "react";
import { connect, DispatchProp } from "react-redux";

import { readExcel } from "@/app/excel/helpers";
import {
    clientImportNextStep,
    clientImportSelector,
    ImportData,
    ImportRow,
    receiveClientImportData,
    receiveClientImportFileName,
} from "@/state/client/import";
import { RootState } from "@/state/rootReducer";
import { InboxOutlined } from "@ant-design/icons";

import StepProgress from "../StepProgress";

const Dragger = UploadAD.Dragger;

type Props = {
    data: ImportData;
} & DispatchProp;

class Upload extends Component<Props> {
    customRequest = ({ file, onSuccess }) => {
        const reader = new FileReader();

        reader.readAsArrayBuffer(file);

        this.props.dispatch(receiveClientImportFileName(file.name));

        reader.onload = async () => {
            let data = await readExcel<ImportRow>(reader);

            data = data.filter((d) => d.some((value) => !!value));

            this.props.dispatch(receiveClientImportData(data));

            onSuccess("done", file);
        };
    };

    render() {
        return (
            <>
                <StepProgress
                    nextDisabled={!(this.props.data.length !== 0)}
                    onNext={() => this.props.dispatch(clientImportNextStep())}
                />

                <Dragger multiple={false} accept=".xlsx" customRequest={this.customRequest}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                </Dragger>
            </>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const importState = clientImportSelector(state);

    return {
        data: importState.data,
    };
};

export default connect(mapStateToProps)(Upload);

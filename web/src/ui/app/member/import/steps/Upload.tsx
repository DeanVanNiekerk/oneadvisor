import { Icon, Upload as UploadAD } from 'antd';
import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';
import { read, utils } from 'xlsx';

import { ImportData, receiveMemberImportData } from '@/state/app/member/import';
import { RootState } from '@/state/rootReducer';

const Dragger = UploadAD.Dragger;

type Props = {
    onComplete: () => void;
} & DispatchProp;

class Upload extends Component<Props> {
    customRequest = ({ file, onSuccess }) => {
        var reader = new FileReader();

        reader.readAsArrayBuffer(file);

        reader.onload = () => {
            const fileContents = reader.result;
            const workbook = read(fileContents, { type: 'array' });

            const sheetName1 = workbook.SheetNames[0];
            const sheet1 = workbook.Sheets[sheetName1];

            const data = utils.sheet_to_json(sheet1, {
                header: 1
            }) as ImportData;

            this.props.dispatch(receiveMemberImportData(data));

            this.props.onComplete();

            onSuccess('done', file);
        };
    };

    render() {
        return (
            <>
                <Dragger
                    multiple={false}
                    accept=".xlsx"
                    customRequest={this.customRequest}
                >
                    <p className="ant-upload-drag-icon">
                        <Icon type="inbox" />
                    </p>
                    <p className="ant-upload-text">
                        Click or drag file to this area to upload
                    </p>
                </Dragger>
            </>
        );
    }
}

export default connect()(Upload);

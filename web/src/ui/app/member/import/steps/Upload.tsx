import { Icon, Upload as UploadAD } from 'antd';
import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';
import { read, utils } from 'xlsx';

import {
    ImportData, memberImportNextStep, memberImportSelector, receiveMemberImportData, receiveMemberImportFileName
} from '@/state/app/member/import';
import { RootState } from '@/state/rootReducer';

import StepProgress from '../StepProgress';

const Dragger = UploadAD.Dragger;

type Props = {
    data: ImportData;
} & DispatchProp;

class Upload extends Component<Props> {
    customRequest = ({ file, onSuccess }) => {
        var reader = new FileReader();

        reader.readAsArrayBuffer(file);

        this.props.dispatch(receiveMemberImportFileName(file.name));

        reader.onload = () => {
            const fileContents = reader.result;
            const workbook = read(fileContents, { type: 'array' });

            const sheetName1 = workbook.SheetNames[0];
            const sheet1 = workbook.Sheets[sheetName1];

            let data = utils.sheet_to_json(sheet1, {
                header: 1
            }) as ImportData;

            data = data.filter(d => d.some(value => !!value));

            this.props.dispatch(receiveMemberImportData(data));

            onSuccess('done', file);
        };
    };

    render() {
        return (
            <>
                <StepProgress
                    nextDisabled={!(this.props.data.length !== 0)}
                    onNext={() => this.props.dispatch(memberImportNextStep())}
                />

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

const mapStateToProps = (state: RootState) => {
    const importState = memberImportSelector(state);

    return {
        data: importState.data
    };
};

export default connect(mapStateToProps)(Upload);

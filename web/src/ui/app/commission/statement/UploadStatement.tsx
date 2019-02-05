import { Icon, Upload } from 'antd';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { commissionsImportApi } from '@/config/api/commission';
import { authSelector } from '@/state/auth';
import { RootState } from '@/state/rootReducer';
import { Button } from '@/ui/controls';
import { showMessage } from '@/ui/feedback/notifcation';

type Props = {
    idToken: string;
    onSuccess: () => void;
    commissionStatementId: string;
};

type State = {
    loading: boolean;
};

class UploadStatement extends Component<Props, State> {
    constructor(props) {
        super(props);

        this.state = {
            loading: false
        };
    }

    onChange = info => {
        if (info.file.status !== 'uploading') {
            this.setState({ loading: true });
        }
        if (info.file.status === 'done') {
            showMessage(
                'success',
                'Commission Statement Imported Successfully',
                5
            );
            this.props.onSuccess();
        } else if (info.file.status === 'error') {
            showMessage('error', 'Commission Statement Imported Failed', 5);
        }
    };

    render() {
        return (
            <Upload
                name="file"
                listType="text"
                onChange={this.onChange}
                action={`${commissionsImportApi}/${
                    this.props.commissionStatementId
                }`}
                headers={{
                    Authorization: 'Bearer ' + this.props.idToken
                }}
            >
                <Button>
                    <Icon type="upload" /> Click to Upload
                </Button>
            </Upload>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const authState = authSelector(state);

    return {
        idToken: authState.idToken
    };
};

export default connect(mapStateToProps)(UploadStatement);

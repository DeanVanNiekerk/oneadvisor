import { Alert, Icon, Upload } from 'antd';
import { UploadChangeParam } from 'antd/lib/upload';
import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';

import { commissionsImportApi } from '@/config/api/commission';
import { Statement } from '@/state/app/commission/statements';
import {
    CommissionStatementTemplate, commissionStatementTemplatesSelector, fetchCommissionStatementTemplates
} from '@/state/app/commission/templates';
import { tokenSelector } from '@/state/auth';
import { RootState } from '@/state/rootReducer';
import { Button, Form, FormField, FormSelect } from '@/ui/controls';
import { showMessage } from '@/ui/feedback/notifcation';

type Props = {
    templates: CommissionStatementTemplate[];
    token: string;
    onSuccess: () => void;
    statement: Statement;
    fetching: boolean;
    companyId: string;
} & DispatchProp;

type State = {
    loading: boolean;
    templateId: string | undefined;
};

class UploadStatement extends Component<Props, State> {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            templateId: undefined,
        };
    }

    componentDidMount() {
        this.loadTemplates();
    }

    loadTemplates = () => {
        const filters = {
            date: [this.props.statement.date],
            companyId: [this.props.companyId]
        }
        this.props.dispatch(fetchCommissionStatementTemplates(filters));
    };

    handleTemplateChange = async (fieldName: string, value: any) => {
        this.setState({
            templateId: value,
        });
    };

    onChange = (info: UploadChangeParam) => {
        if (info.file.status !== "uploading") {
            this.setState({ loading: true });
        }
        if (info.file.status === "done") {
            showMessage(
                "success",
                "Commission Statement Imported Successfully",
                5
            );
            this.props.onSuccess();
        } else if (info.file.status === "error") {
            showMessage("error", "Commission Statement Imported Failed", 5);
        }
    };

    render() {

        if (!this.props.fetching && !this.state.loading && this.props.templates.length === 0)
            return <Alert message="Unable to import. There are no valid templates for this statement." type="error" />

        return (
            <Form editUseCase="com_import_commissions">
                <FormSelect
                    fieldName="templateId"
                    label="Template"
                    value={this.state.templateId}
                    onChange={this.handleTemplateChange}
                    options={this.props.templates}
                    optionsValue="id"
                    optionsText="name"
                    loading={this.props.fetching}
                    placeholder="Select Template"
                />
                <FormField label="File">
                    <Upload
                        name="file"
                        listType="text"
                        onChange={this.onChange}
                        action={`${commissionsImportApi}/${
                            this.props.statement.id
                            }?commissionStatementTemplateId=${
                            this.state.templateId
                            }`}
                        headers={{
                            Authorization: "Bearer " + this.props.token,
                        }}
                        disabled={this.props.fetching || !this.state.templateId}
                        accept=".xlsx"
                    >
                        <Button noLeftMargin={true} type="primary">
                            <Icon type="upload" /> Click to Upload
                        </Button>
                    </Upload>
                </FormField>
            </Form>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const tokenState = tokenSelector(state);
    const templatesState = commissionStatementTemplatesSelector(state);

    return {
        token: tokenState.token,
        fetching: templatesState.fetching,
        templates: templatesState.items,
    };
};

export default connect(mapStateToProps)(UploadStatement);

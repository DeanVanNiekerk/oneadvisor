import { Icon, Upload } from 'antd';
import { UploadChangeParam } from 'antd/lib/upload';
import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';

import { commissionsImportApi } from '@/config/api/commission';
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
    commissionStatementId: string;
    fetching: boolean;
    companyId: string;
} & DispatchProp;

type State = {
    loading: boolean;
    templateId: string;
    templates: CommissionStatementTemplate[];
};

class UploadStatement extends Component<Props, State> {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            templateId: "",
            templates: [],
        };
    }

    componentDidMount() {
        if (this.props.templates.length === 0) this.loadTemplates();
        this.setTemplateState();
    }

    componentDidUpdate(prevProps: Props) {
        if (prevProps.templates != this.props.templates)
            this.setTemplateState();
    }

    loadTemplates = () => {
        this.props.dispatch(fetchCommissionStatementTemplates());
    };

    handleChange = async (fieldName: string, value: any) => {
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

    setTemplateState = () => {
        const templates = this.props.templates.filter(
            t => t.companyId == this.props.companyId
        );
        if (templates.length > 0) {
            this.setState({
                templateId: templates[0].id,
                templates: templates,
            });
        } else {
            const defaultTemplate: CommissionStatementTemplate = {
                id: "",
                companyId: "",
                name: "Default",
            };

            this.setState({
                templateId: "",
                templates: [defaultTemplate],
            });
        }
    };

    render() {
        return (
            <Form editUseCase="com_import_commissions">
                <FormSelect
                    fieldName="templateId"
                    label="Template"
                    value={this.state.templateId}
                    onChange={this.handleChange}
                    options={this.state.templates}
                    optionsValue="id"
                    optionsText="name"
                    loading={this.props.fetching}
                />
                <FormField label="File">
                    <Upload
                        name="file"
                        listType="text"
                        onChange={this.onChange}
                        action={`${commissionsImportApi}/${
                            this.props.commissionStatementId
                        }?commissionStatementTemplateId=${
                            this.state.templateId
                        }`}
                        headers={{
                            Authorization: "Bearer " + this.props.token,
                        }}
                        disabled={this.props.fetching}
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

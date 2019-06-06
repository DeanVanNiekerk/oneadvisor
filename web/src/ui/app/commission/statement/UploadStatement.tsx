import { Alert, Card, Icon, Timeline, Typography, Upload } from 'antd';
import { UploadChangeParam } from 'antd/lib/upload';
import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';

import { commissionsImportApi } from '@/config/api/commission';
import { fetchStatementFiles, Statement, statementFilesSelector } from '@/state/app/commission/statements';
import {
    CommissionStatementTemplate, commissionStatementTemplatesSelector, fetchCommissionStatementTemplates
} from '@/state/app/commission/templates';
import { tokenSelector } from '@/state/auth';
import { RootState } from '@/state/rootReducer';
import { FileInfo } from '@/state/types';
import { Button, ContentLoader, Date, Form, FormField, FormSelect, TabPane, Tabs } from '@/ui/controls';
import { showMessage } from '@/ui/feedback/notifcation';

const { Text } = Typography;

type TabKey = "uploads_tab" | "past_uploads_tab";

type Props = {
    templates: CommissionStatementTemplate[];
    token: string;
    onSuccess: () => void;
    statement: Statement;
    fetchingTemplates: boolean;
    companyId: string;
    files: FileInfo[];
    fetchingFiles: boolean;
} & DispatchProp;

type State = {
    loading: boolean;
    templateId: string | undefined;
    activeTab: TabKey;
};

class UploadStatement extends Component<Props, State> {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            templateId: undefined,
            activeTab: "uploads_tab",
        };
    }

    componentDidMount() {
        this.loadTemplates();
        this.loadFiles();
    }

    loadTemplates = () => {
        const filters = {
            date: [ this.props.statement.date ],
            companyId: [ this.props.companyId ],
        };
        this.props.dispatch(fetchCommissionStatementTemplates(filters));
    };

    loadFiles = () => {
        this.props.dispatch(fetchStatementFiles(this.props.statement.id));
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
            showMessage("success", "Commission Statement Imported Successfully", 5);
            this.props.onSuccess();
        } else if (info.file.status === "error") {
            showMessage("error", "Commission Statement Imported Failed", 5);
        }
    };

    onTabChange = (activeTab: TabKey) => {
        this.setState({ activeTab });
    };

    render() {
        let uploadForm = (
            <Form editUseCase="com_import_commissions">
                <FormSelect
                    fieldName="templateId"
                    label="Template"
                    value={this.state.templateId}
                    onChange={this.handleTemplateChange}
                    options={this.props.templates}
                    optionsValue="id"
                    optionsText="name"
                    loading={this.props.fetchingTemplates}
                    placeholder="Select Template"
                />
                <FormField label="File">
                    <Upload
                        name="file"
                        listType="text"
                        onChange={this.onChange}
                        action={`${commissionsImportApi}/${this.props.statement.id}?commissionStatementTemplateId=${this
                            .state.templateId}`}
                        headers={{
                            Authorization: "Bearer " + this.props.token,
                        }}
                        disabled={this.props.fetchingTemplates || !this.state.templateId}
                        accept=".xlsx"
                    >
                        <Button noLeftMargin={true} type="primary">
                            <Icon type="upload" /> Click to Upload
                        </Button>
                    </Upload>
                </FormField>
            </Form>
        );

        if (!this.props.fetchingTemplates && !this.state.loading && this.props.templates.length === 0)
            uploadForm = (
                <Alert message="Unable to import. There are no valid templates for this statement." type="error" />
            );

        return (
            <Tabs onChange={this.onTabChange} activeKey={this.state.activeTab} clearTabsTopPadding={true}>
                <TabPane tab="Upload" key="uploads_tab">
                    {uploadForm}
                </TabPane>
                <TabPane tab="Past Uploads" key="past_uploads_tab">
                    <ContentLoader isLoading={this.props.fetchingFiles}>
                        <Card>
                            <Timeline>
                                {this.props.files.map((f) => {
                                    return (
                                        <Timeline.Item color={f.deleted ? "red" : "blue"}>
                                            <Text delete={f.deleted}>{f.name}</Text> <Date date={f.created} />
                                        </Timeline.Item>
                                    );
                                })}
                            </Timeline>
                        </Card>
                    </ContentLoader>
                </TabPane>
            </Tabs>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const tokenState = tokenSelector(state);
    const templatesState = commissionStatementTemplatesSelector(state);
    const filesState = statementFilesSelector(state);

    return {
        token: tokenState.token,
        fetchingTemplates: templatesState.fetching,
        templates: templatesState.items,
        files: filesState.items,
        fetchingFiles: filesState.fetching,
    };
};

export default connect(mapStateToProps)(UploadStatement);

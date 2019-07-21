import { Modal } from "antd";
import moment from "moment";
import React, { Component } from "react";
import { connect, DispatchProp } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router";

import { hasUseCase } from "@/app/identity";
import { DATE_FORMAT } from "@/app/utils";
import { CommissionErrorsFilters, fetchNextFormatError } from "@/state/app/commission/errors";
import { downloadCommissionErrors, getCommissionErrors } from "@/state/app/commission/errors/list/actions";
import {
    deleteCommissions, fetchStatement, fetchStatementPreview, reimportCommissions, Statement, statementPreviewSelector
} from "@/state/app/commission/statements";
import { companiesSelector, Company } from "@/state/app/directory/lookups";
import { useCaseSelector } from "@/state/auth";
import { RootState } from "@/state/rootReducer";
import {
    Button, CompanyName, Currency, Date, Drawer, DrawerFooter, Header, Icon, PreviewCard, PreviewCardContainer,
    PreviewCardRow
} from "@/ui/controls";
import { showMessage } from "@/ui/feedback/notifcation";

import CommissionList from "../commission/CommissionList";
import EditFormatError from "../error/format/EditFormatError";
import ErrorList from "../error/list/ErrorList";
import EditStatement from "./EditStatement";
import { Processed } from "./Processed";
import { StatementPreviewErrorCount } from "./StatementPreviewErrorCount";
import UploadStatement from "./UploadStatement";

const confirm = Modal.confirm;

type Props = {
    statement: Statement | null;
    fetching: boolean;
    useCases: string[];
    companies: Company[];
} & RouteComponentProps<{ commissionStatementId: string }> &
    DispatchProp;

type State = {
    commissionListVisible: boolean;
    uploadStatementVisible: boolean;
    errorListVisible: boolean;
    deletingCommissionEntries: boolean;
    reimportingCommissionEntries: boolean;
};

class StatementPreviewComponent extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            commissionListVisible: false,
            uploadStatementVisible: false,
            errorListVisible: false,
            deletingCommissionEntries: false,
            reimportingCommissionEntries: false,
        };
    }

    componentDidMount() {
        this.load();
    }

    toggleCommissionListVisible = () => {
        this.setState({
            commissionListVisible: !this.state.commissionListVisible,
        });
    };

    toggleUploadStatementVisible = () => {
        this.setState({
            uploadStatementVisible: !this.state.uploadStatementVisible,
        });
    };

    toggleErrorListVisible = () => {
        this.setState({
            errorListVisible: !this.state.errorListVisible,
        });
    };

    getCommissionStatementId = () => {
        return this.props.match.params.commissionStatementId;
    };

    load = () => {
        this.props.dispatch(fetchStatementPreview(this.getCommissionStatementId()));
    };

    onFormClose = (cancelled: boolean) => {
        if (!cancelled) this.load();
    };

    editDetails = () => {
        this.props.dispatch(fetchStatement(this.getCommissionStatementId()));
    };

    deleteCommissions = () => {
        confirm({
            title: "Are you sure you want to delete all commission entries?",
            content:
                "All commission entries including any errors will be permanenty deleted, are you sure you wish to continue?",
            onOk: () => {
                showMessage("loading", "Deleting commission entries", 5);
                this.setState({ deletingCommissionEntries: true });
                this.props.dispatch(
                    deleteCommissions(
                        this.getCommissionStatementId(),
                        //Success
                        () => {
                            this.setState({ deletingCommissionEntries: false });
                            showMessage("success", "Commission entries successfully deleted", 5, true);
                            this.load();
                        },
                        //Failure
                        () => {
                            this.setState({ deletingCommissionEntries: false });
                            showMessage("error", "Error deleting commission entries", 5, true);
                        }
                    )
                );
            },
        });
    };

    reimportCommissions = () => {
        confirm({
            title: "Are you sure you want to reimport all commission entries?",
            content:
                "All existing commission entries including any errors will be deleted before import, are you sure you wish to continue?",
            onOk: () => {
                showMessage("loading", "Reimporting commission entries", 5);
                this.setState({ reimportingCommissionEntries: true });
                this.props.dispatch(
                    reimportCommissions(
                        this.getCommissionStatementId(),
                        //Success
                        () => {
                            this.setState({ reimportingCommissionEntries: false });
                            showMessage("success", "Commission entries successfully imported", 5, true);
                            this.load();
                        },
                        //Failure
                        () => {
                            this.setState({ reimportingCommissionEntries: false });
                            showMessage("error", "Error importing commission entries", 5, true);
                        }
                    )
                );
            },
        });
    };

    isLoading = () => {
        return this.props.fetching && this.props.statement === null;
    };

    getCommissionEntriesActions = () => {
        const actions = [
            <Icon tooltip="View Commission Entries" type="bars" onClick={this.toggleCommissionListVisible} />,
        ];

        if (hasUseCase("com_edit_commission_statements", this.props.useCases))
            actions.unshift(
                <Icon
                    tooltip="Delete Commission Entries"
                    type={this.state.deletingCommissionEntries ? "loading-3-quarters" : "delete"}
                    className="text-error"
                    spin={this.state.deletingCommissionEntries}
                    onClick={event => {
                        this.deleteCommissions();
                        event.stopPropagation();
                    }}
                />
            );

        return actions;
    };

    getStatementFilesActions = () => {
        const actions = [
            <Icon tooltip="Upload Commission Statement" type="upload" onClick={this.toggleUploadStatementVisible} />,
        ];

        if (this.props.statement && this.props.statement.commissionCount > 0)
            actions.unshift(
                <Icon
                    tooltip="Reimport Commission Statement File"
                    type={this.state.reimportingCommissionEntries ? "loading-3-quarters" : "reload"}
                    spin={this.state.reimportingCommissionEntries}
                    className="text-primary"
                    onClick={event => {
                        this.reimportCommissions();
                        event.stopPropagation();
                    }}
                />
            );

        return actions;
    };

    getNextFormatError = () => {
        if (this.props.statement === null) return;

        this.props.dispatch(fetchNextFormatError(this.props.statement.id));
    };

    downloadMappingErrors = () => {
        if (this.props.statement === null) return;

        const filters: CommissionErrorsFilters = {
            isFormatValid: [true.toString()],
            commissionStatementId: [this.props.statement.id],
        };

        this.props.dispatch(
            getCommissionErrors(filters, errors => {
                if (this.props.statement === null) return;
                downloadCommissionErrors(
                    errors,
                    this.getCompanyName(),
                    moment(this.props.statement.date).format(DATE_FORMAT)
                );
            })
        );
    };

    getCompanyName = () => {
        let companyId = "";
        if (this.props.statement !== null) companyId = this.props.statement.companyId;
        const company = this.props.companies.find(u => u.id === companyId);
        return company ? company.name : "";
    };

    back = () => {
        return this.props.history.push("/commission");
    };

    render() {
        let { statement } = this.props;
        const cardHeight = "130px";

        return (
            <>
                <Header icon="reconciliation" loading={this.isLoading()} onBack={this.back}>
                    {statement && (
                        <span>
                            <CompanyName companyId={statement.companyId} />
                            {": "}
                            <Date date={statement.date} />
                        </span>
                    )}
                </Header>

                <PreviewCardContainer>
                    <PreviewCard
                        title="Details"
                        icon="profile"
                        onClick={this.editDetails}
                        isLoading={this.isLoading()}
                        actions={[<Icon tooltip="Edit Commission Statement" type="edit" onClick={this.editDetails} />]}
                        rows={3}
                        height={cardHeight}
                    >
                        {statement && (
                            <>
                                <PreviewCardRow label="Status" value={<Processed processed={statement.processed} />} />
                                <PreviewCardRow
                                    label="Amount (incl VAT)"
                                    value={<Currency amount={statement.amountIncludingVAT} />}
                                />
                                <PreviewCardRow label="VAT" value={<Currency amount={statement.vat} />} />
                            </>
                        )}
                    </PreviewCard>
                    <PreviewCard
                        title="Commission Entries"
                        icon="dollar"
                        onClick={this.toggleCommissionListVisible}
                        isLoading={this.isLoading()}
                        actions={this.getCommissionEntriesActions()}
                        rows={3}
                        height={cardHeight}
                    >
                        {statement && (
                            <>
                                <PreviewCardRow label="Total Entries" value={statement.commissionCount} />
                                <PreviewCardRow
                                    label="Amount (incl VAT)"
                                    value={<Currency amount={statement.actualAmountIncludingVAT} />}
                                />
                                <PreviewCardRow label="VAT" value={<Currency amount={statement.actualVAT} />} />
                            </>
                        )}
                    </PreviewCard>
                    <PreviewCard
                        title="Statement Files"
                        icon="file-excel"
                        onClick={this.toggleUploadStatementVisible}
                        isLoading={this.isLoading()}
                        rows={4}
                        height={cardHeight}
                        requiredUseCase="com_import_commissions"
                        actions={this.getStatementFilesActions()}
                    >
                        <div className="text-center">
                            <Icon
                                type="file-excel"
                                style={{
                                    fontSize: "36px",
                                    paddingTop: "25px",
                                }}
                            />
                        </div>
                    </PreviewCard>
                    {statement && statement.formatErrorCount > 0 && (
                        <PreviewCard
                            title="Format Errors"
                            icon="file-exclamation"
                            isLoading={this.isLoading()}
                            rows={3}
                            onClick={this.getNextFormatError}
                            actions={[<Icon type="tool" />]}
                            height={cardHeight}
                        >
                            {statement && (
                                <StatementPreviewErrorCount count={statement.formatErrorCount} errorType="format" />
                            )}
                        </PreviewCard>
                    )}
                    {statement && statement.mappingErrorCount > 0 && (
                        <PreviewCard
                            title="Mapping Errors"
                            icon="file-exclamation"
                            isLoading={this.isLoading()}
                            rows={3}
                            onClick={this.toggleErrorListVisible}
                            actions={[
                                <Icon type="tool" />,
                                <Icon
                                    type="download"
                                    onClick={event => {
                                        this.downloadMappingErrors();
                                        event.stopPropagation();
                                    }}
                                />,
                            ]}
                            height={cardHeight}
                        >
                            {statement && (
                                <StatementPreviewErrorCount count={statement.mappingErrorCount} errorType="mapping" />
                            )}
                        </PreviewCard>
                    )}
                </PreviewCardContainer>

                <EditStatement onClose={this.onFormClose} />
                <EditFormatError
                    statementId={this.props.statement ? this.props.statement.id : ""}
                    remainingErrors={this.props.statement ? this.props.statement.formatErrorCount : 0}
                    onUpdate={this.load}
                />

                <Drawer
                    title="Commission Entries"
                    icon="dollar"
                    noTopPadding={true}
                    visible={this.state.commissionListVisible}
                    onClose={this.toggleCommissionListVisible}
                >
                    <CommissionList
                        hideHeaderText={true}
                        commissionStatementId={this.getCommissionStatementId()}
                        onCommissionsUpdate={this.load}
                        hideColumns={["commissionStatementDate", "policyClientInitials", "policyCompanyId"]}
                    />
                    <DrawerFooter>
                        <Button onClick={this.toggleCommissionListVisible}>Close</Button>
                    </DrawerFooter>
                </Drawer>

                <Drawer
                    title="Statement Files"
                    icon="file-excel"
                    visible={this.state.uploadStatementVisible}
                    onClose={this.toggleUploadStatementVisible}
                >
                    {statement && (
                        <UploadStatement
                            statement={statement}
                            companyId={statement.companyId}
                            onSuccess={() => {
                                this.load();
                                this.toggleUploadStatementVisible();
                            }}
                        />
                    )}

                    <DrawerFooter>
                        <Button onClick={this.toggleUploadStatementVisible}>Close</Button>
                    </DrawerFooter>
                </Drawer>

                {statement && (
                    <Drawer
                        title={`Mapping Errors - ${statement.mappingErrorCount} remaining`}
                        icon="file-exclamation"
                        visible={this.state.errorListVisible}
                        onClose={this.toggleErrorListVisible}
                    >
                        <ErrorList statement={statement} onUpdate={this.load} />
                        <DrawerFooter>
                            <Button onClick={this.toggleErrorListVisible}>Close</Button>
                        </DrawerFooter>
                    </Drawer>
                )}
            </>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const statementState = statementPreviewSelector(state);
    const companiesState = companiesSelector(state);

    return {
        statement: statementState.statement,
        fetching: statementState.fetching,
        useCases: useCaseSelector(state),
        companies: companiesState.items,
    };
};

export default withRouter(connect(mapStateToProps)(StatementPreviewComponent));

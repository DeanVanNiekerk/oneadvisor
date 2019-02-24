import { Icon, Modal } from 'antd';
import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';

import { hasUseCase } from '@/app/identity';
import { fetchNextFormatError, fetchNextMappingError } from '@/state/app/commission/errors';
import {
    deleteCommissions, fetchStatement, fetchStatementPreview, Statement, statementPreviewSelector
} from '@/state/app/commission/statements';
import { authSelector } from '@/state/auth';
import { RootState } from '@/state/rootReducer';
import {
    Button, CompanyName, Currency, Date, Drawer, DrawerFooter, Header, PreviewCard, PreviewCardContainer, PreviewCardRow
} from '@/ui/controls';
import { showMessage } from '@/ui/feedback/notifcation';

import CommissionList from '../commission/CommissionList';
import EditFormatError from '../error/format/EditFormatError';
import EditMappingError from '../error/mapping/EditMappingError';
import EditStatement from './EditStatement';
import { Processed } from './Processed';
import { StatementPreviewErrorCount } from './StatementPreviewErrorCount';
import UploadStatement from './UploadStatement';

const confirm = Modal.confirm;

type Props = {
    statement: Statement | null;
    fetching: boolean;
    useCases: string[];
} & RouteComponentProps<{ commissionStatementId: string }> &
    DispatchProp;

type State = {
    commissionListVisible: boolean;
};

class StatementPreviewComponent extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            commissionListVisible: false
        };
    }

    componentDidMount() {
        this.load();
    }

    toggleCommissionListVisible = () => {
        this.setState({
            commissionListVisible: !this.state.commissionListVisible
        });
    };

    getCommissionStatementId = () => {
        return this.props.match.params.commissionStatementId;
    };

    load = () => {
        this.props.dispatch(
            fetchStatementPreview(this.getCommissionStatementId())
        );
    };

    onFormClose = (cancelled: boolean) => {
        if (!cancelled) this.load();
    };

    editDetails = () => {
        this.props.dispatch(fetchStatement(this.getCommissionStatementId()));
    };

    deleteCommissions = () => {
        confirm({
            title: 'Are you sure you want to delete all commission entries?',
            content:
                'All commission entries including any errors will be permanenty deleted, are you sure you wish to continue?',
            onOk: () => {
                this.props.dispatch(
                    deleteCommissions(this.getCommissionStatementId(), () => {
                        showMessage(
                            'success',
                            'Commission entries successfully deleted',
                            5
                        );
                        this.load();
                    })
                );
            }
        });
    };

    isLoading = () => {
        return this.props.fetching && this.props.statement === null;
    };

    getCommissionEntriesActions = () => {
        const actions = [
            <Icon type="bars" onClick={this.toggleCommissionListVisible} />
        ];

        if (hasUseCase('com_edit_commission_statements', this.props.useCases))
            actions.unshift(
                <Icon
                    type="delete"
                    onClick={event => {
                        this.deleteCommissions();
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

    getNextMappingError = () => {
        if (this.props.statement === null) return;

        this.props.dispatch(fetchNextMappingError(this.props.statement.id));
    };

    showCommissionUploadInfo = () => {
        Modal.info({
            title: 'Excel Column Order',
            content: (
                <div>
                    <ol>
                        <li>
                            <b className="text-primary">Policy Number</b>
                            <span className="pull-right">(Required)</span>
                        </li>
                        <li>
                            <b className="text-primary">AmountIncludingVAT</b>
                            <span className="pull-right">(Required)</span>
                        </li>
                        <li>
                            <b className="text-primary">VAT</b>
                            <span className="pull-right">(Required)</span>
                        </li>
                        <li>
                            <b className="text-primary">CommissionTypeCode</b>
                            <span className="pull-right">(Required)</span>
                        </li>
                        <li>LastName</li>
                        <li>DateOfBirth (YYYY-MM-DD)</li>
                        <li>FirstName</li>
                        <li>IdNumber</li>
                        <li>Initials</li>
                    </ol>
                </div>
            )
        });
    };

    render() {
        let { statement } = this.props;
        const minCardHeight = '230px';

        return (
            <>
                <Header icon="table" loading={this.isLoading()}>
                    {statement && (
                        <span>
                            <CompanyName companyId={statement.companyId} />
                            {': '}
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
                        actions={[
                            <Icon type="edit" onClick={this.editDetails} />
                        ]}
                        rows={3}
                        minHeight={minCardHeight}
                    >
                        {statement && (
                            <>
                                <PreviewCardRow
                                    label="Status"
                                    value={
                                        <Processed
                                            processed={statement.processed}
                                        />
                                    }
                                />
                                <PreviewCardRow
                                    label="Amount (incl VAT)"
                                    value={
                                        <Currency
                                            amount={
                                                statement.amountIncludingVAT
                                            }
                                        />
                                    }
                                />
                                <PreviewCardRow
                                    label="VAT"
                                    value={<Currency amount={statement.vat} />}
                                />
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
                        minHeight={minCardHeight}
                    >
                        {statement && (
                            <>
                                <PreviewCardRow
                                    label="Total Entries"
                                    value={statement.commissionCount}
                                />
                                <PreviewCardRow
                                    label="Amount (incl VAT)"
                                    value={
                                        <Currency
                                            amount={
                                                statement.actualAmountIncludingVAT
                                            }
                                        />
                                    }
                                />
                                <PreviewCardRow
                                    label="VAT"
                                    value={
                                        <Currency
                                            amount={statement.actualVAT}
                                        />
                                    }
                                />
                            </>
                        )}
                    </PreviewCard>
                    <PreviewCard
                        title="Upload Statement"
                        titleExtra={
                            <Icon
                                type="info-circle"
                                className="text-primary"
                                onClick={this.showCommissionUploadInfo}
                            />
                        }
                        icon="upload"
                        isLoading={this.isLoading()}
                        rows={3}
                        minHeight={minCardHeight}
                        requiredUseCase="com_import_commissions"
                    >
                        {statement && (
                            <UploadStatement
                                commissionStatementId={statement.id}
                                onSuccess={this.load}
                            />
                        )}
                    </PreviewCard>
                    {statement && statement.formatErrorCount > 0 && (
                        <PreviewCard
                            title="Format Errors"
                            icon="file-exclamation"
                            isLoading={this.isLoading()}
                            rows={3}
                            onClick={this.getNextFormatError}
                            actions={[<Icon type="tool" />]}
                        >
                            {statement && (
                                <StatementPreviewErrorCount
                                    count={statement.formatErrorCount}
                                />
                            )}
                        </PreviewCard>
                    )}
                    {statement && statement.mappingErrorCount > 0 && (
                        <PreviewCard
                            title="Mapping Errors"
                            icon="file-exclamation"
                            isLoading={this.isLoading()}
                            rows={3}
                            onClick={this.getNextMappingError}
                            actions={[<Icon type="tool" />]}
                        >
                            {statement && (
                                <StatementPreviewErrorCount
                                    count={statement.mappingErrorCount}
                                />
                            )}
                        </PreviewCard>
                    )}
                </PreviewCardContainer>

                <EditStatement onClose={this.onFormClose} />
                <EditFormatError
                    statementId={
                        this.props.statement ? this.props.statement.id : ''
                    }
                    remainingErrors={
                        this.props.statement
                            ? this.props.statement.formatErrorCount
                            : 0
                    }
                    onUpdate={this.load}
                />
                {this.props.statement && (
                    <EditMappingError
                        statement={this.props.statement}
                        remainingErrors={
                            this.props.statement
                                ? this.props.statement.mappingErrorCount
                                : 0
                        }
                        onUpdate={this.load}
                    />
                )}

                <Drawer
                    title="Commission Entries"
                    icon="dollar"
                    noTopPadding={true}
                    visible={this.state.commissionListVisible}
                    onClose={this.toggleCommissionListVisible}
                >
                    <CommissionList
                        commissionStatementId={this.getCommissionStatementId()}
                        onCommissionsUpdate={this.load}
                    />
                    <DrawerFooter>
                        <Button onClick={this.toggleCommissionListVisible}>
                            Close
                        </Button>
                    </DrawerFooter>
                </Drawer>
            </>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const statementState = statementPreviewSelector(state);
    const identityState = authSelector(state);

    return {
        statement: statementState.statement,
        fetching: statementState.fetching,
        useCases: identityState.identity
            ? identityState.identity.useCaseIds
            : []
    };
};

export default withRouter(connect(mapStateToProps)(StatementPreviewComponent));

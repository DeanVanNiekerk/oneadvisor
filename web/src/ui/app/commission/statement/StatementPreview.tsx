import { Icon, Modal } from 'antd';
import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';

import { hasUseCase } from '@/app/identity';
import {
    deleteCommissions, fetchStatement, fetchStatementPreview, Statement, statementPreviewSelector
} from '@/state/app/commission/statements';
import { identitySelector } from '@/state/app/directory/identity';
import { RootState } from '@/state/rootReducer';
import {
    Button, CompanyName, Currency, Date, Drawer, DrawerFooter, Header, PreviewCard, PreviewCardContainer, PreviewCardRow
} from '@/ui/controls';
import { showMessage } from '@/ui/feedback/notifcation';

import CommissionList from '../commission/CommissionList';
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
                        actions={[
                            <Icon
                                type="bars"
                                onClick={this.toggleCommissionListVisible}
                            />,
                            <Icon
                                type="delete"
                                onClick={event => {
                                    this.deleteCommissions();
                                    event.stopPropagation();
                                }}
                            />
                        ]}
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
                        icon="upload"
                        isLoading={this.isLoading()}
                        rows={3}
                        minHeight={minCardHeight}
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
                            onClick={() => alert('TODO')}
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
                            onClick={() => alert('TODO')}
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
    const identityState = identitySelector(state);

    return {
        statement: statementState.statement,
        fetching: statementState.fetching,
        useCases: identityState.identity
            ? identityState.identity.useCaseIds
            : []
    };
};

export default withRouter(connect(mapStateToProps)(StatementPreviewComponent));

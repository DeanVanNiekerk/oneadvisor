import { Card, Col, Icon, Row, Skeleton } from 'antd';
import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';

import { hasUseCase } from '@/app/identity';
import {
    fetchStatement, fetchStatementPreview, Statement, statementPreviewSelector
} from '@/state/app/commission/statements';
import { identitySelector } from '@/state/app/directory/identity';
import { RootState } from '@/state/rootReducer';
import {
    Button, CompanyName, Currency, Date, Drawer, DrawerFooter, Header, PreviewCard, PreviewCardContainer, PreviewCardRow
} from '@/ui/controls';

import CommissionList from '../commission/CommissionList';
import EditStatement from './EditStatement';
import { Processed } from './Processed';

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

    isLoading = () => {
        return this.props.fetching;
    };

    render() {
        let { statement } = this.props;

        return (
            <>
                <Header loading={this.isLoading()}>
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
                        onClick={this.editDetails}
                        isLoading={this.isLoading()}
                        actions={[
                            <Icon type="edit" onClick={this.editDetails} />
                        ]}
                        rows={3}
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
                        onClick={this.toggleCommissionListVisible}
                        isLoading={this.isLoading()}
                        actions={[
                            <Icon
                                type="bars"
                                onClick={this.toggleCommissionListVisible}
                            />
                        ]}
                        rows={3}
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
                </PreviewCardContainer>

                <EditStatement onClose={this.onFormClose} />

                <Drawer
                    title="Commission Entries"
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

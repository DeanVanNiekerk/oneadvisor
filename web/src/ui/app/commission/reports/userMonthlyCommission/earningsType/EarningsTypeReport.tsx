import { Icon } from 'antd';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
    UserEarningsTypeMonthlyCommissionData, userEarningsTypeMonthlyCommissionSelector
} from '@/state/app/commission/reports';
import {
    userEarningsTypeMonthlyCommissionItemsSelector, userEarningsTypeMonthlyCommissionTotalSelector
} from '@/state/app/commission/reports/userEarningsTypeMonthlyCommission/selectors';
import { RootState } from '@/state/rootReducer';
import { TabPane, Tabs } from '@/ui/controls';

import EarningsTypeChart from './EarningsTypeChart';
import EarningsTypeTable from './EarningsTypeTable';

type TabKey =
    | "table"
    | "chart";

type Props = {
    earningsTypeRecords: UserEarningsTypeMonthlyCommissionData[];
    fetching: boolean;
    earningsTypeTotal: number;
};

type State = {
    activeTab: TabKey;
};

class EarningsTypeReport extends Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            activeTab: "table",
        };
    }

    onTabChange = (activeTab: TabKey) => {
        this.setState({ activeTab });
    };

    render() {
        return (
            <Tabs
                onChange={this.onTabChange}
                activeKey={this.state.activeTab}
                sticky={true}
                tabBarGutter={0}
                clearTabsTopPadding={true}
            >
                <TabPane tab={<Icon type="table" className="mr-0" />} key="table">
                    <EarningsTypeTable earningsTypeRecords={this.props.earningsTypeRecords} fetching={this.props.fetching} earningsTypeTotal={this.props.earningsTypeTotal} />
                </TabPane>
                <TabPane tab={<Icon type="pie-chart" className="mr-0" />} key="chart">
                    <EarningsTypeChart earningsTypeRecords={this.props.earningsTypeRecords} fetching={this.props.fetching} earningsTypeTotal={this.props.earningsTypeTotal} />
                </TabPane>
            </Tabs>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const userEarningsTypeMonthlyCommissionState = userEarningsTypeMonthlyCommissionSelector(state);

    return {
        earningsTypeRecords: userEarningsTypeMonthlyCommissionItemsSelector(state),
        fetching: userEarningsTypeMonthlyCommissionState.fetching,
        earningsTypeTotal: userEarningsTypeMonthlyCommissionTotalSelector(state),
    };
};

export default connect(mapStateToProps)(EarningsTypeReport);

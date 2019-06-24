import { Icon } from 'antd';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { UserCompanyMonthlyCommissionData, userCompanyMonthlyCommissionSelector } from '@/state/app/commission/reports';
import {
    userCompanyMonthlyCommissionTotalSelector
} from '@/state/app/commission/reports/userCompanyMonthlyCommission/selectors';
import { RootState } from '@/state/rootReducer';
import { TabPane, Tabs } from '@/ui/controls';

import CompanyChart from './CompanyChart';
import CompanyTable from './CompanyTable';

type TabKey =
    | "table"
    | "chart";

type Props = {
    companyRecords: UserCompanyMonthlyCommissionData[];
    fetching: boolean;
    companyTotal: number;
};

type State = {
    activeTab: TabKey;
};

class CompanyReport extends Component<Props, State> {

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
                //clearTabsTopPadding={true}
            >
                <TabPane tab={<Icon type="table" className="mr-0" />} key="table">
                    <CompanyTable companyRecords={this.props.companyRecords} fetching={this.props.fetching} companyTotal={this.props.companyTotal} />
                </TabPane>
                <TabPane tab={<Icon type="pie-chart" className="mr-0" />} key="chart" className="pt-0">
                    <CompanyChart companyRecords={this.props.companyRecords} fetching={this.props.fetching} companyTotal={this.props.companyTotal} />
                </TabPane>
            </Tabs>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const userCompanyMonthlyCommissionState = userCompanyMonthlyCommissionSelector(state);

    return {
        companyRecords: userCompanyMonthlyCommissionState.items,
        fetching: userCompanyMonthlyCommissionState.fetching,
        companyTotal: userCompanyMonthlyCommissionTotalSelector(state),
    };
};

export default connect(mapStateToProps)(CompanyReport);

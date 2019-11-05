import { Col, Row } from "antd";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import {
    fetchUserCompanyMonthlyCommissionData,
    fetchUserEarningsTypeMonthlyCommissionData,
} from "@/state/app/commission/reports";

import CompanyReport from "./company/CompanyReport";
import EarningsTypeReport from "./earningsType/EarningsTypeReport";
import UserMonthlyCommissionFilters from "./UserMonthlyCommissionFilters";
import UserMonthlyCommissionHeader from "./UserMonthlyCommissionHeader";

type Props = PropsFromDispatch;

const UserMonthlyCommissionReport: React.FC<Props> = (props: Props) => {
    return (
        <>
            <UserMonthlyCommissionHeader />

            <UserMonthlyCommissionFilters />

            <Row gutter={32}>
                <Col span={12}>
                    <EarningsTypeReport />
                </Col>
                <Col span={12}>
                    <CompanyReport />
                </Col>
            </Row>
        </>
    );
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        ...bindActionCreators(
            { fetchUserEarningsTypeMonthlyCommissionData, fetchUserCompanyMonthlyCommissionData },
            dispatch
        ),
    };
};

export default connect(
    null,
    mapDispatchToProps
)(UserMonthlyCommissionReport);

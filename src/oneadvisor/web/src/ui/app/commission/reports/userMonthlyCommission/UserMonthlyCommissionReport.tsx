import { Col, Row } from "antd";
import React from "react";

import CompanyReport from "./company/CompanyReport";
import EarningsTypeReport from "./earningsType/EarningsTypeReport";
import UserMonthlyCommissionFilters from "./UserMonthlyCommissionFilters";
import UserMonthlyCommissionHeader from "./UserMonthlyCommissionHeader";

const UserMonthlyCommissionReport: React.FC = () => {
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

export default UserMonthlyCommissionReport;

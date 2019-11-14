import { Col, Row } from "antd";
import React from "react";
import { connect } from "react-redux";

import { getColumnDefinition } from "@/app/table";
import { formatCurrency } from "@/app/utils";
import {
    UserCompanyMonthlyCommissionData,
    userCompanyMonthlyCommissionSelector,
} from "@/state/app/commission/reports";
import { userCompanyMonthlyCommissionTotalAmountExclVatSelector } from "@/state/app/commission/reports/userCompanyMonthlyCommission/selectors";
import { RootState } from "@/state/rootReducer";
import { CompanyName, getTable } from "@/ui/controls";

const Table = getTable<UserCompanyMonthlyCommissionData>();

type Props = PropsFromState;

const CompanyTable: React.FC<Props> = (props: Props) => {
    return (
        <Table
            header="By Company"
            rowKey="companyId"
            columns={getColumns()}
            dataSource={props.companyRecords}
            loading={props.fetching}
            footer={() => <TableFooter total={props.companyTotal} />}
        />
    );
};

const getColumns = () => {
    const getColumn = getColumnDefinition<UserCompanyMonthlyCommissionData>();
    return [
        getColumn(
            "companyId",
            "Company",
            {},
            {
                render: (companyId: string) => {
                    return <CompanyName companyId={companyId} />;
                },
            }
        ),
        getColumn("amountExcludingVAT", "Amount", {
            type: "currency",
        }),
    ];
};

const TableFooter: React.FC<{ total: number }> = ({ total }) => {
    return (
        <Row type="flex" justify="space-between">
            <Col>
                <b>Total Amount (excl VAT): </b>
                {formatCurrency(total)}
            </Col>
        </Row>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    const userCompanyMonthlyCommissionState = userCompanyMonthlyCommissionSelector(state);

    return {
        companyRecords: userCompanyMonthlyCommissionState.items,
        fetching: userCompanyMonthlyCommissionState.fetching,
        companyTotal: userCompanyMonthlyCommissionTotalAmountExclVatSelector(state),
    };
};

export default connect(mapStateToProps)(CompanyTable);

import { Col, Row } from "antd";
import React from "react";
import { connect } from "react-redux";

import { getColumnDefinition } from "@/app/table";
import { formatCurrency } from "@/app/utils";
import {
    UserEarningsTypeMonthlyCommissionData,
    userEarningsTypeMonthlyCommissionItemsSelector,
    userEarningsTypeMonthlyCommissionSelector,
    userEarningsTypeMonthlyCommissionTotalAmountExclVatSelector,
} from "@/state/app/commission/reports";
import { RootState } from "@/state/rootReducer";
import { CommissionEarningsTypeName, getTable } from "@/ui/controls";

const Table = getTable<UserEarningsTypeMonthlyCommissionData>();

type Props = PropsFromState;

const EarningsTypeTable: React.FC<Props> = (props: Props) => {
    return (
        <Table
            header="By Commission Earnings Type"
            rowKey="commissionEarningsTypeId"
            columns={getColumns()}
            dataSource={props.earningsTypeRecords}
            loading={props.fetching}
            hidePagination={true}
            footer={() => <TableFooter total={props.earningsTypeTotal} />}
        />
    );
};

const getColumns = () => {
    const getColumn = getColumnDefinition<UserEarningsTypeMonthlyCommissionData>();
    return [
        getColumn(
            "commissionEarningsTypeId",
            "Type",
            {},
            {
                render: (commissionEarningsTypeId: string) => {
                    return (
                        <CommissionEarningsTypeName
                            commissionEarningsTypeId={commissionEarningsTypeId}
                        />
                    );
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
        <Row justify="space-between">
            <Col>
                <b>Total Amount (excl VAT): </b>
                {formatCurrency(total)}
            </Col>
        </Row>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    const userEarningsTypeMonthlyCommissionState = userEarningsTypeMonthlyCommissionSelector(state);

    return {
        earningsTypeRecords: userEarningsTypeMonthlyCommissionItemsSelector(state),
        fetching: userEarningsTypeMonthlyCommissionState.fetching,
        earningsTypeTotal: userEarningsTypeMonthlyCommissionTotalAmountExclVatSelector(state),
    };
};

export default connect(mapStateToProps)(EarningsTypeTable);

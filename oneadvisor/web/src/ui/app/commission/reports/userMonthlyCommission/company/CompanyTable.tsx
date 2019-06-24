import { Col, Row } from 'antd';
import React, { Component } from 'react';

import { getColumnDefinition } from '@/app/table';
import { formatCurrency } from '@/app/utils';
import { UserCompanyMonthlyCommissionData } from '@/state/app/commission/reports';
import { CompanyName, getTable } from '@/ui/controls';

const Table = getTable<UserCompanyMonthlyCommissionData>();

type Props = {
    companyRecords: UserCompanyMonthlyCommissionData[];
    fetching: boolean;
    companyTotal: number;
};

class CompanyTable extends Component<Props> {
    getColumns = () => {
        var getColumn = getColumnDefinition<UserCompanyMonthlyCommissionData>();
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

    tableFooter = (total: number) => {
        return (
            <Row type="flex" justify="space-between">
                <Col>
                    <b>Total Amount (incl VAT): </b>
                    {formatCurrency(total)}
                </Col>
            </Row>
        );
    };

    render() {

        return (
            <Table
                header="By Company"
                rowKey="companyId"
                columns={this.getColumns()}
                dataSource={this.props.companyRecords}
                loading={this.props.fetching}
                footer={() => this.tableFooter(this.props.companyTotal)}
            />
        );
    }
}

export default CompanyTable;

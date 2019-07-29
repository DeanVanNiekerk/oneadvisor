import { Col, Row } from "antd";
import React, { Component } from "react";

import { getColumnDefinition } from "@/app/table";
import { formatCurrency } from "@/app/utils";
import { UserEarningsTypeMonthlyCommissionData } from "@/state/app/commission/reports";
import { CommissionEarningsTypeName, getTable } from "@/ui/controls";

const Table = getTable<UserEarningsTypeMonthlyCommissionData>();

type Props = {
	earningsTypeRecords: UserEarningsTypeMonthlyCommissionData[];
	fetching: boolean;
	earningsTypeTotal: number;
};

class EarningsTypeTable extends Component<Props> {
	getColumns = () => {
		var getColumn = getColumnDefinition<UserEarningsTypeMonthlyCommissionData>();
		return [
			getColumn(
				"commissionEarningsTypeId",
				"Type",
				{},
				{
					render: (commissionEarningsTypeId: string) => {
						return <CommissionEarningsTypeName commissionEarningsTypeId={commissionEarningsTypeId} />;
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
					<b>Total Amount (excl VAT): </b>
					{formatCurrency(total)}
				</Col>
			</Row>
		);
	};

	render() {
		return (
			<Table
				header="By Commission Earnings Type"
				rowKey="commissionEarningsTypeId"
				columns={this.getColumns()}
				dataSource={this.props.earningsTypeRecords}
				loading={this.props.fetching}
				hidePagination={true}
				footer={() => this.tableFooter(this.props.earningsTypeTotal)}
			/>
		);
	}
}

export default EarningsTypeTable;

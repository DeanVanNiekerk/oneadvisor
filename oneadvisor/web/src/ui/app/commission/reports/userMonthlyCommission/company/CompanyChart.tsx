import React, { Component } from 'react';
import { connect } from 'react-redux';

import { formatCurrency } from '@/app/utils';
import { UserCompanyMonthlyCommissionData } from '@/state/app/commission/reports';
import { organisationCompaniesSelector, Company, getCompanyName } from '@/state/app/directory/lookups';
import { RootState } from '@/state/rootReducer';
import { Pie } from '@/ui/controls';
import { PieDatum } from '@nivo/pie';

type Props = {
    companyRecords: UserCompanyMonthlyCommissionData[];
    fetching: boolean;
    companyTotal: number;
    companies: Company[];
};

class CompanyChart extends Component<Props> {

    total = () => {
        return this.props.companyRecords.reduce((p, c) => p + c.amountExcludingVAT, 0);
    }

    percent = (value: number) => {
        return value / this.total() * 100;
    }

    data = (): PieDatum[] => {
        return this.props.companyRecords
            .filter(r => r.amountExcludingVAT > 0)
            .map(r => {
                return {
                    id: r.companyId,
                    label: getCompanyName(r.companyId, this.props.companies),
                    value: r.amountExcludingVAT,
                }
            })
    }

    render() {

        return (
            <Pie
                isLoading={this.props.fetching}
                data={this.data()}
                sliceLabel={(d) => this.percent(d.value) > 10 ? formatCurrency(d.value, 0) : ""}
                tooltipFormat={value => formatCurrency(value, 0)}
                startAngle={-45}
            />
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const companiesState = organisationCompaniesSelector(state);

    return {
        companies: companiesState,
    };
};

export default connect(mapStateToProps)(CompanyChart);

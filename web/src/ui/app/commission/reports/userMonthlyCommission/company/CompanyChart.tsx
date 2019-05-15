import React, { Component } from 'react';
import { connect } from 'react-redux';

import { formatCurrency } from '@/app/utils';
import { UserCompanyMonthlyCommissionData } from '@/state/app/commission/reports';
import { companiesSelector, Company, getCompanyName } from '@/state/app/directory/lookups';
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

    data = (): PieDatum[] => {
        return this.props.companyRecords
            .filter(r => r.amountExcludingVAT > 0)
            .map(r => {
                console.log(r.companyId);
                return {
                    id: r.companyId,
                    label: getCompanyName(r.companyId, this.props.companies),
                    value: r.amountExcludingVAT,
                }
            })
    }

    render() {

        console.log("this.props.companies", this.props.companies);

        return (
            <Pie
                data={this.data()}
                sliceLabel={(d) => formatCurrency(d.value)}
            />
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const companiesState = companiesSelector(state);

    return {
        companies: companiesState.items,
    };
};

export default connect(mapStateToProps)(CompanyChart);

import React, { Component } from 'react';
import { connect } from 'react-redux';

import { companiesSelector, Company } from '@/state/app/directory/lookups';
import { RootState } from '@/state/rootReducer';

type Props = {
    companies: Company[];
    companyId: string;
};

class CompanyNameComponent extends Component<Props> {
    render() {
        const { companies, companyId } = this.props;

        const company = companies.find(u => u.id === companyId);

        if (!company) return <span />;

        return <span>{company.name}</span>;
    }
}

const mapStateToProps = (state: RootState) => {
    const companiesState = companiesSelector(state);

    return {
        companies: companiesState.items
    };
};

const CompanyName = connect(mapStateToProps)(CompanyNameComponent);

export { CompanyName };

import React from "react";
import { connect } from "react-redux";

import { RootState } from "@/state";
import { companiesSelector, Company } from "@/state/directory/lookups";

type Props = {
    companies: Company[];
    companyId: string;
};

const CompanyNameComponent: React.FC<Props> = (props: Props) => {
    const { companies, companyId } = props;

    const company = companies.find((u) => u.id === companyId);

    if (!company) return <span />;

    return <span>{company.name}</span>;
};

const mapStateToProps = (state: RootState) => {
    const companiesState = companiesSelector(state);

    return {
        companies: companiesState.items,
    };
};

const CompanyName = connect(mapStateToProps)(CompanyNameComponent);

export { CompanyName };

import React from "react";
import { connect } from "react-redux";

import { companySelector } from "@/state/app/directory/lookups/companies";
import { RootState } from "@/state/rootReducer";

type Props = PropsFromState;

const EditCompanyTitle: React.FC<Props> = ({ company }) => {
    return <>{company && company.id ? `Company: ${company.name}` : "New Company"}</>;
};

type PropsFromState = ReturnType<typeof mapStateToProps>;

const mapStateToProps = (state: RootState) => ({ company: companySelector(state).company });

export default connect(mapStateToProps)(EditCompanyTitle);

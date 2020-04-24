import React from "react";
import { connect } from "react-redux";

import { RootState } from "@/state";
import { companySelector } from "@/state/lookups/directory/companies";

type Props = PropsFromState;

const EditCompanyTitle: React.FC<Props> = ({ company }) => {
    return <>{company && company.id ? `Company: ${company.name}` : "New Company"}</>;
};

type PropsFromState = ReturnType<typeof mapStateToProps>;

const mapStateToProps = (state: RootState) => ({ company: companySelector(state).company });

export default connect(mapStateToProps)(EditCompanyTitle);

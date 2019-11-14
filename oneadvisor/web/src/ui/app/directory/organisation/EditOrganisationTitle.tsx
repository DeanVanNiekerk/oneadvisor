import React from "react";
import { connect } from "react-redux";

import { organisationIsNew } from "@/state/app/directory/organisations";
import { RootState } from "@/state/rootReducer";

type Props = PropsFromState;

const EditOrganisationTitle: React.FC<Props> = ({ isNew }) => {
    return <>{isNew ? `New Company` : "Edit Company"}</>;
};

type PropsFromState = ReturnType<typeof mapStateToProps>;

const mapStateToProps = (state: RootState) => ({ isNew: organisationIsNew(state) });

export default connect(mapStateToProps)(EditOrganisationTitle);

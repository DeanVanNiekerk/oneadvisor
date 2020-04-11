import React from "react";
import { connect } from "react-redux";

import { RootState } from "@/state";
import { organisationIsNew, organisationSelector } from "@/state/directory/organisations";

type Props = PropsFromState;

const EditOrganisationTitle: React.FC<Props> = ({ isNew, organisation }) => {
    return (
        <>
            {isNew
                ? `New Organisation`
                : `Edit Organisation: ${organisation ? organisation.name : ""}`}
        </>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;

const mapStateToProps = (state: RootState) => ({
    isNew: organisationIsNew(state),
    organisation: organisationSelector(state).organisation,
});

export default connect(mapStateToProps)(EditOrganisationTitle);

import React from "react";
import { connect } from "react-redux";

import { RootState } from "@/state";
import { adviceScopeSelector } from "@/state/lookups/directory";

type Props = PropsFromState;

const EditAdviceScopeTitle: React.FC<Props> = ({ adviceScope }) => {
    return (
        <>
            {adviceScope && adviceScope.id
                ? `Advice Scope: ${adviceScope.name}`
                : "New Advice Scope"}
        </>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;

const mapStateToProps = (state: RootState) => ({
    adviceScope: adviceScopeSelector(state).adviceScope,
});

export default connect(mapStateToProps)(EditAdviceScopeTitle);

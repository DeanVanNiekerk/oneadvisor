import React from "react";
import { connect } from "react-redux";

import { RootState } from "@/state";
import { adviceServiceSelector } from "@/state/lookups/directory";

type Props = PropsFromState;

const EditAdviceServiceTitle: React.FC<Props> = ({ adviceService }) => {
    return (
        <>
            {adviceService && adviceService.id
                ? `Advice Service: ${adviceService.name}`
                : "New Advice Service"}
        </>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;

const mapStateToProps = (state: RootState) => ({
    adviceService: adviceServiceSelector(state).adviceService,
});

export default connect(mapStateToProps)(EditAdviceServiceTitle);

import React from "react";
import { connect } from "react-redux";

import { mappingErrorSelector } from "@/state/commission/errors";
import { RootState } from "@/state/rootReducer";
import { FormReadOnly } from "@/ui/controls";

type Props = PropsFromState;

const ExcelData: React.FC<Props> = ({ error }) => {
    if (!error) return <React.Fragment />;

    return <FormReadOnly data={error.data} />;
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    const mappingErrorState = mappingErrorSelector(state);
    return {
        error: mappingErrorState.commissionError,
    };
};

export default connect(mapStateToProps)(ExcelData);

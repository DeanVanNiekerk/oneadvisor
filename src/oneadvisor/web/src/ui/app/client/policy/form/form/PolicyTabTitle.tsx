import React from "react";
import { connect } from "react-redux";

import { getValidationSubSet } from "@/app/validation";
import { PolicyEdit, policySelector } from "@/state/app/client/policies";
import { RootState } from "@/state/rootReducer";
import { TabTitle } from "@/ui/controls";

type PolicyEditKeys = keyof PolicyEdit;

type Props = {
    title: string;
    validationPrefix: PolicyEditKeys[];
} & PropsFromState;

const PolicyTabTitle: React.FC<Props> = (props: Props) => {
    const count = props.validationPrefix.reduce(
        (p, c) => p + getValidationSubSet(c, props.validationResults).length,
        0
    );
    return <TabTitle errorCount={count} title={props.title} />;
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => ({
    validationResults: policySelector(state).validationResults,
});

export default connect(mapStateToProps)(PolicyTabTitle);

import React from "react";
import { connect } from "react-redux";

import { getValidationSubSet } from "@/app/validation";
import { RootState } from "@/state";
import { policySelector } from "@/state/client/policies";
import { TabTitle } from "@/ui/controls";

type Props = {
    title: string;
    validationPrefix: string[];
    exactMatch: boolean;
} & PropsFromState;

const PolicyTabTitle: React.FC<Props> = (props: Props) => {
    const count = props.validationPrefix.reduce(
        (p, c) =>
            p + getValidationSubSet(c, props.validationResults, false, props.exactMatch).length,
        0
    );
    return <TabTitle errorCount={count} title={props.title} />;
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => ({
    validationResults: policySelector(state).validationResults,
});

export default connect(mapStateToProps)(PolicyTabTitle);

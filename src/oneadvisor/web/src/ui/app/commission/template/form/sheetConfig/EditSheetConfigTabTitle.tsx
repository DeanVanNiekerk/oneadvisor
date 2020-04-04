import React from "react";
import { connect } from "react-redux";

import { getValidationSubSet } from "@/app/validation";
import { RootState } from "@/state";
import { commissionStatementTemplateConfigValidationResultsSelector } from "@/state/commission/templates";
import { TabTitle } from "@/ui/controls";

type Props = {
    title: string;
    validationPrefix: string[];
} & PropsFromState;

const EditSheetConfigTabTitle: React.FC<Props> = (props: Props) => {
    const count = props.validationPrefix.reduce(
        (p, c) => p + getValidationSubSet(c, props.validationResults).length,
        0
    );
    return <TabTitle errorCount={count} title={props.title} />;
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => ({
    validationResults: commissionStatementTemplateConfigValidationResultsSelector(state),
});

export default connect(mapStateToProps)(EditSheetConfigTabTitle);

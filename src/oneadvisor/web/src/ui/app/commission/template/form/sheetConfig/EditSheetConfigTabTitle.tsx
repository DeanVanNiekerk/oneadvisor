import React from "react";
import { connect } from "react-redux";

import { getValidationSubSet } from "@/app/validation";
import { commissionStatementTemplateConfigValidationResultsSelector } from "@/state/app/commission/templates";
import { RootState } from "@/state/rootReducer";
import { TabTitle } from "@/ui/controls";

type Props = {
    title: string;
    validationPrefix: string;
} & PropsFromState;

const EditSheetConfigTabTitle: React.FC<Props> = (props: Props) => {
    const count = getValidationSubSet(props.validationPrefix, props.validationResults).length;
    return <TabTitle errorCount={count} title={props.title} />;
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => ({
    validationResults: commissionStatementTemplateConfigValidationResultsSelector(state),
});

export default connect(mapStateToProps)(EditSheetConfigTabTitle);

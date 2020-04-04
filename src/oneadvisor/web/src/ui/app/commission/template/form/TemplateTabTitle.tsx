import React from "react";
import { connect } from "react-redux";

import { getValidationSubSet } from "@/app/validation";
import { RootState } from "@/state";
import { commissionStatementTemplateValidationResultsSelector } from "@/state/commission/templates";
import { TabTitle } from "@/ui/controls";

type Props = {
    title: string;
    validationPrefix: string;
    exactMatch: boolean;
} & PropsFromState;

const TemplateTabTitle: React.FC<Props> = ({
    validationResults,
    validationPrefix,
    exactMatch,
    title,
}) => {
    const count = getValidationSubSet(validationPrefix, validationResults, true, exactMatch).length;

    return <TabTitle errorCount={count} title={title} />;
};

type PropsFromState = ReturnType<typeof mapStateToProps>;

const mapStateToProps = (state: RootState) => ({
    validationResults: commissionStatementTemplateValidationResultsSelector(state),
});

export default connect(mapStateToProps)(TemplateTabTitle);

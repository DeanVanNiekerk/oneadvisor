import { Badge } from "antd";
import React from "react";
import { connect } from "react-redux";

import { getValidationSubSet } from "@/app/validation";
import { commissionStatementTemplateSelector } from "@/state/app/commission/templates";
import { RootState } from "@/state/rootReducer";

type Props = {
    prefix: string;
    exactMatch: boolean;
    title: string;
} & PropsFromState;

const TemplateTabTitle: React.FC<Props> = ({ validationResults, prefix, exactMatch, title }) => {
    const count = getValidationSubSet(prefix, validationResults, true, exactMatch).length;

    return (
        <Badge count={count} offset={[10, -2]}>
            {title}
        </Badge>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;

const mapStateToProps = (state: RootState) => ({
    validationResults: commissionStatementTemplateSelector(state).validationResults,
});

export default connect(mapStateToProps)(TemplateTabTitle);

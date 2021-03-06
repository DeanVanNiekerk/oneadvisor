import React from "react";
import { connect } from "react-redux";

import { RootState } from "@/state";
import { commissionStatementTemplateSelector } from "@/state/commission/templates";

type Props = PropsFromState;

const EditTemplateTitle: React.FC<Props> = ({ template }) => {
    return <>{template && template.id ? `Template: ${template.name}` : "New Template"}</>;
};

type PropsFromState = ReturnType<typeof mapStateToProps>;

const mapStateToProps = (state: RootState) => ({
    template: commissionStatementTemplateSelector(state).template,
});

export default connect(mapStateToProps)(EditTemplateTitle);

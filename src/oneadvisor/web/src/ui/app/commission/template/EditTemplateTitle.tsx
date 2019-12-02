import React from "react";
import { connect } from "react-redux";

import { commissionStatementTemplateSelector } from "@/state/app/commission/templates";
import { RootState } from "@/state/rootReducer";

type Props = PropsFromState;

const EditTemplateTitle: React.FC<Props> = ({ template }) => {
    return <>{template && template.id ? `Template: ${template.name}` : "New Template"}</>;
};

type PropsFromState = ReturnType<typeof mapStateToProps>;

const mapStateToProps = (state: RootState) => ({
    template: commissionStatementTemplateSelector(state).template,
});

export default connect(mapStateToProps)(EditTemplateTitle);

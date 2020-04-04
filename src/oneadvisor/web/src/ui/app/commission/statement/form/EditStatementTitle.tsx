import React from "react";
import { connect } from "react-redux";

import { RootState } from "@/state";
import { statementSelector } from "@/state/commission/statements";

type Props = PropsFromState;

const EditStatementTitle: React.FC<Props> = ({ statement }) => {
    return <>{statement && statement.id ? `Edit Statement` : "New Statement"}</>;
};

type PropsFromState = ReturnType<typeof mapStateToProps>;

const mapStateToProps = (state: RootState) => ({ statement: statementSelector(state).statement });

export default connect(mapStateToProps)(EditStatementTitle);

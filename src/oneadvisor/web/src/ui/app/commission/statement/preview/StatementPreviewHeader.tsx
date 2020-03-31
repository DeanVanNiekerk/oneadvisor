import React from "react";
import { connect } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router";

import {
    statementPreviewIsLoadingSelector,
    statementPreviewSelector,
} from "@/state/app/commission/statements";
import { RootState } from "@/state/rootReducer";
import { CompanyName, Date, Header } from "@/ui/controls";

type Props = PropsFromState & RouteComponentProps;

const StatementPreviewHeader: React.FC<Props> = (props: Props) => {
    const back = () => {
        return props.history.push("/commission");
    };

    return (
        <Header iconName="reconciliation" loading={props.loading} onBack={back}>
            {props.statement && (
                <span>
                    <CompanyName companyId={props.statement.companyId} />
                    {": "}
                    <Date date={props.statement.date} />
                </span>
            )}
        </Header>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    const statementState = statementPreviewSelector(state);
    return {
        statement: statementState.statement,
        loading: statementPreviewIsLoadingSelector(state),
    };
};

export default withRouter(connect(mapStateToProps)(StatementPreviewHeader));

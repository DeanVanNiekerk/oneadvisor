import React from "react";
import { connect } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router";

import { RootState } from "@/state";
import {
    statementPreviewIsLoadingSelector,
    statementPreviewSelector,
} from "@/state/commission/statements";
import { CompanyName, Header } from "@/ui/controls";
import { Date } from "@/ui/controls/common/Date";

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

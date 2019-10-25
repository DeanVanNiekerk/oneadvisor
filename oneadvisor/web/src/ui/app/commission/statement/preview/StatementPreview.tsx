import React, { useEffect } from "react";
import { connect } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router";
import { Dispatch } from "redux";

import { fetchStatementPreview } from "@/state/app/commission/statements";
import { PreviewCardContainer } from "@/ui/controls";

import { CommissionEntriesCard, DetailsCard, MappingErrorsCard, StatementFilesCard } from "./cards";
import StatementPreviewHeader from "./StatementPreviewHeader";

type Props =
    & PropsFromDispatch
    & RouteComponentProps<{ commissionStatementId: string }>;

const StatementPreview: React.FC<Props> = (props: Props) => {

    const cardHeight = "130px";

    useEffect(() => {
        load();
    }, []);

    const load = () => {
        props.fetchStatementPreview(props.match.params.commissionStatementId);
    }

    return (
        <>
            <StatementPreviewHeader />

            <PreviewCardContainer>
                <DetailsCard cardHeight={cardHeight} onSaved={load} />
                <CommissionEntriesCard cardHeight={cardHeight} onCommissionsChanged={load} />
                <StatementFilesCard cardHeight={cardHeight} onCommissionsChanged={load} />
                <MappingErrorsCard cardHeight={cardHeight} onErrorChanged={load} />
            </PreviewCardContainer>

        </>
    );
}

const mapStateToProps = () => ({});

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        fetchStatementPreview: (commissionStatementId: string) => {
            dispatch(fetchStatementPreview(commissionStatementId));
        },
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(StatementPreview));

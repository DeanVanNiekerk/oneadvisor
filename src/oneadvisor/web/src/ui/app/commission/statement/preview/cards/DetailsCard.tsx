import { Tooltip } from "antd";
import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import {
    fetchStatement,
    statementPreviewIsLoadingSelector,
    statementPreviewSelector,
    statementVisible,
} from "@/state/app/commission/statements";
import { RootState } from "@/state/rootReducer";
import { Currency, PreviewCard, PreviewCardRow } from "@/ui/controls";
import { EditOutlined } from "@ant-design/icons";

import EditStatement from "../../form/EditStatement";
import { Processed } from "../../list/Processed";

type Props = {
    cardHeight: string;
    onSaved: () => void;
} & PropsFromState &
    PropsFromDispatch;

const DetailsCardComponent: React.FC<Props> = (props: Props) => {
    const editDetails = () => {
        if (!props.statement) return;
        props.fetchStatement(props.statement.id);
    };

    return (
        <>
            <PreviewCard
                title="Details"
                iconName="profile"
                onClick={editDetails}
                isLoading={props.loading}
                actions={[
                    <Tooltip key={"1"} title="Edit Commission Statement" mouseEnterDelay={0.5}>
                        <EditOutlined onClick={editDetails} />
                    </Tooltip>,
                ]}
                rows={3}
                height={props.cardHeight}
            >
                {props.statement && (
                    <>
                        <PreviewCardRow
                            label="Status"
                            value={<Processed processed={props.statement.processed} />}
                        />
                        <PreviewCardRow
                            label="Amount (incl VAT)"
                            value={<Currency amount={props.statement.amountIncludingVAT} />}
                        />
                        <PreviewCardRow
                            label="VAT"
                            value={<Currency amount={props.statement.vat} />}
                        />
                    </>
                )}
            </PreviewCard>

            <EditStatement onSaved={props.onSaved} />
        </>
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

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        fetchStatement: (commissionStatementId: string) => {
            dispatch(fetchStatement(commissionStatementId));
            dispatch(statementVisible(true));
        },
    };
};

const DetailsCard = connect(mapStateToProps, mapDispatchToProps)(DetailsCardComponent);

export { DetailsCard };

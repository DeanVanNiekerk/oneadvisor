import { Modal } from "antd";
import React, { useState } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import { hasUseCase } from "@/app/identity";
import {
    deleteCommissions,
    statementPreviewIsLoadingSelector,
    statementPreviewSelector,
} from "@/state/app/commission/statements";
import { useCaseSelector } from "@/state/auth";
import { RootState } from "@/state/rootReducer";
import { Button, Currency, Drawer, DrawerFooter, Icon, PreviewCard, PreviewCardRow } from "@/ui/controls";
import { showMessage } from "@/ui/feedback/notifcation";

import CommissionList from "../../../commission/CommissionList";

const confirm = Modal.confirm;

type Props = {
    cardHeight: string;
    onCommissionsChanged: () => void;
} & PropsFromState &
    PropsFromDispatch;

const CommissionEntriesCardComponent: React.FC<Props> = (props: Props) => {
    const [commissionListVisible, setCommissionListVisible] = useState<boolean>(false);
    const [deletingCommissionEntries, setDeletingCommissionEntries] = useState<boolean>(false);

    const deleteCommissions = () => {
        confirm({
            title: "Are you sure you want to delete all commission entries?",
            content:
                "All commission entries including any errors will be permanenty deleted, are you sure you wish to continue?",
            onOk: () => {
                if (!props.statement) return;
                showMessage("loading", "Deleting commission entries", 60);
                setDeletingCommissionEntries(true);
                props.deleteCommissions(
                    props.statement.id,
                    //Success
                    () => {
                        setDeletingCommissionEntries(false);
                        showMessage("success", "Commission entries successfully deleted", 5, true);
                        props.onCommissionsChanged();
                    },
                    //Failure
                    () => {
                        setDeletingCommissionEntries(false);
                        showMessage("error", "Error deleting commission entries", 5, true);
                    }
                );
            },
        });
    };

    const getCommissionEntriesActions = () => {
        const actions = [
            <Icon tooltip="View Commission Entries" type="bars" onClick={() => setCommissionListVisible(true)} />,
        ];

        if (hasUseCase("com_edit_commission_statements", props.useCases))
            actions.unshift(
                <Icon
                    tooltip="Delete Commission Entries"
                    type={deletingCommissionEntries ? "loading-3-quarters" : "delete"}
                    className="text-error"
                    spin={deletingCommissionEntries}
                    onClick={event => {
                        deleteCommissions();
                        event.stopPropagation();
                    }}
                />
            );

        return actions;
    };

    return (
        <>
            <PreviewCard
                title="Commission Entries"
                icon="dollar"
                onClick={() => setCommissionListVisible(true)}
                isLoading={props.loading}
                actions={getCommissionEntriesActions()}
                rows={3}
                height={props.cardHeight}
            >
                {props.statement && (
                    <>
                        <PreviewCardRow label="Total Entries" value={props.statement.commissionCount} />
                        <PreviewCardRow
                            label="Amount (incl VAT)"
                            value={<Currency amount={props.statement.actualAmountIncludingVAT} />}
                        />
                        <PreviewCardRow label="VAT" value={<Currency amount={props.statement.actualVAT} />} />
                    </>
                )}
            </PreviewCard>

            <Drawer
                title="Commission Entries"
                icon="dollar"
                visible={commissionListVisible}
                onClose={() => setCommissionListVisible(false)}
            >
                <CommissionList
                    hideHeader={true}
                    commissionStatementId={props.statement ? props.statement.id : ""}
                    onSaved={props.onCommissionsChanged}
                    hideColumns={["commissionStatementDate", "policyClientInitials", "policyCompanyId"]}
                />
                <DrawerFooter>
                    <Button onClick={() => setCommissionListVisible(false)}>Close</Button>
                </DrawerFooter>
            </Drawer>
        </>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    const statementState = statementPreviewSelector(state);
    return {
        statement: statementState.statement,
        loading: statementPreviewIsLoadingSelector(state),
        useCases: useCaseSelector(state),
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        deleteCommissions: (commissionStatementId: string, onSuccess: () => void, onFailure: () => void) => {
            dispatch(deleteCommissions(commissionStatementId, onSuccess, onFailure));
        },
    };
};

const CommissionEntriesCard = connect(
    mapStateToProps,
    mapDispatchToProps
)(CommissionEntriesCardComponent);

export { CommissionEntriesCard };

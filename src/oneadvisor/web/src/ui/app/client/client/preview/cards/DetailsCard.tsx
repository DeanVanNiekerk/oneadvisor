import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import {
    clientPreviewIsLoadingSelector,
    clientPreviewSelector,
    clientVisible,
    fetchClient,
} from "@/state/app/client/clients";
import { ClientTypeId } from "@/state/app/client/lookups";
import { RootState } from "@/state/rootReducer";
import { Age, Icon, PreviewCard, PreviewCardRow } from "@/ui/controls";

import EditClient from "../../form/EditClient";

type Props = {
    cardHeight: string;
    onSaved: () => void;
} & PropsFromState &
    PropsFromDispatch;

const DetailsCardComponent: React.FC<Props> = (props: Props) => {
    const editDetails = () => {
        if (!props.client) return;
        props.fetchClient(props.client.id);
    };

    return (
        <>
            <PreviewCard
                title="Details"
                icon="profile"
                onClick={editDetails}
                isLoading={props.loading}
                actions={[
                    <Icon
                        key={"1"}
                        tooltip="Edit Client Details"
                        type="edit"
                        onClick={editDetails}
                    />,
                ]}
                rows={2}
                height={props.cardHeight}
            >
                {props.client && (
                    <>
                        {props.client.clientTypeId === ClientTypeId.Individual && (
                            <>
                                <PreviewCardRow
                                    label="Id"
                                    value={`${props.client.idNumber ? props.client.idNumber : ""}`}
                                />
                                <PreviewCardRow
                                    label="Age"
                                    value={<Age dateOfBirth={props.client.dateOfBirth} />}
                                />
                            </>
                        )}
                        {(props.client.clientTypeId === ClientTypeId.Company ||
                            props.client.clientTypeId === ClientTypeId.Trust) && (
                            <>
                                <PreviewCardRow
                                    label="Reg. Number"
                                    value={`${
                                        props.client.alternateIdNumber
                                            ? props.client.alternateIdNumber
                                            : ""
                                    }`}
                                />
                            </>
                        )}
                    </>
                )}
            </PreviewCard>

            <EditClient onSaved={props.onSaved} />
        </>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    const clientState = clientPreviewSelector(state);
    return {
        client: clientState.client,
        loading: clientPreviewIsLoadingSelector(state),
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        fetchClient: (client: string) => {
            dispatch(fetchClient(client));
            dispatch(clientVisible(true));
        },
    };
};

const DetailsCard = connect(mapStateToProps, mapDispatchToProps)(DetailsCardComponent);

export { DetailsCard };
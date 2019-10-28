import React, { useEffect } from "react";
import { connect } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router";
import { Dispatch } from "redux";

import { fetchClientPreview } from "@/state/app/client/clients";
import { PreviewCardContainer } from "@/ui/controls";

import { ContactsCard, DetailsCard, PoliciesCard } from "./cards";
import ClientPreviewHeader from "./ClientPreviewHeader";

type Props =
    & PropsFromDispatch
    & RouteComponentProps<{ clientId: string }>;

const ClientPreview: React.FC<Props> = (props: Props) => {

    const cardHeight = "100px";

    useEffect(() => {
        load();
    }, []);

    const load = () => {
        props.fetchClientPreview(props.match.params.clientId);
    }

    return (
        <>
            <ClientPreviewHeader />

            <PreviewCardContainer>
                <DetailsCard onSaved={load} cardHeight={cardHeight} />
                <PoliciesCard onSaved={load} cardHeight={cardHeight} />
                <ContactsCard onSaved={load} cardHeight={cardHeight} />
            </PreviewCardContainer>
        </>
    );
}

const mapStateToProps = () => ({});

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        fetchClientPreview: (clientId: string) => {
            dispatch(fetchClientPreview(clientId));
        },
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ClientPreview));

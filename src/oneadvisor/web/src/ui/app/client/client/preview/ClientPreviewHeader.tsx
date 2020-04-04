import React from "react";
import { connect } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router";

import { RootState } from "@/state";
import { clientPreviewIsLoadingSelector, clientPreviewSelector } from "@/state/client/clients";
import { ClientTypeIcon, Header } from "@/ui/controls";

type Props = PropsFromState & RouteComponentProps;

const ClientPreviewHeader: React.FC<Props> = (props: Props) => {
    const back = () => {
        return props.history.push("/client");
    };

    const getTitle = () => {
        const { client } = props;
        if (!client) return "";

        let title = client.lastName;

        if (client.firstName) title = `${title}, ${client.firstName}`;

        return title;
    };

    const icon = <ClientTypeIcon clientTypeId={props.client ? props.client.clientTypeId : ""} />;

    return (
        <Header icon={icon} loading={props.loading} onBack={back}>
            {getTitle()}
        </Header>
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

export default withRouter(connect(mapStateToProps)(ClientPreviewHeader));

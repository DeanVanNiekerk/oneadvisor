import React, { useEffect, useState } from "react";
import { connect, DispatchProp } from "react-redux";

import { ClientEdit } from "@/state/client/clients/types";
import { getClient } from "@/state/lookups/client";

type Props = {
    clientId: string | null;
    className?: string;
    prefix?: string;
} & DispatchProp;

const ClientNameComponent: React.FC<Props> = (props: Props) => {
    const [client, setClient] = useState<ClientEdit | null>(null);

    useEffect(() => {
        loadClient();
    }, [props.clientId]);

    const loadClient = () => {
        if (!props.clientId) {
            setClient(null);
            return;
        }

        props.dispatch(
            getClient(props.clientId, (client) => {
                setClient(client);
            })
        );
    };

    if (!client) return <span />;

    return (
        <span className={props.className}>{`${props.prefix || ""}${client.firstName || ""} ${
            client.lastName || ""
        }`}</span>
    );
};

const ClientName = connect()(ClientNameComponent);

export { ClientName };

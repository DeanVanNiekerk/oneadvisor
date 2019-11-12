import { Icon, Tooltip } from "antd";
import React from "react";
import { connect } from "react-redux";

import { ClientType, ClientTypeId, clientTypesSelector } from "@/state/app/client/lookups";
import { RootState } from "@/state/rootReducer";

type Props = {
    clientTypes: ClientType[];
    clientTypeId: string;
    style?: React.CSSProperties;
};

const ClientTypeIconComponent: React.FC<Props> = (props: Props) => {
    const { clientTypes, clientTypeId, style } = props;

    const clientType = clientTypes.find(u => u.id === clientTypeId);

    if (!clientType) return <span />;

    switch (clientTypeId) {
        case ClientTypeId.Individual:
            return getIcon(clientTypes, clientTypeId, "user", "#9D44B5", style);
        case ClientTypeId.Company:
            return getIcon(clientTypes, clientTypeId, "bank", "#D1495B", style);
        case ClientTypeId.Trust:
            return getIcon(clientTypes, clientTypeId, "team", "#012A36", style);
        case ClientTypeId.UnknownEntity:
            return getIcon(clientTypes, clientTypeId, "question", "#1F487E", style);
        default:
            return <Icon type="question" />;
    }
};

const getIcon = (
    clientTypes: ClientType[],
    clientTypeId: string,
    icon: string,
    colour: string,
    style?: React.CSSProperties
) => {
    const clientType = clientTypes.find(u => u.id === clientTypeId);

    if (!clientType) return <span />;

    const styles = {
        color: colour,
        fontSize: "18px",
        ...style,
    };

    return (
        <Tooltip title={clientType.name} mouseEnterDelay={0.5}>
            <Icon type={icon} style={styles} />
        </Tooltip>
    );
};

const mapStateToProps = (state: RootState) => {
    const clientTypesState = clientTypesSelector(state);

    return {
        clientTypes: clientTypesState.items,
    };
};

const ClientTypeIcon = connect(mapStateToProps)(ClientTypeIconComponent);

export { ClientTypeIcon };

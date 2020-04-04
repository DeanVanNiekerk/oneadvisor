import { Tooltip } from "antd";
import React from "react";
import { connect } from "react-redux";

import { RootState } from "@/state";
import { ClientType, ClientTypeId, clientTypesSelector } from "@/state/client/lookups";
import { BankOutlined, QuestionOutlined, TeamOutlined, UserOutlined } from "@ant-design/icons";

type Props = {
    clientTypes: ClientType[];
    clientTypeId: string;
    style?: React.CSSProperties;
};

const ClientTypeIconComponent: React.FC<Props> = (props: Props) => {
    const { clientTypes, clientTypeId, style } = props;

    const clientType = clientTypes.find((u) => u.id === clientTypeId);

    if (!clientType) return <span />;

    switch (clientTypeId) {
        case ClientTypeId.Individual:
            return getIcon(clientTypes, clientTypeId, <UserOutlined />, "#9D44B5", style);
        case ClientTypeId.Company:
            return getIcon(clientTypes, clientTypeId, <BankOutlined />, "#D1495B", style);
        case ClientTypeId.Trust:
            return getIcon(clientTypes, clientTypeId, <TeamOutlined />, "#012A36", style);
        case ClientTypeId.UnknownEntity:
            return getIcon(clientTypes, clientTypeId, <QuestionOutlined />, "#1F487E", style);
        default:
            return <QuestionOutlined />;
    }
};

const getIcon = (
    clientTypes: ClientType[],
    clientTypeId: string,
    icon: React.ReactNode,
    colour: string,
    style?: React.CSSProperties
) => {
    const clientType = clientTypes.find((u) => u.id === clientTypeId);

    if (!clientType) return <span />;

    const styles = {
        color: colour,
        fontSize: "18px",
        ...style,
    };

    return (
        <Tooltip title={clientType.name} mouseEnterDelay={0.5}>
            <span style={styles}>{icon}</span>
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

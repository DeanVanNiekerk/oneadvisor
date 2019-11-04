import { Icon, Tooltip } from "antd";
import React, { Component } from "react";
import { connect } from "react-redux";

import { ClientType, ClientTypeId, clientTypesSelector } from "@/state/app/client/lookups";
import { RootState } from "@/state/rootReducer";

type Props = {
    clientTypes: ClientType[];
    clientTypeId: string;
    style?: React.CSSProperties;
};

class ClientTypeIconComponent extends Component<Props> {
    getIcon = (clientTypeId: string, icon: string, colour: string) => {
        const clientType = this.props.clientTypes.find(u => u.id === clientTypeId);

        if (!clientType) return <span />;

        const style = {
            color: colour,
            fontSize: "18px",
            ...this.props.style,
        };

        return (
            <Tooltip title={clientType.name} mouseEnterDelay={0.5}>
                <Icon type={icon} style={style} />
            </Tooltip>
        );
    };

    render() {
        const { clientTypes, clientTypeId } = this.props;

        const clientType = clientTypes.find(u => u.id === clientTypeId);

        if (!clientType) return <span />;

        switch (clientTypeId) {
            case ClientTypeId.Individual:
                return this.getIcon(clientTypeId, "user", "#9D44B5");
            case ClientTypeId.Company:
                return this.getIcon(clientTypeId, "bank", "#D1495B");
            case ClientTypeId.Trust:
                return this.getIcon(clientTypeId, "team", "#012A36");
            case ClientTypeId.UnknownEntity:
                return this.getIcon(clientTypeId, "question", "#1F487E");
            default:
                return <Icon type="question" />;
        }
    }
}

const mapStateToProps = (state: RootState) => {
    const clientTypesState = clientTypesSelector(state);

    return {
        clientTypes: clientTypesState.items,
    };
};

const ClientTypeIcon = connect(mapStateToProps)(ClientTypeIconComponent);

export { ClientTypeIcon };

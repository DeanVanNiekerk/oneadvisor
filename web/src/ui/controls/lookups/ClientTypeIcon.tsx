import { Icon, Tooltip } from 'antd';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
    CLIENT_TYPE_COMPANY_ID, CLIENT_TYPE_INDIVIDUAL_ID, CLIENT_TYPE_TRUST_ID, ClientType, clientTypesSelector
} from '@/state/app/directory/lookups';
import { RootState } from '@/state/rootReducer';

type Props = {
    clientTypes: ClientType[];
    clientTypeId: string;
    style?: React.CSSProperties;
};

class ClientTypeIconComponent extends Component<Props> {
    getIcon = (clientTypeId: string, icon: string, colour: string) => {
        const clientType = this.props.clientTypes.find(
            u => u.id === clientTypeId
        );

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
            case CLIENT_TYPE_INDIVIDUAL_ID:
                return this.getIcon(
                    CLIENT_TYPE_INDIVIDUAL_ID,
                    "user",
                    "#9D44B5"
                );
            case CLIENT_TYPE_COMPANY_ID:
                return this.getIcon(CLIENT_TYPE_COMPANY_ID, "bank", "#D1495B");
            case CLIENT_TYPE_TRUST_ID:
                return this.getIcon(CLIENT_TYPE_TRUST_ID, "team", "#012A36");
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

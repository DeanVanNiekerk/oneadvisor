import React from "react";
import { connect } from "react-redux";

import { RootState } from "@/state";
import { clientSelector } from "@/state/client/clients";

type Props = PropsFromState;

const EditClientTitle: React.FC<Props> = ({ client }) => {
    return <>{client && client.id ? `Edit Client` : "New Client"}</>;
};

type PropsFromState = ReturnType<typeof mapStateToProps>;

const mapStateToProps = (state: RootState) => ({ client: clientSelector(state).client });

export default connect(mapStateToProps)(EditClientTitle);

import React from "react";
import { connect } from "react-redux";

import { RootState } from "@/state";
import { userIsNew } from "@/state/directory/users";

type Props = PropsFromState;

const EditUserTitle: React.FC<Props> = ({ isNew }) => {
    return <>{isNew ? `New User` : "Edit User"}</>;
};

type PropsFromState = ReturnType<typeof mapStateToProps>;

const mapStateToProps = (state: RootState) => ({ isNew: userIsNew(state) });

export default connect(mapStateToProps)(EditUserTitle);

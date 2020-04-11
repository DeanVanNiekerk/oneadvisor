import React from "react";
import { connect } from "react-redux";

import { RootState } from "@/state";
import { userIsNew, userSelector } from "@/state/directory/users";

type Props = PropsFromState;

const EditUserTitle: React.FC<Props> = ({ isNew, user }) => {
    return (
        <>{isNew ? `New User` : `Edit User: ${user ? user.firstName + " " + user.lastName : ""}`}</>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;

const mapStateToProps = (state: RootState) => ({
    isNew: userIsNew(state),
    user: userSelector(state).user,
});

export default connect(mapStateToProps)(EditUserTitle);

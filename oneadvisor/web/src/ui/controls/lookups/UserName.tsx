import React, { Component } from "react";
import { connect } from "react-redux";

import { UserSimple, usersSimpleSelector } from "@/state/app/directory/usersSimple";
import { RootState } from "@/state/rootReducer";

type Props = {
    users: UserSimple[];
    userId: string | null;
    prefix?: string;
};

class UserNameComponent extends Component<Props> {
    render() {
        const { users, userId } = this.props;

        const user = users.find(u => u.id === userId);

        if (!user) return <span />;

        return <span>{`${this.props.prefix || ""}${user.firstName} ${user.lastName}`}</span>;
    }
}

const mapStateToProps = (state: RootState) => {
    const usersState = usersSimpleSelector(state);

    return {
        users: usersState.items
    };
};

const UserName = connect(mapStateToProps)(UserNameComponent);

export { UserName };

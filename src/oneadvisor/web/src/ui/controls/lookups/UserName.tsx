import React from "react";
import { connect } from "react-redux";

import { RootState } from "@/state";
import { UserSimple, usersSimpleSelector } from "@/state/directory/usersSimple";

type Props = {
    users: UserSimple[];
    userId: string | null;
    prefix?: string;
};

const UserNameComponent: React.FC<Props> = (props: Props) => {
    const { users, userId } = props;

    const user = users.find((u) => u.id === userId);

    if (!user) return <span />;

    return <span>{`${props.prefix || ""}${user.firstName} ${user.lastName}`}</span>;
};

const mapStateToProps = (state: RootState) => {
    const usersState = usersSimpleSelector(state);

    return {
        users: usersState.items,
    };
};

const UserName = connect(mapStateToProps)(UserNameComponent);

export { UserName };

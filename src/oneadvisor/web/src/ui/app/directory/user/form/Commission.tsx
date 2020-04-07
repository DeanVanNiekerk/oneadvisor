import React from "react";
import { connect } from "react-redux";

import { RootState } from "@/state";
import { userSelector } from "@/state/directory/users";
import SplitRuleList from "@/ui/app/commission/splitRule/SplitRuleList";

type Props = PropsFromState;

const Commission: React.FC<Props> = (props) => {
    const { user } = props;

    if (!user || !user.id) return <React.Fragment />;

    return <SplitRuleList userId={user.id} />;
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    const userState = userSelector(state);

    return {
        user: userState.user,
    };
};

export default connect(mapStateToProps)(Commission);

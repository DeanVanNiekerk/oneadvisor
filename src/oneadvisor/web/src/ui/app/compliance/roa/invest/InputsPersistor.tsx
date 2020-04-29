import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { AnyAction, bindActionCreators } from "redux";
import { ThunkDispatch } from "redux-thunk";

import { receiveRoaInvestInputState, roaInvestInputsSelector } from "@/state/compliance/roa";
import { getStoreValue, setStoreValue } from "@/state/storage";
import { RootState } from "@/state/types";

const key = "cmp_roa_invest-inputs-state";

type Props = PropsFromState & PropsFromDispatch;

const InputsPersistor: React.FC<Props> = (props) => {
    const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);

    //Update
    useEffect(() => {
        if (isInitialLoad) {
            console.log("loading in cmp_roa_invest-inputs-state");
            const value = getStoreValue(key);
            if (value) {
                const state = JSON.parse(value);
                props.receiveRoaInvestInputState(state);
            }
            setIsInitialLoad(false);
        } else {
            setStoreValue(key, JSON.stringify(props.state));
        }
    }, [props.state]);

    return <React.Fragment />;
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    return {
        state: roaInvestInputsSelector(state),
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, {}, AnyAction>) => {
    return {
        ...bindActionCreators({ receiveRoaInvestInputState }, dispatch),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(InputsPersistor);

import React, { useState } from "react";
import { connect } from "react-redux";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";

import { RootState } from "@/state";
import {
    policyMergeSelector,
    policyMergeVisible,
    receiveSelectedPolicies,
} from "@/state/client/policies";
import { Button, Drawer } from "@/ui/controls";

import PolilcyDetails from "./steps/PolilcyDetails";
import Result from "./steps/Result";
import SourcePolicies from "./steps/SourcePolicies";

type Props = {
    visible: boolean;
    onMerged: () => void;
} & PropsFromState &
    PropsFromDispatch;

const PolicyMerge: React.FC<Props> = (props: Props) => {
    const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

    const nextStep = () => {
        setCurrentStepIndex(Math.min(currentStepIndex + 1, 2));
    };

    const previousStep = () => {
        setCurrentStepIndex(Math.max(currentStepIndex - 1, 0));
    };

    const cancel = () => {
        if (currentStepIndex === 2) {
            props.clearSelectedPolicies();
            props.onMerged();
        }
        setCurrentStepIndex(0);
        props.close();
    };

    const getContentStyle = (stepIndex: number) => {
        return {
            display: currentStepIndex == stepIndex ? "inline" : "none",
        };
    };

    return (
        <Drawer
            title="Merge Policies"
            iconName="fork"
            visible={props.visible}
            onClose={cancel}
            footer={<Button onClick={cancel}>{currentStepIndex === 2 ? "Close" : "Cancel"}</Button>}
        >
            <div>
                <div style={getContentStyle(0)}>
                    <SourcePolicies nextStep={nextStep} />
                </div>
                <div style={getContentStyle(1)}>
                    <PolilcyDetails nextStep={nextStep} previousStep={previousStep} />
                </div>
                <div style={getContentStyle(2)}>
                    <Result />
                </div>
            </div>
        </Drawer>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    const mergeState = policyMergeSelector(state);

    return {
        visible: mergeState.visible,
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, {}, AnyAction>) => {
    return {
        clearSelectedPolicies: () => {
            dispatch(receiveSelectedPolicies([]));
        },
        close: () => {
            dispatch(policyMergeVisible(false));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PolicyMerge);

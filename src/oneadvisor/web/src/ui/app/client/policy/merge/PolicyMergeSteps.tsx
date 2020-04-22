import React from "react";

import { StepProgress, StepProgressProps } from "@/ui/controls";

type Props = {
    currentStepIndex: number;
} & StepProgressProps;

const PolicyMergeSteps: React.FC<Props> = (props) => {
    return <StepProgress steps={["Policies", "Review", "Result"]} {...props} />;
};

export { PolicyMergeSteps };

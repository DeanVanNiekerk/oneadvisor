import { Alert, Divider } from "antd";
import React from "react";

import { PolicyMergeSteps } from "../PolicyMergeSteps";

const Result: React.FC = () => {
    return (
        <>
            <PolicyMergeSteps currentStepIndex={2} />

            <Divider />

            <Alert
                message="Policies have been successfully merged."
                type="success"
                showIcon
                className="mb-1"
            />
        </>
    );
};

export default Result;

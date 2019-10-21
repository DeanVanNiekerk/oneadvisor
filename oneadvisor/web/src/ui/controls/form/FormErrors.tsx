import { Alert } from "antd";
import React from "react";

import { ValidationResult } from "@/app/validation";

type Props = {
    propertyName?: string;
    validationResults: ValidationResult[];
    message?: string;
};

const FormErrors: React.FC<Props> = (props: Props) => {
    const { propertyName = "", validationResults } = props;

    const results = validationResults
        .filter(r => r.propertyName === propertyName)
        .map(r => r.errorMessage);

    const message = results.join(",");

    return message ? (
        <Alert
            message={props.message || message}
            type="error"
            showIcon
            className="mb-1"
        />
    ) : (
            <React.Fragment />
        );
};

export { FormErrors };

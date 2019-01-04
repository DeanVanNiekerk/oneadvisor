import { Alert } from 'antd';
import React from 'react';

import { ValidationResult } from '@/app/validation';

type Props = {
    propertyName?: string;
    validationResults: ValidationResult[];
};

const FormErrors = (props: Props) => {
    const { propertyName = '', validationResults } = props;

    const results = validationResults
        .filter(r => r.propertyName === propertyName)
        .map(r => r.errorMessage);

    const message = results.join(',');

    return message ? <Alert message={message} type="error" showIcon /> : <></>;
};

export { FormErrors };

// @flow

import React, { Component } from 'react';
import { Form, Input } from 'antd';

import { FormField } from './FormField';
import type { ValidationResult } from '@/state/types';
import { removeValidationError } from '@/state/validation';

const FormItem = Form.Item;

type Props = {
    fieldName: string,
    label: string,
    value: string | number,
    onChange: (fieldName: string, event: SyntheticInputEvent<any>) => void,
    errorText: string | null,
    validationResults: ValidationResult[]
};

type State = {
    validationResults:  ValidationResult[]
};

class FormInput extends Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            validationResults: props.validationResults
        };
    }

    componentDidUpdate(nextProps: Props) {
        if (nextProps.validationResults !== this.state.validationResults) {
            this.setState({
                validationResults: nextProps.validationResults
            });
        }
    }
    
    onChange = (event: SyntheticInputEvent<any>) => {
        this.props.onChange(this.props.fieldName, event);

        //Clear the validation result when the value changes
        this.setState({
            validationResults: removeValidationError(this.props.fieldName, this.state.validationResults)
        });
    };

    render() {
        const { validationResults } = this.state;
        const { fieldName, label, value, onChange } = this.props;

        return (
            <FormField
                label={label}
                fieldName={fieldName}
                validationResults={validationResults}
            >
                <Input 
                    name={fieldName}
                    id={fieldName}
                    value={value}
                    onChange={this.onChange}
                />
            </FormField>
        );
    }
}

export { FormInput };

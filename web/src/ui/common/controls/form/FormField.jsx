// @flow

import React, { Component } from 'react';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';

import type { ValidationResult } from '@/state/types';
import { getValidationError } from '@/state/validation'; 

type Props = {
    fieldName: string,
    label: string,
    value: string | number,
    onChange: (fieldName: string, event: SyntheticInputEvent<any>) => void,
    errorText: string | null,
    validationResults: ValidationResult[],
};

type State = {
    errorText: string | null,
    validationResults: ValidationResult[],
};

class FormField extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            errorText: getValidationError(props.fieldName, props.validationResults),
            validationResults: props.validationResults
        };
    }

    componentDidUpdate(nextProps: Props) {

        if(nextProps.validationResults !== this.state.validationResults) {
            this.setState({
                errorText: getValidationError(nextProps.fieldName, nextProps.validationResults),
                validationResults: nextProps.validationResults
            });
        }
    }

    onChange = (event: SyntheticInputEvent<any>) => {
        this.props.onChange(this.props.fieldName, event);
        
        //Clear the error when the value changes
        this.setState({
            errorText: null
        });
    };

    render() {
        
        const { errorText } = this.state;
        const { fieldName, label, value, onChange } = this.props;

        return (
            <FormControl
                error={errorText !== null}
                fullWidth={true}
            >
                <InputLabel>{label}</InputLabel>
                <Input value={value} onChange={this.onChange} />
                <FormHelperText>{errorText}</FormHelperText>
            </FormControl>
        );
    }
}

export { FormField };

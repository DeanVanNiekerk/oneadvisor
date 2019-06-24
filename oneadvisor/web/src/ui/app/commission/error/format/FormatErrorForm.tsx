import React, { Component } from 'react';

import { ValidationResult } from '@/app/validation';
import { CommissionImportData } from '@/state/app/commission/errors';
import { Form, FormInput } from '@/ui/controls';
import update from 'immutability-helper';

type Props = {
    error: CommissionImportData;
    validationResults: ValidationResult[];
    onChange: (error: CommissionImportData) => void;
};

type State = {
    error: CommissionImportData;
};

class FormatErrorForm extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            error: props.error
        };
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.error != prevProps.error) {
            this.setState({
                error: this.props.error
            });
        }
    }

    handleChange = async (fieldName: string, value: any) => {
        const error = update(this.state.error, { [fieldName]: { $set: value } });
        this.setState({
            error: error
        });
        this.props.onChange(error);
    };

    render() {
        const { validationResults } = this.props;
        const { error } = this.state;

        return (
            <Form editUseCase="com_edit_commission_statements">
                {Object.keys(error).map(fieldName => {
                    return (
                        <FormInput
                            key={fieldName}
                            fieldName={fieldName}
                            label={fieldName}
                            value={error[fieldName]}
                            onChange={this.handleChange}
                            validationResults={validationResults}
                        />
                    );
                })}
            </Form>
        );
    }
}

export default FormatErrorForm;

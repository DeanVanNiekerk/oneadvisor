import React, { Component } from 'react';

import { ValidationResult } from '@/app/validation';
import { CommissionErrorData } from '@/state/app/commission/errors';
import { Form, FormInput } from '@/ui/controls';

type Props = {
    error: CommissionErrorData;
    validationResults: ValidationResult[];
    onChange: (error: CommissionErrorData) => void;
};

type State = {
    error: CommissionErrorData;
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
        const error = {
            ...this.state.error,
            [fieldName]: value
        };
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

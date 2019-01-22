import React, { Component } from 'react';

import { ValidationResult } from '@/app/validation';
import { CommissionType } from '@/state/app/directory/lookups/commissionTypes';
import { Form, FormInput } from '@/ui/controls';

type Props = {
    commissionType: CommissionType;
    validationResults: ValidationResult[];
    onChange: (commissionType: CommissionType) => void;
};

type State = {
    commissionType: CommissionType;
};

class CommissionTypeForm extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            commissionType: props.commissionType
        };
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.commissionType != prevProps.commissionType)
            this.setState({
                commissionType: this.props.commissionType
            });
    }

    handleChange = (fieldName: string, value: any) => {
        const commissionType = {
            ...this.state.commissionType,
            [fieldName]: value
        };
        this.setState({
            commissionType: commissionType
        });
        this.props.onChange(commissionType);
    };

    render() {
        const { validationResults } = this.props;
        const { commissionType } = this.state;

        return (
            <Form editUseCase="dir_edit_lookups">
                <FormInput
                    fieldName="name"
                    label="Name"
                    value={commissionType.name}
                    onChange={this.handleChange}
                    validationResults={validationResults}
                    autoFocus={true}
                />
            </Form>
        );
    }
}

export default CommissionTypeForm;

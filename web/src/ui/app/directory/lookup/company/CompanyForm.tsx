import React, { Component } from 'react';

import { ValidationResult } from '@/app/validation';
import { Company } from '@/state/app/directory/lookups/companies';
import { Form, FormInput } from '@/ui/controls';

type Props = {
    company: Company;
    validationResults: ValidationResult[];
    onChange: (company: Company) => void;
};

type State = {
    company: Company;
};

class CompanyForm extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            company: props.company
        };
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.company != prevProps.company)
            this.setState({
                company: this.props.company
            });
    }

    handleChange = (fieldName: string, value: any) => {
        const company = {
            ...this.state.company,
            [fieldName]: value
        };
        this.setState({
            company: company
        });
        this.props.onChange(company);
    };

    render() {
        const { validationResults } = this.props;
        const { company } = this.state;

        return (
            <Form editUseCase="dir_edit_lookups">
                <FormInput
                    fieldName="name"
                    label="Name"
                    value={company.name}
                    onChange={this.handleChange}
                    validationResults={validationResults}
                    autoFocus={true}
                />
            </Form>
        );
    }
}

export default CompanyForm;

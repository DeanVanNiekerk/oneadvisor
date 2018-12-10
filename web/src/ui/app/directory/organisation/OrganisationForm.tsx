import React, { Component } from 'react';

import { Organisation } from '@/state/app/directory/organisations/types';
import { ValidationResult } from '@/state/types';
import { Form, FormInput } from '@/ui/controls';

type Props = {
    organisation: Organisation,
    validationResults: ValidationResult[],
    onChange: (organisation: Organisation) => void
};

type State = {
    organisation: Organisation
};

class OrganisationForm extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            organisation: props.organisation
        };
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.organisation != prevProps.organisation)
            this.setState({
                organisation: this.props.organisation
            });
    }

    handleChange = (fieldName: string, value: any) => {
        const organisation = {
            ...this.state.organisation,
            [fieldName]: value
        };
        this.setState({
            organisation: organisation
        });
        this.props.onChange(organisation);
    };

    render() {
        const { validationResults } = this.props;
        const { organisation } = this.state;

        return (
            <Form>
                <FormInput
                    fieldName="name"
                    label="Name"
                    value={organisation.name}
                    onChange={this.handleChange}
                    validationResults={validationResults}
                />
            </Form>
        );
    }
}

export default OrganisationForm;

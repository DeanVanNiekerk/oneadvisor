import update from 'immutability-helper';
import React, { Component } from 'react';

import { ValidationResult } from '@/app/validation';
import { Organisation } from '@/state/app/directory/organisations';
import { Form, FormInput } from '@/ui/controls';

type Props = {
    organisation: Organisation;
    validationResults: ValidationResult[];
    onChange: (organisation: Organisation) => void;
};

type State = {
    organisation: Organisation;
};

class OrganisationForm extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            organisation: props.organisation,
        };
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.organisation != prevProps.organisation)
            this.setState({
                organisation: this.props.organisation,
            });
    }

    handleChange = (fieldName: keyof Organisation, value: string) => {
        const organisation = update(this.state.organisation, { [fieldName]: { $set: value } });
        this.setState({
            organisation: organisation,
        });
        this.props.onChange(organisation);
    };

    render() {
        const { validationResults } = this.props;
        const { organisation } = this.state;

        return (
            <Form editUseCase="dir_edit_organisations">
                <FormInput
                    fieldName="name"
                    label="Name"
                    value={organisation.name}
                    onChange={this.handleChange}
                    validationResults={validationResults}
                    autoFocus={true}
                />
            </Form>
        );
    }
}

export default OrganisationForm;

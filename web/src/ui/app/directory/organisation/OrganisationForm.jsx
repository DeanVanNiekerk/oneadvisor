// @flow

import React, { Component } from 'react';

import type { ValidationResult } from '@/state/types';
import type { State as RootState } from '@/state/rootReducer';
import type { Organisation } from '@/state/app/directory/organisations/types';
import { Form, FormInput } from '@/ui/controls';
import { getValidationError } from '@/state/validation';

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

    handleChange = (fieldName: string, event: SyntheticInputEvent<any>) => {
        const organisation = {
            ...this.state.organisation,
            [fieldName]: event.target.value
        };
        this.setState({
            organisation: organisation
        });
        this.props.onChange(organisation);
    };

    render() {
        const { validationResults } = this.props;
        const { organisation } = this.state;

        if (!organisation) return <></>;

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

// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Col, Row } from 'reactstrap';

import type { ValidationResult } from '@/state/types';
import type { State as RootState } from '@/state/rootReducer';
import type { Organisation } from '@/state/app/directory/organisations/types';
import { Form, FormField } from '@/ui/controls';
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

        return (
            <Form>
                <Row form>
                    <Col md={6}>
                        <FormField
                            fieldName="name"
                            label="Name"
                            value={this.state.organisation.name}
                            onChange={this.handleChange}
                            validationResults={validationResults}
                        />
                    </Col>
                </Row>
            </Form>
        );
    }
}

const mapStateToProps = (state: RootState) => ({});

export default connect(mapStateToProps)(OrganisationForm);

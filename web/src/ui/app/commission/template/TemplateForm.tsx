import React, { Component } from 'react';
import { connect } from 'react-redux';

import { ValidationResult } from '@/app/validation';
import { CommissionStatementTemplateEdit } from '@/state/app/commission/templates';
import { companiesSelector, Company } from '@/state/app/directory/lookups';
import { RootState } from '@/state/rootReducer';
import { Form, FormInput, FormSelect } from '@/ui/controls';

type Props = {
    template: CommissionStatementTemplateEdit;
    validationResults: ValidationResult[];
    onChange: (template: CommissionStatementTemplateEdit) => void;
    companies: Company[];
};

type State = {
    template: CommissionStatementTemplateEdit;
};

class TemplateForm extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            template: props.template
        };
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.template != prevProps.template)
            this.setState({
                template: this.props.template
            });
    }

    handleChange = (fieldName: string, value: any) => {
        const template = {
            ...this.state.template,
            [fieldName]: value
        };
        this.setState({
            template: template
        });
        this.props.onChange(template);
    };

    render() {
        const { validationResults } = this.props;
        const { template } = this.state;

        return (
            <Form editUseCase="com_edit_commission_statement_templates">
                <FormInput
                    fieldName="name"
                    label="Name"
                    value={template.name}
                    onChange={this.handleChange}
                    validationResults={validationResults}
                    autoFocus={true}
                />
                <FormSelect
                    fieldName="companyId"
                    label="Company"
                    value={template.companyId}
                    onChange={this.handleChange}
                    validationResults={validationResults}
                    options={this.props.companies}
                    optionsValue="id"
                    optionsText="name"
                />
            </Form>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const companiesState = companiesSelector(state);

    return {
        companies: companiesState.items
    };
};

export default connect(mapStateToProps)(TemplateForm);

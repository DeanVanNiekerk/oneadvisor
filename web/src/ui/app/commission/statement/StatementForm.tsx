import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';

import { ValidationResult } from '@/app/validation';
import { StatementEdit } from '@/state/app/commission/statements';
import { companiesSelector, Company } from '@/state/app/directory/lookups';
import { RootState } from '@/state/rootReducer';
import { Form, FormDate, FormInputNumber, FormSelect, FormSwitch } from '@/ui/controls';

type Props = {
    statement: StatementEdit;
    validationResults: ValidationResult[];
    onChange: (member: StatementEdit) => void;
    companies: Company[];
} & DispatchProp;

type State = {
    statement: StatementEdit;
};

class StatementForm extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            statement: props.statement
        };
    }

    handleChange = async (fieldName: string, value: any) => {
        const statement = {
            ...this.state.statement,
            [fieldName]: value
        };
        this.setState({
            statement: statement
        });
        this.props.onChange(statement);
    };

    handleAmountExclVATChange = async (fieldName: string, value: number) => {
        const statement = {
            ...this.state.statement,
            amountIncludingVAT: value + this.state.statement.vat
        };
        this.setState({
            statement: statement
        });
        this.props.onChange(statement);
    };

    render() {
        const { validationResults } = this.props;
        const { statement } = this.state;

        return (
            <Form editUseCase="com_edit_commission_statements">
                <FormSelect
                    fieldName="companyId"
                    label="Company"
                    value={statement.companyId}
                    onChange={this.handleChange}
                    validationResults={validationResults}
                    options={this.props.companies}
                    optionsValue="id"
                    optionsText="name"
                />
                <FormInputNumber
                    fieldName="amountIncludingVAT"
                    label="Amount (incl VAT)"
                    value={statement.amountIncludingVAT}
                    onChange={this.handleChange}
                    validationResults={validationResults}
                    isCurrency={true}
                    min={0}
                />
                <FormInputNumber
                    fieldName="vat"
                    label="VAT"
                    value={statement.vat}
                    onChange={this.handleChange}
                    validationResults={validationResults}
                    isCurrency={true}
                    min={0}
                />
                <FormInputNumber
                    fieldName=""
                    label="Amount (excl VAT)"
                    value={statement.amountIncludingVAT - statement.vat}
                    onChange={this.handleAmountExclVATChange}
                    isCurrency={true}
                    min={0}
                />
                <FormDate
                    fieldName="date"
                    label="Date"
                    value={statement.date}
                    onChange={this.handleChange}
                    validationResults={validationResults}
                />
                <FormSwitch
                    fieldName="processed"
                    label="Processed"
                    value={statement.processed}
                    onChange={this.handleChange}
                    validationResults={validationResults}
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

export default connect(mapStateToProps)(StatementForm);

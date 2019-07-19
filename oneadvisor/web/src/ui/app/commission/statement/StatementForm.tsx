import update from "immutability-helper";
import React, { Component } from "react";
import { connect, DispatchProp } from "react-redux";

import { filterOption } from "@/app/controls/select";
import { ValidationResult } from "@/app/validation";
import { StatementEdit } from "@/state/app/commission/statements";
import { companiesSelector, Company } from "@/state/app/directory/lookups";
import { RootState } from "@/state/rootReducer";
import { Form, FormDate, FormInputNumber, FormSelect, FormSwitch } from "@/ui/controls";

type Props = {
    statement: StatementEdit;
    validationResults: ValidationResult[];
    onChange: (client: StatementEdit) => void;
    companies: Company[];
} & DispatchProp;

type State = {
    statement: StatementEdit;
    companySearch: string;
};

class StatementForm extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            statement: props.statement,
            companySearch: "",
        };
    }

    handleChange = async (fieldName: string, value: any) => {
        const statement = update(this.state.statement, { [fieldName]: { $set: value } });
        this.setState({
            statement: statement,
        });
        this.props.onChange(statement);
    };

    handleAmountExclVATChange = async (fieldName: string, value: number) => {
        const statement = update(this.state.statement, {
            amountIncludingVAT: { $set: value + this.state.statement.vat },
        });
        this.setState({
            statement: statement,
        });
        this.props.onChange(statement);
    };

    companySearch = (value: string) => {
        this.setState({
            companySearch: value,
        });
    };

    companies = () => {
        if (this.state.companySearch === "") return this.props.companies;
        return this.props.companies.filter(c => {
            return c.name.toLowerCase().indexOf(this.state.companySearch.toLowerCase()) === 0;
        });
    };

    render() {
        const { validationResults } = this.props;
        const { statement } = this.state;

        return (
            <Form editUseCase="com_edit_commission_statements">
                <FormSelect<string>
                    fieldName="companyId"
                    label="Company"
                    value={statement.companyId}
                    onChange={this.handleChange}
                    validationResults={validationResults}
                    options={this.companies()}
                    optionsValue="id"
                    optionsText="name"
                    autoFocus={true}
                    onSearch={this.companySearch}
                    onSelect={() => this.companySearch("")}
                    showSearch
                    allowClear
                    filterOption={filterOption}
                />
                <FormInputNumber
                    fieldName="amountIncludingVAT"
                    label="Amount (incl VAT)"
                    value={statement.amountIncludingVAT}
                    onChange={this.handleChange}
                    validationResults={validationResults}
                    min={0}
                />
                <FormInputNumber
                    fieldName="vat"
                    label="VAT"
                    value={statement.vat}
                    onChange={this.handleChange}
                    validationResults={validationResults}
                    min={0}
                />
                <FormInputNumber
                    fieldName=""
                    label="Amount (excl VAT)"
                    value={(statement.amountIncludingVAT - statement.vat).toFixed(2)}
                    onChange={this.handleAmountExclVATChange}
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
        companies: companiesState.items,
    };
};

export default connect(mapStateToProps)(StatementForm);

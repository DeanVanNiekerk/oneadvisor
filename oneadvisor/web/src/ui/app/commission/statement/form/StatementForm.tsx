import update from "immutability-helper";
import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import { filterOption } from "@/app/controls/select";
import { modifyStatement, StatementEdit, statementSelector } from "@/state/app/commission/statements";
import { organisationCompaniesSelector } from "@/state/app/directory/lookups";
import { RootState } from "@/state/rootReducer";
import { Form, FormDate, FormInputNumber, FormSelect, FormSwitch } from "@/ui/controls";

type Props = PropsFromState & PropsFromDispatch;

const StatementForm: React.FC<Props> = ({ statement, validationResults, handleChange, companies }) => {
    if (!statement) return <React.Fragment />;

    const onChange = (fieldName: keyof StatementEdit, value: string | number | boolean) => {
        handleChange(statement, fieldName, value);
    }

    const handleAmountExclVATChange = async (fieldName: string, value: number) => {
        onChange("amountIncludingVAT", value + statement.vat);
    };

    return (
        <Form editUseCase="com_edit_commission_statements">
            <FormSelect<string>
                fieldName="companyId"
                label="Company"
                value={statement.companyId}
                onChange={onChange}
                validationResults={validationResults}
                options={companies}
                optionsValue="id"
                optionsText="name"
                autoFocus={true}
                showSearch={true}
                allowClear
                filterOption={filterOption}
            />
            <FormInputNumber
                fieldName="amountIncludingVAT"
                label="Amount (incl VAT)"
                value={statement.amountIncludingVAT}
                onChange={onChange}
                validationResults={validationResults}
                min={0}
            />
            <FormInputNumber
                fieldName="vat"
                label="VAT"
                value={statement.vat}
                onChange={onChange}
                validationResults={validationResults}
                min={0}
            />
            <FormInputNumber
                fieldName=""
                label="Amount (excl VAT)"
                value={(statement.amountIncludingVAT - statement.vat).toFixed(2)}
                onChange={handleAmountExclVATChange}
                min={0}
            />
            <FormDate
                fieldName="date"
                label="Date"
                value={statement.date}
                onChange={onChange}
                validationResults={validationResults}
            />
            <FormSwitch
                fieldName="processed"
                label="Processed"
                value={statement.processed}
                onChange={onChange}
                validationResults={validationResults}
            />
        </Form>
    );
}

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    const statementState = statementSelector(state);
    const companiesState = organisationCompaniesSelector(state);
    return {
        statement: statementState.statement,
        validationResults: statementState.validationResults,
        companies: companiesState,
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        handleChange: (statement: StatementEdit, fieldName: keyof StatementEdit, value: string | number | boolean) => {
            const statementyModified = update(statement, { [fieldName]: { $set: value } });
            dispatch(modifyStatement(statementyModified));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StatementForm);

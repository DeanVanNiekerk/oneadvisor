import update from "immutability-helper";
import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import { filterOption } from "@/app/controls/select";
import { RootState } from "@/state";
import {
    CommissionStatementTemplateEdit,
    commissionStatementTemplateSelector,
    modifyCommissionStatementTemplate,
} from "@/state/commission/templates";
import { companiesSelector } from "@/state/directory/lookups";
import { Form, FormDate, FormInput, FormSelect } from "@/ui/controls";

type Props = PropsFromState & PropsFromDispatch;

const TemplateDetails: React.FC<Props> = ({
    template,
    validationResults,
    handleChange,
    companies,
}) => {
    if (!template) return <React.Fragment />;

    const onChange = (fieldName: keyof CommissionStatementTemplateEdit, value: string) => {
        handleChange(template, fieldName, value);
    };

    return (
        <Form>
            <FormInput
                fieldName="name"
                label="Name"
                value={template.name}
                onChange={onChange}
                validationResults={validationResults}
                autoFocus={true}
            />
            <FormSelect<string>
                fieldName="companyId"
                label="Company"
                showSearch={true}
                filterOption={filterOption}
                value={template.companyId || ""}
                onChange={onChange}
                validationResults={validationResults}
                options={companies}
                optionsValue="id"
                optionsText="name"
            />
            <FormDate
                fieldName="startDate"
                label="State Date"
                value={template.startDate || undefined}
                onChange={onChange}
                validationResults={validationResults}
                extra="Inclusive state date. Leave empty if there is no start date."
            />
            <FormDate
                fieldName="endDate"
                label="End Date"
                value={template.endDate || undefined}
                onChange={onChange}
                validationResults={validationResults}
                extra="Inclusive end date. Leave empty if there is no end date."
            />
        </Form>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    const templateState = commissionStatementTemplateSelector(state);

    return {
        template: templateState.template,
        validationResults: templateState.validationResults,
        companies: companiesSelector(state).items,
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        handleChange: (
            template: CommissionStatementTemplateEdit,
            fieldName: keyof CommissionStatementTemplateEdit,
            value: string
        ) => {
            const templateModified = update(template, { [fieldName]: { $set: value } });
            dispatch(modifyCommissionStatementTemplate(templateModified));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TemplateDetails);

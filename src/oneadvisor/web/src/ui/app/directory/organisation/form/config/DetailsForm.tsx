import update from "immutability-helper";
import React from "react";
import { connect } from "react-redux";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";

import { getValidationSubSet } from "@/app/validation";
import { RootState } from "@/state";
import {
    Config,
    modifyOrganisationConfig,
    organisationConfigSelector,
    organisationSelector,
} from "@/state/directory/organisations";
import { Form, FormDate, FormInput, FormSwitch } from "@/ui/controls";

type Props = PropsFromState & PropsFromDispatch;

const DetailsForm: React.FC<Props> = ({ config, handleChange, validationResults }) => {
    const onChange = (fieldName: keyof Config, value: string | boolean | null) => {
        handleChange(config, fieldName, value);
    };

    return (
        <Form layout="vertical" editUseCase="dir_edit_organisations">
            <FormInput
                fieldName="telephoneNumber"
                label="Telephone"
                onChange={onChange}
                value={config.telephoneNumber || ""}
                validationResults={validationResults}
            />

            <FormSwitch
                fieldName="vatRegistered"
                label="VAT Registered"
                value={config.vatRegistered}
                onChange={onChange}
                validationResults={validationResults}
            />
            <FormDate
                fieldName="vatRegistrationDate"
                label="VAT Registration Date"
                value={config.vatRegistrationDate || undefined}
                onChange={onChange}
                validationResults={validationResults}
                allowClear={true}
            />

            <FormSwitch
                fieldName="hasProfessionalIndemnityCover"
                label="Has professional indemnity cover"
                value={config.hasProfessionalIndemnityCover}
                onChange={onChange}
                validationResults={validationResults}
            />

            <FormSwitch
                fieldName="hasReceivedCommissionFromCompanies"
                label="Has received more than 30% of last years commission from the following companies?"
                value={config.hasReceivedCommissionFromCompanies}
                onChange={onChange}
                validationResults={validationResults}
            />
            <FormInput
                fieldName="hasReceivedCommissionFromCompaniesTarget"
                label="If yes, who?"
                onChange={onChange}
                value={config.hasReceivedCommissionFromCompaniesTarget || ""}
                validationResults={validationResults}
            />

            <FormSwitch
                fieldName="hasSharesInProductProviders"
                label="Holds more than 10% shares in any one of the product providers?"
                value={config.hasSharesInProductProviders}
                onChange={onChange}
                validationResults={validationResults}
            />
            <FormInput
                fieldName="hasSharesInProductProvidersTarget"
                label="If yes, who?"
                onChange={onChange}
                value={config.hasSharesInProductProvidersTarget || ""}
                validationResults={validationResults}
            />
        </Form>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    const organisationState = organisationSelector(state);
    return {
        config: organisationConfigSelector(state),
        validationResults: getValidationSubSet("Config", organisationState.validationResults),
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, {}, AnyAction>) => {
    return {
        handleChange: (config: Config, fieldName: keyof Config, value: string | boolean | null) => {
            const configModified = update(config, { [fieldName]: { $set: value } });
            dispatch(modifyOrganisationConfig(configModified));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailsForm);

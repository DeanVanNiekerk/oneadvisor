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
import { companiesSelector, Company } from "@/state/lookups/directory";
import { FormErrors, getFormSwitchList } from "@/ui/controls";

const FormSwitchList = getFormSwitchList<Company, string>();

type Props = PropsFromState & PropsFromDispatch;

const CompaniesForm: React.FC<Props> = ({ config, companies, handleChange, validationResults }) => {
    return (
        <>
            <FormErrors validationResults={validationResults} />
            <FormSwitchList
                idKey="id"
                itemName={(company) => company.name}
                selectedIds={config.companyIds}
                editUseCase="dir_edit_organisations"
                onChange={(companyIds) => handleChange(config, companyIds)}
                dataSource={companies}
            />
        </>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    const organisationState = organisationSelector(state);
    return {
        config: organisationConfigSelector(state),
        companies: companiesSelector(state).items,
        validationResults: getValidationSubSet(
            "Config.CompanyIds",
            organisationState.validationResults,
            true,
            true
        ),
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, {}, AnyAction>) => {
    return {
        handleChange: (config: Config, companyIds: string[]) => {
            const configModified = update(config, {
                companyIds: { $set: companyIds },
            });
            dispatch(modifyOrganisationConfig(configModified));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CompaniesForm);

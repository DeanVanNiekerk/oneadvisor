import update from "immutability-helper";
import React from "react";
import { connect } from "react-redux";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";

import { getValidationSubSet } from "@/app/validation";
import { RootState } from "@/state";
import { licenseCategoriesSelector, LicenseCategory } from "@/state/directory/lookups";
import {
    Config,
    modifyOrganisationConfig,
    organisationConfigSelector,
    organisationSelector,
} from "@/state/directory/organisations";
import { FormErrors, getFormSwitchList } from "@/ui/controls";

const FormSwitchList = getFormSwitchList<LicenseCategory, string>();

type Props = PropsFromState & PropsFromDispatch;

const LicenseCategoriesForm: React.FC<Props> = ({
    config,
    licenseCategories,
    handleChange,
    validationResults,
}) => {
    return (
        <>
            <FormErrors validationResults={validationResults} />
            <FormSwitchList
                idKey="id"
                itemName={(category) => (
                    <div style={{ display: "flex" }}>
                        <div style={{ paddingRight: 20 }}>{category.code}</div>
                        <div>{category.name}</div>
                    </div>
                )}
                selectedIds={config.licenseCategoryIds}
                editUseCase="dir_edit_organisations"
                onChange={(licenseCategoryIds) => handleChange(config, licenseCategoryIds)}
                dataSource={licenseCategories}
            />
        </>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    const organisationState = organisationSelector(state);
    return {
        config: organisationConfigSelector(state),
        licenseCategories: licenseCategoriesSelector(state).items,
        validationResults: getValidationSubSet(
            "Config.LicenseCategoryIds",
            organisationState.validationResults,
            true,
            true
        ),
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, {}, AnyAction>) => {
    return {
        handleChange: (config: Config, licenseCategoryIds: string[]) => {
            const configModified = update(config, {
                licenseCategoryIds: { $set: licenseCategoryIds },
            });
            dispatch(modifyOrganisationConfig(configModified));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(LicenseCategoriesForm);

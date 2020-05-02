import update from "immutability-helper";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { AnyAction, bindActionCreators } from "redux";
import { ThunkDispatch } from "redux-thunk";

import { getValidationSubSet } from "@/app/validation";
import { RootState } from "@/state";
import { getOrganisationByBranchId } from "@/state/directory/organisations";
import {
    modifyUserConfig,
    userConfigValidationResultsSelector,
    userSelector,
} from "@/state/directory/users";
import { Config } from "@/state/directory/users/types";
import { licenseCategoriesSelector, LicenseCategory } from "@/state/lookups/directory";
import { FormErrors, getFormSwitchList } from "@/ui/controls";

const FormSwitchList = getFormSwitchList<LicenseCategory, string>();

type Props = PropsFromState & PropsFromDispatch;

const LicenseCategoriesForm: React.FC<Props> = (props) => {
    const { user, licenseCategories, validationResults, handleChange } = props;

    const [organisationLicenseCategoryIds, setOrganisationLicenseCategoryIds] = useState<string[]>(
        []
    );

    useEffect(() => {
        if (!user || !user.branchId) return;

        props.getOrganisationByBranchId(user.branchId, (organisation) => {
            if (organisation)
                setOrganisationLicenseCategoryIds(organisation.config.licenseCategoryIds);
        });
    }, [user]);

    if (!user) return <React.Fragment />;

    return (
        <>
            <FormErrors
                validationResults={getValidationSubSet(
                    "LicenseCategoryIds",
                    validationResults,
                    true,
                    true
                )}
            />
            <FormSwitchList
                idKey="id"
                itemName={(category) => (
                    <div style={{ display: "flex" }}>
                        <div style={{ paddingRight: 20 }}>{category.code}</div>
                        <div>{category.name}</div>
                    </div>
                )}
                selectedIds={user.config.licenseCategoryIds}
                editUseCase="dir_edit_users"
                onChange={(licenseCategoryIds) => handleChange(user.config, licenseCategoryIds)}
                dataSource={licenseCategories.filter((lc) =>
                    organisationLicenseCategoryIds.some((id) => id === lc.id)
                )}
            />
        </>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    return {
        user: userSelector(state).user,
        licenseCategories: licenseCategoriesSelector(state).items,
        validationResults: userConfigValidationResultsSelector(state),
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, {}, AnyAction>) => {
    return {
        ...bindActionCreators({ getOrganisationByBranchId }, dispatch),
        handleChange: (config: Config, licenseCategoryIds: string[]) => {
            const configModified = update(config, {
                licenseCategoryIds: { $set: licenseCategoryIds },
            });
            dispatch(modifyUserConfig(configModified));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(LicenseCategoriesForm);

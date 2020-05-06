import update from "immutability-helper";
import React from "react";
import { connect } from "react-redux";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";

import { getValidationSubSet } from "@/app/validation";
import { RootState } from "@/state";
import {
    modifyOrganisationConfig,
    organisationConfigSelector,
    organisationSelector,
} from "@/state/directory/organisations";
import { Config, Fund } from "@/state/directory/organisations/types";
import { FormErrors, FormSimpleList } from "@/ui/controls";

type Props = PropsFromState & PropsFromDispatch;

const FundsForm: React.FC<Props> = ({ config, handleChange, validationResults }) => {
    return (
        <>
            <FormErrors validationResults={validationResults} />
            <FormSimpleList
                editUseCase="dir_edit_organisations"
                fieldName="funds"
                displayName="Fund"
                values={config.funds.map((f) => f.name)}
                onChange={(funds: string[]) =>
                    handleChange(
                        config,
                        funds.map((f) => ({ code: f, name: f }))
                    )
                }
                validationResults={validationResults}
            />
        </>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    const organisationState = organisationSelector(state);
    return {
        config: organisationConfigSelector(state),
        validationResults: getValidationSubSet(
            "Config.Funds",
            organisationState.validationResults,
            true,
            true
        ),
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, {}, AnyAction>) => {
    return {
        handleChange: (config: Config, funds: Fund[]) => {
            const configModified = update(config, {
                funds: { $set: funds },
            });
            dispatch(modifyOrganisationConfig(configModified));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(FundsForm);

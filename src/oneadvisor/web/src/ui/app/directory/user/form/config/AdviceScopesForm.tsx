import update from "immutability-helper";
import React from "react";
import { connect } from "react-redux";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";

import { getValidationSubSet } from "@/app/validation";
import { RootState } from "@/state";
import {
    modifyUserConfig,
    userConfigSelector,
    userConfigValidationResultsSelector,
} from "@/state/directory/users";
import { Config } from "@/state/directory/users/types";
import { AdviceScope, adviceScopesSelector } from "@/state/lookups/directory";
import { FormErrors, getFormSwitchList } from "@/ui/controls";

const FormSwitchList = getFormSwitchList<AdviceScope, string>();

type Props = PropsFromState & PropsFromDispatch;

const AdviceScopesForm: React.FC<Props> = (props) => {
    return (
        <>
            <FormErrors
                validationResults={getValidationSubSet(
                    "AdviceScopeIds",
                    props.validationResults,
                    true,
                    true
                )}
            />
            <FormSwitchList
                idKey="id"
                itemName={(scope) => scope.name}
                selectedIds={props.config.adviceScopeIds}
                editUseCase="dir_edit_users"
                onChange={(adviceScopeIds) => props.handleChange(props.config, adviceScopeIds)}
                dataSource={props.adviceScopes}
            />
        </>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    return {
        config: userConfigSelector(state),
        validationResults: userConfigValidationResultsSelector(state),
        adviceScopes: adviceScopesSelector(state).items,
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, {}, AnyAction>) => {
    return {
        handleChange: (config: Config, adviceScopeIds: string[]) => {
            const configModified = update(config, {
                adviceScopeIds: { $set: adviceScopeIds },
            });
            dispatch(modifyUserConfig(configModified));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AdviceScopesForm);

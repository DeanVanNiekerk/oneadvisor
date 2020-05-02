import update from "immutability-helper";
import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import { getValidationSubSet } from "@/app/validation";
import { RootState } from "@/state";
import { modifyUser, userSelector } from "@/state/directory/users";
import { UserEdit } from "@/state/directory/users/types";
import { FormErrors, FormSimpleList } from "@/ui/controls";

type Props = PropsFromState & PropsFromDispatch;

const AliasForm: React.FC<Props> = (props) => {
    const { user, handleChange, validationResults } = props;

    if (!user) return <React.Fragment />;

    return (
        <>
            <FormErrors
                validationResults={getValidationSubSet(
                    "Aliases",
                    props.validationResults,
                    true,
                    true
                )}
            />
            <FormSimpleList
                editUseCase="dir_edit_users"
                fieldName="Aliases"
                displayName="Alias"
                values={user.aliases}
                onChange={(aliases: string[]) => handleChange(user, aliases)}
                validationResults={validationResults}
            />
        </>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    const userState = userSelector(state);

    return {
        user: userState.user,
        validationResults: userState.validationResults,
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        handleChange: (user: UserEdit, aliases: string[]) => {
            const userModified = update(user, {
                aliases: { $set: aliases },
            });
            dispatch(modifyUser(userModified));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AliasForm);

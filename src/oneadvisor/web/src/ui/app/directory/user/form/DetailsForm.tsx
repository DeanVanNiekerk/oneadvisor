import update from "immutability-helper";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import { getScopes } from "@/config/scope";
import { RootState } from "@/state";
import { getBranch } from "@/state/directory/branches";
import { modifyUser, UserEdit, userSelector } from "@/state/directory/users";
import { userTypesSelector } from "@/state/lookups/directory";
import { Form, FormInput, FormSelect, FormSwitch } from "@/ui/controls";

import BranchSelect from "./BranchSelect";
import OrganisationSelect from "./OrganisationSelect";

type Props = PropsFromState & PropsFromDispatch;

const DetailsForm: React.FC<Props> = (props) => {
    const { user, userTypes, validationResults, handleChange } = props;

    const [organisationId, setOrganisationId] = useState<string | null>(null);

    //Set the inital organisation id
    useEffect(() => {
        if (!!organisationId || !user) return;
        props.getBranch(user.branchId, (branch) => {
            setOrganisationId(branch.organisationId);
        });
    }, [user]);

    if (!user) return <React.Fragment />;

    const onChange = (fieldName: keyof UserEdit, value: string | boolean | number | null) => {
        handleChange(user, fieldName, value);
    };

    return (
        <Form editUseCase="dir_edit_users">
            <FormInput
                fieldName="firstName"
                label="First Name"
                value={user.firstName}
                onChange={onChange}
                validationResults={validationResults}
                autoFocus={true}
            />
            <FormInput
                fieldName="lastName"
                label="Last Name"
                value={user.lastName}
                onChange={onChange}
                validationResults={validationResults}
            />
            <FormInput
                fieldName="email"
                label="Email"
                value={user.email}
                onChange={onChange}
                validationResults={validationResults}
            />
            <FormInput
                fieldName="userName"
                label="Username"
                value={user.userName}
                onChange={onChange}
                validationResults={validationResults}
            />
            <OrganisationSelect
                organisationId={organisationId}
                validationResults={validationResults}
                onChange={(organisationId) => {
                    setOrganisationId(organisationId);
                    onChange("branchId", null);
                }}
            />
            <BranchSelect
                branchId={user.branchId}
                organisationId={organisationId}
                validationResults={validationResults}
                onChange={(branchId: string) => onChange("branchId", branchId)}
            />
            <FormSelect<number>
                fieldName="scope"
                label="Scope"
                value={user.scope}
                onChange={onChange}
                validationResults={validationResults}
                options={getScopes()}
                optionsValue="id"
                optionsText="name"
            />
            <FormSelect<string>
                fieldName="userTypeId"
                label="Type"
                value={user.userTypeId}
                onChange={onChange}
                validationResults={validationResults}
                options={userTypes}
                optionsValue="id"
                optionsText="name"
            />
            <FormSwitch
                fieldName="isLocked"
                label="Locked"
                value={user.isLocked}
                onChange={onChange}
                validationResults={validationResults}
                className={user.isLocked ? "bg-error" : ""}
            />
        </Form>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    const userState = userSelector(state);

    return {
        user: userState.user,
        validationResults: userState.validationResults,
        userTypes: userTypesSelector(state).items,
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        ...bindActionCreators({ getBranch }, dispatch),
        handleChange: (
            user: UserEdit,
            fieldName: keyof UserEdit,
            value: string | boolean | number | null
        ) => {
            const userModified = update(user, { [fieldName]: { $set: value } });
            dispatch(modifyUser(userModified));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailsForm);

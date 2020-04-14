import update from "immutability-helper";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import { getValidationSubSet } from "@/app/validation";
import { RootState } from "@/state";
import { applicationsSelector } from "@/state/context";
import { getOrganisationByBranchId } from "@/state/directory/organisations";
import { fetchRoles, Role, rolesSelector } from "@/state/directory/roles";
import { modifyUser, UserEdit, userSelector } from "@/state/directory/users";
import { FormErrors, getFormSwitchList } from "@/ui/controls";

const FormSwitchList = getFormSwitchList<Role, string>();

type Props = PropsFromState & PropsFromDispatch;

const RolesForm: React.FC<Props> = (props) => {
    const { user } = props;

    const [organisationApplicationIds, setOrganisationApplicationIds] = useState<string[]>([]);

    useEffect(() => {
        props.fetchRoles();
    }, []);

    useEffect(() => {
        if (!user || !user.branchId) return;

        props.getOrganisationByBranchId(user.branchId, (organisation) => {
            if (organisation) setOrganisationApplicationIds(organisation.applicationIds);
        });
    }, [user ? user.branchId : ""]);

    const getOrganisationApplications = () => {
        return props.applications.filter((a) =>
            organisationApplicationIds.some((id) => a.id === id)
        );
    };

    const handleChange = (roles: string[], applicationId: string) => {
        if (!user) return;

        const rolesFiltered = user.roles.filter((r) => getRoleApplicationId(r) !== applicationId);
        const updatedRoles = [...rolesFiltered, ...roles];

        props.handleChange(user, updatedRoles);
    };

    const getRoleApplicationId = (roleName: string): string => {
        const role = props.roles.find((r) => r.name === roleName);
        return role ? role.applicationId : "";
    };

    if (!user) return <React.Fragment />;

    return (
        <>
            <FormErrors
                validationResults={getValidationSubSet(
                    "Roles",
                    props.validationResults,
                    true,
                    true
                )}
            />
            {getOrganisationApplications().map((application) => (
                <FormSwitchList
                    key={application.id}
                    idKey="name"
                    itemName={(role) => role.description}
                    selectedIds={user.roles.filter(
                        (r) => getRoleApplicationId(r) === application.id
                    )}
                    editUseCase="dir_edit_users"
                    header={application.name}
                    onChange={(roles) => handleChange(roles, application.id)}
                    dataSource={props.roles.filter((r) => r.applicationId === application.id)}
                />
            ))}
        </>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    const userState = userSelector(state);

    return {
        user: userState.user,
        validationResults: userState.validationResults,
        applications: applicationsSelector(state),
        roles: rolesSelector(state).items,
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        ...bindActionCreators({ getOrganisationByBranchId, fetchRoles }, dispatch),
        handleChange: (user: UserEdit, roles: string[]) => {
            const userModified = update(user, {
                roles: { $set: roles },
            });
            dispatch(modifyUser(userModified));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(RolesForm);

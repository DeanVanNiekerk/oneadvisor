import { List, Switch } from "antd";
import update from "immutability-helper";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import { getValidationSubSet } from "@/app/validation";
import { RootState } from "@/state";
import { applicationsSelector, fetchApplications } from "@/state/directory/applications";
import { getOrganisations } from "@/state/directory/organisations";
import { fetchRoles, Role, rolesSelector } from "@/state/directory/roles";
import { modifyUser, UserEdit, userSelector } from "@/state/directory/users";
import { FormErrors } from "@/ui/controls";

type Props = PropsFromState & PropsFromDispatch;

const RolesForm: React.FC<Props> = (props) => {
    const { user, handleChange } = props;

    const [organisationApplicationIds, setOrganisationApplicationIds] = useState<string[]>([]);

    useEffect(() => {
        props.fetchRoles();
        props.fetchApplications();
    }, []);

    useEffect(() => {
        if (!user || !user.branchId) return;

        props.getOrganisations({ branchId: [user.branchId] }, (result) => {
            setOrganisationApplicationIds(result.items[0].applicationIds);
        });
    }, [user]);

    if (!user) return <React.Fragment />;

    const getOrganisationApplications = () => {
        return props.applications.filter((a) =>
            organisationApplicationIds.some((id) => a.id === id)
        );
    };

    const isRoleSelected = (role: string) => {
        if (!user) return;
        return user.roles.some((r) => r === role);
    };

    const toggleRoleChange = (role: string) => {
        let rolesModified = [...user.roles];

        if (isRoleSelected(role)) rolesModified = user.roles.filter((r) => r !== role);
        else rolesModified.push(role);

        handleChange(user, rolesModified);
    };

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
                <List
                    key={application.id}
                    header={<h4 className="mb-0">{application.name}</h4>}
                    bordered={true}
                    size="small"
                    dataSource={props.roles.filter((r) => r.applicationId === application.id)}
                    renderItem={(role: Role) => (
                        <List.Item
                            actions={[
                                <Switch
                                    key={"1"}
                                    //disabled={!hasUseCase("dir_edit_users", this.props.useCases)}
                                    checked={isRoleSelected(role.name)}
                                    onChange={() => toggleRoleChange(role.name)}
                                    size="small"
                                />,
                            ]}
                        >
                            {role.description}
                        </List.Item>
                    )}
                    className="mb-2"
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
        applications: applicationsSelector(state).items,
        roles: rolesSelector(state).items,
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        ...bindActionCreators({ getOrganisations, fetchRoles, fetchApplications }, dispatch),
        handleChange: (user: UserEdit, roles: string[]) => {
            const userModified = update(user, {
                roles: { $set: roles },
            });
            dispatch(modifyUser(userModified));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(RolesForm);

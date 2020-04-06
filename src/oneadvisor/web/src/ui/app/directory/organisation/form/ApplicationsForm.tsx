import { List, Switch } from "antd";
import update from "immutability-helper";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";

import { getValidationSubSet } from "@/app/validation";
import { RootState } from "@/state";
import {
    Application,
    applicationsSelector,
    fetchApplications,
} from "@/state/directory/applications";
import {
    modifyOrganisation,
    OrganisationEdit,
    organisationSelector,
} from "@/state/directory/organisations";
import { FormErrors } from "@/ui/controls";

type Props = PropsFromState & PropsFromDispatch;

const ApplicationsForm: React.FC<Props> = ({
    organisation,
    applications,
    handleChange,
    fetchApplications,
    validationResults,
}) => {
    useEffect(() => {
        fetchApplications();
    }, []);

    if (!organisation) return <React.Fragment />;

    const isApplicationSelected = (applicationId: string) => {
        return organisation.applicationIds.some((r) => r === applicationId);
    };

    const toggleApplicationChange = (applicationId: string) => {
        let applicationIdsModified = [...organisation.applicationIds];

        if (isApplicationSelected(applicationId))
            applicationIdsModified = organisation.applicationIds.filter((a) => a !== applicationId);
        else applicationIdsModified.push(applicationId);

        handleChange(organisation, applicationIdsModified);
    };

    return (
        <>
            <FormErrors validationResults={validationResults} />
            <List
                bordered={true}
                size="small"
                dataSource={applications}
                renderItem={(application: Application) => (
                    <List.Item
                        actions={[
                            <Switch
                                key={"1"}
                                checked={isApplicationSelected(application.id)}
                                size="small"
                                onChange={() => toggleApplicationChange(application.id)}
                            />,
                        ]}
                    >
                        {application.name}
                    </List.Item>
                )}
                className="mb-2"
            />
        </>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    const organisationState = organisationSelector(state);
    return {
        organisation: organisationState.organisation,
        applications: applicationsSelector(state).items,
        validationResults: getValidationSubSet(
            "ApplicationIds",
            organisationState.validationResults,
            true,
            true
        ),
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, {}, AnyAction>) => {
    return {
        handleChange: (organisation: OrganisationEdit, applicationIds: string[]) => {
            const organisationModified = update(organisation, {
                applicationIds: { $set: applicationIds },
            });
            dispatch(modifyOrganisation(organisationModified));
        },
        fetchApplications: () => {
            dispatch(fetchApplications());
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ApplicationsForm);

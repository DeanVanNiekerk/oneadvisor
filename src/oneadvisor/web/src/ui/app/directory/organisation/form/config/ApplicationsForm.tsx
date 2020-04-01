import { List, Switch } from "antd";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";

import {
    Application,
    applicationsSelector,
    fetchApplications,
} from "@/state/app/directory/applications";
import {
    modifyOrganisationConfigApplicationIds,
    organisationConfigApplicationIdsSelector,
} from "@/state/app/directory/organisations";
import { RootState } from "@/state/rootReducer";

type Props = PropsFromState & PropsFromDispatch;

const ApplicationsForm: React.FC<Props> = ({
    applicationIds,
    applications,
    handleChange,
    fetchApplications,
}) => {
    useEffect(() => {
        fetchApplications();
    }, []);

    const isApplicationSelected = (applicationId: string) => {
        return applicationIds.some((r) => r === applicationId);
    };

    const toggleApplicationChange = (applicationId: string) => {
        let applicationIdsModified = [...applicationIds];

        if (isApplicationSelected(applicationId))
            applicationIdsModified = applicationIds.filter((a) => a !== applicationId);
        else applicationIdsModified.push(applicationId);

        handleChange(applicationIdsModified);
    };

    return (
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
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    return {
        applicationIds: organisationConfigApplicationIdsSelector(state),
        applications: applicationsSelector(state).items,
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, {}, AnyAction>) => {
    return {
        handleChange: (applicationIds: string[]) => {
            dispatch(modifyOrganisationConfigApplicationIds(applicationIds));
        },
        fetchApplications: () => {
            dispatch(fetchApplications());
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ApplicationsForm);

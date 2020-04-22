import { Alert, Divider, List } from "antd";
import React from "react";
import { connect } from "react-redux";

import { RootState } from "@/state";
import { policiesSelector, Policy } from "@/state/client/policies";
import { UserName } from "@/ui/controls";

import { PolicyMergeSteps } from "../PolicyMergeSteps";

type Props = {
    nextStep: () => void;
} & PropsFromState;

const SourcePolicies: React.FC<Props> = (props) => {
    return (
        <>
            <PolicyMergeSteps currentStepIndex={0} onNext={props.nextStep} />

            <Divider />

            <Alert
                message="Before continuing, please confirm that you do wish to merge all the policies below."
                type="info"
                showIcon
                className="mb-1"
            />

            <List
                itemLayout="horizontal"
                bordered={true}
                dataSource={props.policies}
                renderItem={(policy: Policy) => (
                    <List.Item>
                        <List.Item.Meta
                            title={policy.number}
                            description={
                                <div>
                                    <span>
                                        <b>Client: </b>
                                    </span>
                                    <span>{`${policy.clientInitials ? policy.clientInitials : ""} ${
                                        policy.clientLastName
                                    }`}</span>{" "}
                                    <span>
                                        <b>Broker: </b>
                                    </span>
                                    <span>
                                        <UserName userId={policy.userId} />
                                    </span>
                                    <span>
                                        <b>Company: </b>
                                    </span>
                                    <span>{policy.companyName}</span>{" "}
                                </div>
                            }
                        />
                    </List.Item>
                )}
            />
        </>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    const policiesState = policiesSelector(state);
    return {
        policies: policiesState.selectedPolicies,
    };
};

export default connect(mapStateToProps)(SourcePolicies);

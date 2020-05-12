import { List } from "antd";
import Alert from "antd/lib/alert";
import React, { useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";

import { Button, Drawer } from "@/ui/controls";
import { showMessage } from "@/ui/feedback/notifcation";

import { SubstituteProperties } from "./generate/utils";

type VariableOptions = {
    name: keyof SubstituteProperties;
    description: string;
};

const TextSubstitutionInfo: React.FC = () => {
    const [showInfo, setShowInfo] = useState<boolean>(false);

    const options: VariableOptions[] = [
        {
            name: "clientFullName",
            description: "The client's full name",
        },
        {
            name: "clientAge",
            description: "The client's clients age",
        },
        {
            name: "clientIdNumber",
            description: "The client's ID number",
        },
        {
            name: "retirementAge",
            description: "The client's retirment age",
        },
        {
            name: "clientYearsToRetirement",
            description: "The client's years to retirements (Retirement Age - Age)",
        },
        {
            name: "lifeExpectancy",
            description: "The client's life expectancy",
        },
        {
            name: "needMonthly",
            description: "The client's monthly need in Rands",
        },
        {
            name: "needLumpsum",
            description: "The client's lumpsum need in Rands",
        },
        {
            name: "rateOfReturn",
            description: "The client's assumed rate of return (eg CPI + 4%)",
        },
        {
            name: "contributionMonthly",
            description: "The client's monthly contribution in Rands",
        },
        {
            name: "contributionLumpsum",
            description: "The client's lumpsum contribution in Rands",
        },
        {
            name: "userFullName",
            description: "The Brokers's full name (Your full name)",
        },
        {
            name: "userOrganisationName",
            description: "The Brokers's organisation name (Your organisation name)",
        },
    ];

    return (
        <>
            <Button type="default" iconName="swap" onClick={() => setShowInfo(true)}>
                Text Substitution
            </Button>

            <Drawer
                title="Text Substitution"
                iconName="swap"
                visible={showInfo}
                onClose={() => setShowInfo(false)}
                footer={
                    <React.Fragment>
                        <Button onClick={() => setShowInfo(false)}>Close</Button>
                    </React.Fragment>
                }
            >
                <Alert
                    message="Text substitution allows you to pull variables into the Consult Reason, Recommendation and Client Choice sections"
                    type="info"
                />

                <div className="mt-2 mb-1 bold">Available Variables</div>

                <List<VariableOptions>
                    itemLayout="horizontal"
                    bordered
                    dataSource={options}
                    renderItem={(option) => (
                        <List.Item
                            actions={[
                                <CopyToClipboard
                                    text={`{${option.name}}`}
                                    onCopy={() => {
                                        showMessage("info", "Variable Copied", 2);
                                    }}
                                >
                                    <a>Copy</a>
                                </CopyToClipboard>,
                            ]}
                        >
                            <List.Item.Meta
                                title={`{${option.name}}`}
                                description={option.description}
                            />
                        </List.Item>
                    )}
                />
            </Drawer>
        </>
    );
};

export default TextSubstitutionInfo;

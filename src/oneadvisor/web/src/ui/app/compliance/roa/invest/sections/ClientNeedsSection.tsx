import { Card, Col, Row } from "antd";
import React, { useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import { RootState } from "@/state";
import {
    receiveClientId,
    receiveConsultReason,
    receiveContributionLumpsum,
    receiveContributionMonthly,
    receiveInvestmentAdviceType,
    receiveNeedLumpsum,
    receiveNeedMonthly,
    roaInvestInputsNeedsSelector,
} from "@/state/compliance/roa";
import {
    Button,
    ClientName,
    ClientSearch,
    Drawer,
    Form,
    FormInputNumber,
    FormSelect,
    FormText,
    FormTextArea,
} from "@/ui/controls";

type InvestmentAdviceType = {
    code: string;
    name: string;
};

const investmentAdviceTypes: InvestmentAdviceType[] = [
    {
        code: "retirement",
        name: "Retirement",
    },
    {
        code: "education",
        name: "Education",
    },
    {
        code: "reserve",
        name: "Reserve",
    },
    {
        code: "other",
        name: "other",
    },
];

type Props = PropsFromState & PropsFromDispatch;

const ClientObjectiveSection: React.FC<Props> = (props) => {
    const [clientSearchVisible, setClientSearchVisible] = useState<boolean>(false);

    const labelSpan = 9;

    return (
        <Card title="Client Needs">
            <Row gutter={24}>
                <Col md={24} xl={12}>
                    <Form layout="vertical">
                        <FormText
                            fieldName="clientId"
                            label="Client"
                            value={props.clientId ? <ClientName clientId={props.clientId} /> : null}
                            emptyValueText={<span className="text-error">Select Client</span>}
                            extra={
                                <>
                                    <Button
                                        iconName="search"
                                        type={props.clientId ? "dashed" : "primary"}
                                        onClick={() => setClientSearchVisible(true)}
                                        size="small"
                                    >
                                        {props.clientId ? "Change Client" : "Select Client"}
                                    </Button>
                                </>
                            }
                        />
                        <FormTextArea
                            fieldName="consultReason"
                            label="Consult Reason"
                            value={props.consultReason}
                            rows={5}
                            onChange={(_fieldName, value) => props.receiveConsultReason(value)}
                        />
                    </Form>
                </Col>

                <Col md={24} xl={12}>
                    <Form>
                        <FormSelect<string>
                            fieldName="investmentAdviceTypes"
                            label="Advice Type"
                            options={investmentAdviceTypes}
                            optionsValue="code"
                            optionsText="name"
                            value={props.investmentAdviceType}
                            labelSpan={labelSpan}
                            onChange={(_fieldName, values) =>
                                props.receiveInvestmentAdviceType(values)
                            }
                        />
                        <FormInputNumber
                            fieldName="needMonthly"
                            label="Monthly Need"
                            value={props.needMonthly}
                            labelSpan={labelSpan}
                            onChange={(_fieldName, value) =>
                                props.receiveNeedMonthly(value === undefined ? null : value)
                            }
                            precision={0}
                        />
                        <FormInputNumber
                            fieldName="needLumpsum"
                            label="Lumpsum Need"
                            value={props.needLumpsum}
                            labelSpan={labelSpan}
                            onChange={(_fieldName, value) =>
                                props.receiveNeedLumpsum(value === undefined ? null : value)
                            }
                            precision={0}
                        />
                        <FormInputNumber
                            fieldName="contributionMonthly"
                            label="Monthly Contribution"
                            value={props.contributionMonthly}
                            labelSpan={labelSpan}
                            onChange={(_fieldName, value) =>
                                props.receiveContributionMonthly(value === undefined ? null : value)
                            }
                            precision={0}
                        />
                        <FormInputNumber
                            fieldName="contributionLumpsum"
                            label="Lumpsum Contribution"
                            value={props.contributionLumpsum}
                            labelSpan={labelSpan}
                            onChange={(_fieldName, value) =>
                                props.receiveContributionLumpsum(value === undefined ? null : value)
                            }
                            precision={0}
                        />
                    </Form>
                </Col>
            </Row>

            <Drawer
                title="Client Search"
                visible={clientSearchVisible}
                onClose={() => setClientSearchVisible(false)}
                footer={<Button onClick={() => setClientSearchVisible(false)}>Close</Button>}
            >
                <ClientSearch
                    defaultSearchText={""}
                    onSelect={(clientId: string) => {
                        props.receiveClientId(clientId);
                        setClientSearchVisible(false);
                    }}
                />
            </Drawer>
        </Card>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    const needsState = roaInvestInputsNeedsSelector(state);
    return {
        clientId: needsState.clientId,
        consultReason: needsState.consultReason,
        investmentAdviceType: needsState.investmentAdviceType,
        needMonthly: needsState.needMonthly,
        needLumpsum: needsState.needLumpsum,
        contributionMonthly: needsState.contributionMonthly,
        contributionLumpsum: needsState.contributionLumpsum,
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        ...bindActionCreators(
            {
                receiveClientId,
                receiveConsultReason,
                receiveInvestmentAdviceType,
                receiveNeedMonthly,
                receiveNeedLumpsum,
                receiveContributionMonthly,
                receiveContributionLumpsum,
            },
            dispatch
        ),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ClientObjectiveSection);

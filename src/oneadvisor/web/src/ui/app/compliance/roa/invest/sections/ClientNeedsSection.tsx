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
    receiveInvestmentAdviceTypeCode,
    receiveNeedLumpsum,
    receiveNeedMonthly,
    roaInvestInputsNeedsSelector,
    roaInvestLookupsSelector,
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
                            options={props.investmentAdviceTypes}
                            optionsValue="code"
                            optionsText="name"
                            value={props.investmentAdviceTypeCode}
                            labelSpan={labelSpan}
                            onChange={(_fieldName, values) =>
                                props.receiveInvestmentAdviceTypeCode(values)
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
    const lookupsState = roaInvestLookupsSelector(state);
    return {
        clientId: needsState.clientId,
        consultReason: needsState.consultReason,
        investmentAdviceTypeCode: needsState.investmentAdviceTypeCode,
        needMonthly: needsState.needMonthly,
        needLumpsum: needsState.needLumpsum,
        contributionMonthly: needsState.contributionMonthly,
        contributionLumpsum: needsState.contributionLumpsum,
        investmentAdviceTypes: lookupsState.investmentAdviceTypes,
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        ...bindActionCreators(
            {
                receiveClientId,
                receiveConsultReason,
                receiveInvestmentAdviceTypeCode,
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

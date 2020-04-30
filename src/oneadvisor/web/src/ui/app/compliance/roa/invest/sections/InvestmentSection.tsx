import { Card, Col, Row } from "antd";
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import {
    receiveInvestment,
    removeInvestment,
    roaInvestRecommendedCompaniesSelector,
    roaInvestRecommendedFundsSelector,
    roaInvestRecommendedProductTypesSelector,
} from "@/state/compliance/roa";
import { Investment } from "@/state/compliance/roa/invest/inputs/types";
import { RootState } from "@/state/types";
import { Form, FormInputNumber, FormSelect } from "@/ui/controls";
import { showConfirm } from "@/ui/feedback/modal/confirm";
import { DeleteOutlined } from "@ant-design/icons";

type Props = {
    index: number;
    investment: Investment;
} & PropsFromState &
    PropsFromDispatch;

const InvestmentSection: React.FC<Props> = (props) => {
    const { investment } = props;

    const onChange = (fieldName: string, value: string | number | null | string[]) => {
        props.receiveInvestment({
            ...props.investment,
            [fieldName]: value,
        });
    };

    const removeInvestment = (id: string) => {
        showConfirm({
            title: "Remove Investment",
            content: "Are you sure you want to remove this investment?",
            onOk: () => {
                props.removeInvestment(id);
            },
        });
    };

    const labelSpan = 12;

    return (
        <Card
            title={`Investment ${(props.index + 1).toString()}`}
            extra={[
                <DeleteOutlined
                    key="1"
                    className="text-error"
                    onClick={() => removeInvestment(investment.id)}
                />,
            ]}
        >
            <Row gutter={24}>
                <Col md={24} xl={12}>
                    <Form>
                        <FormInputNumber
                            fieldName="contributionPremium"
                            label="Premium Contribution"
                            value={investment.contributionPremium}
                            onChange={(fieldName, value) =>
                                onChange(fieldName, value === undefined ? null : value)
                            }
                            precision={0}
                            labelSpan={labelSpan}
                        />
                        <FormInputNumber
                            fieldName="contributionLumpsum"
                            label="Lumpsum Contribution"
                            value={investment.contributionLumpsum}
                            onChange={(fieldName, value) =>
                                onChange(fieldName, value === undefined ? null : value)
                            }
                            precision={0}
                            labelSpan={labelSpan}
                        />
                        <FormInputNumber
                            fieldName="upfrontFeePercent"
                            label="Upfront Fee Percent"
                            value={investment.upfrontFeePercent}
                            onChange={(fieldName, value) =>
                                onChange(fieldName, value === undefined ? null : value)
                            }
                            precision={0}
                            labelSpan={labelSpan}
                        />
                        <FormInputNumber
                            fieldName="upfrontFeeAmount"
                            label="Upfront Fee Amount"
                            value={investment.upfrontFeeAmount}
                            onChange={(fieldName, value) =>
                                onChange(fieldName, value === undefined ? null : value)
                            }
                            precision={0}
                            labelSpan={labelSpan}
                        />
                        <FormInputNumber
                            fieldName="assetManagementFeePercent"
                            label="Asset Management Fee Percent"
                            value={investment.assetManagementFeePercent}
                            onChange={(fieldName, value) =>
                                onChange(fieldName, value === undefined ? null : value)
                            }
                            precision={0}
                            labelSpan={labelSpan}
                        />
                    </Form>
                </Col>

                <Col md={24} xl={12}>
                    <Form>
                        <FormSelect<string>
                            fieldName="productTypeId"
                            label="Product"
                            options={props.productTypes}
                            optionsValue="id"
                            optionsText="name"
                            value={investment.productTypeId}
                            onChange={onChange}
                        />
                        <FormSelect<string[]>
                            mode="multiple"
                            fieldName="funds"
                            label="Funds"
                            options={props.funds.map((f) => ({ id: f, name: f }))}
                            optionsValue="id"
                            optionsText="name"
                            value={investment.funds}
                            onChange={onChange}
                        />
                        <FormSelect<string>
                            fieldName="companyId"
                            label="Company"
                            options={props.companies}
                            optionsValue="id"
                            optionsText="name"
                            value={investment.companyId}
                            onChange={onChange}
                        />
                    </Form>
                </Col>
            </Row>
        </Card>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    return {
        productTypes: roaInvestRecommendedProductTypesSelector(state),
        companies: roaInvestRecommendedCompaniesSelector(state),
        funds: roaInvestRecommendedFundsSelector(state),
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        ...bindActionCreators({ receiveInvestment, removeInvestment }, dispatch),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(InvestmentSection);

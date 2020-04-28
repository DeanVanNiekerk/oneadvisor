import { Col } from "antd";
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import { RootState } from "@/state";
import { addInvestment, roaInvestInputsSelector } from "@/state/compliance/roa";
import { Button } from "@/ui/controls";

import InvestmentSection from "./InvestmentSection";

type Props = PropsFromState & PropsFromDispatch;

const InvestmentListSection: React.FC<Props> = (props) => {
    return (
        <>
            {props.investments.map((investment, index) => {
                return (
                    <Col key={investment.id} md={24} className="pt-1">
                        <InvestmentSection index={index} investment={investment} />
                    </Col>
                );
            })}
            <Col md={24} className="pt-1 pb-2">
                <Button
                    block
                    type="dashed"
                    size="large"
                    iconName="plus"
                    onClick={props.addInvestment}
                >
                    Add Investment
                </Button>
            </Col>
        </>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    const roaInvestState = roaInvestInputsSelector(state);
    return {
        investments: roaInvestState.investments,
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        ...bindActionCreators({ addInvestment }, dispatch),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(InvestmentListSection);

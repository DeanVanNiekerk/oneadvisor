import { Col, Row } from "antd";
import React, { useState } from "react";
import { connect } from "react-redux";
import { AnyAction, bindActionCreators } from "redux";
import { ThunkDispatch } from "redux-thunk";

import { loadRoaInvestData } from "@/state/compliance/roa";
import { RootState } from "@/state/types";
import { Button, Drawer, Header } from "@/ui/controls";

import RoaPdf from "./generate/RoaPdf";
import InputsPersistor from "./InputsPersistor";
import AdvisorRecommendationsSection from "./sections/AdvisorRecommendationsSection";
import ClientChoiceSection from "./sections/ClientChoiceSection";
import ClientNeedsSection from "./sections/ClientNeedsSection";
import InvestmentListSection from "./sections/InvestmentListSection";
import OptionsDiscussedSection from "./sections/OptionsDiscussedSection";

type Props = PropsFromDispatch;

const RoaInvest: React.FC<Props> = (props) => {
    const [showPreview, setShowPreview] = useState<boolean>(false);

    return (
        <>
            <Header
                iconName="file-done"
                actions={
                    <>
                        <Button
                            type="primary"
                            iconName="file-pdf"
                            onClick={() => {
                                props.loadRoaInvestData();
                                setShowPreview(true);
                            }}
                        >
                            Preview
                        </Button>
                    </>
                }
            >
                Record of Advice: Invest
            </Header>

            <CardsContainer />

            <Drawer
                title="Record of Advice: Invest"
                iconName="file-pdf"
                visible={showPreview}
                onClose={() => setShowPreview(false)}
                bodyStyle={{
                    padding: 0,
                    margin: 0,
                    overflow: "hidden",
                }}
                footer={
                    <React.Fragment>
                        <Button onClick={() => setShowPreview(false)}>Close</Button>
                    </React.Fragment>
                }
            >
                <RoaPdf />
            </Drawer>

            <InputsPersistor />
        </>
    );
};

const CardsContainer: React.FC = () => {
    return (
        <div>
            <Row gutter={18}>
                <Col md={24}>
                    <ClientNeedsSection />
                </Col>
                <Col md={24} className="pt-1">
                    <OptionsDiscussedSection />
                </Col>
                <Col md={24} className="pt-1">
                    <AdvisorRecommendationsSection />
                </Col>
                <Col md={24} className="pt-1">
                    <ClientChoiceSection />
                </Col>
                <InvestmentListSection />
            </Row>
        </div>
    );
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, {}, AnyAction>) => {
    return {
        ...bindActionCreators({ loadRoaInvestData }, dispatch),
    };
};

export default connect(null, mapDispatchToProps)(RoaInvest);

import React from "react";
import { connect } from "react-redux";

import { RootState } from "@/state";
import { roaInvestRiskQuestionsSelector } from "@/state/compliance/roa";

import RiskAnswers from "./RiskAnswers";

type Props = PropsFromState;

const RiskQuestions: React.FC<Props> = (props) => {
    return (
        <>
            {props.questions.map((question) => {
                return (
                    <div style={{ paddingBottom: 20, paddingTop: 10 }} key={question.code}>
                        <div style={{ paddingBottom: 10 }}>{question.text}</div>
                        <div>
                            <RiskAnswers question={question} />
                        </div>
                    </div>
                );
            })}
        </>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    return {
        questions: roaInvestRiskQuestionsSelector(state),
    };
};

export default connect(mapStateToProps)(RiskQuestions);

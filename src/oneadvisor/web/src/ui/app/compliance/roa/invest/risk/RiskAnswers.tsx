import { Switch } from "antd";
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import { RootState } from "@/state";
import {
    riskProfileQuestionAnswered,
    roaInvestRiskQuestionAnswersSelector,
} from "@/state/compliance/roa";
import { RiskProfileQuestion } from "@/state/compliance/roa/invest/risk/types";

type Props = OwnProps & PropsFromState & PropsFromDispatch;

type OwnProps = {
    question: RiskProfileQuestion;
};

const RiskAnswers: React.FC<Props> = (props) => {
    return (
        <>
            {props.question.answers.map((answer) => {
                return (
                    <div style={{ paddingBottom: 6 }} key={answer.code}>
                        <div style={{ display: "flex", paddingTop: 2, paddingBottom: 2 }}>
                            <div style={{ paddingRight: 12 }}>
                                <Switch
                                    size="small"
                                    checked={props.answerCode === answer.code}
                                    onChange={(checked) =>
                                        props.riskProfileQuestionAnswered(
                                            props.question.code,
                                            answer.code,
                                            checked
                                        )
                                    }
                                />
                            </div>
                            <div style={{ paddingTop: 1 }}>{answer.text}</div>
                        </div>
                    </div>
                );
            })}
        </>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState, ownProps: OwnProps) => {
    const questionAnswers = roaInvestRiskQuestionAnswersSelector(state);

    return {
        answerCode: questionAnswers[ownProps.question.code],
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        ...bindActionCreators(
            {
                riskProfileQuestionAnswered,
            },
            dispatch
        ),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(RiskAnswers);

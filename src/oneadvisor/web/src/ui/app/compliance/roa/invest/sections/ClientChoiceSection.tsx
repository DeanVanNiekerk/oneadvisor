import { Card } from "antd";
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import { RootState } from "@/state";
import { receiveClientChoice, roaInvestInputsClientChoiceSelector } from "@/state/compliance/roa";
import { Form, FormTextArea } from "@/ui/controls";

type Props = PropsFromState & PropsFromDispatch;

const ClientChoiceSection: React.FC<Props> = (props) => {
    return (
        <Card title="Client Choice">
            <Form layout="vertical" size="small">
                <FormTextArea
                    fieldName="clientChoice"
                    label="Choice"
                    value={props.clientChoice}
                    rows={3}
                    onChange={(_fieldName, value) => props.receiveClientChoice(value)}
                />
            </Form>
        </Card>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    return {
        clientChoice: roaInvestInputsClientChoiceSelector(state),
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        ...bindActionCreators(
            {
                receiveClientChoice,
            },
            dispatch
        ),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ClientChoiceSection);

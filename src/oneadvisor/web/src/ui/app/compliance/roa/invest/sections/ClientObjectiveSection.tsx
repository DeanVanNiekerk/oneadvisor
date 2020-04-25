import { Card } from "antd";
import React, { useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import { RootState } from "@/state";
import {
    receiveClientId,
    receiveConsultReason,
    roaInvestInputsSelector,
} from "@/state/compliance/roa";
import {
    Button,
    ClientName,
    ClientSearch,
    Drawer,
    Form,
    FormText,
    FormTextArea,
} from "@/ui/controls";

type Props = PropsFromState & PropsFromDispatch;

const ClientObjectiveSection: React.FC<Props> = (props) => {
    const [clientSearchVisible, setClientSearchVisible] = useState<boolean>(false);

    return (
        <Card title="Client Objectives">
            <Form layout="vertical">
                <FormText
                    fieldName="clientId"
                    label="Client"
                    value={props.clientId ? <ClientName clientId={props.clientId} /> : null}
                    emptyValueText={<span className="text-error">Select Client</span>}
                    extra={
                        <>
                            <Button
                                size="small"
                                iconName="search"
                                type={props.clientId ? "dashed" : "primary"}
                                onClick={() => setClientSearchVisible(true)}
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
    const roaInvestState = roaInvestInputsSelector(state);
    return {
        clientId: roaInvestState.clientId,
        consultReason: roaInvestState.consultReason,
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        ...bindActionCreators({ receiveClientId, receiveConsultReason }, dispatch),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ClientObjectiveSection);

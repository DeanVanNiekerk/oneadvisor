import React, { Component } from "react";
import { connect, DispatchProp } from "react-redux";

import {
    clientMergeReset,
    clientMergeSelector,
    clientSelector,
    clientsMergingSelector,
} from "@/state/app/client/clients";
import { RootState } from "@/state/rootReducer";
import { Button, ContentLoader, Drawer } from "@/ui/controls";

import ClientDetails from "./steps/ClientDetails";
import Result from "./steps/Result";
import SourceClients from "./steps/SourceClients";

type Props = {
    fetching: boolean;
    visible: boolean;
    onMerged: () => void;
    currentStepIndex: number;
} & DispatchProp;

type State = {
    steps: React.ReactNode[];
};

class ClientMerge extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            steps: [<SourceClients key={"1"} />, <ClientDetails key={"2"} />, <Result key={"3"} />],
        };
    }

    cancel = () => {
        if (this.props.currentStepIndex === 2) this.props.onMerged();
        this.props.dispatch(clientMergeReset());
    };

    isLoading = () => {
        return this.props.fetching;
    };

    render() {
        const { visible, currentStepIndex } = this.props;

        return (
            <Drawer
                title="Merge Clients"
                iconName="fork"
                visible={visible}
                onClose={this.cancel}
                footer={
                    <Button onClick={this.cancel} disabled={this.isLoading()}>
                        Cancel
                    </Button>
                }
            >
                <ContentLoader isLoading={this.isLoading()}>
                    {this.state.steps.map((step, index) => {
                        return (
                            <div
                                key={index}
                                style={{
                                    display: index === currentStepIndex ? "inline" : "none",
                                }}
                            >
                                {step}
                            </div>
                        );
                    })}
                </ContentLoader>
            </Drawer>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const clientMergeState = clientMergeSelector(state);
    const clientState = clientSelector(state);

    return {
        fetching: clientMergeState.fetching || clientState.fetching || clientState.updating,
        currentStepIndex: clientMergeState.currentStepIndex,
        visible: clientsMergingSelector(state),
    };
};

export default connect(mapStateToProps)(ClientMerge);

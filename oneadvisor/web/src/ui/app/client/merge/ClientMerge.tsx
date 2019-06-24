import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';

import { clientMergeSelector, clientSelector } from '@/state/app/client/clients';
import { RootState } from '@/state/rootReducer';
import { Button, ContentLoader, Drawer, DrawerFooter } from '@/ui/controls';

import ClientDetails from './steps/ClientDetails';
import Result from './steps/Result';
import SourceClients from './steps/SourceClients';

type Props = {
    fetching: boolean;
    visible: boolean;
    onClose: (cancelled: boolean) => void;
    currentStepIndex: number;
} & DispatchProp;

type State = {
    steps: React.ReactNode[];
};

class ClientMerge extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            steps: [<SourceClients />, <ClientDetails />, <Result />],
        };
    }

    cancel = () => {
        this.props.onClose(this.props.currentStepIndex != 2);
    };

    isLoading = () => {
        return this.props.fetching;
    };

    render() {
        const { visible, currentStepIndex } = this.props;

        return (
            <Drawer
                title="Merge Clients"
                icon="fork"
                visible={visible}
                onClose={this.cancel}
            >
                <ContentLoader isLoading={this.isLoading()}>
                    {this.state.steps.map((step, index) => {
                        return (
                            <div
                                key={index}
                                style={{
                                    display:
                                        index === currentStepIndex
                                            ? "inline"
                                            : "none",
                                }}
                            >
                                {step}
                            </div>
                        );
                    })}
                </ContentLoader>
                <DrawerFooter>
                    <Button onClick={this.cancel} disabled={this.isLoading()}>
                        Cancel
                    </Button>
                </DrawerFooter>
            </Drawer>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const clientMergeState = clientMergeSelector(state);
    const clientState = clientSelector(state);

    return {
        fetching:
            clientMergeState.fetching ||
            clientState.fetching ||
            clientState.updating,
        currentStepIndex: clientMergeState.currentStepIndex,
    };
};

export default connect(mapStateToProps)(ClientMerge);

import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';

import { memberMergeSelector, memberSelector } from '@/state/app/member/members';
import { RootState } from '@/state/rootReducer';
import { Button, ContentLoader, Drawer, DrawerFooter } from '@/ui/controls';

import MemberDetails from './steps/MemberDetails';
import Result from './steps/Result';
import SourceMembers from './steps/SourceMembers';

type Props = {
    fetching: boolean;
    visible: boolean;
    onClose: (cancelled: boolean) => void;
    currentStepIndex: number;
} & DispatchProp;

type State = {
    steps: React.ReactNode[];
};

class MemberMerge extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            steps: [<SourceMembers />, <MemberDetails />, <Result />],
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
                title="Merge Members"
                icon="fork"
                visible={visible}
                onClose={this.cancel}
            >
                <ContentLoader isLoading={this.isLoading()}>
                    {this.state.steps[currentStepIndex]}
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
    const memberMergeState = memberMergeSelector(state);
    const memberState = memberSelector(state);

    return {
        fetching:
            memberMergeState.fetching ||
            memberState.fetching ||
            memberState.updating,
        currentStepIndex: memberMergeState.currentStepIndex,
    };
};

export default connect(mapStateToProps)(MemberMerge);

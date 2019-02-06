import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';

import { exportMembers } from '@/state/app/member/export';
import { Button, Header } from '@/ui/controls';

type State = {
    downloading: boolean;
};

class MemberExport extends Component<DispatchProp, State> {
    constructor(props) {
        super(props);

        this.state = {
            downloading: false
        };
    }

    export = () => {
        this.setState({
            downloading: true
        });
        this.props.dispatch(
            exportMembers(() => {
                this.setState({
                    downloading: false
                });
            })
        );
    };

    render() {
        return (
            <>
                <Header icon="download">Export Member Data</Header>

                <div className="mt-1" />

                <Button
                    icon="download"
                    loading={this.state.downloading}
                    onClick={this.export}
                >
                    Download
                </Button>
            </>
        );
    }
}

export default connect()(MemberExport);

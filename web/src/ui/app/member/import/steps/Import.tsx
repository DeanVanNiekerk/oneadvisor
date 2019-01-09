import { Col, Row } from 'antd';
import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';

import { ImportMember, importMember, memberImportSelector } from '@/state/app/member/import';
import { RootState } from '@/state/rootReducer';
import { Button } from '@/ui/controls';

type Props = {
    members: ImportMember[];
} & DispatchProp;

class Import extends Component<Props> {
    startImport = () => {
        this.props.members.forEach(m => {
            this.props.dispatch(importMember(m));
        });
    };

    render() {
        return (
            <>
                <h4 className="mt-1">Start Import</h4>

                <Row type="flex" justify="end" className="mt-1">
                    <Col>
                        <Button type="primary" onClick={this.startImport}>
                            Start Import
                        </Button>
                    </Col>
                </Row>
            </>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const importState = memberImportSelector(state);

    return {
        members: importState.members
    };
};

export default connect(mapStateToProps)(Import);

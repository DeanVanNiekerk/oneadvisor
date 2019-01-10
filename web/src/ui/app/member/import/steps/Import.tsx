import { Col, Progress, Row } from 'antd';
import { number } from 'prop-types';
import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';

import {
    ImportMember, importMember, memberImportProgressPercentSelector, memberImportSelector
} from '@/state/app/member/import';
import { RootState } from '@/state/rootReducer';
import { Button } from '@/ui/controls';

/*
InvalidOperationException: The property 'Id' on entity type 'MemberPolicyEntity' 
is part of a key and so cannot be modified or marked as modified. 
To change the principal of an existing entity with an identifying foreign key first delete the dependent and invoke 'SaveChanges' 
then associate the dependent with the new principal.
*/

type Props = {
    members: ImportMember[];
    progressPercent: number;
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

                <Progress type="circle" percent={this.props.progressPercent} />

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
        members: importState.members,
        progressPercent: memberImportProgressPercentSelector(state)
    };
};

export default connect(mapStateToProps)(Import);

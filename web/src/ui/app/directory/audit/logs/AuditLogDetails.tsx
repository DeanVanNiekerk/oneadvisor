import React, { Component } from 'react';
import JSONPretty from 'react-json-pretty';

import { AuditLog } from '@/state/app/directory/audit';
import { Button, Date, Drawer, DrawerFooter, UserName } from '@/ui/controls';

type Props = {
    visible: boolean;
    auditLog: AuditLog | null;
    onClose: () => void;
};

class AuditLogDetails extends Component<Props> {
    render() {
        const { auditLog, visible, onClose } = this.props;

        return (
            <Drawer
                title="Audit Log Detail"
                visible={visible}
                onClose={onClose}
            >
                {auditLog && (
                    <>
                        <p>
                            <b>Date: </b>
                            <Date date={auditLog.date} includeTime={true} />
                        </p>
                        <p>
                            <b>Entity: </b>
                            {auditLog.entity.replace('Entity', '')}
                        </p>
                        <p>
                            <b>Action: </b>
                            {auditLog.action}
                        </p>
                        <p>
                            <b>Broker: </b>
                            <UserName userId={auditLog.userId} />
                        </p>
                        <p>
                            <b>Raw Data: </b>
                        </p>

                        <JSONPretty json={JSON.parse(auditLog.data)} />
                    </>
                )}
                <DrawerFooter>
                    <Button onClick={onClose}>Close</Button>
                </DrawerFooter>
            </Drawer>
        );
    }
}

export default AuditLogDetails;

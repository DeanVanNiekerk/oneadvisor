import React from "react";
import JSONPretty from "react-json-pretty";

import { AuditLog } from "@/state/app/directory/audit";
import { Button, Date, Drawer, DrawerFooter, UserName } from "@/ui/controls";

type Props = {
    visible: boolean;
    auditLog: AuditLog | null;
    onClose: () => void;
};

const AuditLogDetails: React.FC<Props> = ({ auditLog, visible, onClose }) => {
    return (
        <Drawer
            title="Audit Log Detail"
            iconName="video-camera"
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
                        {auditLog.entity}
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

                    <JSONPretty json={auditLog.data} />
                </>
            )}
            <DrawerFooter>
                <Button onClick={onClose}>Close</Button>
            </DrawerFooter>
        </Drawer>
    );
};

export default AuditLogDetails;

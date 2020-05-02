import React from "react";
import JSONPretty from "react-json-pretty";

import { AuditLog } from "@/state/directory/audit/logs/types";
import { Button, Drawer, UserName } from "@/ui/controls";
import { Date } from "@/ui/controls/common/Date";

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
            footer={<Button onClick={onClose}>Close</Button>}
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
        </Drawer>
    );
};

export default AuditLogDetails;

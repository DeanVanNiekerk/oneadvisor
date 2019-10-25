import React, { useState } from "react";

import { Statement } from "@/state/app/commission/statements";
import { TabPane, Tabs } from "@/ui/controls";

import StatementHistory from "./StatementHistory";
import UploadStatementForm from "./UploadStatementForm";

type Props = {
    onSuccess: () => void;
    statement: Statement;
};

const UploadStatement: React.FC<Props> = (props: Props) => {

    const [activeTab, setActiveTab] = useState("uploads_tab");

    return (
        <Tabs onChange={setActiveTab} activeKey={activeTab} clearTabsTopPadding={true}>
            <TabPane tab="Upload" key="uploads_tab">
                <UploadStatementForm statement={props.statement} onUploaded={props.onSuccess} />
            </TabPane>
            <TabPane tab="Past Uploads" key="past_uploads_tab">
                <StatementHistory statement={props.statement} />
            </TabPane>
        </Tabs>
    );
}

export default UploadStatement;

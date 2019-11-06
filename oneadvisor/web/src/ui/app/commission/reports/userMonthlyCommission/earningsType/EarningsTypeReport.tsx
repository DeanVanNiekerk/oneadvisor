import { Icon } from "antd";
import React, { useState } from "react";

import { TabPane, Tabs } from "@/ui/controls";

import EarningsTypeChart from "./EarningsTypeChart";
import EarningsTypeTable from "./EarningsTypeTable";

const EarningsTypeReport: React.FC = () => {
    const [activeTab, setActiveTab] = useState("table");

    return (
        <Tabs onChange={setActiveTab} activeKey={activeTab} sticky={true} tabBarGutter={0}>
            <TabPane tab={<Icon type="table" className="mr-0" />} key="table">
                <EarningsTypeTable />
            </TabPane>
            <TabPane tab={<Icon type="pie-chart" className="mr-0" />} key="chart">
                <EarningsTypeChart />
            </TabPane>
        </Tabs>
    );
};

export default EarningsTypeReport;

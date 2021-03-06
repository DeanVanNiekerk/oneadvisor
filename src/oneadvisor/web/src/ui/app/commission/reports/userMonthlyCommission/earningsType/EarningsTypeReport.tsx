import React, { useState } from "react";

import { TabPane, Tabs } from "@/ui/controls";
import { PieChartOutlined, TableOutlined } from "@ant-design/icons";

import EarningsTypeChart from "./EarningsTypeChart";
import EarningsTypeTable from "./EarningsTypeTable";

const EarningsTypeReport: React.FC = () => {
    const [activeTab, setActiveTab] = useState("table");

    return (
        <Tabs
            onChange={setActiveTab}
            activeKey={activeTab}
            sticky={true}
            tabBarGutter={0}
            transparentBackgroud={true}
        >
            <TabPane tab={<TableOutlined className="mx-1" />} key="table">
                <EarningsTypeTable />
            </TabPane>
            <TabPane tab={<PieChartOutlined className="mx-1" />} key="chart">
                <EarningsTypeChart />
            </TabPane>
        </Tabs>
    );
};

export default EarningsTypeReport;

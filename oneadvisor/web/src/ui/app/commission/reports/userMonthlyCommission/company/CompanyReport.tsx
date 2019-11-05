import { Icon } from "antd";
import React, { useState } from "react";

import { TabPane, Tabs } from "@/ui/controls";

import CompanyChart from "./CompanyChart";
import CompanyTable from "./CompanyTable";

const CompanyReport: React.FC = () => {
    const [activeTab, setActiveTab] = useState("table");

    return (
        <Tabs onChange={setActiveTab} activeKey={activeTab} sticky={true} tabBarGutter={0}>
            <TabPane tab={<Icon type="table" className="mr-0" />} key="table">
                <CompanyTable />
            </TabPane>
            <TabPane tab={<Icon type="pie-chart" className="mr-0" />} key="chart" className="pt-0">
                <CompanyChart />
            </TabPane>
        </Tabs>
    );
};

export default CompanyReport;

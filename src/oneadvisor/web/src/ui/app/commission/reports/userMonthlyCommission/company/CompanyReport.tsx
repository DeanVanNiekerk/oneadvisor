import React, { useState } from "react";

import { TabPane, Tabs } from "@/ui/controls";
import { PieChartOutlined, TableOutlined } from "@ant-design/icons";

import CompanyChart from "./CompanyChart";
import CompanyTable from "./CompanyTable";

const CompanyReport: React.FC = () => {
    const [activeTab, setActiveTab] = useState("table");

    return (
        <Tabs onChange={setActiveTab} activeKey={activeTab} sticky={true} tabBarGutter={0}>
            <TabPane tab={<TableOutlined className="mx-1" />} key="table">
                <CompanyTable />
            </TabPane>
            <TabPane tab={<PieChartOutlined className="mx-1" />} key="chart" className="pt-0">
                <CompanyChart />
            </TabPane>
        </Tabs>
    );
};

export default CompanyReport;

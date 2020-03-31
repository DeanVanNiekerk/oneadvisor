import React from "react";

import { IconName } from "@/app/types";
import {
    AlertOutlined,
    ApartmentOutlined,
    BankOutlined,
    BlockOutlined,
    CopyOutlined,
    DatabaseOutlined,
    DeleteOutlined,
    DollarOutlined,
    DownloadOutlined,
    EditOutlined,
    ExclamationOutlined,
    ExportOutlined,
    FileTextOutlined,
    ForkOutlined,
    HistoryOutlined,
    ImportOutlined,
    LeftOutlined,
    LineChartOutlined,
    PieChartOutlined,
    PlusOutlined,
    ProfileOutlined,
    ReconciliationOutlined,
    RightOutlined,
    SafetyCertificateOutlined,
    SafetyOutlined,
    SearchOutlined,
    SettingOutlined,
    TeamOutlined,
    UserOutlined,
    VideoCameraOutlined,
} from "@ant-design/icons";

type Props = {
    name?: IconName;
    style?: React.CSSProperties;
};

const Icon: React.FC<Props> = (props: Props) => {
    return <React.Fragment>{getIcon(props.name)}</React.Fragment>;
};

const getIcon = (name?: IconName, style?: React.CSSProperties): React.ReactNode => {
    switch (name) {
        case "user":
            return <UserOutlined style={style} />;
        case "team":
            return <TeamOutlined style={style} />;
        case "safety-certificate":
            return <SafetyCertificateOutlined style={style} />;
        case "bank":
            return <BankOutlined style={style} />;
        case "database":
            return <DatabaseOutlined style={style} />;
        case "profile":
            return <ProfileOutlined style={style} />;
        case "video-camera":
            return <VideoCameraOutlined style={style} />;
        case "block":
            return <BlockOutlined style={style} />;
        case "reconciliation":
            return <ReconciliationOutlined style={style} />;
        case "apartment":
            return <ApartmentOutlined style={style} />;
        case "pie-chart":
            return <PieChartOutlined style={style} />;
        case "history":
            return <HistoryOutlined style={style} />;
        case "alert":
            return <AlertOutlined style={style} />;
        case "line-chart":
            return <LineChartOutlined style={style} />;
        case "dollar":
            return <DollarOutlined style={style} />;
        case "file-text":
            return <FileTextOutlined style={style} />;
        case "import":
            return <ImportOutlined style={style} />;
        case "export":
            return <ExportOutlined style={style} />;
        case "plus":
            return <PlusOutlined style={style} />;
        case "delete":
            return <DeleteOutlined style={style} />;
        case "fork":
            return <ForkOutlined style={style} />;
        case "edit":
            return <EditOutlined style={style} />;
        case "copy":
            return <CopyOutlined style={style} />;
        case "right":
            return <RightOutlined style={style} />;
        case "left":
            return <LeftOutlined style={style} />;
        case "download":
            return <DownloadOutlined style={style} />;
        case "search":
            return <SearchOutlined style={style} />;
        case "exclamation":
            return <ExclamationOutlined style={style} />;
        case "safety":
            return <SafetyOutlined style={style} />;
        case "setting":
            return <SettingOutlined style={style} />;
        default:
            return <span></span>;
    }
};

export { Icon };

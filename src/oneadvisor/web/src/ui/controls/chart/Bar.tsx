import { Empty } from "antd";
import React from "react";

import { CHART_COLORS, CHART_THEME } from "@/ui/styles/nivo-theme";
import { BarSvgProps, ResponsiveBar } from "@nivo/bar";

import { ContentLoader } from "../";

type Props = {
    containerHeight?: string;
    isLoading?: boolean;
} & BarSvgProps;

const Bar: React.FC<Props> = (props: Props) => {
    const p: BarSvgProps = {
        margin: { top: 30, right: 30, bottom: 30, left: 60 },
        borderWidth: 1,
        colors: CHART_COLORS,
        theme: CHART_THEME,
        ...props,
    };

    const containerHeight = props.containerHeight ? props.containerHeight : "350px";

    if (p.data.length === 0) return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;

    return (
        <ContentLoader isLoading={props.isLoading}>
            <div style={{ height: containerHeight }}>
                <ResponsiveBar {...p} />
            </div>
        </ContentLoader>
    );
};

export { Bar };

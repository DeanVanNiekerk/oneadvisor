import { Empty } from "antd";
import React from "react";

import { TEXT_COLOR } from "@/ui/styles";
import { CHART_COLORS, CHART_THEME } from "@/ui/styles/nivo-theme";
import { PieSvgProps, ResponsivePie } from "@nivo/pie";

import { ContentLoader } from "../";

type Props = {
    containerHeight?: string;
    isLoading?: boolean;
} & PieSvgProps;

const Pie: React.FC<Props> = (props: Props) => {
    const p: PieSvgProps = {
        radialLabel: "label",
        margin: { top: 30, right: 30, bottom: 30, left: 30 },
        innerRadius: 0.5,
        padAngle: 0.7,
        cornerRadius: 3,
        borderWidth: 1,
        radialLabelsLinkHorizontalLength: 10,
        radialLabelsTextColor: TEXT_COLOR,
        colors: CHART_COLORS,
        theme: CHART_THEME,
        ...props,
    };

    const containerHeight = props.containerHeight ? props.containerHeight : "350px";

    if (p.data.length === 0) return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;

    return (
        <ContentLoader isLoading={props.isLoading}>
            <div style={{ height: containerHeight }}>
                <ResponsivePie {...p} />
            </div>
        </ContentLoader>
    );
};

export { Pie };

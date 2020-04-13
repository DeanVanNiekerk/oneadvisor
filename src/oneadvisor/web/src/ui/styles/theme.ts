import { OrdinalColorsInstruction } from "@nivo/colors";
import { Theme } from "@nivo/core";

//General
export const TEXT_COLOR = "rgba(255, 255, 255, 0.65)";
export const BACKGROUND_COLOR = "#1f1f1f";

//Charts
export const CHART_COLORS: OrdinalColorsInstruction = { scheme: "set3" };

export const CHART_THEME: Theme = {
    tooltip: {
        container: {
            backgroundColor: BACKGROUND_COLOR,
        },
    },
    grid: {
        line: {
            stroke: "rgba(255, 255, 255, 0.25)",
        },
    },
    axis: {
        ticks: {
            text: {
                fill: TEXT_COLOR,
            },
        },
    },
};

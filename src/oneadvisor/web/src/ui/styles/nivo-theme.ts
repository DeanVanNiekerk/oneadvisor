import { OrdinalColorsInstruction } from "@nivo/colors";
import { Theme } from "@nivo/core";

import { BACKGROUND_COLOR_ALT, TEXT_COLOR } from "./theme";

// DARK THEME -----------------------------------------------------
export const CHART_COLORS: OrdinalColorsInstruction = { scheme: "set3" };

export const CHART_THEME: Theme = {
    tooltip: {
        container: {
            backgroundColor: BACKGROUND_COLOR_ALT,
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
// --------------------------------------------------------------------

// LIGHT THEME -----------------------------------------------------
// export const CHART_COLORS: OrdinalColorsInstruction = { scheme: "set3" };

// export const CHART_THEME: Theme = {
//     tooltip: {
//         container: {
//             backgroundColor: BACKGROUND_COLOR_ALT,
//         },
//     },
//     grid: {
//         line: {
//             stroke: "rgba(0, 0, 0, 0.25)",
//         },
//     },
//     axis: {
//         ticks: {
//             text: {
//                 fill: TEXT_COLOR,
//             },
//         },
//     },
// };
// --------------------------------------------------------------------

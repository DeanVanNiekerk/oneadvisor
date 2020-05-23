import React from "react";

import { RoaInvestData } from "@/state/compliance/roa/invest/data/types";
import { Image, View } from "@react-pdf/renderer";

type Props = {
    data: RoaInvestData;
};

const MainLogo: React.FC<Props> = ({ data }) => {
    if (!data.logoDataUrl) return <React.Fragment />;

    return (
        <View
            style={{
                height: 80,
            }}
        >
            <Image
                src={data.logoDataUrl}
                style={{
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 80,
                    objectFit: "contain",
                    position: "absolute",
                }}
            />
        </View>
    );
};

export { MainLogo };

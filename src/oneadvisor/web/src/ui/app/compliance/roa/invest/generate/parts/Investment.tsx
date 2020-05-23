import React from "react";

import { InvestmentData } from "@/state/compliance/roa/invest/data/types";
import { Text, View } from "@react-pdf/renderer";

import { FieldValue, FieldValues, styles } from "../common";

type Props = {
    investment: InvestmentData;
};

const Investment: React.FC<Props> = ({ investment }) => {
    return (
        <>
            <View wrap={false}>
                <View style={[styles.h4]}>
                    <Text>{`Investment ${investment.number}`}</Text>
                </View>

                <FieldValue fieldName="Company" value={investment.companyName} />
                <FieldValue fieldName="Product" value={investment.productTypeName} />
                <FieldValues fieldName="Funds" values={investment.funds} />
                <FieldValue
                    fieldName="Contribution Premium"
                    value={investment.contributionPremium}
                />
                <FieldValue
                    fieldName="Contribution Lumpsum"
                    value={investment.contributionLumpsum}
                />
                <FieldValue fieldName="Upfront Fee" value={investment.upfrontFee} />
                <FieldValue fieldName="Advisor ongoing Fee" value={investment.assetManagementFee} />
            </View>
            <View wrap={false}>
                <View style={[styles.h5]}>
                    <Text>Product Characteristics - {investment.productTypeName}</Text>
                </View>
                {investment.productCharacteristics.map((c) => {
                    return (
                        <FieldValue
                            key={c.name}
                            fieldName={c.name}
                            value={c.description}
                            mode="vertical"
                        />
                    );
                })}
            </View>
        </>
    );
};

export { Investment };

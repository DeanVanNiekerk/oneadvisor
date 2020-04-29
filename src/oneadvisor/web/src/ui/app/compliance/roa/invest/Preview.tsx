import React from "react";
import { connect } from "react-redux";

import { roaInvestDataSelector } from "@/state/compliance/roa";
import { InvestmentData, RoaInvestData } from "@/state/compliance/roa/invest/data/types";
import { RootState } from "@/state/types";
import { Loader } from "@/ui/controls";
import { Document, Font, Page, PDFViewer, StyleSheet, Text, View } from "@react-pdf/renderer";

Font.register({ family: "Roboto", src: "dist/fonts/Roboto-Regular.ttf" });

Font.register({
    family: "Roboto",
    fonts: [
        { src: "dist/fonts/Roboto-Regular.ttf" }, // font-style: normal, font-weight: normal
        { src: "dist/fonts/Roboto-Bold.ttf", fontWeight: 700, fontStyle: "bold" },
    ],
});

const styles = StyleSheet.create({
    page: {
        fontFamily: "Roboto",
        paddingVertical: 32,
        paddingHorizontal: 32,
        fontSize: 10,
    },
    h1: {
        fontSize: 24,
        fontStyle: "bold",
        marginTop: 16,
        marginBottom: 28,
    },
    h3: {
        fontSize: 14,
        fontStyle: "bold",
        marginTop: 8,
        marginBottom: 16,
    },
    h4: {
        fontSize: 12,
        marginTop: 6,
        marginBottom: 12,
    },
    b: {
        fontStyle: "bold",
    },
    pl1: {
        paddingLeft: 4,
    },
    pl2: {
        paddingLeft: 8,
    },
    mb1: {
        marginBottom: 4,
    },
    mb2: {
        marginBottom: 8,
    },
    mb3: {
        marginBottom: 12,
    },
    field: {
        marginBottom: 12,
    },
});

// page: {
//     flexDirection: "row",
//     backgroundColor: "#E4E4E4",
// },
// section: {
//     margin: 10,
//     padding: 10,
//     flexGrow: 1,
// },

type Props = PropsFromState;

const Preview: React.FC<Props> = ({ data, fetching }) => {
    if (fetching) return <Loader className="mt-5" />;

    return (
        <PDFViewer width="100%" height="100%">
            <Document title="Invest ROA">
                <Page size="A4" style={styles.page}>
                    <View style={styles.h1}>
                        <Text>Record of Advice</Text>
                    </View>
                    <View style={styles.mb3}>
                        <Text>{data.clientFullName}</Text>
                    </View>
                    <ClientObjectives data={data} />
                    <Splitter />
                    <OptionsDiscussed data={data} />
                    <Splitter />
                    <AdvisorRecommendation data={data} />
                    <Splitter />
                    <ClientChoice data={data} />
                    <Splitter />
                    <Investments data={data} />
                </Page>
            </Document>
        </PDFViewer>
    );
};

type DataProps = {
    data: RoaInvestData;
};

const ClientObjectives: React.FC<DataProps> = ({ data }) => {
    return (
        <>
            <View style={[styles.h3]}>
                <Text>Client Needs</Text>
            </View>
            <View style={styles.mb3}>
                <Text>{data.consultReason}</Text>
            </View>
            <FieldValue fieldName="Type of Investment Advice" value={data.investmentAdviceType} />
            <FieldValue fieldName="Monthly Need" value={data.needMonthly} />
            <FieldValue fieldName="Lumpsum Need" value={data.needLumpsum} />
            <FieldValue fieldName="Monthly Contribution" value={data.contributionMonthly} />
            <FieldValue fieldName="Lumpsum Contribution" value={data.contributionLumpsum} />
        </>
    );
};

const OptionsDiscussed: React.FC<DataProps> = ({ data }) => {
    return (
        <>
            <View wrap={false}>
                {/* Keep header and first section together */}
                <View style={[styles.h3]}>
                    <Text>Options Discussed</Text>
                </View>
                <FieldValues fieldName="Products Considered" values={data.discussedProductTypes} />
            </View>

            <FieldValues fieldName="Companies Considered" values={data.discussedCompanies} />
            <FieldValues fieldName="Funds Considered" values={data.discussedFunds} />
        </>
    );
};

const AdvisorRecommendation: React.FC<DataProps> = ({ data }) => {
    return (
        <>
            <View wrap={false}>
                {/* Keep header and first section together */}
                <View style={[styles.h3]}>
                    <Text>Advisor Recommendation</Text>
                </View>
                <FieldValues
                    fieldName="Products Recommended"
                    values={data.recommendedProductTypes}
                />
            </View>

            <FieldValues fieldName="Companies Recommended" values={data.recommendedCompanies} />
            <FieldValues fieldName="Funds Recommended" values={data.recommendedFunds} />

            <View style={styles.mb3}>
                <Text>{data.recommendedAction}</Text>
            </View>
        </>
    );
};

const ClientChoice: React.FC<DataProps> = ({ data }) => {
    return (
        <View wrap={false}>
            <View style={[styles.h3]}>
                <Text>Client Choice</Text>
            </View>

            <View style={styles.mb3}>
                <Text>{data.clientChoice}</Text>
            </View>
        </View>
    );
};

const Investments: React.FC<DataProps> = ({ data }) => {
    return (
        <>
            <View style={[styles.h3]}>
                <Text>Investments Implemented</Text>
            </View>

            {data.investments.map((investment) => (
                <View style={[styles.mb2]}>
                    <Investment key={investment.number} investment={investment} />
                    <Splitter />
                </View>
            ))}
        </>
    );
};

type InvestmentProps = {
    investment: InvestmentData;
};

const Investment: React.FC<InvestmentProps> = ({ investment }) => {
    return (
        <>
            <View wrap={false}>
                <View style={[styles.h4]}>
                    <Text>{`Investment ${investment.number}`}</Text>
                </View>

                <FieldValue fieldName="Company" value={investment.companyName} />
                <FieldValue fieldName="Product" value={investment.productTypeName} />
                <FieldValue fieldName="Fund" value={investment.fund} />
                <FieldValue
                    fieldName="Contribution Premium"
                    value={investment.contributionPremium}
                />
                <FieldValue
                    fieldName="Contribution Lumpsum"
                    value={investment.contributionLumpsum}
                />
                <FieldValue fieldName="Upfront Fee" value={investment.upfrontFee} />
                <FieldValue
                    fieldName="Aasset Management Fee"
                    value={investment.assetManagementFee}
                />
            </View>
            <View wrap={false}>
                <View style={[styles.h4, styles.mb2]}>
                    <Text>Product Characteristics - {investment.productTypeName}</Text>
                </View>
                {investment.productCharacteristics.map((c) => {
                    return <FieldValue fieldName={c.name} value={c.description} mode="vertical" />;
                })}
            </View>
        </>
    );
};

type FieldValueProps = {
    fieldName: string;
    value: string;
    mode?: "horizonal" | "vertical";
};

const FieldValue: React.FC<FieldValueProps> = ({ fieldName, value, mode }) => {
    if (!value) return <React.Fragment />;

    if (mode === "vertical")
        return (
            <View style={styles.field}>
                <Text style={styles.b}>{fieldName}: </Text>
                <Text>{value}</Text>
            </View>
        );

    return (
        <View style={styles.field}>
            <Text>
                <Text style={styles.b}>{fieldName}: </Text>
                {value}
            </Text>
        </View>
    );
};

type FieldValuesProps = {
    fieldName: string;
    values: string[];
};

const FieldValues: React.FC<FieldValuesProps> = ({ fieldName, values }) => {
    if (values.length === 0) return <React.Fragment />;

    return (
        <View wrap={false}>
            <View style={[styles.b, styles.mb2]}>
                <Text>{fieldName}</Text>
            </View>
            <View style={styles.field}>
                {values.map((value) => (
                    <Text style={[styles.pl2, styles.mb1]} key={value}>
                        {value}
                    </Text>
                ))}
            </View>
        </View>
    );
};

const Splitter: React.FC = () => {
    return (
        <View
            style={{
                borderBottomWidth: 1,
                borderBottomColor: "#D3D3D3",
                borderBottomStyle: "solid",
                marginHorizontal: 28,
                marginVertical: 18,
            }}
        ></View>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    const roaInvestDataState = roaInvestDataSelector(state);
    return {
        data: roaInvestDataState.data,
        fetching: roaInvestDataState.fetching,
    };
};

export default connect(mapStateToProps)(Preview);

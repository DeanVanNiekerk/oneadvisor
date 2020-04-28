import React from "react";
import { connect } from "react-redux";

import { roaInvestDataSelector } from "@/state/compliance/roa";
import { RoaInvestData } from "@/state/compliance/roa/invest/data/types";
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
        padding: 16,
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
        fontStyle: "bold",
        marginTop: 6,
        marginBottom: 12,
    },
    b: {
        fontStyle: "bold",
    },
    mb3: {
        marginBottom: 14,
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
                    <OptionsDiscussed data={data} />
                    <AdvisorRecommendation data={data} />
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
            <View style={[styles.h4]}>
                <Text>{`Reason that prompted this consult with ${data.clientFullName}`}</Text>
            </View>
            <View style={styles.mb3}>
                <Text>{data.consultReason}</Text>
            </View>
            <View style={[styles.h4]}>
                <Text>Type of Financial Planning Assessment Requested</Text>
            </View>
            <View style={styles.mb3}>
                <Text>Focussed on investment only</Text>
            </View>
        </>
    );
};

const OptionsDiscussed: React.FC<DataProps> = ({ data }) => {
    return (
        <>
            <View style={[styles.h3]}>
                <Text>Options Discussed</Text>
            </View>
            <View style={[styles.h4]}>
                <Text>Products Considered</Text>
            </View>
            <View style={styles.mb3}>
                {data.discussedProductTypes.map((name) => (
                    <Text key={name}>{name}</Text>
                ))}
            </View>
            <View style={[styles.h4]}>
                <Text>Funds and Investment Benchmarks Discussed</Text>
            </View>
            <View style={styles.mb3}>
                {data.discussedFunds.map((name) => (
                    <Text key={name}>{name}</Text>
                ))}
            </View>
            <View style={[styles.h4]}>
                <Text>Companies Considered</Text>
            </View>
            <View style={styles.mb3}>
                {data.discussedCompanies.map((name) => (
                    <Text key={name}>{name}</Text>
                ))}
            </View>
        </>
    );
};

const AdvisorRecommendation: React.FC<DataProps> = ({ data }) => {
    return (
        <>
            <View style={[styles.h3]}>
                <Text>Advisor Recommendation</Text>
            </View>
            <View style={styles.mb3}>
                <Text>{data.recommendedAction}</Text>
            </View>
        </>
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

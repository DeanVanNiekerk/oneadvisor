import React from "react";
import { connect } from "react-redux";

import { roaInvestDataSelector } from "@/state/compliance/roa";
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
    const debug = false;

    if (fetching) return <Loader className="mt-5" />;

    return (
        <PDFViewer width="100%" height="100%">
            <Document title="Invest ROA">
                <Page size="A4" style={styles.page}>
                    <View style={styles.h1} debug={debug}>
                        <Text>Record of Advice</Text>
                    </View>
                    <View style={styles.mb3} debug={debug}>
                        <Text>{data.clientFullName}</Text>
                    </View>

                    <View style={[styles.h3]} debug={debug}>
                        <Text>Client Objectives</Text>
                    </View>
                    <View style={[styles.h4]} debug={debug}>
                        <Text>{`Reason that prompted this consult with ${data.clientFullName}`}</Text>
                    </View>
                    <View style={styles.mb3} debug={debug}>
                        <Text>{data.consultReason}</Text>
                    </View>
                    <View style={[styles.h4]} debug={debug}>
                        <Text>Type of Financial Planning Assessment Requested</Text>
                    </View>
                    <View style={styles.mb3} debug={debug}>
                        <Text>Focussed on investment only</Text>
                    </View>

                    <View style={[styles.h3]} debug={debug}>
                        <Text>Options Discussed</Text>
                    </View>
                    <View style={[styles.h4]} debug={debug}>
                        <Text>Products Considered</Text>
                    </View>
                    <View style={styles.mb3} debug={debug}>
                        {data.productTypeNames.map((name) => (
                            <Text key={name}>{name}</Text>
                        ))}
                    </View>
                    <View style={[styles.h4]} debug={debug}>
                        <Text>Companies Considered</Text>
                    </View>
                    <View style={styles.mb3} debug={debug}>
                        {data.companyNames.map((name) => (
                            <Text key={name}>{name}</Text>
                        ))}
                    </View>
                </Page>
            </Document>
        </PDFViewer>
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

import React from "react";
import { connect } from "react-redux";

import { roaInvestDataSelector } from "@/state/compliance/roa";
import { RootState } from "@/state/types";
import { Loader } from "@/ui/controls";
import { Document, Page, PDFViewer, Text, View } from "@react-pdf/renderer";

import { FieldValue, PageNumber, Splitter, styles } from "./common";
import {
    AdvisorRecommendation,
    ClientChoice,
    ClientObjectives,
    Investments,
    OptionsDiscussed,
    Signatures,
} from "./parts";

type Props = PropsFromState;

const RoaPdf: React.FC<Props> = ({ data, fetching }) => {
    if (fetching) return <Loader className="mt-5" />;

    return (
        <PDFViewer width="100%" height="100%">
            <Document title="Invest ROA">
                <Page size="A4" style={styles.page}>
                    <View style={styles.h1}>
                        <Text>Record of Advice</Text>
                    </View>
                    <FieldValue fieldName="Date" value={new Date().toLocaleDateString()} />
                    <FieldValue fieldName="Client" value={data.clientFullName} />

                    <ClientObjectives data={data} />
                    <Splitter />
                    <OptionsDiscussed data={data} />
                    <Splitter />
                    <AdvisorRecommendation data={data} />
                    <Splitter />
                    <ClientChoice data={data} />
                    <Splitter />
                    <Investments data={data} />
                    <Signatures data={data} />
                    <PageNumber />
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

export default connect(mapStateToProps)(RoaPdf);
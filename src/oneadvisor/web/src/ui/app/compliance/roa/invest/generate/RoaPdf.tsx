import dayjs from "dayjs";
import React from "react";
import { connect } from "react-redux";

import { roaInvestDataSelector } from "@/state/compliance/roa";
import { RootState } from "@/state/types";
import { Loader } from "@/ui/controls";
import { Document, Page, PDFViewer, Text, View } from "@react-pdf/renderer";

import { FieldValue, Initials, PageNumber, Splitter, styles } from "./common";
import {
    AdvisorRecommendation,
    ClientChoice,
    ClientObjectives,
    Investments,
    MainLogo,
    OptionsDiscussed,
    Risk,
    Signatures,
} from "./parts";

type Props = PropsFromState;

const RoaPdf: React.FC<Props> = ({ data, fetching }) => {
    if (fetching) return <Loader className="mt-5" />;

    return (
        <PDFViewer width="100%" height="100%">
            <Document title="Invest ROA">
                <Page size="A4" style={styles.page}>
                    <MainLogo data={data} />

                    <View style={styles.h1}>
                        <Text>Record of Advice</Text>
                    </View>

                    <FieldValue fieldName="Date" value={dayjs().format("DD-MM-YYYY")} />
                    <FieldValue fieldName="Client Name" value={data.clientFullName} />
                    <FieldValue fieldName="Client ID Number" value={data.clientIdNumber} />

                    <ClientObjectives data={data} />
                    <PageNumber />
                    <Initials />
                </Page>
                <Page size="A4" style={styles.page}>
                    <Risk data={data} />
                    <PageNumber />
                    <Initials />
                </Page>
                <Page size="A4" style={styles.page}>
                    <OptionsDiscussed data={data} />
                    <Splitter />
                    <AdvisorRecommendation data={data} />
                    <Splitter />
                    <ClientChoice data={data} />
                    <PageNumber />
                    <Initials />
                </Page>
                <Page size="A4" style={styles.page}>
                    <Investments data={data} />
                    <Signatures data={data} />
                    <PageNumber />
                    <Initials />
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

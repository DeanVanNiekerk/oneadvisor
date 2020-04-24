import { Col, Row } from "antd";
import React, { useState } from "react";
import { connect } from "react-redux";

import { RootState } from "@/state";
import { roaInvestSelector } from "@/state/compliance/roa";
import { Button, Drawer, Header } from "@/ui/controls";
import { Document, Font, Page, PDFViewer, StyleSheet, Text, View } from "@react-pdf/renderer";

import ClientObjectiveSection from "./sections/ClientObjectiveSection";

Font.register({ family: "Roboto", src: "dist/fonts/Roboto-Regular.ttf" });

Font.register({
    family: "Roboto",
    fonts: [
        { src: "dist/fonts/Roboto-Regular.ttf" }, // font-style: normal, font-weight: normal
        { src: "dist/fonts/Roboto-Bold.ttf", fontWeight: 700, fontStyle: "bold" },
    ],
});

type Props = PropsFromState;

// page: {
//     flexDirection: "row",
//     backgroundColor: "#E4E4E4",
// },
// section: {
//     margin: 10,
//     padding: 10,
//     flexGrow: 1,
// },

const styles = StyleSheet.create({
    page: {
        fontFamily: "Roboto",
        padding: 10,
        fontSize: 10,
    },
    h1: {
        fontSize: 24,
        fontStyle: "bold",
        marginTop: 16,
        marginBottom: 28,
    },
    h4: {
        fontSize: 12,
        fontStyle: "bold",
        marginTop: 8,
        marginBottom: 16,
    },
    b: {
        fontStyle: "bold",
    },
    mb3: {
        marginBottom: 14,
    },
});

const RoaInvest: React.FC<Props> = () => {
    const [showPreview, setShowPreview] = useState<boolean>(false);

    return (
        <>
            <Header
                iconName="file-done"
                actions={
                    <>
                        <Button
                            type="primary"
                            iconName="file-pdf"
                            onClick={() => setShowPreview(true)}
                        >
                            Preview
                        </Button>
                    </>
                }
            >
                Record of Advice: Invest
            </Header>

            <CardsContainer />

            <Drawer
                title="Record of Advice: Invest"
                iconName="file-pdf"
                visible={showPreview}
                onClose={() => setShowPreview(false)}
                bodyStyle={{
                    padding: 0,
                    margin: 0,
                    overflow: "hidden",
                }}
                footer={
                    <React.Fragment>
                        <Button onClick={() => setShowPreview(false)}>Close</Button>
                    </React.Fragment>
                }
            >
                <Preview />
            </Drawer>
        </>
    );
};

const CardsContainer: React.FC = () => {
    return (
        <div>
            <Row gutter={16}>
                <Col md={24} xl={12}>
                    <ClientObjectiveSection />
                </Col>
            </Row>
        </div>
    );
};

const Preview: React.FC = () => {
    const debug = false;

    return (
        <PDFViewer width="100%" height="100%">
            <Document title="Invest ROA">
                <Page size="A4" style={styles.page}>
                    <View style={styles.h1} debug={debug}>
                        <Text>Record of Advice</Text>
                    </View>
                    <View style={styles.mb3} debug={debug}>
                        <Text>Dean van Niekerk</Text>
                    </View>
                    <View style={[styles.h4]} debug={debug}>
                        <Text>Client Objectives</Text>
                    </View>
                </Page>
            </Document>
        </PDFViewer>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    const roaInvestState = roaInvestSelector(state);
    return {};
};

export default connect(mapStateToProps)(RoaInvest);

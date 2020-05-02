import { Font, StyleSheet } from "@react-pdf/renderer";

Font.register({ family: "Roboto", src: "dist/fonts/Roboto-Regular.ttf" });

Font.register({
    family: "Roboto",
    fonts: [
        { src: "dist/fonts/Roboto-Regular.ttf" }, // font-style: normal, font-weight: normal
        { src: "dist/fonts/Roboto-Bold.ttf", fontWeight: 700, fontStyle: "bold" },
    ],
});

export const styles = StyleSheet.create({
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
    h5: {
        fontSize: 11,
        marginTop: 4,
        marginBottom: 10,
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
    mt1: {
        marginTop: 4,
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
    row: {
        flexDirection: "row",
    },
    flex1: {
        flex: 1,
    },
    flexGrow1: {
        flexGrow: 1,
    },
});

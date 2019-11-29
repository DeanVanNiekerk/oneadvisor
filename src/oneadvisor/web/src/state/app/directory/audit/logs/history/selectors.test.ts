import { auditLogHistorySelector } from "./selectors";

describe("auditLog list selectors", () => {
    it("auditLogHistorySelector", () => {
        const state = {
            app: {
                directory: {
                    audit: {
                        logs: {
                            history: {
                                property: "1",
                            },
                        },
                    },
                },
            },
        };

        const expected = {
            property: "1",
        };

        //@ts-ignore
        const actual = auditLogHistorySelector(state);

        expect(actual).toEqual(expected);
    });
});

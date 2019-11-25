import { auditLogsSelector } from "./selectors";

describe("auditLog list selectors", () => {
    it("auditLogsSelector", () => {
        const state = {
            app: {
                directory: {
                    audit: {
                        logs: {
                            list: {
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
        const actual = auditLogsSelector(state);

        expect(actual).toEqual(expected);
    });
});

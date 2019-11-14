import { contactsSelector } from "./selectors";

describe("contact list selectors", () => {
    it("contactsSelector", () => {
        const state = {
            app: {
                client: {
                    contacts: {
                        list: {
                            property: "1",
                        },
                    },
                },
            },
        };

        const expected = {
            property: "1",
        };

        //@ts-ignore
        const actual = contactsSelector(state);

        expect(actual).toEqual(expected);
    });
});

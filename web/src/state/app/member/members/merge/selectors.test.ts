import { memberMergeSelector } from './selectors';

describe("member list selectors", () => {
    it("memberMergeSelector", () => {
        const state = {
            app: {
                member: {
                    members: {
                        merge: {
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
        const actual = memberMergeSelector(state);

        expect(actual).toEqual(expected);
    });
});

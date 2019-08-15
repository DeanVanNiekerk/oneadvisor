import { changeLogSelector } from "./selectors";

describe('changeLog selectors', () => {
    it('changeLogSelector', () => {
        const state = {
            app: {
                directory: {
                    changeLogs: {
                        changeLog: {
                            property: '1'
                        }
                    }
                }
            }
        };

        const expected = {
            property: '1'
        };

        //@ts-ignore
        const actual = changeLogSelector(state);

        expect(actual).toEqual(expected);
    });
});

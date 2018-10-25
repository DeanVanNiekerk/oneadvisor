import { applicationsSelector } from './selectors'
import { defaultState } from './reducer'

describe('context selectors', () => {

    describe('applicationsSelector()', () => {

        const setupState = (pathName) => {

            return {
                context: {
                    ...defaultState
                },
                router: {
                    location: {
                        pathName: pathName
                    }
                }
            }

        }

        it('root path', () => {

            const state = setupState('');
            const actual = applicationsSelector(state)

            expect(actual.length).toEqual(1);
            expect(actual[0]).toEqual({
                id: "DIRECTORY",
                name: "Directory",
                color: "#3949ab",
                relativePath: "/directory",
                isCurrent: true
            })
        })

        it('directory app', () => {

            const state = setupState('/directory/users');
            const actual = applicationsSelector(state)

            expect(actual.length).toEqual(1);
            expect(actual[0]).toEqual({
                id: "DIRECTORY",
                name: "Directory",
                color: "#3949ab",
                relativePath: "/directory",
                isCurrent: true
            })
        })
    })

})
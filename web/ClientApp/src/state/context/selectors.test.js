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
                        pathname: pathName
                    }
                }
            }

        }

        it('root path', () => {

            const state = setupState('');
            const actual = applicationsSelector(state)

            expect(actual.length).toEqual(2);
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

            expect(actual[0]).toEqual({
                id: "DIRECTORY",
                name: "Directory",
                color: "#3949ab",
                relativePath: "/directory",
                isCurrent: true
            })
        })

        it('member app', () => {

            const state = setupState('/member/members');
            const actual = applicationsSelector(state)

            expect(actual[1]).toEqual({
                id: "MEMBER",
                name: "Member",
                color: "#00897b",
                relativePath: "/member",
                isCurrent: true
            })
        })
    })

})
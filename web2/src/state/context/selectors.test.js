import { applicationsSelector, currentApplicationSelector, currentMenuSelector, currentMenuLinkSelector } from './selectors'
import { defaultState as defaultContextState } from './reducer'
import { DEFAULT_APPLICATION_ID, MEMBER_ID, DIRECTORY_ID } from 'config/application'
import { menus } from 'config/menu'

describe('context selectors', () => {

    const setupState = (pathName = '/', contextState = defaultContextState) => {

        return {
            context: {
                ...contextState
            },
            router: {
                location: {
                    pathname: pathName
                }
            }
        }

    }

    describe('applicationsSelector()', () => {


        it('root path', () => {

            const state = setupState('/');
            const actual = applicationsSelector(state)

            expect(actual.length).toEqual(2);
            expect(actual[0].id).toEqual(DEFAULT_APPLICATION_ID)
        })

        it('directory app', () => {

            const state = setupState('/directory/users');
            const actual = applicationsSelector(state)

            expect(actual[0]).toEqual({
                id: DIRECTORY_ID,
                name: "Directory",
                color: "#3949ab",
                icon: "security",
                relativePath: "/directory",
                isCurrent: true
            })
        })

        it('member app', () => {

            const state = setupState('/member/members');
            const actual = applicationsSelector(state)

            expect(actual[1]).toEqual({
                id: MEMBER_ID,
                name: "Member",
                color: "#00897b",
                icon: "account_circle",
                relativePath: "/member",
                isCurrent: true
            })
        })
    })

    describe('currentApplicationSelector()', () => {

        it('get current app - default', () => {

            const state = setupState();
            const actual = currentApplicationSelector(state)

            expect(actual.id).toEqual(DEFAULT_APPLICATION_ID);
        })

        it('get current app - not default', () => {

            const state = setupState('/member');
            const actual = currentApplicationSelector(state)

            expect(actual.id).toEqual(MEMBER_ID);
        })

      
    })

    describe('currentMenuSelector()', () => {

        it('get current app menu - default app', () => {

            const state = setupState();
            const actual = currentMenuSelector(state)

            expect(actual.relativePath).toEqual(menus[DEFAULT_APPLICATION_ID].relativePath);
        })
      
    })

    describe('currentMenuLinkSelector()', () => {

        it('get current app menu link - default app', () => {

            const state = setupState();
            const link = currentMenuLinkSelector(state)

            //Bit of a guess, but whatevs
            expect(link.name).toEqual(menus[DEFAULT_APPLICATION_ID].groups[0].links[0].name);
        })
      
    })


})
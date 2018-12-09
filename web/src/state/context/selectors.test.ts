

import {
    applicationsSelector,
    currentApplicationSelector,
    currentMenuSelector,
    currentMenuLinkSelector
} from './selectors';
import { defaultState as defaultContextState } from './reducer';
import {
    DEFAULT_APPLICATION_ID,
    MEMBER_ID,
    DIRECTORY_ID
} from '@/config/application';
import { menus } from '@/config/menu';

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
        };
    };

    describe('applicationsSelector()', () => {
        it('root path', () => {
            const state = setupState('/');

            //@ts-ignore
            const actual = applicationsSelector(state);

            expect(actual.length).toEqual(2);
            expect(actual[0].id).toEqual(DEFAULT_APPLICATION_ID);
        });

        it('directory app', () => {
            const state = setupState('/directory/users');

            //@ts-ignore
            const actual = applicationsSelector(state);

            const app = actual[0];

            expect(app.id).toEqual(DIRECTORY_ID);
            expect(app.name).toEqual('Directory');
            expect(app.relativePath).toEqual('/directory');
            expect(app.isCurrent).toEqual(true);
        });

        it('member app', () => {
            const state = setupState('/member/members');

            //@ts-ignore
            const actual = applicationsSelector(state);

            const app = actual[1];

            expect(app.id).toEqual(MEMBER_ID);
            expect(app.name).toEqual('Member');
            expect(app.relativePath).toEqual('/member');
            expect(app.isCurrent).toEqual(true);
        });
    });

    describe('currentApplicationSelector()', () => {
        it('get current app - default', () => {
            const state = setupState();

            //@ts-ignore
            const actual = currentApplicationSelector(state);

            expect(actual.id).toEqual(DEFAULT_APPLICATION_ID);
        });

        it('get current app - not default', () => {
            const state = setupState('/member');

            //@ts-ignore
            const actual = currentApplicationSelector(state);

            expect(actual.id).toEqual(MEMBER_ID);
        });
    });

    describe('currentMenuSelector()', () => {
        it('get current app menu - default app', () => {
            const state = setupState();

            //@ts-ignore
            const actual = currentMenuSelector(state);

            expect(actual.relativePath).toEqual(
                menus[DEFAULT_APPLICATION_ID].relativePath
            );
        });
    });

    describe('currentMenuLinkSelector()', () => {
        it('get current app menu link - default app', () => {
            const state = setupState();

            //@ts-ignore
            const link = currentMenuLinkSelector(state);

            //Bit of a guess, but whatevs
            expect(link.name).toEqual(
                menus[DEFAULT_APPLICATION_ID].groups[0].links[0].name
            );
        });

        it('get current app menu link - default app', () => {
            const state = setupState('/directory/users/00ug5ocbmgYtTMoGM0h7');

            //@ts-ignore
            const link = currentMenuLinkSelector(state);

            //Bit of a guess, but whatevs
            expect(link.name).toEqual('Users');
        });
    });
});

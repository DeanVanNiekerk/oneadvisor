import {
    CLIENT_ID,
    COMMISSION_ID,
    COMPLIANCE_ID,
    DEFAULT_APPLICATION_ID,
    DIRECTORY_ID,
    INVEST_ID,
} from "@/config/application";
import { menus } from "@/config/menu";

import { defaultState as defaultContextState } from "./reducer";
import {
    currentMenuLinkSelector,
    currentMenuSelector,
    currentRootNavigationItemSelector,
    rootNavigationItemsSelector,
} from "./selectors";

describe("context selectors", () => {
    const setupState = (pathName = "/", contextState = defaultContextState) => {
        return {
            context: {
                ...contextState,
            },
            router: {
                location: {
                    pathname: pathName,
                },
            },
        };
    };

    describe("rootNavigationItemsSelector()", () => {
        it("root path", () => {
            const state = setupState();

            //@ts-ignore
            const actual = rootNavigationItemsSelector(state);

            expect(actual.length).toEqual(5);
            expect(actual[0].applicationId).toEqual(DIRECTORY_ID);
            expect(actual[1].applicationId).toEqual(CLIENT_ID);
            expect(actual[2].applicationId).toEqual(COMMISSION_ID);
            expect(actual[3].applicationId).toEqual(COMPLIANCE_ID);
            expect(actual[4].applicationId).toEqual(INVEST_ID);
        });

        it("directory app", () => {
            const state = setupState("/directory/users");

            //@ts-ignore
            const actual = rootNavigationItemsSelector(state);

            const item = actual[0];

            expect(item.applicationId).toEqual(DIRECTORY_ID);
            expect(item.name).toEqual("Directory");
            expect(item.relativePath).toEqual("/directory");
            expect(item.isCurrent).toEqual(true);
        });

        it("client app", () => {
            const state = setupState("/client/clients");

            //@ts-ignore
            const actual = rootNavigationItemsSelector(state);

            const item = actual[1];

            expect(item.applicationId).toEqual(CLIENT_ID);
            expect(item.name).toEqual("Client");
            expect(item.relativePath).toEqual("/client");
            expect(item.isCurrent).toEqual(true);
        });

        it("commission app", () => {
            const state = setupState("/commission/upload");

            //@ts-ignore
            const actual = rootNavigationItemsSelector(state);

            const item = actual[2];

            expect(item.applicationId).toEqual(COMMISSION_ID);
            expect(item.name).toEqual("Commission");
            expect(item.relativePath).toEqual("/commission");
            expect(item.isCurrent).toEqual(true);
        });
    });

    describe("currentRootNavigationItemSelector()", () => {
        it("get current app - default", () => {
            const state = setupState();

            //@ts-ignore
            const actual = currentRootNavigationItemSelector(state);

            expect(actual.applicationId).toEqual(DEFAULT_APPLICATION_ID);
        });

        it("get current app - not default", () => {
            const state = setupState("/client");

            //@ts-ignore
            const actual = currentRootNavigationItemSelector(state);

            expect(actual.applicationId).toEqual(CLIENT_ID);
        });
    });

    describe("currentMenuSelector()", () => {
        it("get current app menu - default app", () => {
            const state = setupState();

            //@ts-ignore
            const actual = currentMenuSelector(state);

            expect(actual.relativePath).toEqual(menus[DEFAULT_APPLICATION_ID].relativePath);
        });
    });

    describe("currentMenuLinkSelector()", () => {
        it("get current app menu link - default app", () => {
            const state = setupState();

            //@ts-ignore
            const link = currentMenuLinkSelector(state);

            //Bit of a guess, but whatevs
            expect(link.name).toEqual(menus[DEFAULT_APPLICATION_ID].groups[0].links[0].name);
        });

        it("get current app menu link - default app", () => {
            const state = setupState("/directory/users/00ug5ocbmgYtTMoGM0h7");

            //@ts-ignore
            const link = currentMenuLinkSelector(state);

            //Bit of a guess, but whatevs
            expect(link.name).toEqual("Users");
        });
    });
});

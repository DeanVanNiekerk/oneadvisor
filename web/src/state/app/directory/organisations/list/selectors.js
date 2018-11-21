// @flow

import { createSelector } from 'reselect';
import type { State as RootState } from '@/state/rootReducer';
import type { RouterProps } from '@/state/types';
import type { Organisation } from '../types';
import type { State } from './reducer';

const rootSelector = (state: RootState): State =>
    state.app.directory.organisations.list;

export const listSelector: (state: RootState) => State = createSelector(
    rootSelector,
    root => root
);

const getCurrentOrganisationId = (state: RootState, props: RouterProps) =>
    props.match.params.organisationId;

export const getCachedOrganisation: (
    state: RootState,
    props: RouterProps
) => ?Organisation = createSelector(
    [rootSelector, getCurrentOrganisationId],
    (root, organisationId) => {
        return root.items.find(u => u.id === organisationId);
    }
);

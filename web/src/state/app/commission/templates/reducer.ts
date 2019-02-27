import { combineReducers } from 'redux';

import { TemplateListAction } from './list/actions';
import { reducer as listReducer, State as ListState } from './list/reducer';
import { TemplateAction } from './template/actions';
import { reducer as templateReducer, State as TemplateState } from './template/reducer';

export type Action = TemplateListAction | TemplateAction;

export type State = {
    list: ListState;
    template: TemplateState;
};

export const reducer = combineReducers({
    list: listReducer,
    template: templateReducer
});

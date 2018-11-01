// @flow
import { menus } from 'config/menu'
import { applications } from 'config/application'
import type { Action } from './actions'
import type { Application } from './types'

type State = { 
  +applications: Application[],
  +menus: any[]
 };

export const defaultState = {
  applications: applications,
  menus: menus
}

export default (state: State = defaultState, action: Action) => {

  switch (action.type) {
    default: return state;
  }

};
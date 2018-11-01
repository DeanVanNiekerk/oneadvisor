// @flow

import { menus } from 'config/menu'
import { applications } from 'config/application'
import type { Application, Menus } from './types'

export type Action = { 
  type: string
}

export type State = {
  +applications: Application[],
  +menus: Menus
}

export const defaultState: State = {
  applications: applications,
  menus: menus
}

export const reducer = (state: State = defaultState, action: Action) => {

  switch (action.type) {
    default: return state;
  }

};
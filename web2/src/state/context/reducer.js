import { menus } from 'config/menu'
import { applications } from 'config/application'

export const defaultState = {
  applications: applications,
  menus: menus
}

export default (state = defaultState, action) => {

  switch (action.type) {
    default: return state;
  }

};
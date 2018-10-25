import { DIRECTORY_ID, MEMBER_ID } from 'config/application'


const createApplication = (id, name, color, relativePath) => ({
  id,
  name,
  color,
  relativePath
})

export const defaultState = {
  applications: [
    createApplication(DIRECTORY_ID, "Directory", "#3949ab", "/directory"),
    createApplication(MEMBER_ID, "Member", "#00897b", "/member")
  ]
}

export default (state = defaultState, action) => {

  switch (action.type) {
    default: return state;
  }

};
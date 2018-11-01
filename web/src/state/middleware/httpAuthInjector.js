
import { RSAA } from 'redux-api-middleware'

export default store => next => action => {

    const rsaa = action[RSAA]
  
    // Check if this action is a redux-api-middleware action.
    if (rsaa) {
        // Inject the Authorization header from localStorage.
        rsaa.headers = {
            ...rsaa.headers, 
            ...{ Authorization: 'Bearer ' +  store.getState().auth.accessToken } 
        };
    }
  
    // Pass the FSA to the next action.
    return next(action)
  }
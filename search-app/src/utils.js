import axios from 'axios';

const makeRequestCreator = () => {
  let cancelToken;

  return async(query) => {
    // Check there is a request ongoing and cancel if it's true
    if(cancelToken){
      cancelToken.cancel()
    }

    cancelToken = axios.CancelToken.source()

    try{
      const res = await axios(query, {cancelToken: cancelToken.token})
      const result = res.data
      return result;
    } catch(error) {
        if(axios.isCancel(error)) {
          // Handle if request was cancelled
          console.log('Request canceled', error);
          return error
        } else {
          // Handle usual errors
          console.log('Something went wrong: ', error.message)
          return error
        }
    }
  }
}

export const search = makeRequestCreator()

import format from 'date-fns/format';
import * as types from '../actions/actionTypes';


const initialState = { 
  currentTab : 'First Tab',
  reqResArray : [],
  history : [],
  warningModalMessage : "",
  newRequestFields : {
    method : 'GET',
    protocol : 'http://',
    url : 'http://',
  },
  newRequestHeaders : {
    headersArr : [],
    count : 0,
  },
  newRequestCookies : {
    cookiesArr : [],
    count : 0,
  },
  newRequestBody : {
    bodyContent : '',
    bodyType : 'none',
    rawType : 'Text (text/plain)',
    JSONFormatted : true,
  },
};

const businessReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.GET_HISTORY: {
      return {
        ...state,

        reqResArray : [],
        history: action.payload,
      };
    }

    case types.DELETE_HISTORY: {
      const deleteId = action.payload.id;
      const deleteDate = format(action.payload.created_at, 'MM/DD/YYYY');
      const newHistory = JSON.parse(JSON.stringify(state.history));
      newHistory.forEach((obj, i) => {
        if (obj.date === deleteDate)
          obj.history = obj.history.filter(hist => hist.id !== deleteId);
          if (obj.history.length === 0) {
            newHistory.splice(i, 1) 
          }
      })

      return {
        ...state,
        history: newHistory,
      };
    }

    case types.REQRES_CLEAR: {
      return {
        ...state,
        reqResArray: [],
      };
    }

    case types.REQRES_ADD: {
      const reqResArray = JSON.parse(JSON.stringify(state.reqResArray));
      reqResArray.push(action.payload);

      const addDate = format(action.payload.created_at, 'MM/DD/YYYY');

      const newHistory = JSON.parse(JSON.stringify(state.history));
      
      let updated = false;
      newHistory.forEach((obj) => {
        if (obj.date === addDate) {
          obj.history.unshift(action.payload);
          updated = true;
        }
      });
      if (!updated) {
        newHistory.unshift({
          date: addDate,
          history: [action.payload],
        });
      }

      return {
        ...state,
        reqResArray,
        history: newHistory,
      };
    }

    case types.REQRES_DELETE: {
      const deleteId = action.payload.id;
      const newReqResArray = state.reqResArray.filter(reqRes => reqRes.id !== deleteId)

      return {
        ...state,
        reqResArray : newReqResArray
      }
    }

    case types.REQRES_UPDATE:{
      let reqResDeepCopy = JSON.parse(JSON.stringify(state.reqResArray));
      let indexToBeUpdated;
      reqResDeepCopy.forEach((reqRes, index) => {
        if (reqRes.id === action.payload.id) {
          indexToBeUpdated = index;
        }
      });

      if (indexToBeUpdated !== undefined) {
        reqResDeepCopy.splice(indexToBeUpdated, 1, action.payload);
      }

      return {
        ...state,
        reqResArray: reqResDeepCopy,
      };
    }

    case types.SET_WARNING_MODAL_MESSAGE: {
      return {
        ...state,
        warningModalMessage : action.payload
      }
    }

    case types.SET_NEW_REQUEST_FIELDS:{
      return {
        ...state,
        newRequestFields : action.payload,
      }
    }

    case types.SET_NEW_REQUEST_HEADERS: {
      return {
        ...state,
        newRequestHeaders: action.payload,
      };
    }

    case types.SET_NEW_REQUEST_BODY: {
      return {
        ...state,
        newRequestBody: action.payload,
      };
    }

    case types.SET_NEW_REQUEST_COOKIES: {
      return {
        ...state,
        newRequestCookies: action.payload,
      };
    }

    case types.SET_CURRENT_TAB: {
      return {
        ...state,
        currentTab : action.payload,
      }
    }

    default:
      return state;
  }
};

export default businessReducer;

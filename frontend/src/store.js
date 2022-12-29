import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension'
import { authReducer } from './reducers/userReducer';

let initialState = {

    auth: {
        user: localStorage.getItem("userdetails") ?
            JSON.parse(localStorage.getItem("userdetails"))
            : null
    }
}

const reducer = combineReducers({
    auth: authReducer,
})


const middleware = [thunk];
const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middleware)))

export default store;


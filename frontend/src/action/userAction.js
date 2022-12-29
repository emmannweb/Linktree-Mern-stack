import axios from 'axios'
import { toast } from "react-toastify";
import {
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOAD_USER_REQUEST,
    LOAD_USER_SUCCESS,
    LOAD_USER_FAIL,
    LOGOUT_SUCCESS,
    LOGOUT_FAIL,
    CLEAR_ERRORS,
    LOGOUT_AUTO_SUCCESS,
    LOGOUT_AUTO_FAIL
} from '../constants/userConstants'



// SIGN IN USER
export const signin = (email, password) => async (dispatch) => {

    dispatch({
        type: LOGIN_REQUEST,
        payload: { email, password }
    });

    try {
        const { data } = await axios.post('/api/v1/signin', { email, password });
        localStorage.setItem('userdetails', JSON.stringify(data));
        dispatch({
            type: LOGIN_SUCCESS,
            payload: data
        });
        if (data.success === true) {
            toast.success('Logado com sucesso!');
        }

    } catch (error) {
        dispatch({
            type: LOGIN_FAIL,
            //payload: error.response && error.response.message.data.messsage ? error.response.data.message : error.message
            payload: error.response.data.error,
        });

        toast.error(error.response.data.error);
    }
}



//CURRENTLY LOGGED USER
export const loadUser = () => async (dispatch) => {

    try {
        const { data } = await axios.get('/api/v1/getme');
        dispatch({
            type: LOAD_USER_SUCCESS,
            payload: data.user
        });

    } catch (error) {
        dispatch({
            type: LOAD_USER_FAIL,
            payload: error.response.data.error
        });

    }
}


//LOG OUT
export const logOut = () => async (dispatch) => {

    try {

        const { data } = await axios.get('/api/v1/logout');
        localStorage.removeItem('userdetails');
        dispatch({
            type: LOGOUT_SUCCESS
        });
        if (data.success === true) {
            toast.success('Desconectado!');
        }

    } catch (error) {
        dispatch({
            type: LOGOUT_FAIL,
            payload: error.response.data.error
        });

    }
}


//log out auto
export const logOutAuto = () => async (dispatch) => {
    setTimeout(async () => {
        try {

            const { data } = await axios.get('/api/v1/logout');
            localStorage.removeItem('userdetails');

            dispatch({
                type: LOGOUT_AUTO_SUCCESS
            });

            window.location.reload(true);
            toast.error("Your token is expired, please log again");

        } catch (error) {
            dispatch({
                type: LOGOUT_AUTO_FAIL,
                payload: error.response.data.error
            });

        }

    }, 3600000);
}

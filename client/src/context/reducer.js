import {   
    DISPLAY_ALERT,
    CLEAR_ALERT,
    SETUP_USER_BEGIN,
    SETUP_USER_ERROR,
    SETUP_USER_SUCCESS,
    LOGOUT_USER,
    HANDLE_CHANGE,
    CLEAR_VALUES,
    CREATE_TASK_BEGIN,
    CREATE_TASK_ERROR,
    CREATE_TASK_SUCCESS,
    SET_EDIT_TASK,
    EDIT_TASK_BEGIN,
    EDIT_TASK_ERROR,
    EDIT_TASK_SUCCESS,
    TOGGLE_SIDEBAR,
    GET_TASKS_BEGIN,
    GET_TASKS_SUCCESS,
    DELETE_TASK_BEGIN,
    CHANGE_PAGE,
    CLEAR_FILTERS,
    UPDATE_USER_BEGIN,
    UPDATE_USER_SUCCESS,
    UPDATE_USER_ERROR,
    GET_COMPANIES_BEGIN,
    GET_COMPANIES_SUCCESS,
    GET_EMPLOYEES_BEGIN,
    GET_EMPLOYEES_SUCCESS,
    TOGGLE_STATUS_BEGIN,
    TOGGLE_STATUS_SUCCESS,
    SHOW_STATS_BEGIN,
    SHOW_STATS_SUCCESS,
    
} from "./actions"

import { initialState } from "./appContext"

const reducer = (state, action) => {
    if(action.type === DISPLAY_ALERT){
        return {
            ...state,
            showAlert: true,
            alertType: 'danger',
            alertText: 'Please provide all values'
        }
    }

    if(action.type === CLEAR_ALERT){
        return {
            ...state,
            showAlert: false,
            alertType: '',
            alertText: ''
        }
    }

    if(action.type === SETUP_USER_BEGIN){
        return {
            ...state,
            isLoading: true
        }
    }

    if(action.type === SETUP_USER_SUCCESS){
        return {
            ...state,
            isLoading: false,
            token: action.payload.token,
            user: action.payload.user,
            showAlert: true,
            alertType: 'success',
            alertText: action.payload.alertText
        }
    }

    if(action.type === SETUP_USER_ERROR){
        return {
            ...state,
            isLoading: false,
            showAlert: true,
            alertType: 'danger',
            alertText: action.payload.msg
        }
    }

    if(action.type === TOGGLE_SIDEBAR){
        return {
            ...state,
            showSidebar: !state.showSidebar,
          }
    }

    if(action.type === LOGOUT_USER){
        return {
            ...initialState,
            user: null,
            token: null,
            employees: null
        }
    }
    
    if(action.type === HANDLE_CHANGE){
        return {
            ...state,
            page: 1,
            [action.payload.name]: action.payload.value
        }
    }

    if(action.type === CLEAR_VALUES){
        const initialState = {
            isEditing: false,
            editTaskId: '',
            subject: '',
            caption: '',
            owner: ''
        }

        return {
            ...state,
            ...initialState
        }
    }

    if(action.type === CREATE_TASK_BEGIN){
        return {
            ...state,
            isLoading: true
        }
    }

    if(action.type === CREATE_TASK_SUCCESS){
        return {
            ...state,
            isLoading: false,
            showAlert: true,
            alertType: 'success',
            alertText: 'New Task Created'
        }
    }

    if(action.type === CREATE_TASK_ERROR){
        return {
            ...state,
            isLoading: false,
            showAlert: true,
            alertType: 'danger',
            alertText: action.payload.msg
        }
    }

    if(action.type === SET_EDIT_TASK){
        const task = state.tasks.find(task => task._id === action.payload.id)
        const { _id, subject, caption, owner } = task
        return {
            ...state,
            isEditing: true,
            editTaskId: _id,
            subject,
            caption,
            owner
        }   
    }

    if(action.type === EDIT_TASK_BEGIN){
        return {
            ...state,
            isLoading: true
        }
    }

    if(action.type === EDIT_TASK_SUCCESS){
        return {
            ...state,
            isLoading: false,
            showAlert: true,
            alertType: 'success',
            alertText: 'Task Updated!'
        }
    }

    if(action.type === EDIT_TASK_ERROR){
        return {
            ...state,
            isLoading: false,
            showAlert: true,
            alertType: 'danger',
            alertText: action.payload.msg
        }
    }

    if(action.type === GET_TASKS_BEGIN){
        return {
            ...state,
            isLoading: true,
            showAlert: false
        }
    }

    if(action.type === GET_TASKS_SUCCESS){
        return {
            ...state,
            isLoading:false,
            tasks: action.payload.tasks,
            totalTasks: action.payload.totalTasks,
            numOfPages: action.payload.numOfPages
        }
    }

    if(action.type === DELETE_TASK_BEGIN){
        return {...state, isLoading: true}
    }

    if (action.type === CHANGE_PAGE){
        return { ...state, page: action.payload.pageNumber }
    }

    if(action.type === CLEAR_FILTERS){
        return {
            ...state,
            search: '',
            searchStatus: 'all',
            sort: 'latest',
            searchOwner: ''
        }
    }

    if (action.type === UPDATE_USER_BEGIN){
        return { ...state, isLoading: true }
    }

    if (action.type === UPDATE_USER_SUCCESS){
        return {
            ...state,
            isLoading: false,
            token: action.payload.token,
            user: action.payload.user,
            showAlert: true,
            alertType: 'success',
            alertText: 'User Profile Updated!',
        }
    }

    if (action.type === UPDATE_USER_ERROR){
        return {
            ...state,
            isLoading: false,
            showAlert: true,
            alertType: 'danger',
            alertText: action.payload.msg,
        }
    }

    if(action.type === GET_COMPANIES_BEGIN){
        return{
            ...state,
            isLoading: true
        }
    }

    if(action.type === GET_COMPANIES_SUCCESS){
        return {
            ...state,
            isLoading: false,
            companies: action.payload.companies
        }
    }

    if(action.type === GET_EMPLOYEES_BEGIN){
        return{
            ...state,
            isLoading: true
        }
    }

    if(action.type === GET_EMPLOYEES_SUCCESS){
        return {
            ...state,
            isLoading: false,
            employees: action.payload.employees
        }
    }

    if(action.type === TOGGLE_STATUS_BEGIN){
        return{
            ...state,
            isLoading: true
        }
    }

    if(action.type === TOGGLE_STATUS_SUCCESS){
        return{
            ...state,
            isLoading: false
        }
    }

    if(action.type === SHOW_STATS_BEGIN){
        return{
            ...state,
            isLoading: true,
            // showAlert: false
        }
    }

    if(action.type === SHOW_STATS_SUCCESS){
        return {
            ...state,
            isLoading: false,
            stats: action.payload.stats,
            monthlyTasks: action.payload.monthlyTasks,
        }
    }

    throw new Error(`no such action: ${action.type}`)
}

export default reducer
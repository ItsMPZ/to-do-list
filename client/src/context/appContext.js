import React, { useReducer, useContext } from 'react'
import reducer from './reducer'
import axios from "axios"

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

const token = localStorage.getItem("token")
const user = localStorage.getItem("user")
const employees = localStorage.getItem("employees")
const companies = localStorage.getItem("companies")

const initialState = {
    isLoading: false,
    showAlert: false,
    alertText: '',
    alertType: '',
    user: user? JSON.parse(user) : null,
    token: token,
    isEditing: false,
    subject: '',
    caption: '',
    status: 'notDone',
    statusOptions: ['done', 'notDone'],
    roleOptions: ['none', 'employee', 'company'],
    showSidebar: false,
    tasks: [],
    page: 1,
    totalTasks: 0,
    search: '',
    searchStatus: 'all',
    sort: 'latest',
    sortOptions: ['latest', 'oldest', 'a-z', 'z-a'],
    numOfPages: 1,
    companies: companies? JSON.parse(companies): [],
    employees: employees? JSON.parse(employees): null,
    owner: '',
    searchOwner: '',
    searchCreatedBy: '',
    stats: {},
    monthlyTasks: [],
    
}

const AppContext = React.createContext()

const AppProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState)

    //axios
    const authFetch = axios.create({
        baseURL: '/api/v1'
    })

    //request
    authFetch.interceptors.request.use(
        (config) => {
            config.headers.common['Authorization'] = `Bearer ${state.token}`
            return config
        },
        (error) => {
            return Promise.reject(error)
        }
    )

    //response
    authFetch.interceptors.response.use(
        (response) => {
            return response
        },
        (error) => {
            // console.log(error.response)
            if (error.response.status === 401) {
            logoutUser()
            }
            return Promise.reject(error)
        }
    )

    //functions
    const displayAlert = () => {
        dispatch({ type: DISPLAY_ALERT })
        clearAlert()
    }

    const clearAlert = () => {
        setTimeout(() => {
            dispatch({ type: CLEAR_ALERT })
        }, 3000)
    }

    const addUserToLocalStorage= ({ user, token }) => {
        localStorage.setItem('user', JSON.stringify(user))
        localStorage.setItem('token', token)
    }

    const removeUserFromLocalStorage= () => {
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        localStorage.removeItem('employees')
        localStorage.removeItem('companies')
    }

    const setupUser = async ({ currentUser, endPoint, alertText }) => {
        dispatch({ type: SETUP_USER_BEGIN })
        try {
            const { data } = await axios.post(`/api/v1/auth/${endPoint}`, currentUser)

            const { user, token } = data

            dispatch({
                type: SETUP_USER_SUCCESS,
                payload: {
                    user,
                    token,
                    alertText,
                }
            })

            addUserToLocalStorage({ user, token })
            
            if(user.role === 'company' && endPoint === 'login'){
                getEmployees(user._id)
            }
            
        } catch (error) {
            dispatch({
                type: SETUP_USER_ERROR,
                payload: { msg: error.response.data.msg }
            })
        }
        clearAlert()
    }

    const getEmployees = async (companyId) => {
        dispatch({ type: GET_EMPLOYEES_BEGIN })
        try {
            const { data } = await authFetch.get(`/users/employees?worksFor=${companyId}`)

            dispatch({
                type: GET_EMPLOYEES_SUCCESS,
                payload: {
                    employees: data
                }
            })

            localStorage.setItem('employees', JSON.stringify(data))

        } catch (error) {
            logoutUser()
        }
    }

    const logoutUser = () => {
        dispatch({ type: LOGOUT_USER })
        removeUserFromLocalStorage()
    }

    const handleChange = ({ name, value }) => {
        dispatch({
            type: HANDLE_CHANGE,
            payload: { name, value }
        })
    }

    const clearValues = () => {
        dispatch({ type: CLEAR_VALUES})
    }

    const createTask = async () => {
        dispatch({ type: CREATE_TASK_BEGIN })
        try {
            const {
                subject,
                caption,
                owner
            } = state

            let reqBody = {
                subject,
                caption
            }

            if(owner){
                reqBody.owner = owner
            }

            await authFetch.post('/tasks', reqBody)
            
            dispatch({ type: CREATE_TASK_SUCCESS })
            dispatch({ type: CLEAR_VALUES })

        } catch (error) {
            if(error.response.status === 401 ) return
            dispatch({
                type: CREATE_TASK_ERROR,
                payload: { msg: error.response.data.msg }
            })
        }
        clearAlert()
    }

    const setEditTask = id => {
        dispatch({
            type: SET_EDIT_TASK,
            payload: { id }
        })
    }

    const editTask = async () => {
        dispatch({ type: EDIT_TASK_BEGIN })
        try {
            const {
                subject,
                caption,
                owner
            } = state

            let reqBody = {
                subject,
                caption
            }

            if(owner){
                reqBody.owner = owner
            }

            await authFetch.patch(`/tasks/${state.editTaskId}`, reqBody)

            dispatch({ type: EDIT_TASK_SUCCESS })
            clearValues()
        } catch (error) {
            if (error.response.status === 401) return
            dispatch({
                type: EDIT_TASK_ERROR,
                payload: { msg: error.response.data.msg },
            })
        }
        clearAlert()
    }

    const toggleStatus = async id => {
        dispatch({ type: TOGGLE_STATUS_BEGIN })
        try {
            await authFetch.patch(`/tasks/toggle/${id}`)
            dispatch({ type: TOGGLE_STATUS_SUCCESS })
            getTasks()
        } catch (error) {
            logoutUser()
        }
    }

    const toggleSidebar = () => {
        dispatch({ type: TOGGLE_SIDEBAR })
    }

    const updateUser = async ( currentUser ) => {
        dispatch({ type: UPDATE_USER_BEGIN })
        try {
            const { data } = await authFetch.patch(`/auth/updateUser`, currentUser)
            const { user, token } = data

            dispatch({
                type: UPDATE_USER_SUCCESS,
                payload: {user, token}
            })

            addUserToLocalStorage({user, token})
        } catch (error) {
            if (error.response.status !== 401) {
                dispatch({
                    type: UPDATE_USER_ERROR,
                    payload: { msg: error.response.data.msg },
                })
            }
        }
        clearAlert()
    }

    const getTasks = async () => {
        const {
            page,
            search,
            searchStatus,
            sort,
            searchOwner,
            searchCreatedBy
        } = state

        let url = `/tasks?page=${page}&status=${searchStatus}&sort=${sort}&owner=${searchOwner}&createdBy=${searchCreatedBy}`
        if(search) {
            url = url + `&search=${search}`
        }

        dispatch({ type: GET_TASKS_BEGIN })

        try {
            const { data } = await authFetch(url)
            const { tasks, totalTasks, numOfPages } = data
            dispatch({
                type: GET_TASKS_SUCCESS,
                payload: {
                    tasks,
                    totalTasks,
                    numOfPages
                }
            })
        } catch (error) {
            logoutUser()
        }
    }

    const getCompanies = async () => {
        dispatch({ type: GET_COMPANIES_BEGIN })
        try {
            const { data } = await authFetch.get('/users/companies')
            dispatch({
                type: GET_COMPANIES_SUCCESS,
                payload: { companies: data }
            })
            localStorage.setItem('companies', JSON.stringify(data))
        } catch (error) {
            logoutUser()
        }
    } 

    const changePage = (pageNumber) => {
        dispatch({ type: CHANGE_PAGE, payload: { pageNumber } })
    }

    const deleteTask = async (id) => {
        dispatch({ type: DELETE_TASK_BEGIN })
        try {
            await authFetch.delete(`/tasks/${id}`)
            getTasks()
        } catch (error) {
            logoutUser()
        }
    }

    const clearFilters = () => {
        dispatch({ type: CLEAR_FILTERS })
    }

    const showStats = async () => {
        dispatch({ type: SHOW_STATS_BEGIN })
        try {
            const { data } = await authFetch('/tasks/stats')
            dispatch({
                type: SHOW_STATS_SUCCESS,
                payload: {
                    stats: data.defaultStats,
                    monthlyTasks: data.monthlyTasks
                }
            })
        } catch (error) {
            logoutUser()
        }
    }

    return(
        <AppContext.Provider
            value={{
                ...state,
                displayAlert,
                setupUser,
                handleChange,
                clearValues,
                createTask,
                setEditTask,
                editTask,
                toggleSidebar,
                updateUser,
                getTasks,
                deleteTask,
                changePage,
                clearFilters,
                logoutUser,
                toggleStatus,
                showStats,
                getCompanies,

            }}
        >
            {children}
        </AppContext.Provider>
    )
}

const useAppContext = () => {
    return useContext(AppContext)
}

export { AppProvider, initialState, useAppContext }
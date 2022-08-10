import User from '../models/User.js'
import { StatusCodes } from 'http-status-codes'
import {
    BadRequestError,
    NotFoundError
} from '../errors/index.js'

const getAllUsers = async (req, res) => {
    let allUsers = await User.find()
    res.status(StatusCodes.OK).json(allUsers)
}

const getAllCompanies = async (req, res) => {
    let allCompanies = await User.find({ role: "company"}).select("-employees -email")
    res.status(StatusCodes.OK).json(allCompanies)
}

const getEmployees = async (req, res) => {
    const { worksFor } = req.query

    let queryObject = { role: 'employee' }

    if(worksFor){
        queryObject.worksFor = worksFor
    }

    const employees = await User.find(queryObject).sort('lastName')

    res.status(StatusCodes.OK).json(employees)
}

export {
    getAllUsers,
    getAllCompanies,
    getEmployees,

}
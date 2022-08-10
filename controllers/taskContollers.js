import Task from "../models/Task.js"
import User from '../models/User.js'
import { StatusCodes } from "http-status-codes"
import {
    BadRequestError,
    NotFoundError
} from '../errors/index.js'
import checkPermissions from "../utils/checkPermissions.js"
import mongoose from "mongoose"
import moment from "moment"

const createTask = async (req, res) => {
    const { subject, owner } = req.body

    if(!subject){
        throw new BadRequestError("Please provide all values")
    }

    req.body.createdBy = req.user.userId

    if(!owner){
        req.body.owner = req.user.userId
    }

    const task = await Task.create(req.body)

    res.status(StatusCodes.CREATED).json({ task })

}

const getAllTasks = async (req, res) => {
    const { status, sort, search, owner, createdBy } = req.query

    let queryObject

    const user = await User.findOne({ _id: req.user.userId })

    if(user.role !== 'company'){
        queryObject = { owner: req.user.userId }
    } else {
        queryObject = { createdBy: req.user.userId }
    }

    //add stuff based on condition
    if (status && status != 'all') {
        queryObject.status = status
    }

    if(search){
        queryObject.subject = { $regex: search, $options: 'i' }
    }

    if(owner){
        queryObject.owner = owner
    }

    if(createdBy){
        queryObject.createdBy = createdBy
    }

    //no await
    let result = Task.find(queryObject)

    // chain sort conditions
    if (sort === 'latest') {
        result = result.sort('-createdAt')
    }
    if (sort === 'oldest') {
        result = result.sort('createdAt')
    }
    if (sort === 'a-z') {
        result = result.sort('subject')
    }
    if (sort === 'z-a') {
        result = result.sort('-subject')
    }

    // setup pagination
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (page - 1) * limit

    result = result.skip(skip).limit(limit)

    const tasks = await result

    const totalTasks = await Task.countDocuments(queryObject)
    const numOfPages = Math.ceil(totalTasks / limit)

    res.status(StatusCodes.OK).json({ tasks, totalTasks, numOfPages })
}

const showStats = async (req, res) => {
    const user = await User.findOne({ _id: req.user.userId })

    let matchObj = { createdBy: mongoose.Types.ObjectId(req.user.userId) }

    if(user.role === 'employee'){
        matchObj = { owner: mongoose.Types.ObjectId(req.user.userId) }
    }

    let stats = await Task.aggregate([
        { $match: matchObj },
        { $group: { _id: '$status', count: { $sum: 1 } } },
    ])

    stats = stats.reduce((acc, curr) => {
        const { _id: title, count } = curr
        acc[title] = count
        return acc
    }, {})
    
    const defaultStats = {
        done: stats.done || 0,
        notDone: stats.notDone || 0
    }
    
    let monthlyTasks = await Task.aggregate([
        { $match: matchObj },
        {
            $group: {
                _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
                count: { $sum: 1 },
            },
        },
        { $sort: { '_id.year': -1, '_id.month': -1 } },
        { $limit: 6 },
    ])

    monthlyTasks = monthlyTasks
    .map((item) => {
        const {
        _id: { year, month },
        count,
        } = item
        const date = moment()
        .month(month - 1)
        .year(year)
        .format('MMM Y')
        return { date, count }
    })
    .reverse()
    
    res.status(StatusCodes.OK).json({ defaultStats, monthlyTasks })
}

const deleteTask = async (req, res) => {
    const { id: taskId } = req.params

    const task = await Task.findOne({ _id: taskId })

    if(!task) {
        throw new NotFoundError(`No task with id ${taskId}`)
    }

    checkPermissions(req.user, task.createdBy)

    await task.remove()

    res.status(StatusCodes.OK).json({msg: "Success! Task removed"})
}

const updateTask = async (req, res) => {
    const { id: taskId } = req.params
    const { subject, owner } = req.body

    if (!subject) {
        throw new BadRequestError('Please provide all values')
    }

    const task = await Task.findOne({ _id: taskId })

    if (!task) {
        throw new NotFoundError(`No task with id :${taskId}`)
    }

    if(!owner){
        req.body.owner = req.user.userId
    }

    // check permissions
    checkPermissions(req.user, task.createdBy)

    const updatedTask = await Task.findOneAndUpdate({ _id: taskId }, req.body, {
        new: true,
        runValidators: true,
    })

    res.status(StatusCodes.OK).json({ updatedTask })
}

const toggleTaskStatus = async (req, res) => {
    const { id: taskId } = req.params
    const task = await Task.findOne({ _id: taskId })

    if (!task) {
        throw new NotFoundError(`No task with id :${taskId}`)
    }

    // check permissions
    checkPermissions(req.user, task.owner)

    const {status} = task
    const newStatus = (status === 'done')? "notDone": "done"

    const toggledTask = await Task.findOneAndUpdate({ _id: taskId }, {$set: { "status" : `${newStatus}`}}, {
        new: true,
        runValidators: true,
    })
    
    res.status(StatusCodes.OK).json({toggledTask})
}

export { createTask, getAllTasks, deleteTask, updateTask, toggleTaskStatus, showStats }

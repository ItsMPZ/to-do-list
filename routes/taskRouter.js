import express from 'express'
const router = express.Router()

import{
    createTask,
    getAllTasks,
    deleteTask,
    updateTask,
    toggleTaskStatus,
    showStats
} from "../controllers/taskContollers.js"

router.route('/').post(createTask).get(getAllTasks)
router.route('/:id').delete(deleteTask).patch(updateTask)
router.route('/stats').get(showStats)
router.route('/toggle/:id').patch(toggleTaskStatus)

export default router
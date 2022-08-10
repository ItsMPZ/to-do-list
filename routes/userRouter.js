import express from 'express'
const router = express.Router()
import {
    getAllUsers,
    getAllCompanies,
    getEmployees,

} from '../controllers/userController.js'

router.route('/').get(getAllUsers)
router.route('/companies').get(getAllCompanies)
router.route('/employees').get(getEmployees)

export default router
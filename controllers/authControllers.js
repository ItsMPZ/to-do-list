import User from '../models/User.js'
import {StatusCodes} from 'http-status-codes'
import { BadRequestError, UnAuthenticatedError } from '../errors/index.js'

const register = async (req, res) => {
    const {name, email, password, role, lastName} = req.body

    //check for values
    if(!name, !email, !password, !role){
        throw new BadRequestError('Please provide all values')
    }
    if(role === 'employee' && !lastName){{
        throw new BadRequestError('Please provide all values')
    }}

    //check for email
    const userAlreadyExists = await User.findOne({ email })
    if(userAlreadyExists){
        throw new BadRequestError('Email already in use')
    }

    //creating user 
    const user = await User.create(req.body)

    const token = user.createJWT()

    res.status(StatusCodes.CREATED).json({
        user,
        token
    })
}

const login = async (req, res) => {
    const { email, password } = req.body

    //check for values
    if(!email || !password){
        throw new BadRequestError("Please provide all values")
    }
    
    const user = await User.findOne({ email }).select("+password")

    //ckeck for user
    if(!user){
        throw new UnAuthenticatedError("Invalid Crdentials")
    }

    const isPasswordCorrect = await user.comparePassword(password)

    //ckeck for password
    if(!isPasswordCorrect){
        throw new UnAuthenticatedError("Invalid Crdentials")
    }

    const token = user.createJWT()
    user.password = undefined
    res.status(StatusCodes.OK).json({
        user,
        token
    })
}
const updateUser = async (req, res) => {
    const { email, name, lastName } = req.body

    //check for values
    if (!email || !name) {
        throw new BadRequestError('Please provide all values')
    }

    const user = await User.findOne({ _id: req.user.userId })

    if(user.role != 'company' && !lastName){
        throw new BadRequestError('Please provide all values')
    }

    user.name = name
    user.email = email

    if(user.role != 'company'){
        user.lastName = lastName
    }

    await user.save()

    const token = user.createJWT()

    res.status(StatusCodes.OK).json({
        user,
        token
    })
}

export { register, login, updateUser }
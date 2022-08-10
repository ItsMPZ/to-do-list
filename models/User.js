import mongoose from "mongoose";
import validator from "validator";
import bcryprt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const roleOptions = ['company', 'employee', 'none']
const rolesWithLastName = ['employee', 'none']

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide name'],
        minlength: 3,
        maxlength: 20,
        trim: true,
        unique: [() => {return(this.role === 'company')}]
    },
    lastName: {
        type: String,
        minlength: 3,
        maxlength: 20,
        trim: true,
        required: [isLastNameRequierd, 'Please provide last name']
    },
    password: {
        type: String,
        required: [true, 'Please provide password'],
        minlength: 6,
        maxlength: 20,
        select: false
    },
    email: {
        type: String,
        required: true,
        validate: {
            validator: validator.isEmail,
            message: 'Please provide a valid email'
        },
        unique: true
    },
    role: {
        type: String,
        enum: roleOptions,
        default: 'none',
        required: [true, "Please select a role"]
    },
    worksFor: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: [isWorksForRequierd]
    }
})

//for checking if lastName is requierd or not
function isLastNameRequierd(){
    if(rolesWithLastName.indexOf(this.role) > -1){
        return true
    }
    return false
}

//for checking if worksFor is requierd or not
function isWorksForRequierd(){
    if(this.role === 'employee'){
        return true
    }
    return false
}

//for hashing the password
UserSchema.pre('save', async function() {
    if (!this.isModified('password')) return
    const salt = await bcryprt.genSalt(10)
    this.password = await bcryprt.hash(this.password, salt)
    if(this.role === 'company'){
        this.lastName = null
    }
})

//for creating a web token
UserSchema.methods.createJWT = function() {
    return jwt.sign(
        {
            userId: this._id
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_LIFETIME
        }
    )
}

//for comparing the password in login
UserSchema.methods.comparePassword = async function(candidatePassword) {
    const isMatch = await bcryprt.compare(candidatePassword, this.password)
    return isMatch
}

export default mongoose.model('User', UserSchema)
import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
    {
        subject: {
            type: String,
            required: true,
            maxlength: 25
        },
        caption: {
            type: String,
            maxlength: 300
        },
        status: {
            type: String,
            enum: ["done", "notDone"],
            default: "notDone"
        },
        createdBy: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: [true, "Please provide user"]
        },
        owner: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: [true, "Please provide an owner"]
        }
    },
    {
        timestamps: true
    }
)

export default mongoose.model("Task", TaskSchema)
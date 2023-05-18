import * as mongoose from "mongoose";
export const LessonsSchema = new mongoose.Schema({
    description: String,
    duraction: String,
    seqNo: Number,
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Courses'
    }
})
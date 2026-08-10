import mongoose , {Schema, Document, Types, SchemaTypes} from "mongoose";

export interface IComment extends Document{
    ticket: Types.ObjectId;
    author: Types.ObjectId;
    message:string;
    createdAt:Date;
}

const commentSchema = new Schema<IComment>(
    {
        ticket : {
            type: Schema.Types.ObjectId,
            ref : "Ticket",
            required: true
        },
        author: { 
            type: Schema.Types.ObjectId, 
            ref: "User",
             required: true },
    message: { 
        type: String,
         required: true,
          trim: true },
    },{timestamps:true}
)

commentSchema.index({ ticket: 1, createdAt: 1 });

export default mongoose.model<IComment>("Comment",commentSchema);
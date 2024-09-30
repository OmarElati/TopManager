// import mongoose, { Schema } from "mongoose";

// const taskSchema = new Schema({
//   title: { type: String, required: true },
//   dateStart: { type: Date, required: true },
//   dateEnd: { type: Date, required: true },
//   priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
//   status: { 
//     type: String, 
//     enum: [
//       "to assign tickets", 
//       "assigned", 
//       "stand by", 
//       "run", 
//       "to validate", 
//       "reward", 
//       "release"
//     ], 
//     default: "to assign tickets" 
//   },
//   subTasks: [{ title: String, isCompleted: { type: Boolean, default: false } }],
//   team: [{ type: Schema.Types.ObjectId, ref: "User" }],
// }, { timestamps: true });

// const projectSchema = new Schema({
//   title: { type: String, required: true },
//   description: { type: String, required: true },
//   dateStart: { type: Date, required: true },
//   dateEnd: { type: Date, required: true },
//   tasks: [taskSchema],
//   admin: { type: Schema.Types.ObjectId, ref: "User", required: true },
// }, { timestamps: true });

// const Project = mongoose.model("Project", projectSchema);

// export default Project;

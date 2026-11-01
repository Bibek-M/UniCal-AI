import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, 
  password: { type: String, required: true },
  name: { type: String, required: true },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'] 
  },
  rollNumber: { type: String, 

  required: function(this: any) {
    return this.role === 'Student';
  },
 
  sparse: true },
  department: { type: String, required: true },
  semester: { type: String, required: true }, 
  role: { 
    type: String, 
    required: true, 
    enum: ['Student', 'Faculty', 'Admin'], 
    default: 'Student' 
  },
  joinedOn: { 
    type: Date, 
    default: Date.now  } 
});

const userModel = mongoose.model("users", userSchema);

export {
  userModel
};

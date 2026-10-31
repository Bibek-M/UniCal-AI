
import mongoose from 'mongoose'

mongoose.connect();

// Schema => Type of Data 
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, 
  password: { type: String, required: true }
});

const userModel = mongoose.model("users", userSchema);

export {
  userModel
};

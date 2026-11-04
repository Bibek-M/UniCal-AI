import mongoose from 'mongoose';

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
  rollNumber: { 
    type: String, 
    required: function(this: any) {
      return this.role === 'Student';
    },
    sparse: true 
  },
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
    default: Date.now  
  } 
});

const faqSchema = new mongoose.Schema({
  question: { type: String, required: true, unique: true },
  answer: { type: String, required: true }
});

const eventSchema = new mongoose.Schema({
  id: { type: Number },
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { 
    type: String, 
    required: true,
    match: [/^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/, 'Please use DD-MM-YYYY date format']
  },
  startTime: { type: String },
  endTime: { type: String },
  location: { type: String },
  category: { 
    type: String, 
    required: true, 
    enum: ['academic', 'holiday', 'event', 'placement', 'deadline'] 
  },
  department: { type: String },
  branch: [{ type: String }],
  semester: [{ type: Number }],
  organizer: { type: String },
  isImportant: { type: Boolean, default: false }
});

const scheduleSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'users', 
    required: true,
    index: true 
  },
  eventId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'events' 
  },
  eventCustomId: { type: Number },
  event: {
    id: { type: Number },
    title: { type: String, required: true },
    description: { type: String },
    date: { type: String, required: true },
    startTime: { type: String },
    endTime: { type: String },
    location: { type: String },
    category: { type: String },
    department: { type: String },
    branch: [{ type: String }],
    semester: [{ type: Number }],
    organizer: { type: String },
    isImportant: { type: Boolean, default: false }
  },
  notes: { type: String, default: "" },
  addedAt: { type: Date, default: Date.now }
});

scheduleSchema.index({ userId: 1, eventId: 1 }, { unique: true, sparse: true });
scheduleSchema.index({ userId: 1, eventCustomId: 1 }, { unique: true, sparse: true });

const userModel = mongoose.model("users", userSchema);
const faqModel = mongoose.model("faq", faqSchema);
const eventModel = mongoose.model("events", eventSchema);
const scheduleModel = mongoose.model("schedules", scheduleSchema);

export {
  userModel,
  faqModel,
  eventModel,
  scheduleModel
};

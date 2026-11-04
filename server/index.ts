import express from 'express'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import { JWT_SECRET, authMiddleware } from './middleware.ts'
const app = express();
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));
import { userModel, faqModel, eventModel, scheduleModel } from './models.ts';
import cors from 'cors';
import { aiRouter } from './ai/index.ts';
import { ragRouter } from './rag/index.ts';
const port = 3000;
app.use(cors());
import { connectDB } from './db';
await connectDB();

// Mount AI document extraction routes (Gemini)
app.use('/api/ai', aiRouter);
app.use('/api/events', aiRouter);

// Mount Student Chatbot RAG routes (Groq)
app.use('/api/rag', ragRouter);
app.use('/api/chat', ragRouter);


// User Signup with bcrypt password hashing
app.post('/signup', async (req, res) => {
  try {
    const { 
      username, 
      password, 
      name, 
      email, 
      rollNumber, 
      department, 
      semester, 
      role 
    }: { [key: string]: string } = req.body;

    if (!username || !password || !name || !email) {
      res.status(400).json({
        message: "Username, password, name, and email are required fields."
      });
      return;
    }

    const userExist = await userModel.findOne({
      $or: [{ username }, { email }]
    });

    if (userExist) {
      res.status(403).json({
        message: "User with this username or email already exists"
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({
      username,
      password: hashedPassword,
      name,
      email,
      rollNumber,
      department,
      semester,
      role: role || 'Student'
    });

    res.status(201).json({
      message: "User registered successfully",
      id: newUser._id
    });
  } catch (error: any) {
    console.error('Error in signup:', error);
    res.status(500).json({
      message: "Failed to register user",
      error: error.message
    });
  }
});

// User Signin with bcrypt comparison and JWT token generation
app.post('/signin', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({
        message: "Username and password are required."
      });
      return;
    }

    // Match against username, email, or rollNumber
    const user = await userModel.findOne({
      $or: [
        { username: username },
        { email: username },
        { rollNumber: username }
      ]
    });

    if (!user) {
      res.status(403).json({
        message: "Invalid credentials"
      });
      return;
    }

    // Compare with bcrypt hash
    let isPasswordValid = false;
    try {
      isPasswordValid = await bcrypt.compare(password, user.password);
    } catch {
      isPasswordValid = false;
    }

    // Backward-compatibility fallback for any pre-existing plain text password records
    if (!isPasswordValid && password === user.password) {
      isPasswordValid = true;
      // Upgrade plain text password to bcrypt hash in DB
      user.password = await bcrypt.hash(password, 10);
      await user.save();
    }

    if (!isPasswordValid) {
      res.status(403).json({
        message: "Invalid credentials"
      });
      return;
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Sign in successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        semester: user.semester,
        rollNumber: user.rollNumber
      }
    });
  } catch (error: any) {
    console.error('Error in signin:', error);
    res.status(500).json({
      message: "Server error during sign in",
      error: error.message
    });
  }
});


// Get current authenticated user profile
app.get('/api/users/me', authMiddleware, async (req: any, res) => {
  try {
    const user = await userModel.findById(req.userId).select('-password');
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json(user);
  } catch (error: any) {
    console.error('Error fetching current user profile:', error);
    res.status(500).json({ 
      message: 'Failed to retrieve user profile', 
      error: error.message 
    });
  }
});

//getting users 
app.get('/api/users', authMiddleware, async (req, res) => {
  try {
    const users = await userModel.find({}).select('-password');
    res.status(200).json(users);
  } catch (error: any) {
    console.error('Error fetching users:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to retrieve users from database', 
      error: error.message 
    });
  }
});

// updating user profile in DB
app.put('/api/users/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, department, semester, rollNumber } = req.body;

    const updatedUser = await userModel.findByIdAndUpdate(
      id,
      {
        ...(name && { name }),
        ...(email && { email }),
        ...(department && { department }),
        ...(semester && { semester }),
        ...(rollNumber && { rollNumber }),
      },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser
    });
  } catch (error: any) {
    console.error('Error updating user:', error);
    res.status(500).json({
      message: 'Failed to update profile',
      error: error.message
    });
  }
});


//sending Faq to DB
app.post('/api/faqs', authMiddleware, async (req, res) => {
  try {
    const { question, answer } = req.body;
    if (!question || !answer) {
      res.status(400).json({ 
        message: "Both question and answer fields are required." 
      });
      return;
    }
    const faqExist = await faqModel.findOne({ question });
    if (faqExist) {
      res.status(400).json({ 
        message: "This question already exists." 
      });
      return;
    }
    const newFaq = await faqModel.create({
      question,
      answer
    });
    res.status(201).json({
      message: "FAQ added successfully",
      id: newFaq._id
    });

  } catch (error: any) {
    console.error('Error creating FAQ:', error);
    res.status(500).json({ 
      message: 'Failed to save FAQ', 
      error: error.message 
    });
  }
});

// getting Faqs from DB
app.get('/api/faqs', async (req, res) => {
  try {
    const faqs = await faqModel.find({});
    res.status(200).json(faqs);
  } catch (error: any) {
    console.error('Error fetching FAQs:', error);
    res.status(500).json({ 
      message: 'Failed to retrieve FAQs from database', 
      error: error.message 
    });
  }
});

// updating a Faq in DB
app.put('/api/faqs/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { question, answer } = req.body;

    if (!question || !answer) {
      res.status(400).json({ 
        message: "Both question and answer fields are required." 
      });
      return;
    }

    let updatedFaq;
    if (mongoose.isValidObjectId(id)) {
      updatedFaq = await faqModel.findByIdAndUpdate(
        id,
        { question, answer },
        { new: true, runValidators: true }
      );
    } else {
      updatedFaq = await faqModel.findOneAndUpdate(
        { _id: id },
        { question, answer },
        { new: true, runValidators: true }
      );
    }

    if (!updatedFaq) {
      res.status(404).json({ message: "FAQ not found" });
      return;
    }

    res.status(200).json({
      message: "FAQ updated successfully",
      faq: updatedFaq
    });
  } catch (error: any) {
    console.error('Error updating FAQ:', error);
    res.status(500).json({ 
      message: 'Failed to update FAQ', 
      error: error.message 
    });
  }
});

// deleting a Faq from DB
app.delete('/api/faqs/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    let deletedFaq;

    if (mongoose.isValidObjectId(id)) {
      deletedFaq = await faqModel.findByIdAndDelete(id);
    } else {
      deletedFaq = await faqModel.findOneAndDelete({ _id: id });
    }

    if (!deletedFaq) {
      res.status(404).json({ message: "FAQ not found" });
      return;
    }

    res.status(200).json({
      message: "FAQ deleted successfully",
      id: deletedFaq._id
    });
  } catch (error: any) {
    console.error('Error deleting FAQ:', error);
    res.status(500).json({ 
      message: 'Failed to delete FAQ', 
      error: error.message 
    });
  }
});


// adding Event to DB
app.post('/api/events', authMiddleware, async (req, res) => {
  try {
    const {
      id,
      title,
      description,
      date,
      startTime,
      endTime,
      location,
      category,
      department,
      branch,
      semester,
      organizer,
      isImportant
    } = req.body;

    if (!title || !description || !date || !category) {
      res.status(400).json({ 
        message: "title, description, date, and category are required fields." 
      });
      return;
    }

    const dateRegex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/;
    if (!dateRegex.test(date)) {
      res.status(400).json({ 
        message: "Invalid date format. Expected DD-MM-YYYY format (e.g. 10-09-2026)." 
      });
      return;
    }

    const newEvent = await eventModel.create({
      id,
      title,
      description,
      date,
      startTime,
      endTime,
      location,
      category,
      department,
      branch,
      semester,
      organizer,
      isImportant
    });

    res.status(201).json({
      message: "Event added successfully",
      id: newEvent._id,
      event: newEvent
    });
  } catch (error: any) {
    console.error('Error creating event:', error);
    res.status(500).json({ 
      message: 'Failed to save event', 
      error: error.message 
    });
  }
});

// getting Events from DB
app.get('/api/events', async (req, res) => {
  try {
    const events = await eventModel.find({});
    res.status(200).json(events);
  } catch (error: any) {
    console.error('Error fetching events:', error);
    res.status(500).json({ 
      message: 'Failed to retrieve events from database', 
      error: error.message 
    });
  }
});

// updating an Event in DB
app.put('/api/events/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.body;

    if (date) {
      const dateRegex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/;
      if (!dateRegex.test(date)) {
        res.status(400).json({ 
          message: "Invalid date format. Expected DD-MM-YYYY format (e.g. 10-09-2026)." 
        });
        return;
      }
    }

    let updatedEvent;
    if (mongoose.isValidObjectId(id)) {
      updatedEvent = await eventModel.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    } else {
      updatedEvent = await eventModel.findOneAndUpdate({ id: Number(id) }, req.body, { new: true, runValidators: true });
    }

    if (!updatedEvent) {
      res.status(404).json({ message: "Event not found" });
      return;
    }

    res.status(200).json({
      message: "Event updated successfully",
      event: updatedEvent
    });
  } catch (error: any) {
    console.error('Error updating event:', error);
    res.status(500).json({ 
      message: 'Failed to update event', 
      error: error.message 
    });
  }
});

// deleting an Event from DB
app.delete('/api/events/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    let deletedEvent;

    if (mongoose.isValidObjectId(id)) {
      deletedEvent = await eventModel.findByIdAndDelete(id);
    } else {
      deletedEvent = await eventModel.findOneAndDelete({ id: Number(id) });
    }

    if (!deletedEvent) {
      res.status(404).json({ message: "Event not found" });
      return;
    }

    res.status(200).json({
      message: "Event deleted successfully",
      id: deletedEvent._id
    });
  } catch (error: any) {
    console.error('Error deleting event:', error);
    res.status(500).json({ 
      message: 'Failed to delete event', 
      error: error.message 
    });
  }
});

// ==========================================
// STUDENT PERSONAL SCHEDULE ENDPOINTS
// ==========================================

// Add an event to student's personal schedule
app.post('/api/schedule', authMiddleware, async (req: any, res) => {
  try {
    const userId = req.userId;
    const { eventId, event: passedEvent, notes } = req.body;

    if (!eventId && !passedEvent) {
      res.status(400).json({ message: "Either 'eventId' or 'event' data is required." });
      return;
    }

    let targetEvent: any = passedEvent;
    let mongoEventId: any = null;
    let customId: number | undefined = undefined;

    // Look up event from database if eventId is provided
    if (eventId) {
      if (mongoose.isValidObjectId(eventId)) {
        const found = await eventModel.findById(eventId);
        if (found) {
          targetEvent = found;
          mongoEventId = found._id;
          customId = found.id;
        }
      } else if (!isNaN(Number(eventId))) {
        const found = await eventModel.findOne({ id: Number(eventId) });
        if (found) {
          targetEvent = found;
          mongoEventId = found._id;
          customId = found.id;
        }
      }
    }

    if (!targetEvent) {
      res.status(404).json({ message: "Event not found to add to schedule." });
      return;
    }

    if (!mongoEventId && targetEvent._id && mongoose.isValidObjectId(targetEvent._id)) {
      mongoEventId = targetEvent._id;
    }
    if (customId === undefined && targetEvent.id !== undefined && !isNaN(Number(targetEvent.id))) {
      customId = Number(targetEvent.id);
    }

    // Check for existing schedule item for this user
    const duplicateOrFilter: any[] = [];
    if (mongoEventId) duplicateOrFilter.push({ eventId: mongoEventId });
    if (customId !== undefined) duplicateOrFilter.push({ eventCustomId: customId });
    if (targetEvent.title && targetEvent.date) {
      duplicateOrFilter.push({ "event.title": targetEvent.title, "event.date": targetEvent.date });
    }

    const existingSchedule = await scheduleModel.findOne({
      userId,
      ...(duplicateOrFilter.length > 0 ? { $or: duplicateOrFilter } : {})
    });

    if (existingSchedule) {
      res.status(409).json({
        message: "This event is already in your schedule.",
        schedule: existingSchedule,
        alreadyAdded: true
      });
      return;
    }

    // Create schedule item
    const newSchedule = await scheduleModel.create({
      userId,
      eventId: mongoEventId || undefined,
      eventCustomId: customId,
      event: {
        id: customId,
        title: targetEvent.title,
        description: targetEvent.description || "",
        date: targetEvent.date,
        startTime: targetEvent.startTime || "",
        endTime: targetEvent.endTime || "",
        location: targetEvent.location || "",
        category: targetEvent.category || "event",
        department: targetEvent.department || "",
        branch: Array.isArray(targetEvent.branch) ? targetEvent.branch : [],
        semester: Array.isArray(targetEvent.semester) ? targetEvent.semester : [],
        organizer: targetEvent.organizer || "",
        isImportant: Boolean(targetEvent.isImportant)
      },
      notes: notes || "",
      addedAt: new Date()
    });

    res.status(201).json({
      message: "Event added to your schedule successfully!",
      schedule: newSchedule
    });
  } catch (error: any) {
    console.error('Error adding event to schedule:', error);
    res.status(500).json({
      message: "Failed to add event to schedule",
      error: error.message
    });
  }
});

// Fetch all events scheduled by the authenticated student
app.get('/api/schedule', authMiddleware, async (req: any, res) => {
  try {
    const userId = req.userId;
    const schedules = await scheduleModel.find({ userId }).sort({ addedAt: -1 });

    res.status(200).json(schedules);
  } catch (error: any) {
    console.error('Error fetching student schedule:', error);
    res.status(500).json({
      message: "Failed to retrieve your schedule",
      error: error.message
    });
  }
});

// Remove an event from the authenticated student's schedule
app.delete('/api/schedule/:id', authMiddleware, async (req: any, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const matchConditions: any[] = [];
    if (mongoose.isValidObjectId(id)) {
      matchConditions.push({ _id: id });
      matchConditions.push({ eventId: id });
    }
    if (!isNaN(Number(id))) {
      matchConditions.push({ eventCustomId: Number(id) });
    }
    if (matchConditions.length === 0) {
      matchConditions.push({ _id: id });
    }

    const deletedItem = await scheduleModel.findOneAndDelete({
      userId,
      $or: matchConditions
    });

    if (!deletedItem) {
      res.status(404).json({ message: "Schedule item not found in your schedule." });
      return;
    }

    res.status(200).json({
      message: "Event removed from your schedule successfully",
      id: deletedItem._id
    });
  } catch (error: any) {
    console.error('Error removing event from schedule:', error);
    res.status(500).json({
      message: "Failed to remove event from schedule",
      error: error.message
    });
  }
});

//serving port
app.listen(port,()=>{
    console.log(`Running on Port: ${port}`);
})

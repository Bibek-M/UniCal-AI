import express from 'express'
import jwt from 'jsonwebtoken'
const app=express();
app.use(express.json());
import {userModel} from './models.ts';
import cors from 'cors'
const port =3000;
app.use(cors());
import { connectDB } from './db';
await connectDB();
app.post('/signup',async (req,res)=>{
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
    const userExist =await userModel.findOne({
        username:username,
        password:password
    });
    if(userExist){
        res.status(403).json({
            message:"User already  Exist"
        })
        return ;
    }
    // users.push({
    //     username:username,
    //     password:password
    // })
    // res.json({
    //     message:"New user registered"
    // })
    const newUser = await userModel.create({
  username,
  password,
  name,
  email,
  rollNumber,
  department,
  semester,
  role 
});
    res.json({
       id:newUser._id
    })
})
// app.post('/signin',(req,res)=>{
//      const username:string= req.body.username;
//     const password:string= req.body.password;
//     const userExist = users.find (user=>user.username==username && user.password==password);
//     if(!userExist){
//         res.status(403).json({
//             message:"User Does not Exist"
//         })
//         return ;
//     }
//     const token = jwt.sign(
//       {
//         username: username,
//       },
//       "This is sec"
//     );
//     res.json({
//         token:token
//     })
// })


//getting users 
app.get('/api/users', async (req, res) => {
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

app.listen(port,()=>{
    console.log(`Running on Port: ${port}`);
})

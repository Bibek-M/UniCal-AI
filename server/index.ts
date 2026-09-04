import express from 'express'
import jwt from 'jsonwebtoken'
const app=express();
app.use(express.json());

const port =3000;
interface User {
  username: string;
  password: string;
}
const users: User[] = [];
app.post('/signup',(req,res)=>{
    const username :string= req.body.username;
    const password: string= req.body.password;
    const userExist = users.find (user=>user.username===username && user.password===password);
    if(userExist){
        res.status(403).json({
            message:"User already  Exist"
        })
        return ;
    }
    users.push({
        username:username,
        password:password
    })
    res.json({
        message:"New user registered"
    })
})
app.post('/signin',(req,res)=>{
     const username:string= req.body.username;
    const password:string= req.body.password;
    const userExist = users.find (user=>user.username==username && user.password==password);
    if(!userExist){
        res.status(403).json({
            message:"User Does not Exist"
        })
        return ;
    }
    const token = jwt.sign(
      {
        username: username,
      },
      "This is sec"
    );
    res.json({
        token:token
    })
})
app.listen(port,()=>{
    console.log(`Running on Port: ${port}`);
})
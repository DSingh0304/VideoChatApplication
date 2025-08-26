import User from "../models/user.js"
import jwt from "jsonwebtoken";
export async function signup(req, res) {
    const { email, password, fullName } = req.body;

    try {
        if (!email || !password || !fullName) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message: "User already exists :) Try different email."});
        }

        const idx = Math.floor(Math.random()*100) + 1; // generate a number between 1-100
        const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`

        const newUser = new User.create({
            email,
            fullName,
            password,
            profilePic: randomAvatar,
        })

        // TODO: Create user in stearm as well

        const token = jwt.sign({userID:newUser._id},process.env.JWT_SECRET_KEY,{
            expiresIn:"7d",
        })

        res.cookie('jwt',token,{
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true, // Prevents XCSS attack
            sameSite: "strict", // Prevents CSRF attack
            secure: process.env.NODE_ENV === "production",
        })

        res.status(201).json({success:true , user:newUser });

    } catch (error) {
        console.log("Error in signup controller" , error);
        return res.status(500).json({message: "Internal Server Error"});
    }

}
export async function login(req, res){
    res.send("Login Route");

}
export function logout(req, res) {
    res.send("Logout Route");
}
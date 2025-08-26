import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName: {
        typeof: String,
        required: true,
    },
    email: {
        typeof: String,
        required: true,
        unique: true,
    },
    password: {
        typeof: String,
        required: true,
        minLength: 6,
    },
    bio: {
        typeof: String,
        defalut: "",
    },
    profilePic: {
        typeof: String,
        defalut: "",
    },
    nativeLanguage: {
        typeof: String,
        defalut: "",
    },
    isOnBoarded: {
        typeof: Boolean,
        defalut: false,
    },
    friends: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    ]

}, { timestamps: true });

const User = mongoose.model("User", userSchema);

//  pre save hook - hashing of password

userSchema.pre("save" , async function(next){
    if(!this.isModified("password")) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password,salt);
        next();
    } catch (error){
          next(error);
    }
})

export default User;
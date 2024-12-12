import mongoose from "mongoose"
import bcrypt from "bcryptjs"

export interface IUser extends mongoose.Document {
  username: string
  email: string
  password: string
  createdAt: Date
  lastLogin: Date
  gameProgress?: {
    level: number
    experience: number
    achievements: string[]
  }
  settings?: {
    theme: "light" | "dark"
    notifications: boolean
    sound: boolean
  }
  comparePassword(candidatePassword: string): Promise<boolean>
}

const userSchema = new mongoose.Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, "Please provide a username"],
      unique: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters long"],
      maxlength: [20, "Username cannot be more than 20 characters"],
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [8, "Password must be at least 8 characters long"],
      select: false, // Don't include password in queries by default
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    gameProgress: {
      level: {
        type: Number,
        default: 1,
      },
      experience: {
        type: Number,
        default: 0,
      },
      achievements: {
        type: [String],
        default: [],
      },
    },
    settings: {
      theme: {
        type: String,
        enum: ["light", "dark"],
        default: "dark",
      },
      notifications: {
        type: Boolean,
        default: true,
      },
      sound: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: true,
  }
)

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()

  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error: any) {
    next(error)
  }
})

// Method to compare password
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password)
  } catch (error) {
    throw new Error("Password comparison failed")
  }
}

// Delete password when converting to JSON
userSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.password
    return ret
  },
})

export const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema)
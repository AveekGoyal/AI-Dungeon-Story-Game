import mongoose from "mongoose"

export interface ICharacter extends mongoose.Document {
  userId: mongoose.Types.ObjectId
  name: string
  class: string
  stats: {
    strength: number
    intelligence: number
    health: number
    agility: number
    magic: number
  }
  abilities: {
    name: string
    description: string
    type: "attack" | "defense" | "utility" | "special"
    damage?: number
    healing?: number
    effects?: string[]
  }[]
  status: {
    currentHealth: number
    maxHealth: number
    currentMagic: number
    maxMagic: number
    isAlive: boolean
  }
  backstory?: string
  traits?: string[]
  createdAt: Date
  updatedAt: Date
}

const characterSchema = new mongoose.Schema<ICharacter>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    class: {
      type: String,
      required: true,
      enum: [
        "fire-mage",
        "dark-mage",
        "light-mage",
        "archer",
        "crimson",
        "rapier",
        "swordsmen",
      ],
    },
    stats: {
      strength: {
        type: Number,
        default: 5,
        min: 1,
        max: 10,
      },
      intelligence: {
        type: Number,
        default: 5,
        min: 1,
        max: 10,
      },
      health: {
        type: Number,
        default: 5,
        min: 1,
        max: 10,
      },
      agility: {
        type: Number,
        default: 5,
        min: 1,
        max: 10,
      },
      magic: {
        type: Number,
        default: 5,
        min: 1,
        max: 10,
      },
    },
    abilities: [{
      name: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        enum: ["attack", "defense", "utility", "special"],
        required: true,
      },
      damage: Number,
      healing: Number,
      effects: [String],
    }],
    status: {
      currentHealth: {
        type: Number,
        min: 0,
      },
      maxHealth: {
        type: Number,
        min: 1,
      },
      currentMagic: {
        type: Number,
        min: 0,
      },
      maxMagic: {
        type: Number,
        min: 1,
      },
      isAlive: {
        type: Boolean,
        default: true,
      },
    },
    backstory: String,
    traits: [String],
  },
  {
    timestamps: true,
  }
)

// Initialize character status based on stats
characterSchema.pre('save', function(next) {
  if (this.isNew) {
    const healthMultiplier = 10
    const magicMultiplier = 8
    
    this.status = {
      currentHealth: this.stats.health * healthMultiplier,
      maxHealth: this.stats.health * healthMultiplier,
      currentMagic: this.stats.magic * magicMultiplier,
      maxMagic: this.stats.magic * magicMultiplier,
      isAlive: true,
    }
  }
  next()
})

export const Character = mongoose.models.Character || mongoose.model<ICharacter>("Character", characterSchema)

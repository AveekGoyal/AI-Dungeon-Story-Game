import mongoose from "mongoose"

export interface IGenre extends mongoose.Document {
  name: string
  description: string
  availableClasses: string[]
  themeSettings: {
    colorPalette: string[]
    environmentTypes: string[]
  }
  imageUrl: string
}

const genreSchema = new mongoose.Schema<IGenre>(
  {
    name: {
      type: String,
      required: [true, "Please provide a genre name"],
      enum: ["Fantasy", "Dark Fantasy", "Epic Fantasy", "Mythological"],
      unique: true,
    },
    description: {
      type: String,
      required: [true, "Please provide a genre description"],
    },
    availableClasses: [{
      type: String,
      enum: ["Fire Mage", "Dark Mage", "Light Mage", "Wizard", "Enchantress", "Crimson"],
    }],
    themeSettings: {
      colorPalette: [String],
      environmentTypes: [String],
    },
    imageUrl: {
      type: String,
      required: [true, "Please provide a genre image"],
    },
  }
)

// Predefined genres
export const PREDEFINED_GENRES = [
  {
    name: "Fantasy",
    description: "A classic fantasy setting with magic, dragons, and epic quests.",
    availableClasses: ["Fire Mage", "Light Mage", "Wizard"],
    themeSettings: {
      colorPalette: ["#FFD700", "#228B22", "#4169E1"],
      environmentTypes: ["Forest", "Castle", "Village", "Mountain"],
    },
    imageUrl: "/images/genres/fantasy.jpg",
  },
  {
    name: "Dark Fantasy",
    description: "A darker realm where shadows lurk and danger awaits at every turn.",
    availableClasses: ["Dark Mage", "Crimson", "Enchantress"],
    themeSettings: {
      colorPalette: ["#800000", "#483D8B", "#2F4F4F"],
      environmentTypes: ["Dungeon", "Cursed Forest", "Ruins", "Crypt"],
    },
    imageUrl: "/images/genres/dark-fantasy.jpg",
  },
  {
    name: "Epic Fantasy",
    description: "Grand adventures across vast landscapes with world-changing stakes.",
    availableClasses: ["Fire Mage", "Light Mage", "Wizard", "Enchantress"],
    themeSettings: {
      colorPalette: ["#DAA520", "#20B2AA", "#9370DB"],
      environmentTypes: ["Kingdom", "Desert", "Ocean", "Sky City"],
    },
    imageUrl: "/images/genres/epic-fantasy.jpg",
  },
  {
    name: "Mythological",
    description: "Stories inspired by ancient myths and legends.",
    availableClasses: ["Light Mage", "Wizard", "Enchantress", "Crimson"],
    themeSettings: {
      colorPalette: ["#C0C0C0", "#CD853F", "#6B8E23"],
      environmentTypes: ["Temple", "Sacred Grove", "Ancient City", "Divine Realm"],
    },
    imageUrl: "/images/genres/mythological.jpg",
  },
]

export const Genre = mongoose.models.Genre || mongoose.model<IGenre>("Genre", genreSchema)

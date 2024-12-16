import mongoose, { Document } from 'mongoose';
import { StoryContext, ChoiceHistory, ChapterContext, NarrativeContext } from '@/types/story-context';

// Interface for the Story document
interface IStory extends Document {
  userId: string;
  title: string;
  description: string;
  genre: {
    name: string;
    description: string;
  };
  character: {
    name: string;
    class: string;
    stats: {
      strength: number;
      intelligence: number;
      healthPoints: number;
      agility: number;
      magicPoints: number;
      specialAttacks: string[];
    };
  };
  context?: StoryContext;
  currentChapter: number;
  currentPage: number;
}

const ChoiceHistorySchema = new mongoose.Schema<ChoiceHistory>({
  chapterNumber: { type: Number, required: true },
  pageNumber: { type: Number, required: true },
  choiceText: { type: String, required: true },
  timestamp: { type: String, required: true }
});

const ChapterContextSchema = new mongoose.Schema<ChapterContext>({
  chapterNumber: { type: Number, required: true },
  summary: { type: String, required: true },
  keyEvents: { type: [String], required: true },
  theme: { type: String, required: true }
});

const NarrativeContextSchema = new mongoose.Schema<NarrativeContext>({
  mainPlotPoints: { type: [String], required: true },
  characterDevelopment: { type: [String], required: true },
  currentTheme: { type: String, required: true }
});

const StoryContextSchema = new mongoose.Schema<StoryContext>({
  currentChapterContext: { type: ChapterContextSchema, required: true },
  previousChoices: { type: [ChoiceHistorySchema], required: true },
  narrativeContext: { type: NarrativeContextSchema, required: true },
  lastUpdated: { type: String, required: true }
});

const StorySchema = new mongoose.Schema<IStory>({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  genre: {
    name: { type: String, required: true },
    description: { type: String, required: true }
  },
  character: {
    name: { type: String, required: true },
    class: { type: String, required: true },
    stats: {
      strength: { type: Number, required: true },
      intelligence: { type: Number, required: true },
      healthPoints: { type: Number, required: true },
      agility: { type: Number, required: true },
      magicPoints: { type: Number, required: true },
      specialAttacks: { type: [String], required: true }
    }
  },
  context: { type: StoryContextSchema, required: false },
  currentChapter: { type: Number, default: 1 },
  currentPage: { type: Number, default: 1 }
}, {
  timestamps: true
});

export const Story = (mongoose.models.Story || mongoose.model<IStory>('Story', StorySchema)) as mongoose.Model<IStory>;

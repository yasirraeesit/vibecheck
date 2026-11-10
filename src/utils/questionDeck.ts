import rawQuestions from '../data/partyQuestions.json';
import { PartyQuestion } from '../types/telemetry';

export class QuestionDeck {
  private questions: PartyQuestion[] = [];
  private activeCategory: string = 'all';
  private customQueue: PartyQuestion[] = [];
  private currentIndex: number = 0;

  constructor() {
    this.questions = rawQuestions as PartyQuestion[];
    this.shuffle();
  }

  public getAvailableCategories(): string[] {
    return ['all', 'spicy', 'funny', 'absurd'];
  }

  public filterByCategory(category: string): void {
    this.activeCategory = category;
    this.shuffle();
    this.currentIndex = 0;
  }

  public addCustomQuestion(text: string): void {
    const customQuestion: PartyQuestion = {
      id: `custom-${Date.now()}`,
      text: text.trim(),
      category: 'custom',
    };
    this.customQueue.unshift(customQuestion);
  }

  public drawNext(): PartyQuestion {
    if (this.customQueue.length > 0) {
      return this.customQueue.shift()!;
    }

    const eligible = this.activeCategory === 'all'
      ? this.questions
      : this.questions.filter((q) => q.category === this.activeCategory);

    if (eligible.length === 0) {
      return {
        id: 'fallback-1',
        text: 'Are you hiding any secrets right now?',
        category: 'spicy',
      };
    }

    const question = eligible[this.currentIndex % eligible.length];
    this.currentIndex++;
    return question;
  }

  public shuffle(): void {
    const array = [...this.questions];
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    this.questions = array;
  }
}


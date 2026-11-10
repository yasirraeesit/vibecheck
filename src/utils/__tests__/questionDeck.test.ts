import { QuestionDeck } from '../questionDeck';

describe('QuestionDeck', () => {
  it('loads and draws questions across categories', () => {
    const deck = new QuestionDeck();
    const q = deck.drawNext();
    expect(q.text.length).toBeGreaterThan(10);
    expect(['spicy', 'funny', 'absurd', 'custom']).toContain(q.category);
  });

  it('allows injecting a custom interrogation question and draws it first', () => {
    const deck = new QuestionDeck();
    deck.addCustomQuestion('Did you steal my sandwich from the breakroom?');
    const custom = deck.drawNext();
    expect(custom.text).toBe('Did you steal my sandwich from the breakroom?');
    expect(custom.category).toBe('custom');
  });

  it('filters questions by category', () => {
    const deck = new QuestionDeck();
    deck.filterByCategory('spicy');
    const q1 = deck.drawNext();
    expect(q1.category).toBe('spicy');
  });

  it('returns available categories', () => {
    const deck = new QuestionDeck();
    const categories = deck.getAvailableCategories();
    expect(categories).toContain('all');
    expect(categories).toContain('spicy');
    expect(categories).toContain('funny');
    expect(categories).toContain('absurd');
  });
});

import { useEffect, useState } from 'react';
import API from '../services/api';

interface CategorySuggestions {
  category: string;
  items: string[];
}

function parseSuggestions(raw: string): CategorySuggestions[] {
  const lines = raw.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const categories: CategorySuggestions[] = [];
  let currentCategory = '';
  let currentItems: string[] = [];
  for (const line of lines) {
    const categoryMatch = line.match(/^\*\*(.+)\*\*:?$/);
    if (categoryMatch) {
      if (currentCategory && currentItems.length) {
        categories.push({ category: currentCategory, items: currentItems });
      }
      currentCategory = categoryMatch[1];
      currentItems = [];
    } else if (/^\d+\.\s+/.test(line)) {
      currentItems.push(line.replace(/^\d+\.\s+/, ''));
    }
  }
  if (currentCategory && currentItems.length) {
    categories.push({ category: currentCategory, items: currentItems });
  }
  return categories;
}

export default function Suggestions() {
  const [categories, setCategories] = useState<CategorySuggestions[]>([]);

  useEffect(() => {
    API.post('/suggestions', { prompt: 'Suggest items for my cart' })
      .then((res) => {
        const suggestions = res.data.suggestions;
        if (typeof suggestions === 'string') {
          setCategories(parseSuggestions(suggestions));
        } else {
          setCategories([]);
        }
      })
      .catch(() => alert('Could not fetch suggestions'));
  }, []);

  return (
    <div>
      <h3>💡 Smart Suggestions</h3>
      {categories.length === 0 ? (
        <p>No suggestions available.</p>
      ) : (
        categories.map((cat, idx) => (
          <div key={idx} style={{ marginBottom: '1em' }}>
            <strong>{cat.category}</strong>
            <ul>
              {cat.items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}

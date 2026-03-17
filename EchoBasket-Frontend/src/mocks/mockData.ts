// src/mocks/mockData.ts

import { CartItem, Recommendation, Product } from '@/types';

/**
 * Mock Products Database
 */
export const mockProducts: Record<string, Product> = {
  'apples': {
    id: 'apples',
    name: 'Fresh Apples',
    price: 3.99,
    category: 'Fruits',
    description: 'Crisp and juicy red apples, perfect for snacking',
    image: '🍎',
  },
  'bananas': {
    id: 'bananas',
    name: 'Organic Bananas',
    price: 2.49,
    category: 'Fruits',
    description: 'Ripe organic bananas, excellent source of potassium',
    image: '🍌',
  },
  'milk': {
    id: 'milk',
    name: 'Whole Milk',
    price: 4.29,
    category: 'Dairy',
    description: 'Fresh whole milk, 1 gallon',
    image: '🥛',
  },
  'bread': {
    id: 'bread',
    name: 'Whole Wheat Bread',
    price: 3.49,
    category: 'Bakery',
    description: 'Hearty whole wheat bread, freshly baked',
    image: '🍞',
  },
  'eggs': {
    id: 'eggs',
    name: 'Farm Fresh Eggs',
    price: 5.99,
    category: 'Dairy',
    description: 'Dozen free-range eggs',
    image: '🥚',
  },
  'cheese': {
    id: 'cheese',
    name: 'Cheddar Cheese',
    price: 7.99,
    category: 'Dairy',
    description: 'Sharp aged cheddar cheese',
    image: '🧀',
  },
  'yogurt': {
    id: 'yogurt',
    name: 'Greek Yogurt',
    price: 6.49,
    category: 'Dairy',
    description: 'Plain Greek yogurt, high in protein',
    image: '🥣',
  },
  'tomatoes': {
    id: 'tomatoes',
    name: 'Cherry Tomatoes',
    price: 4.99,
    category: 'Vegetables',
    description: 'Sweet cherry tomatoes, vine-ripened',
    image: '🍅',
  },
  'carrots': {
    id: 'carrots',
    name: 'Baby Carrots',
    price: 2.99,
    category: 'Vegetables',
    description: 'Fresh baby carrots, great for snacking',
    image: '🥕',
  },
  'broccoli': {
    id: 'broccoli',
    name: 'Fresh Broccoli',
    price: 3.49,
    category: 'Vegetables',
    description: 'Vibrant green broccoli crowns',
    image: '🥦',
  },
  'coffee': {
    id: 'coffee',
    name: 'Premium Coffee Beans',
    price: 9.99,
    category: 'Beverages',
    description: 'Single-origin arabica coffee beans',
    image: '☕',
  },
  'tea': {
    id: 'tea',
    name: 'Green Tea',
    price: 6.99,
    category: 'Beverages',
    description: 'Organic green tea, 20 bags',
    image: '🍵',
  },
};

/**
 * Mock Cart Items
 */
export const mockCartItems: CartItem[] = [
  { ...mockProducts.apples, quantity: 2 },
  { ...mockProducts.bread, quantity: 1 },
];

/**
 * Generate mock recommendations based on cart items
 */
export const generateMockRecommendations = (
  cartItems: CartItem[],
  limit: number = 8,
): Recommendation[] => {
  const recommendations: Recommendation[] = [];
  const usedIds = new Set(cartItems.map((item) => item.id));

  // Product pairing logic
  const pairingRules: Record<string, string[]> = {
    apples: ['cheese', 'yogurt'],
    bananas: ['yogurt', 'milk'],
    milk: ['eggs', 'cheese', 'yogurt'],
    bread: ['cheese', 'tomatoes', 'butter'],
    eggs: ['milk', 'cheese', 'bread'],
    cheese: ['apples', 'bread', 'tomatoes'],
    yogurt: ['berries', 'granola'],
    tomatoes: ['cheese', 'bread', 'basil'],
    carrots: ['broccoli', 'milk'],
    broccoli: ['carrots', 'cheese'],
    coffee: ['milk', 'sugar'],
    tea: ['honey', 'lemon'],
  };

  // Collect all paired products
  for (const item of cartItems) {
    const paired = pairingRules[item.id] || [];
    for (const pairedId of paired) {
      if (!usedIds.has(pairedId) && mockProducts[pairedId]) {
        const product = mockProducts[pairedId];
        recommendations.push({
          ...product,
          relevance: 0.85 + Math.random() * 0.15,
          reason: `Pairs well with ${item.name}`,
        });
        usedIds.add(pairedId);
      }
    }
  }

  // Add random products if needed
  const allProducts = Object.values(mockProducts);
  while (recommendations.length < limit && recommendations.length < allProducts.length) {
    const randomProduct =
      allProducts[Math.floor(Math.random() * allProducts.length)];
    if (!usedIds.has(randomProduct.id)) {
      recommendations.push({
        ...randomProduct,
        relevance: 0.6 + Math.random() * 0.25,
        reason: 'Popular item',
      });
      usedIds.add(randomProduct.id);
    }
  }

  return recommendations.slice(0, limit);
};

/**
 * Parse voice input to extract product
 */
export const parseVoiceToProduct = (input: string): Product | null => {
  const lowerInput = input.toLowerCase();

  // Simple keyword matching
  for (const [key, product] of Object.entries(mockProducts)) {
    if (lowerInput.includes(product.name.toLowerCase()) ||
        lowerInput.includes(key)) {
      return product;
    }
  }

  // Fuzzy matching for misspellings
  const words = lowerInput.split(/\s+/);
  for (const word of words) {
    if (word.length > 2) {
      for (const product of Object.values(mockProducts)) {
        if (
          product.name.toLowerCase().includes(word) ||
          product.category?.toLowerCase().includes(word)
        ) {
          return product;
        }
      }
    }
  }

  return null;
};

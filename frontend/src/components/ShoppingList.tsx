import React, { useEffect, useState, useRef } from 'react';
import API from '../services/api';

interface Item {
  id: string;
  name: string;
  quantity: number;
  category?: string;
  brand?: string;
  price?: number;
}

const ShoppingList: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const nameRef = useRef<HTMLInputElement>(null);
  const quantityRef = useRef<HTMLInputElement>(null);

  const fetchList = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await API.get('/cart', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const itemsArr: Item[] = Object.values(res.data).map((item) => {
        const typedItem = item as Item;
        return {
          id: typedItem.id || typedItem.name || String(Date.now()),
          name: typedItem.name || 'Unnamed Item',
          quantity: typedItem.quantity || 1,
          category: typedItem.category,
          brand: typedItem.brand,
          price: typedItem.price,
        };
      });
      setItems(itemsArr);
    } catch {
      alert('Failed to load shopping list');
    }
  };

  useEffect(() => {
    fetchList();
    const handler = () => fetchList();
    window.addEventListener('cart-updated', handler);
    return () => window.removeEventListener('cart-updated', handler);
  }, []);

  const addItem = async () => {
    const name = nameRef.current?.value?.trim();
    const quantity = Number(quantityRef.current?.value) || 1;
    if (!name) {
      alert('Enter item name');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const item = { id: Date.now().toString(), name, quantity };
      await API.post('/cart', { item }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      fetchList();
      if (nameRef.current) nameRef.current.value = '';
      if (quantityRef.current) quantityRef.current.value = '';
    } catch {
      alert('Failed to add item');
    }
  };

  const updateItem = async (id: string, quantity: number) => {
    try {
      const token = localStorage.getItem('token');
      const item = items.find((i) => i.id === id);
      if (!item) return;
      await API.put(`/cart/${id}`, { item: { ...item, quantity } }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      fetchList();
    } catch {
      alert('Failed to update item');
    }
  };

  const deleteItem = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      await API.delete(`/cart/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      fetchList();
    } catch {
      alert('Failed to delete item');
    }
  };

  return (
    <div
      style={{
        // width: '100%',
        // maxWidth: 900,
        margin: '2em auto',
        background: '#23232a',
        borderRadius: 16,
        boxShadow: '0 2px 16px #0004',
        padding: '2.5em',
        color: '#e5e7eb',
        fontFamily: "'Inter', sans-serif",
        userSelect: 'none',
      }}
    >
      <h3
        style={{
          textAlign: 'center',
          color: '#a5b4fc',
          marginBottom: '2em',
          fontSize: '2em',
          fontWeight: 700,
        }}
      >
        🛒 Your Shopping List
      </h3>

      <div
        style={{
          display: 'flex',
          gap: '1em',
          marginBottom: '2em',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}
      >
        <input
          ref={nameRef}
          placeholder="Item name"
          style={{
            flex: 2,
            minWidth: 180,
            padding: '0.7em',
            borderRadius: 8,
            border: '1px solid #444',
            background: '#18181b',
            color: '#e5e7eb',
          }}
        />
        <input
          ref={quantityRef}
          type="number"
          min={1}
          placeholder="Qty"
          style={{
            width: 80,
            padding: '0.7em',
            borderRadius: 8,
            border: '1px solid #444',
            background: '#18181b',
            color: '#e5e7eb',
          }}
        />
        <button
          type="button"
          onClick={addItem}
          style={{
            background: '#6366f1',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '0.7em 1.5em',
            fontWeight: 600,
            fontSize: '1em',
            boxShadow: '0 1px 4px #0002',
            cursor: 'pointer',
            userSelect: 'none',
            transition: 'background-color 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#4f46e5';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#6366f1';
          }}
        >
          Add
        </button>
      </div>

      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
        }}
      >
        {items.length === 0 ? (
          <li
            style={{
              textAlign: 'center',
              color: '#888',
              fontSize: '1.1em',
              userSelect: 'text',
            }}
          >
            No items in cart.
          </li>
        ) : (
          items.map((i) => (
            <li
              key={i.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: '#18181b',
                borderRadius: 10,
                marginBottom: 12,
                padding: '1em 1.5em',
                boxShadow: '0 1px 8px #0002',
                border: '1px solid #23232a',
                userSelect: 'text',
              }}
            >
              <div>
                <strong
                  style={{
                    color: '#a5b4fc',
                    fontSize: '1.1em',
                  }}
                >
                  {i.name}
                </strong>{' '}
                <span
                  style={{
                    color: '#facc15',
                    fontWeight: 500,
                    marginLeft: 4,
                    marginRight: 10,
                  }}
                >
                  x{i.quantity}
                </span>
                <span
                  style={{
                    fontSize: 13,
                    color: '#aaa',
                    whiteSpace: 'nowrap',
                  }}
                >
                  ({i.category || 'uncategorized'})
                </span>
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => updateItem(i.id, i.quantity + 1)}
                  aria-label={`Increase quantity of ${i.name}`}
                  style={{
                    marginRight: 6,
                    background: '#6366f1',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 6,
                    padding: '0.4em 1em',
                    cursor: 'pointer',
                    fontWeight: 600,
                    transition: 'background-color 0.25s ease',
                    userSelect: 'none',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#4f46e5')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#6366f1')}
                >
                  +
                </button>
                <button
                  type="button"
                  onClick={() => updateItem(i.id, Math.max(1, i.quantity - 1))}
                  aria-label={`Decrease quantity of ${i.name}`}
                  style={{
                    marginRight: 6,
                    background: '#f87171',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 6,
                    padding: '0.4em 1em',
                    cursor: 'pointer',
                    fontWeight: 600,
                    transition: 'background-color 0.25s ease',
                    userSelect: 'none',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#dc2626')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f87171')}
                >
                  -
                </button>
                <button
                  type="button"
                  onClick={() => deleteItem(i.id)}
                  aria-label={`Remove ${i.name} from list`}
                  style={{
                    background: '#f43f5e',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 6,
                    padding: '0.4em 1em',
                    cursor: 'pointer',
                    fontWeight: 600,
                    transition: 'background-color 0.25s ease',
                    userSelect: 'none',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e11d48')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f43f5e')}
                >
                  Remove
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default ShoppingList;

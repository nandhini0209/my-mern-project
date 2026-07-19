import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  function addItem(book, quantity = 1) {
    setItems((prev) => {
      const existing = prev.find((i) => i.bookId === book._id);
      if (existing) {
        return prev.map((i) =>
          i.bookId === book._id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [
        ...prev,
        {
          bookId: book._id,
          title: book.title,
          author: book.author,
          price: book.price,
          image: book.image,
          quantity,
        },
      ];
    });
  }

  function updateQuantity(bookId, quantity) {
    if (quantity <= 0) {
      removeItem(bookId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.bookId === bookId ? { ...i, quantity } : i))
    );
  }

  function removeItem(bookId) {
    setItems((prev) => prev.filter((i) => i.bookId !== bookId));
  }

  function clearCart() {
    setItems([]);
  }

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const value = { items, addItem, updateQuantity, removeItem, clearCart, totalItems, totalPrice };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}

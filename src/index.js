import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

// Pizza Component
function Pizza({ pizza, onOrder }) {
  return (
    <li className="pizza">
      <img src={pizza.image} alt={pizza.name} />
      <div>
        <h3>{pizza.name}</h3>
        <p>{pizza.ingredients}</p>
      </div>
      <span>${pizza.price}</span>
      <button className="btn" onClick={() => onOrder(pizza)}>
        Order
      </button>
    </li>
  );
}

// Pizza Data
const pizzaData = [
  { name: "Margherita", ingredients: "Tomato, mozzarella, basil", price: 10, image: process.env.PUBLIC_URL + "/pizzas/margherita.jpg" },
  { name: "Spinaci", ingredients: "Spinach, ricotta, tomato sauce", price: 12, image: process.env.PUBLIC_URL + "/pizzas/spinaci.jpg" },
  { name: "Pepperoni", ingredients: "Spicy pepperoni, mozzarella, tomato sauce", price: 14, image: process.env.PUBLIC_URL + "/pizzas/salamino.jpg" },
  { name: "Funghi", ingredients: "Mushrooms, mozzarella, tomato sauce", price: 11, image: process.env.PUBLIC_URL + "/pizzas/funghi.jpg" },
  { name: "Focaccia", ingredients: "Olives, cherry tomatoes, garlic, or herbs", price: 15, image: process.env.PUBLIC_URL + "/pizzas/focaccia.jpg" },
  { name: "Prosciutto", ingredients: "Prosciutto, mozzarella, tomato sauce, arugula", price: 13, image: process.env.PUBLIC_URL + "/pizzas/prosciutto.jpg" },
];

// Menu Component
function Menu({ onOrder, filter }) {
  const filteredPizzas = pizzaData.filter(pizza =>
    pizza.name.toLowerCase().startsWith(filter.toLowerCase())
  );

  return (
    <main className="menu">
      <h2>Our Menu</h2>
      <p>Choose from our selection of freshly baked pizzas made with authentic ingredients and love.</p>
      <ul className="pizzas">
        {filteredPizzas.map((pizza, index) => (
          <Pizza key={index} pizza={pizza} onOrder={onOrder} />
        ))}
          {filteredPizzas.length === 0 && (
            <p className="no-results">No pizzas found 🍕</p>
        )}
      </ul>
    </main>
  );
}


// Header Component
function Header() {
  return (
    <header className="header">
      <h1>Hui Zhi's Pizza Co.</h1>
    </header>
  );
}

// Footer Component
function Footer({ isOpen, orders, onClearOrders }) {
  return (
    <footer className="footer">
      {isOpen ? (
        <div className="order">
          <p>We're currently open!</p>
          {orders.length > 0 ? (
            <>
              <p>Your orders:</p>
              <ul>
                {orders.map((order, index) => (
                  <li key={index}>
                    {order.pizza.name} {order.quantity > 1 ? `x${order.quantity}` : ""}
                  </li>
                ))}
              </ul>

              {/* Clear All Orders Button */}
              <button className="clear-btn" onClick={onClearOrders}>
                Clear All Orders
              </button>
            </>
          ) : (
            <p>No orders yet.</p>
          )}
        </div>
      ) : (
        <p>Sorry, we're closed</p>
      )}
    </footer>
  );
}


function App() {
  const currentHour = new Date().getHours();
  const isOpen = currentHour >= 10 && currentHour < 22;

  const [orders, setOrders] = React.useState([]);
  const [filter, setFilter] = React.useState("");

  // Handle ordering a pizza
  function handleOrder(pizza) {
    const isSure = window.confirm(`Are you sure you want to add ${pizza.name} to your order?`);
    if (!isSure) return; // if user clicks Cancel, do nothing

    setOrders(prevOrders => {
      const existing = prevOrders.find(order => order.pizza.name === pizza.name);
      if (existing) {
        return prevOrders.map(order =>
          order.pizza.name === pizza.name
            ? { ...order, quantity: order.quantity + 1 }
            : order
        );
      } else {
        return [...prevOrders, { pizza, quantity: 1 }];
      }
    });
  }

  // Handle clearing all orders
  function handleClearOrders() {
    const isSure = window.confirm(`Are you sure you want to clear your order`);
    if (!isSure) return;
    setOrders([]);
  }

  return (
    <div className="container">
      <Header />

      {/* Filter */}
      <div style={{ margin: "1rem 10rem" }}>
        <input
          type="text"
          placeholder="Search your pizza!"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      <Menu onOrder={handleOrder} filter={filter} />

      <Footer isOpen={isOpen} orders={orders} onClearOrders={handleClearOrders} />
    </div>
  );
}


// Render App
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

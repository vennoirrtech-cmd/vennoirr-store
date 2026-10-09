import { useContext } from "react";
import { CartContext } from "../context/CartContext";

export default function Cart() {
  const { cart, removeFromCart, sidebarOpen, setSidebarOpen } = useContext(CartContext);

  return (
    <div className={`cart-drawer ${sidebarOpen ? "open" : ""}`}>
      <button onClick={() => setSidebarOpen(false)}>×</button>

      {cart.map((item, i) => (
        <div key={i} className="cart-row">
          <img src={item.image || item.images?.[0]?.url || item.images?.[0] || ""} />
          <p>{item.title} ({item.size})</p>
          <button className="cd-remove" onClick={() => removeFromCart(i)}>Remove</button>
        </div>
      ))}
    </div>
  );
}

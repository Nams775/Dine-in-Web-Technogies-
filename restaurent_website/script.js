// ===== MESSAGE SYSTEM =====
function showMessage(message, type = "success") {
    let messageBox = document.getElementById("message-box");
    if (!messageBox) {
        messageBox = document.createElement("div");
        messageBox.id = "message-box";
        document.body.appendChild(messageBox);
    }

    messageBox.textContent = message;
    messageBox.className = type;

    setTimeout(() => {
        messageBox.textContent = "";
        messageBox.className = "";
    }, 3000);
}

// ===== CART FUNCTIONALITY =====
function addToCart(name, price) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push({ name, price: parseFloat(price) });
    localStorage.setItem("cart", JSON.stringify(cart));
    showMessage(`${name} added to cart!`);
}

function displayCart() {
    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let total = 0;

    cartItems.innerHTML = "";
    
    if (cart.length === 0) {
        cartItems.innerHTML = "<p>Your cart is empty</p>";
        cartTotal.innerHTML = "";
        return;
    }

    cart.forEach((item, index) => {
        cartItems.innerHTML += `
            <div class="cart-item">
                <p>${item.name} - ₹${item.price.toFixed(2)}</p>
                <button onclick="removeFromCart(${index})">Remove</button>
            </div>`;
        total += item.price;
    });

    cartTotal.innerHTML = `<p><strong>Total: ₹${total.toFixed(2)}</p>`;
}

function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
    showMessage("Item removed from cart");
}

// ===== ORDER MANAGEMENT =====
function saveOrderToHistory(order) {
    let history = JSON.parse(localStorage.getItem('orderHistory')) || [];
    history.push(order);
    localStorage.setItem('orderHistory', JSON.stringify(history));
    console.log("✅ Order saved:", order);
}

function placeOrder() {
    console.log("🚀 placeOrder() function called!");
    
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        showMessage("Your cart is empty.", "error");
        return;
    }

    // DEBUG TABLE INPUT
    console.log("🔍 Looking for table input...");
    const tableInput = document.getElementById('table-number');
    console.log("Table input element:", tableInput);
    console.log("Table input value:", tableInput ? tableInput.value : 'NOT FOUND');
    
    let tableNumber = '1';
    if (tableInput && tableInput.value) {
        tableNumber = tableInput.value;
        console.log("✅ Using table number from input:", tableNumber);
    } else {
        console.log("❌ Table input not found, using default:", tableNumber);
    }

    let total = cart.reduce((sum, item) => sum + item.price, 0);

    let order = {
        tableNumber: tableNumber,
        items: [...cart],
        total: total.toFixed(2),
        time: new Date().toLocaleString(),
        status: 'Pending'
    };

    console.log("📦 Final order to save:", order);

    // Save to order history
    saveOrderToHistory(order);
    
    // Clear cart
    localStorage.removeItem('cart');
    displayCart();
    
    // Show success message
    showMessage(`✅ Order placed successfully for Table ${tableNumber}!`, "success");
    
    // Redirect to order history
    setTimeout(() => {
        window.location.href = 'order-history.html';
    }, 2000);
}

// ===== ORDER DISPLAY FUNCTIONS =====
function displayKitchenOrders() {
    const kitchenOrders = document.getElementById('kitchen-orders');
    if (!kitchenOrders) return;

    let orders = JSON.parse(localStorage.getItem('orderHistory')) || [];
    kitchenOrders.innerHTML = '';

    if (orders.length === 0) {
        kitchenOrders.innerHTML = '<p>No active orders yet.</p>';
        return;
    }

    orders.forEach((order, index) => {
        kitchenOrders.innerHTML += `
            <div class="order-card">
                <h3>🪑 Table: ${order.tableNumber}</h3>
                <p><strong>Items:</strong> ${order.items.map(i => i.name).join(', ')}</p>
                <p><strong>Total:</strong> ₹${order.total}</p>
                <p><strong>Time:</strong> ${order.time}</p>
                <p><strong>Status:</strong> 
                    <select onchange="updateOrderStatus(${index}, this.value)">
                        <option value="Pending" ${order.status === 'Pending' ? 'selected' : ''}>Pending</option>
                        <option value="In Progress" ${order.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                        <option value="Completed" ${order.status === 'Completed' ? 'selected' : ''}>Completed</option>
                    </select>
                </p>
            </div>
        `;
    });
}

function displayOrderHistory() {
    const historyContainer = document.getElementById('order-history');
    if (!historyContainer) return;

    let history = JSON.parse(localStorage.getItem('orderHistory')) || [];
    historyContainer.innerHTML = '';

    if (history.length === 0) {
        historyContainer.innerHTML = '<p>No previous orders found.</p>';
        return;
    }

    history.forEach(order => {
        historyContainer.innerHTML += `
            <div class="order-card">
                <h3>🪑 Table: ${order.tableNumber}</h3>
                <p><strong>Items:</strong> ${order.items.map(i => i.name).join(', ')}</p>
                <p><strong>Total:</strong> ₹${order.total}</p>
                <p><strong>Status:</strong> ${order.status}</p>
                <p><strong>Time:</strong> ${order.time}</p>
            </div>
        `;
    });
}

function updateOrderStatus(index, newStatus) {
    let orders = JSON.parse(localStorage.getItem('orderHistory')) || [];
    orders[index].status = newStatus;
    localStorage.setItem('orderHistory', JSON.stringify(orders));
    displayKitchenOrders();
}

// ===== CONTACT FORM =====
function validateForm(event) {
    event.preventDefault();
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || !email || !message) {
        showMessage("All fields are required.", "error");
        return;
    }
    if (!emailRegex.test(email)) {
        showMessage("Please enter a valid email.", "error");
        return;
    }
    showMessage("Message sent successfully!", "success");
    document.getElementById("contact-form").reset();
}

// ===== EVENT LISTENERS =====
document.addEventListener("DOMContentLoaded", () => {
    console.log("📄 Page loaded:", window.location.href);
    
    // Add to cart buttons
    document.querySelectorAll(".add-to-cart").forEach((button) => {
        button.addEventListener("click", () => {
            const name = button.getAttribute("data-name");
            const price = button.getAttribute("data-price");
            addToCart(name, price);
        });
    });

    // Cart page
    if (document.getElementById("cart-items")) {
        console.log("🛒 Cart page detected");
        displayCart();
        document.getElementById("place-order").addEventListener("click", placeOrder);
        
        // Debug table input on cart page
        const tableInput = document.getElementById('table-number');
        console.log("🔍 Cart page table input:", tableInput);
        console.log("🔍 Table input value:", tableInput ? tableInput.value : 'NOT FOUND');
    }

    // Contact form
    if (document.getElementById("contact-form")) {
        document.getElementById("contact-form").addEventListener("submit", validateForm);
    }

    // Order history
    if (document.getElementById("order-history")) {
        displayOrderHistory();
    }

    // Kitchen dashboard
    if (document.getElementById("kitchen-orders")) {
        displayKitchenOrders();
    }
});
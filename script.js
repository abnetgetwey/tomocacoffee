// 1. Cart State (Load from LocalStorage if available)
let cart = JSON.parse(localStorage.getItem('tomocaCart')) || [];

function saveCart() {
    localStorage.setItem('tomocaCart', JSON.stringify(cart));
}

// 2. Add to Cart Function
function addToCart(productName, price) {
    cart.push({
        id: Date.now(),
        name: productName,
        price: price
    });
    
    saveCart();
    updateCartUI();
    showToast(`${productName} added to cart!`);
    
    // If we are on a page with a sidebar (Shop or Index), open it
    const sidebar = document.getElementById('cart-sidebar');
    if(sidebar) {
        toggleCart();
    }
}

// 3. Remove from Cart Function
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    updateCartUI();
}

// 4. Update Cart UI (Badge + List)
function updateCartUI() {
    const cartBadge = document.getElementById('cart-count');
    
    // Update Badge Count
    if (cartBadge) {
        cartBadge.innerText = cart.length;
        if (cart.length > 0) {
            cartBadge.style.display = 'inline-block';
        } else {
            cartBadge.style.display = 'none';
        }
    }

    // Render Items (Sidebar for Index/Shop, Main for Cart.html)
    const cartSidebarContainer = document.getElementById('cart-items-container');
    const cartPageContainer = document.getElementById('cart-page-items'); 
    
    let total = 0;
    let htmlContent = '';

    if (cart.length === 0) {
        htmlContent = '<p style="text-align:center; color: #666; margin-top: 50px;">Your cart is empty.</p>';
    } else {
        cart.forEach(item => {
            total += item.price;
            htmlContent += `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <div class="cart-item-title">${item.name}</div>
                        <div class="cart-item-price">ETB ${item.price}</div>
                    </div>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})">&times;</button>
                </div>
            `;
        });
    }

    if (cartSidebarContainer) cartSidebarContainer.innerHTML = htmlContent;
    if (cartPageContainer) cartPageContainer.innerHTML = htmlContent;

    // Update Total
    const totalDisplays = document.querySelectorAll('.cart-total-price');
    totalDisplays.forEach(el => el.innerText = 'ETB ' + total.toFixed(2));
}

// 5. Toggle Sidebar (Only for Index/Shop)
function toggleCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.querySelector('.cart-overlay');
    
    if(cartSidebar && cartOverlay) {
        cartSidebar.classList.toggle('open');
        if (cartSidebar.classList.contains('open')) {
            cartOverlay.style.display = 'block';
        } else {
            cartOverlay.style.display = 'none';
        }
    }
}

// 6. Show Toast
function showToast(message) {
    const toast = document.getElementById('toast');
    if(!toast) return;
    toast.innerText = message;
    toast.className = "show";
    setTimeout(function(){ 
        toast.className = toast.className.replace("show", ""); 
    }, 3000);
}

// 7. GENERATE PDF CHECKOUT LOGIC
function checkout() {
    if(cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    // Alert user what is happening
    alert("Generating your Payment Invoice PDF...");

    // Trigger Browser Print Dialog
    // This allows you to Save as PDF
    window.print();
}

// Initialize UI on page load
window.addEventListener('DOMContentLoaded', updateCartUI);
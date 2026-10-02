// =======================================
// CUPIFY · GitHub Pages Edition
// Funcionalidad en JavaScript puro.
// =======================================

const CART_KEY = "cupifyCart";
const CUSTOM_NAME_KEY = "cupifyCustomName";

const cartButton = document.getElementById("cart-button");
const cartOverlay = document.getElementById("cart-overlay");
const closeCartButton = document.getElementById("close-cart");
const cartCount = document.getElementById("cart-count");
const drawerCartCount = document.getElementById("drawer-cart-count");
const cartItems = document.getElementById("cart-items");
const emptyCart = document.getElementById("empty-cart");
const cartSummary = document.getElementById("cart-summary");
const cartTotal = document.getElementById("cart-total");
const checkoutButton = document.getElementById("checkout-button");
const exploreCollection = document.getElementById("explore-collection");

const menuButton = document.getElementById("menu-button");
const mainNav = document.getElementById("main-nav");

const customizerOverlay = document.getElementById("customizer-overlay");
const closeCustomizerButton = document.getElementById("close-customizer");
const customNameInput = document.getElementById("custom-name");
const modalCustomName = document.getElementById("modal-custom-name");
const bannerCustomName = document.getElementById("banner-custom-name");
const continueDesignButton = document.getElementById("continue-design");
const openCustomizerButtons = document.querySelectorAll(".js-open-customizer");

let cart = loadCart();
let customName = localStorage.getItem(CUSTOM_NAME_KEY) || "Tu nombre";

customNameInput.value = customName;
updateCustomName(customName);
renderCart();


// ==========================
// CART
// ==========================

document.querySelectorAll(".add-button").forEach((button) => {
  button.addEventListener("click", () => {

    const card = button.closest(".product-card");

    const product = {
      id: Number(card.dataset.id),
      name: card.dataset.name,
      price: Number(card.dataset.price),
      tone: card.dataset.tone
    };

    cart.push(product);
    saveCart();
    renderCart();

    const label = button.querySelector(".add-label");
    const originalText = label.textContent;

    button.classList.add("added");
    label.textContent = "Agregado ✓";

    window.setTimeout(() => {
      button.classList.remove("added");
      label.textContent = originalText;
    }, 1200);
  });
});


cartButton.addEventListener("click", openCart);
closeCartButton.addEventListener("click", closeCart);

cartOverlay.addEventListener("click", (event) => {
  if (event.target === cartOverlay) {
    closeCart();
  }
});

exploreCollection.addEventListener("click", () => {
  closeCart();
});

checkoutButton.addEventListener("click", () => {
  alert("El checkout todavía está en desarrollo. Aquí después conectaremos el método de compra.");
});


function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}


function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}


function renderCart() {

  cartCount.textContent = cart.length;
  drawerCartCount.textContent = `(${cart.length})`;

  cartItems.innerHTML = "";

  if (cart.length === 0) {
    emptyCart.hidden = false;
    cartSummary.hidden = true;
    return;
  }

  emptyCart.hidden = true;
  cartSummary.hidden = false;

  cart.forEach((item, index) => {

    const itemElement = document.createElement("div");
    itemElement.className = "cart-item";

    const thumb = document.createElement("div");
    thumb.className = `cart-thumb ${item.tone}`;
    thumb.textContent = "CUPIFY";

    const info = document.createElement("div");
    info.className = "cart-item-info";

    const name = document.createElement("strong");
    name.textContent = item.name;

    const price = document.createElement("p");
    price.textContent = `$${item.price} MXN`;

    info.append(name, price);

    const removeButton = document.createElement("button");
    removeButton.className = "remove-item";
    removeButton.type = "button";
    removeButton.setAttribute("aria-label", `Quitar ${item.name}`);
    removeButton.textContent = "×";

    removeButton.addEventListener("click", () => {
      cart.splice(index, 1);
      saveCart();
      renderCart();
    });

    itemElement.append(thumb, info, removeButton);
    cartItems.appendChild(itemElement);
  });

  const total = cart.reduce((sum, item) => sum + item.price, 0);
  cartTotal.textContent = `$${total} MXN`;
}


function openCart() {
  cartOverlay.hidden = false;
  document.body.classList.add("no-scroll");
}


function closeCart() {
  cartOverlay.hidden = true;
  document.body.classList.remove("no-scroll");
}


// ==========================
// CUSTOMIZER
// ==========================

openCustomizerButtons.forEach((button) => {
  button.addEventListener("click", openCustomizer);
});


closeCustomizerButton.addEventListener("click", closeCustomizer);


customizerOverlay.addEventListener("click", (event) => {
  if (event.target === customizerOverlay) {
    closeCustomizer();
  }
});


customNameInput.addEventListener("input", () => {

  const value = customNameInput.value.trimStart();

  customName = value || "Tu nombre";

  updateCustomName(customName);

  localStorage.setItem(CUSTOM_NAME_KEY, customName);
});


continueDesignButton.addEventListener("click", () => {

  localStorage.setItem(CUSTOM_NAME_KEY, customName);

  closeCustomizer();

  alert(`¡Perfecto! "${customName}" será el inicio de tu diseño.`);
});


function updateCustomName(name) {
  modalCustomName.textContent = name;
  bannerCustomName.textContent = name;
}


function openCustomizer() {
  customizerOverlay.hidden = false;
  document.body.classList.add("no-scroll");

  window.setTimeout(() => {
    customNameInput.focus();
    customNameInput.select();
  }, 50);
}


function closeCustomizer() {
  customizerOverlay.hidden = true;
  document.body.classList.remove("no-scroll");
}


// ==========================
// MOBILE MENU
// ==========================

menuButton.addEventListener("click", () => {

  const isOpen = mainNav.classList.toggle("is-open");

  menuButton.setAttribute("aria-expanded", String(isOpen));
});


mainNav.querySelectorAll("a").forEach((link) => {

  link.addEventListener("click", () => {

    mainNav.classList.remove("is-open");

    menuButton.setAttribute("aria-expanded", "false");
  });
});


// ==========================
// FAVORITES
// ==========================

document.querySelectorAll(".heart-button").forEach((button) => {

  button.addEventListener("click", () => {

    const active = button.classList.toggle("is-favorite");

    button.textContent = active ? "♥" : "♡";
  });
});


// ==========================
// ESC KEY
// ==========================

document.addEventListener("keydown", (event) => {

  if (event.key !== "Escape") {
    return;
  }

  if (!cartOverlay.hidden) {
    closeCart();
  }

  if (!customizerOverlay.hidden) {
    closeCustomizer();
  }

  mainNav.classList.remove("is-open");
  menuButton.setAttribute("aria-expanded", "false");
});

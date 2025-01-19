// Render Header and Footer on page

const headerElement = document.querySelector("header");
const footerElement = document.querySelector("footer");

headerElement.innerHTML = `<!-- header 1 -->
<div>
  <div class="announcement">
    <button>Announcement</button>
    <small>How we're responding to COVID-19</small>
  </div>
</div>
<!-- Header 1 ends -->

<!-- header 2 -->
<div class="nav-header">
  <div class="container">
    <div class="site-name">
      <a href="/">
        <div class="acme-logo"></div>
      </a>
    </div>
    <div class="nav-field">
      <nav>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/about.html">About</a></li>
          <li><a href="/shop.html">Shop</a></li>
          <li><a href="/donate.html">Donate</a></li>
          <li><a href="/support.html">Contact</a></li>
        </ul>
      </nav>
    </div>

    <div class="cart-box">
      <a href="">
        <div class="cart-icon"></div>
        <div class="count-circle">
          <span></span>
        </div>
      </a>
    </div>
  </div>
</div>
<!-- Header 2 ends -->
`;

footerElement.innerHTML = `<div class="container">
  <div class="site-name">
    <a href="/">
      <div class="acme-logo"></div>
    </a>
  </div>
  <div class="social-medias">
    <ul>
      <li><a href="https://twitter.com" class="twitter"></a></li>
      <li><a href="https://facebook.com" class="facebook"></a></li>
      <li><a href="https://instagram.com" class="instagram"></a></li>
    </ul>
  </div>
</div>`;

const fullOverlayElement = document.querySelector(".full-overlay")
const modalElement = document.querySelector(".modal");
modalElement.innerHTML = `<form action="" class="modal-container">
<div class="modal-sec-1">
  <h3>Your Cart</h3>
  <a href="" class="close-icon"></a>
</div>
<hr />
<div class="modal-sec-2"></div>

<div class="modal-sec-3-main">
  <div class="modal-sec-3">
    <hr />
    <div class="total-price">
      <small>Subtotal</small>
      <strong></strong>
    </div>
    <button>Continue to Checkout</button>
  </div>
</div>
</form>`

// -----------------------------

// SECOND PART

// CART ITEMS -----------------------------------
let categories = {
  0: "Gift Cards",
  1: "Tents",
  2: "Accessories",
  3: "Packs",
};
let shopProducts = [
  {
    productId: 0,
    name: "Gift Card",
    price: 25,
    discountPercent: 0,
    productCategory: 0,
    featured: false,
    imageURL: "assets3/gift-card.jpeg",
  },
  {
    productId: 1,
    name: "White Tent",
    price: 25,
    discountPercent: 0,
    productCategory: 1,
    featured: true,
    imageURL: "assets3/featured.jpeg",
  },
  {
    productId: 2,
    name: "Tin Coffee Tumbler",
    price: 35,
    discountPercent: 0,
    productCategory: 2,
    featured: false,
    imageURL: "assets3/coffee-mug.jpeg",
  },
  {
    productId: 3,
    name: "Blue Canvas Pack",
    price: 160,
    discountPercent: 25,
    productCategory: 3,
    featured: false,
    imageURL: "assets3/backpack.jpeg",
  },
  {
    productId: 4,
    name: "Green Canvas Pack",
    price: 125,
    discountPercent: 0,
    productCategory: 3,
    featured: false,
    imageURL: "assets3/backpack-2.jpeg",
  },
];

// itemId, itemQuantity are keys here of cartItems array
if (localStorage.getItem('localCartStorage') != null) {
  cartItems = JSON.parse(localStorage.getItem('localCartStorage'));
} else {
  cartItems = [];
  localStorage.setItem('localCartStorage', JSON.stringify(cartItems));
}

const countCircleSpan = document.querySelector(".count-circle span");
countCircleSpan.innerHTML = cartItems.length;

const cartIconElement = document.querySelector(".cart-box a");
cartIconElement.addEventListener("click", (e) => {
  e.preventDefault()
  modalSetup()
  fullOverlayElement.style.display = "block";
  modalElement.style.display = "block"
});
const closeButton = document.querySelector(".close-icon");
// CLOSE CART action
closeButton.addEventListener("click", (e) => {
  e.preventDefault();
  countCircleSpan.innerHTML = cartItems.length;
  modalElement.style.display = "none";
  fullOverlayElement.style.display = "none";
});

function modalSetup() {
  // SETUP OF CART MODAL WINDOW

  const modalSection2 = document.querySelector(".modal-sec-2");
  modalSection2.innerHTML = "";

  cartItems.forEach((cartItem) => {
    cartItemProduct = shopProducts.find(
      (product) => product.productId === cartItem.itemId
    );

    const cartItemElement = document.createElement("div");
    cartItemElement.classList.add("cart-item");
    cartItemElement.setAttribute(
      "data-category",
      `${cartItemProduct.productId}`
    );
    cartItemElement.innerHTML = `
      <div class="cart-image" style="background-image: url(${
        cartItemProduct.imageURL
      })"></div>
      <div class="cart-info">
        <strong>${cartItemProduct.name}</strong>
        <small>$ ${(cartItemProduct.price - (cartItemProduct.discountPercent/100) * cartItemProduct.price).toFixed(2)} USD</small>
        <a href="">Remove</a>
      </div>
      <div class="cart-quantity-input">
        <input class="quantity-input" type="number" min="1" step="1" value="${
          cartItem.itemQuantity
        }" />
      </div>`;

    modalSection2.appendChild(cartItemElement);
  });

  // REMOVE ITEM action
  const removeElements = document.querySelectorAll(".cart-info a");
  removeElements.forEach((removeElement) => {
    removeElement.addEventListener("click", (e) => {
      e.preventDefault();
      removedItem = parseInt(
        removeElement.parentElement.parentElement.getAttribute("data-category")
      );
      cartItems = cartItems.filter(
        (cartItem) => cartItem.itemId !== removedItem
      );
      localStorage.setItem('localCartStorage', JSON.stringify(cartItems));
      removeElement.parentElement.parentElement.style.opacity = 0.3;
      setTimeout(() => {
        removeElement.parentElement.parentElement.remove();
        removeElement.parentElement.parentElement.querySelector(
          ".quantity-input"
        ).value = "0";
        displaySubtotal();
      }, 500);
    });
  });

  // TOTAL PRICE DISPLAY
  const totalPriceElement = document.querySelector(".total-price strong");
  const itemsCountInput = document.querySelectorAll(
    ".cart-quantity-input .quantity-input"
  );
  
  // display at START
  displaySubtotal();
  // on COUNT CHANGE
  itemsCountInput.forEach((countInput) => {
    countInput.addEventListener("input", (e) => {
      var changingItemId = parseInt(
        countInput.parentElement.parentElement.getAttribute("data-category")
      );
      var changingProduct = cartItems.find(
        (item) => item.itemId === changingItemId
      );

      countInput.value = countInput.value.replace(/\D/g, "");
      changingProduct.itemQuantity = parseInt(countInput.value);
      localStorage.setItem('localCartStorage', JSON.stringify(cartItems));
      displaySubtotal();
    });
  });

  // this function takes the price and quantity from the webpage and update subtotal
  function displaySubtotal() {
    var subTotal = 0;
    itemsCountInput.forEach((itemCountInput) => {
      priceValue = parseFloat(
        itemCountInput.parentElement.parentElement
          .querySelector("small")
          .innerHTML.replace(/[^\d.]/g, "")
      );
      subTotal = subTotal + priceValue * itemCountInput.value;
    });

    totalPriceElement.innerHTML = `$ ${subTotal.toFixed(2)} USD`;
  }
}

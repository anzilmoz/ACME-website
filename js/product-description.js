// -------------------

const addToCartButton = document.querySelector(".quantity-form button");
const quantityInputMain = document.querySelector(".quantity-form input");
quantityInputMain.value = "1";

quantityInputMain.addEventListener("input", (e) => {
  quantityInputMain.value = quantityInputMain.value.replace(/\D/g, "");
});

// ADD TO CART BUTTON actions
addToCartButton.addEventListener("click", (e) => {
  e.preventDefault();

  if (quantityInputMain.value != "" && quantityInputMain.value != 0) {
    e.target.innerHTML = "Adding to Cart...";

    const existingItem = cartItems.find(
      (item) => item.itemId === selectedProduct.productId
    );

    if (existingItem) {
      existingItem.itemQuantity =
        existingItem.itemQuantity + parseInt(quantityInputMain.value);
    } else {
      cartItems.push({
        itemId: selectedProduct.productId,
        itemQuantity: parseInt(quantityInputMain.value),
      });
    }

    localStorage.setItem('localCartStorage', JSON.stringify(cartItems))
    modalSetup();

    setTimeout(() => {
      e.target.innerHTML = "Add to Cart";
      // function to blackout the backgrount and display the modal
      fullOverlayElement.style.display = "block";
      modalElement.style.display = "block";
    }, 1000);
  }
});

// -----------------------------------

// ON START UP (get the productId from URL and display respective product)
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("productId");
const selectedProduct = shopProducts.find(
  (product) => product.productId == productId
);

const mainHeading = document.querySelector(".header-3-content");
const itemImageElement = document.querySelector(".left");
const itemNameElement = document.querySelector(".name-and-price h1");
const itemPriceElement = document.querySelector(".name-and-price small");

mainHeading.innerHTML = `<p>${selectedProduct.name}</p>`;
itemImageElement.innerHTML = `<div class="product-image" style="background-image: url(${selectedProduct.imageURL})"></div>`;
itemNameElement.innerHTML = selectedProduct.name;
itemPriceElement.innerHTML = `$ ${selectedProduct.price.toFixed(2)} USD`;

// -----------------------------------

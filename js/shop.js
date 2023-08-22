
// 1. RENDERING THE FEATURED SECTION

let featuredProduct = shopProducts.find((product) => product.featured === true);
const section1 = document.querySelector(".section-1");
// Update the background image of section-1
section1.style.backgroundImage = `url(${featuredProduct.imageURL})`;
// Make the section a link
const featuredSection = section1.querySelector(".overlay-link");
featuredSection.setAttribute(
  "href",
  `product-description.html?productId=${featuredProduct.productId}`
);
// Update the content of the left-contents
const leftContents = section1.querySelector(".left-contents");
leftContents.innerHTML = `
    <strong>${featuredProduct.name}</strong>
    <small>$ ${featuredProduct.price.toFixed(2)} USD</small>
  `;

// 2. DISPLAY CATEGORIES
const categoriesList = document.getElementById("categoriesList");
var button = document.createElement("button");
button.setAttribute("class", "category-button");
button.innerHTML = "All";
categoriesList.appendChild(button);
let categoryValues = Object.values(categories);
for (var i = 0; i < categoryValues.length; i++) {
  var button = document.createElement("button");
  button.setAttribute("class", "category-button");
  button.setAttribute("data-category", `${i}`);
  button.innerHTML = categoryValues[i];
  categoriesList.appendChild(button);
}

// ABOVE THREE PARTS ARE MORE STATIC
// BELOW ARE DYNAMIC

// 3. DISPLAY OTHER ITEMS

// Not featured items display, it displays "all" categories at first
const itemsMainContainer = document.querySelector(".items-main");
displayProductsByCategory("all");

// displaying by category
// Access the categories and not featured items container
const categoryButtons = document.querySelectorAll(".category-button");
let selectedButton = null; // To keep track of the currently selected button
// Add click event listener to each category button
categoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (selectedButton) {
      // Reset the colors of the previously selected button
      selectedButton.style.backgroundColor = "white";
      selectedButton.style.color = "#212121";
    }
    // Change colors of the clicked button
    button.style.color = "white";
    button.style.backgroundColor = "#212121";
    selectedButton = button; // Update the selected button
    const selectedCategoryValue = button.getAttribute("data-category");
    const selectedCategory = parseInt(selectedCategoryValue);

    if (!selectedCategoryValue) {
      displayProductsByCategory("all-with-featured");
    } else {
      displayProductsByCategory(selectedCategory);
    }
    const featuredSection = document.querySelector(".section-1");
    featuredSection.style.display = "none";
  });
});

// Function to display products by category
function displayProductsByCategory(category) {
  itemsMainContainer.innerHTML = "";

  if (category == "all") {
    filteredProducts = shopProducts.filter(
      (product) => product.featured == false
    );
  } else if (category == "all-with-featured") {
    filteredProducts = shopProducts;
  } else {
    filteredProducts = shopProducts.filter(
      (product) => product.productCategory == category
    );
  }

  filteredProducts.forEach((product) => {
    const itemDiv = document.createElement("div");
    itemDiv.classList.add("item-main");

    itemDiv.innerHTML = `
        <a class="item-image" style="background-image: url(${
          product.imageURL
        })" href="product-description.html?productId=${product.productId}"></a>
        <p>${product.name}</p>
        <small>$ ${product.price.toFixed(2)} USD ${
      product.previousPrice !== null
        ? `<del>$ ${product.previousPrice.toFixed(2)} USD</del>`
        : ""
    }</small>
      
        <a class="item-details" href="product-description.html?productId=${
          product.productId
        }">Details</a>
      `;

    itemsMainContainer.appendChild(itemDiv);
  });
}

// ------------------------------------------------------

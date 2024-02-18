"use strict";

// Function to handle user login
async function login(event) {
  try {
    event.preventDefault();
    // Extract username and password from the login form
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Check for empty fields
    if (username === "" || password === "") return;

    // Send login request to server
    const response = await fetch("/api/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    // Parse server response
    const data = await response.json();

    // Handle unsuccessful login
    if (!data.success) {
      alert(data.message);
      return;
    }

    // Successful login: store user information and redirect to home page
    const loggedInUser = data.user;
    storageService.setUser(loggedInUser);
    window.location.href = "/products.html"; // Redirect to product selection page
  } catch (error) {
    console.log(error);
    alert(error.message);
  }
}

// Function to handle user signup
async function signup(event) {
  try {
    event.preventDefault();
    // Extract username, password, and email from the signup form
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const email = document.getElementById("email").value;

    // Check for empty fields
    if (username === "" || password === "" || email === "") {
      alert("Please fill in all fields.");
      return;
    }

    // Create credentials object
    const credentials = { username, password, email };

    // Send signup request to server
    const response = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    // Parse server response
    const data = await response.json();

    // Redirect to login page after successful signup
    window.location.href = "/products.html";
  } catch (error) {
    console.log(error);
  }
}

// Function to initialize the application
async function init() {
  // Retrieve user information from local storage
  const user = storageService.getUser();

  // Redirect to login page if user is not logged in
  if (!user) {
    window.location.href = "/signin.html";
    return;
  }

  // Fetch and render products from the server
  await renderProducts();
}

// Function to fetch and render products
async function renderProducts() {
  try {
    // Fetch products from the server
    const response = await fetch("/products.html");
    const data = await response.json();

    // Handle unsuccessful server response
    if (!data.success) return alert(data.message);

    // Render products on the product selection page
    const products = data.products;
    renderProductList(data);
  } catch (error) {
    console.log(error);
  }
}

// Function to render the product list on the webpage
function renderProductList(products) {
  const productListContainer = document.getElementById("productList");

  // Clear previous content
  productListContainer.innerHTML = "";

  // Iterate through products and create HTML elements
  products.forEach((product) => {
    const productDiv = document.createElement("div");
    productDiv.className = "product-item";

    const productName = document.createElement("p");
    productName.textContent = product.name;

    const productPrice = document.createElement("p");
    productPrice.textContent = `Price: $${product.price.toFixed(2)}`;

    // Button to add the product to the selected list
    const addButton = document.createElement("button");
    addButton.textContent = "Add to Cart";
    addButton.onclick = () => addToCart(product._id, product.name);

    // Append elements to the product div
    productDiv.appendChild(productName);
    productDiv.appendChild(productPrice);
    productDiv.appendChild(addButton);

    // Append the product div to the container
    productListContainer.appendChild(productDiv);
  });
}

// Function to add a product to the selected list
function addToCart(productId, productName) {
  const selectedProducts = storageService.getSelectedProducts();

  // Check if the product is already in the selected list
  const existingProduct = selectedProducts.find((product) => product._id === productId);

  if (!existingProduct) {
    // If not, add the product to the selected list
    const newProduct = { _id: productId, name: productName };
    storageService.setSelectedProducts([...selectedProducts, newProduct]);
    alert(`Product '${productName}' added to the cart!`);
  } else {
    // If already in the list, show an alert
    alert(`Product '${productName}' is already in the cart!`);
  }
}

// Function to handle user logout
function logout() {
  // Clear user and selected products information from local storage
  storageService.clearAll();
  // Redirect to login page
  window.location.href = "/signin.html";
}

// Finding products by name
function searchProducts() {
  var searchInput = document.getElementById('searchInput').value.toLowerCase();
  var products = document.querySelectorAll('.product');

  products.forEach(function (product) {
    var productName = product.textContent.toLowerCase();
    if (productName.includes(searchInput)) {
      product.style.display = 'block';
    } else {
      product.style.display = 'none';
    }
  });
}

function displayCheckoutInfo() {
  const selectedProducts = storageService.getSelectedProducts();
  const totalAmountElement = document.getElementById("totalAmount");
  let totalAmount = 0;

  // Display selected products
  const selectedProductsContainer = document.getElementById("selectedProductsContainer");
  selectedProductsContainer.innerHTML = ""; // Clear previous content

  selectedProducts.forEach(product => {
    const productDiv = document.createElement("div");
    productDiv.textContent = `${product.name} - $${product.price.toFixed(2)}`;
    selectedProductsContainer.appendChild(productDiv);

    // Calculate total amount
    totalAmount += product.price;
  });

  // Display total amount
  totalAmountElement.textContent = totalAmount.toFixed(2);
}

async function confirmPurchase() {
  try {
    const selectedProducts = storageService.getSelectedProducts();

    // Check if there are any selected products
    if (selectedProducts.length === 0) {
      alert("No products selected for purchase.");
      return;
    }

    // Fetch user information from local storage
    const user = storageService.getUser();
    if (!user) {
      alert("User not logged in. Please log in before making a purchase.");
      return;
    }

    // Prepare data for the purchase request
    const purchaseData = {
      userId: user._id,
      products: selectedProducts.map(product => ({
        productId: product._id,
        quantity: 1, // Assuming quantity is 1 for simplicity
      })),
    };

    // Send purchase request to the server
    const response = await fetch("/api/buy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(purchaseData),
    });

    // Parse server response
    const data = await response.json();

    // Handle unsuccessful purchase
    if (!data.success) {
      alert("Purchase failed. Please try again.");
      return;
    }

    // Clear selected products after successful purchase
    storageService.setSelectedProducts([]);

    // Redirect to the product selection page
    window.location.href = "/products.html";
  } catch (error) {
    console.log(error);
    alert("An error occurred. Please try again later.");
  }
}

// Call the init function when the page is loaded
window.onload = init;

"use strict";

const gProducts = [
  {
    id: 1, 
    name: "A Couch",
    price: 2000,
  },
  {
    id: 2, 
    name: "Coffee Table",
    price: 50,
  },{
    id: 3, 
    name: "Dining Table",
    price: 1500,
  },{
    id: 4, 
    name: "Kitchen Island",
    price: 1200,
  },{
    id: 5, 
    name: "Outdoor Sofa",
    price: 500,
  },
]

function renderProducts() {
  const strHTMLS = gProducts.map(product => {
    return `
    <div class="product ${product.id}"  onclick="addToCart('${product.name}',${product.price})">${product.name} - ${product.price}</div>
    `
  })
  document.querySelector(".prodsList").innerHTML = strHTMLS.join("")
}

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
function init() {
  // Retrieve user information from local storage
  const user = storageService.getUser();

  // Redirect to login page if user is not logged in
  if (!user) {
    window.location.href = "/signin.html";
    return;
  }
 renderProducts()
}
// Function to add a product to the selected list
function addToCart(productName, productPrice, productId) {
  const selectedProducts = storageService.getSelectedProducts();
  const newCartItem = {
    name: productName,
    price: productPrice,
  }
  selectedProducts.push(newCartItem)

  storageService.setSelectedProducts([...selectedProducts]);
  alert(`Product '${productName}' added to the cart!`);
}

// Function to handle user logout
function logout() {
  // Clear user and selected products information from local storage
  storageService.clearAll();
  // Redirect to login page
  window.location.href = "/signin.html";
}
function confirmPurchase() {
  storageService.clearAll();
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
    console.log("displayCheckoutInfo called");
    const selectedProducts = storageService.getSelectedProducts();
    let totalAmount = 0;
    let totalProducts = 0;

    // Display selected products
    const selectedProductsContainer = document.getElementById("selectedProductsContainer");
    selectedProductsContainer.innerHTML = ""; // Clear previous content

    selectedProducts.forEach(product => {
        const productDiv = document.createElement("div");
        productDiv.textContent = `${product.name} - ₪${(+product.price).toFixed(2)}`;
        selectedProductsContainer.appendChild(productDiv);

        // Calculate total price
        totalAmount += +product.price;

        // Calculate total products
        totalProducts += 1;
    });

    // Display total amount and total products
    const totalAmountElement = document.getElementById("totalAmount");
    const totalProductsElement = document.getElementById("totalProducts");
    totalAmountElement.textContent = `₪${totalAmount.toFixed(2)}`;
    totalProductsElement.textContent = totalProducts;
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
        quantity: product.count,
      })),
    };

    // Send purchase request to the server
    const response = await fetch("/api/products", {
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

function toBuy() {
  window.location.href("/buy.html")
}

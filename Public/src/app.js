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
  }, {
    id: 3,
    name: "Dining Table",
    price: 1500,
  }, {
    id: 4,
    name: "Kitchen Island",
    price: 1200,
  }, {
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

async function login(event) {
  try {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username === "" || password === "") return;

    const response = await fetch("/api/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!data.success) {
      alert(data.message);
      return;
    }

    const loggedInUser = data.user;
    storageService.setUser(loggedInUser);
    window.location.href = "/products.html";
  } catch (error) {
    console.log(error);
    alert(error.message);
  }
}

async function signup(event) {
  try {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const email = document.getElementById("email").value;

    if (username === "" || password === "" || email === "") {
      alert("Please fill in all fields.");
      return;
    }

    const credentials = { username, password, email };

    const response = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    window.location.href = "/products.html";
  } catch (error) {
    console.log(error);
  }
}

function init() {
  const user = storageService.getUser();


  if (!user) {
    window.location.href = "/signin.html";
    return;
  }
  renderProducts()
}

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


function logout() {
  storageService.clearAll();
  window.location.href = "/signin.html";
}


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


  const selectedProductsContainer = document.getElementById("selectedProductsContainer");
  selectedProductsContainer.innerHTML = "";

  selectedProducts.forEach(product => {
    const productDiv = document.createElement("div");
    productDiv.textContent = `${product.name} - ₪${(+product.price).toFixed(2)}`;
    selectedProductsContainer.appendChild(productDiv);

    totalAmount += +product.price;

    totalProducts += 1;
  });

  const totalAmountElement = document.getElementById("totalAmount");
  const totalProductsElement = document.getElementById("totalProducts");
  totalAmountElement.textContent = `₪${totalAmount.toFixed(2)}`;
  totalProductsElement.textContent = totalProducts;
}

async function confirmPurchase() {
  try {
    const selectedProducts = storageService.getSelectedProducts();

    if (selectedProducts.length === 0) {
      alert("No products selected for purchase.");
      return;
    }

    const user = storageService.getUser();
    if (!user) {
      alert("User not logged in. Please log in before making a purchase.");
      return;
    }

    const purchaseData = {
      userId: user._id,
      products: selectedProducts.map(product => ({
        productId: product._id,
        quantity: product.count,
      })),
    };

    const response = await fetch("/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(purchaseData),
    });

    const data = await response.json();

    if (!data.success) {
      alert("Purchase failed. Please try again.");
      return;
    }

    storageService.setSelectedProducts([]);

    window.location.href = "/products.html";
  } catch (error) {
    console.log(error);
    alert("An error occurred. Please try again later.");
  }
}



// ===============================
// Grocery POS - V1
// Product Management
// ===============================

let products = JSON.parse(localStorage.getItem("products")) || [];

const productForm = document.getElementById("productForm");
const productTable = document.getElementById("productTable");
const searchInput = document.getElementById("search");


// ===============================
// Date
// ===============================

function showDate() {
    const dateElement = document.getElementById("date");

    const today = new Date();

    dateElement.textContent = today.toLocaleDateString("en-LK", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });
}

showDate();


// ===============================
// Save Products
// ===============================

function saveProducts() {
    localStorage.setItem("products", JSON.stringify(products));
}


// ===============================
// Add Product
// ===============================

productForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const name = document.getElementById("productName").value.trim();
    const barcode = document.getElementById("barcode").value.trim();
    const category = document.getElementById("category").value.trim();

    const buyPrice = Number(
        document.getElementById("buyPrice").value
    );

    const sellPrice = Number(
        document.getElementById("sellPrice").value
    );

    const stock = Number(
        document.getElementById("stock").value
    );


    // Check duplicate barcode

    const duplicate = products.find(
        product => product.barcode === barcode
    );

    if (duplicate) {
        alert("This barcode is already registered!");
        return;
    }


    const product = {

        id: Date.now(),

        name: name,

        barcode: barcode,

        category: category,

        buyPrice: buyPrice,

        sellPrice: sellPrice,

        stock: stock
    };


    products.push(product);

    saveProducts();

    productForm.reset();

    renderProducts();

    updateDashboard();

    alert("Product added successfully!");


});


// ===============================
// Display Products
// ===============================

function renderProducts(searchText = "") {

    productTable.innerHTML = "";


    const search = searchText.toLowerCase();


    const filteredProducts = products.filter(product => {

        return (
            product.name.toLowerCase().includes(search) ||
            product.barcode.toLowerCase().includes(search) ||
            product.category.toLowerCase().includes(search)
        );

    });


    if (filteredProducts.length === 0) {

        productTable.innerHTML = `
            <tr>
                <td colspan="7" style="text-align:center;">
                    No products found
                </td>
            </tr>
        `;

        return;
    }


    filteredProducts.forEach(product => {

        const row = document.createElement("tr");


        row.innerHTML = `

            <td>${product.name}</td>

            <td>${product.barcode}</td>

            <td>${product.category || "-"}</td>

            <td>Rs. ${product.buyPrice.toFixed(2)}</td>

            <td>Rs. ${product.sellPrice.toFixed(2)}</td>

            <td>${product.stock}</td>

            <td>

                <button
                    onclick="deleteProduct(${product.id})"
                    style="background:#dc2626;"
                >
                    Delete
                </button>

            </td>

        `;


        productTable.appendChild(row);

    });

}


// ===============================
// Search
// ===============================

searchInput.addEventListener("input", function () {

    renderProducts(this.value);

});


// ===============================
// Delete Product
// ===============================

function deleteProduct(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this product?"
    );


    if (!confirmDelete) {
        return;
    }


    products = products.filter(
        product => product.id !== id
    );


    saveProducts();

    renderProducts();

    updateDashboard();

}


// ===============================
// Dashboard
// ===============================

function updateDashboard() {

    const productCount =
        document.getElementById("productCount");

    const stockCount =
        document.getElementById("stockCount");

    const lowStock =
        document.getElementById("lowStock");


    productCount.textContent = products.length;


    const totalStock = products.reduce(
        (total, product) =>
            total + Number(product.stock),
        0
    );


    stockCount.textContent = totalStock;


    const lowStockProducts = products.filter(
        product => Number(product.stock) <= 5
    );


    lowStock.textContent =
        lowStockProducts.length;


    // Sales will be connected in the next version

    document.getElementById("todaySales").textContent =
        "Rs. 0.00";

}


// ===============================
// Start Application
// ===============================

renderProducts();

updateDashboard();

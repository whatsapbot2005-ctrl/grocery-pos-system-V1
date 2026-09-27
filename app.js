// ==========================================
// 🛒 GROCERY POS SYSTEM
// ==========================================

let products = JSON.parse(
    localStorage.getItem("products")
) || [];

let cart = [];

let salesData = JSON.parse(
    localStorage.getItem("salesData")
) || {
    date: "",
    total: 0
};


// ==========================================
// ELEMENTS
// ==========================================

const productForm =
    document.getElementById("productForm");

const productTable =
    document.getElementById("productTable");

const searchInput =
    document.getElementById("search");

const saleBarcode =
    document.getElementById("saleBarcode");

const cartTable =
    document.getElementById("cartTable");

const cartTotal =
    document.getElementById("cartTotal");

const cashReceived =
    document.getElementById("cashReceived");

const changeAmount =
    document.getElementById("changeAmount");


// ==========================================
// DATE
// ==========================================

function getToday() {

    return new Date()
        .toISOString()
        .split("T")[0];

}


function showDate() {

    const dateElement =
        document.getElementById("date");

    dateElement.textContent =
        new Date().toLocaleDateString(
            "en-LK",
            {
                year: "numeric",
                month: "long",
                day: "numeric"
            }
        );

}

showDate();


// ==========================================
// DAILY SALES
// ==========================================

function checkDailySales() {

    const today = getToday();

    if (salesData.date !== today) {

        salesData = {
            date: today,
            total: 0
        };

        saveSales();

    }

}

checkDailySales();


// ==========================================
// SAVE
// ==========================================

function saveProducts() {

    localStorage.setItem(
        "products",
        JSON.stringify(products)
    );

}


function saveSales() {

    localStorage.setItem(
        "salesData",
        JSON.stringify(salesData)
    );

}


// ==========================================
// ADD PRODUCT
// ==========================================

productForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();

        const name =
            document
                .getElementById("productName")
                .value
                .trim();

        const barcode =
            document
                .getElementById("barcode")
                .value
                .trim();

        const category =
            document
                .getElementById("category")
                .value
                .trim();

        const buyPrice =
            Number(
                document
                    .getElementById("buyPrice")
                    .value
            );

        const sellPrice =
            Number(
                document
                    .getElementById("sellPrice")
                    .value
            );

        const stock =
            Number(
                document
                    .getElementById("stock")
                    .value
            );


        const existingProduct =
            products.find(
                product =>
                    String(product.barcode).trim()
                    ===
                    String(barcode).trim()
            );


        if (existingProduct) {

            alert(
                "⚠️ This barcode is already registered!"
            );

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


        alert(
            "✅ Product added successfully!"
        );

    }
);


// ==========================================
// DISPLAY PRODUCTS
// ==========================================

function renderProducts(searchText = "") {

    productTable.innerHTML = "";

    const search =
        searchText
            .toLowerCase()
            .trim();


    const filteredProducts =
        products.filter(product => {

            return (

                String(product.name)
                    .toLowerCase()
                    .includes(search)

                ||

                String(product.barcode)
                    .toLowerCase()
                    .includes(search)

                ||

                String(product.category)
                    .toLowerCase()
                    .includes(search)

            );

        });


    if (filteredProducts.length === 0) {

        productTable.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    style="text-align:center;"
                >
                    No products found
                </td>

            </tr>

        `;

        return;

    }


    filteredProducts.forEach(product => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>${product.name}</td>

            <td>${product.barcode}</td>

            <td>
                ${product.category || "-"}
            </td>

            <td>
                Rs. ${Number(product.buyPrice).toFixed(2)}
            </td>

            <td>
                Rs. ${Number(product.sellPrice).toFixed(2)}
            </td>

            <td>${product.stock}</td>

            <td>

                <button
                    onclick="deleteProduct(${product.id})"
                    style="
                        background:#dc2626;
                        color:white;
                        border:none;
                        padding:8px;
                        border-radius:6px;
                    "
                >
                    Delete
                </button>

            </td>

        `;


        productTable.appendChild(row);

    });

}


// ==========================================
// SEARCH
// ==========================================

searchInput.addEventListener(
    "input",
    function() {

        renderProducts(this.value);

    }
);


// ==========================================
// DELETE
// ==========================================

function deleteProduct(id) {

    if (
        !confirm(
            "Are you sure you want to delete this product?"
        )
    ) {

        return;

    }


    products =
        products.filter(
            product =>
                product.id !== id
        );


    saveProducts();

    renderProducts();

    updateDashboard();

}


// ==========================================
// ADD TO CART
// ==========================================

function addToCart() {

    const barcode =
        String(
            saleBarcode.value
        ).trim();


    if (!barcode) {

        alert(
            "⚠️ Please enter a barcode!"
        );

        return;

    }


    const product =
        products.find(
            item =>
                String(item.barcode).trim()
                ===
                String(barcode).trim()
        );


    if (!product) {

        alert(
            "❌ Product not found!"
        );

        return;

    }


    if (
        Number(product.stock) <= 0
    ) {

        alert(
            "⚠️ This product is out of stock!"
        );

        return;

    }


    const existing =
        cart.find(
            item =>
                item.id === product.id
        );


    if (existing) {

        if (
            existing.quantity <
            Number(product.stock)
        ) {

            existing.quantity++;

        } else {

            alert(
                "⚠️ Not enough stock!"
            );

        }

    } else {

        cart.push({

            id: product.id,

            name: product.name,

            barcode: product.barcode,

            price:
                Number(product.sellPrice),

            quantity: 1

        });

    }


    saleBarcode.value = "";

    renderCart();

}


// ==========================================
// ENTER BARCODE
// ==========================================

saleBarcode.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {

            event.preventDefault();

            addToCart();

        }

    }
);


// ==========================================
// RENDER CART
// ==========================================

function renderCart() {

    cartTable.innerHTML = "";


    if (cart.length === 0) {

        cartTable.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    style="text-align:center;"
                >
                    Cart is empty
                </td>

            </tr>

        `;

        updateCartTotal();

        return;

    }


    cart.forEach(item => {

        const row =
            document.createElement("tr");


        const total =
            item.price *
            item.quantity;


        row.innerHTML = `

            <td>${item.name}</td>

            <td>
                Rs. ${item.price.toFixed(2)}
            </td>

            <td>

                <button
                    onclick="changeQuantity(${item.id}, -1)"
                >
                    −
                </button>

                <strong style="margin:0 8px;">
                    ${item.quantity}
                </strong>

                <button
                    onclick="changeQuantity(${item.id}, 1)"
                >
                    +
                </button>

            </td>

            <td>
                Rs. ${total.toFixed(2)}
            </td>

            <td>

                <button
                    onclick="removeFromCart(${item.id})"
                    style="
                        background:#dc2626;
                        color:white;
                        border:none;
                        padding:7px;
                        border-radius:6px;
                    "
                >
                    Remove
                </button>

            </td>

        `;


        cartTable.appendChild(row);

    });


    updateCartTotal();

}


// ==========================================
// QUANTITY
// ==========================================

function changeQuantity(id, amount) {

    const item =
        cart.find(
            product =>
                product.id === id
        );


    if (!item) return;


    const product =
        products.find(
            product =>
                product.id === id
        );


    item.quantity += amount;


    if (item.quantity < 1) {

        item.quantity = 1;

    }


    if (
        item.quantity >
        Number(product.stock)
    ) {

        item.quantity =
            Number(product.stock);

        alert(
            "⚠️ Maximum available stock reached!"
        );

    }


    renderCart();

}


// ==========================================
// REMOVE
// ==========================================

function removeFromCart(id) {

    cart =
        cart.filter(
            item =>
                item.id !== id
        );

    renderCart();

}


// ==========================================
// TOTAL
// ==========================================

function getCartTotal() {

    return cart.reduce(
        (total, item) => {

            return total +
                (
                    item.price *
                    item.quantity
                );

        },
        0
    );

}


function updateCartTotal() {

    const total =
        getCartTotal();


    cartTotal.textContent =
        "Rs. " +
        total.toFixed(2);


    calculateChange();

}


// ==========================================
// CHANGE
// ==========================================

cashReceived.addEventListener(
    "input",
    calculateChange
);


function calculateChange() {

    const total =
        getCartTotal();


    const cash =
        Number(
            cashReceived.value
        ) || 0;


    const change =
        cash - total;


    changeAmount.textContent =
        "Rs. " +
        (
            change > 0
                ? change
                : 0
        ).toFixed(2);

}


// ==========================================
// COMPLETE SALE + RECEIPT
// ==========================================

function completeSale() {

    if (cart.length === 0) {

        alert(
            "⚠️ Cart is empty!"
        );

        return;

    }


    const total =
        getCartTotal();


    const cash =
        Number(
            cashReceived.value
        ) || 0;


    if (cash < total) {

        alert(
            "⚠️ Cash received is not enough!"
        );

        return;

    }


    // Reduce stock

    cart.forEach(item => {

        const product =
            products.find(
                product =>
                    product.id === item.id
            );


        if (product) {

            product.stock =
                Number(product.stock)
                -
                Number(item.quantity);

        }

    });


    // Save today's sales

    salesData.total += total;

    salesData.date =
        getToday();


    saveProducts();

    saveSales();


    const change =
        cash - total;


    // Generate receipt

    generateReceipt(
        total,
        cash,
        change
    );


    alert(
        "✅ SALE COMPLETED!"
    );


    // Clear cart

    cart = [];

    cashReceived.value = "";

    saleBarcode.value = "";


    renderCart();

    renderProducts();

    updateDashboard();

}


// ==========================================
// RECEIPT
// ==========================================

function generateReceipt(
    total,
    cash,
    change
) {

    const receiptSection =
        document.getElementById(
            "receiptSection"
        );

    const receipt =
        document.getElementById(
            "receipt"
        );


    const now =
        new Date();


    const date =
        now.toLocaleDateString("en-LK");


    const time =
        now.toLocaleTimeString("en-LK");


    let itemsHTML = "";


    // Receipt items

    cart.forEach(item => {

        const itemTotal =
            item.price *
            item.quantity;


        itemsHTML += `

            <tr>

                <td>
                    ${item.name}
                </td>

                <td>
                    ${item.quantity}
                </td>

                <td>
                    Rs. ${item.price.toFixed(2)}
                </td>

                <td>
                    Rs. ${itemTotal.toFixed(2)}
                </td>

            </tr>

        `;

    });


    receipt.innerHTML = `

        <div class="receipt-box">

            <h2>🛒 GROCERY SHOP</h2>

            <p>
                Thank you for shopping!
            </p>

            <hr>

            <p>
                <strong>Date:</strong>
                ${date}
            </p>

            <p>
                <strong>Time:</strong>
                ${time}
            </p>

            <hr>

            <table>

                <thead>

                    <tr>
                        <th>Item</th>
                        <th>Qty</th>
                        <th>Price</th>
                        <th>Total</th>
                    </tr>

                </thead>

                <tbody>

                    ${itemsHTML}

                </tbody>

            </table>

            <hr>

            <h3>
                Total:
                Rs. ${total.toFixed(2)}
            </h3>

            <p>
                Cash:
                Rs. ${cash.toFixed(2)}
            </p>

            <p>
                Change:
                Rs. ${change.toFixed(2)}
            </p>

            <hr>

            <p style="text-align:center;">
                Thank You ❤️
            </p>

        </div>

    `;


    receiptSection.style.display =
        "block";


    receiptSection.scrollIntoView({
        behavior: "smooth"
    });

}


// ==========================================
// PRINT RECEIPT
// ==========================================

function printReceipt() {

    const receipt =
        document.getElementById(
            "receipt"
        ).innerHTML;


    const printWindow =
        window.open(
            "",
            "",
            "width=400,height=600"
        );


    printWindow.document.write(`

        <html>

        <head>

            <title>Receipt</title>

            <style>

                body {
                    font-family: Arial;
                    padding: 20px;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                }

                th,
                td {
                    padding: 6px;
                    border-bottom: 1px solid #ddd;
                    text-align: left;
                }

                h2,
                h3,
                p {
                    margin: 6px 0;
                }

            </style>

        </head>

        <body>

            ${receipt}

        </body>

        </html>

    `);


    printWindow.document.close();

    printWindow.focus();

    printWindow.print();

}


// ==========================================
// DASHBOARD
// ==========================================

function updateDashboard() {

    checkDailySales();


    document.getElementById(
        "productCount"
    ).textContent =
        products.length;


    const totalStock =
        products.reduce(
            (total, product) => {

                return total +
                    Number(product.stock);

            },
            0
        );


    document.getElementById(
        "stockCount"
    ).textContent =
        totalStock;


    const lowStockProducts =
        products.filter(
            product =>
                Number(product.stock) <= 5
        );


    document.getElementById(
        "lowStock"
    ).textContent =
        lowStockProducts.length;


    document.getElementById(
        "todaySales"
    ).textContent =
        "Rs. " +
        Number(
            salesData.total
        ).toFixed(2);

}


// ==========================================
// START
// ==========================================

renderProducts();

renderCart();

updateDashboard();

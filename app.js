// ==========================================
// 🛒 GROCERY POS SYSTEM - V2
// ==========================================

// Products saved in browser
let products = JSON.parse(
    localStorage.getItem("products")
) || [];

// Current shopping cart
let cart = [];

// Today's sales
let salesData = JSON.parse(
    localStorage.getItem("salesData")
) || {
    date: "",
    total: 0
};


// ==========================================
// ELEMENTS
// ==========================================

const productForm = document.getElementById("productForm");
const productTable = document.getElementById("productTable");
const searchInput = document.getElementById("search");

const saleBarcode = document.getElementById("saleBarcode");
const cartTable = document.getElementById("cartTable");
const cartTotal = document.getElementById("cartTotal");

const cashReceived = document.getElementById("cashReceived");
const changeAmount = document.getElementById("changeAmount");


// ==========================================
// TODAY'S DATE
// ==========================================

function getToday() {

    const now = new Date();

    return now.toISOString().split("T")[0];

}


// ==========================================
// SHOW DATE
// ==========================================

function showDate() {

    const dateElement = document.getElementById("date");

    const today = new Date();

    dateElement.textContent =
        today.toLocaleDateString("en-LK", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });

}

showDate();


// ==========================================
// RESET DAILY SALES
// ==========================================

function checkDailySales() {

    const today = getToday();

    if (salesData.date !== today) {

        salesData = {
            date: today,
            total: 0
        };

        localStorage.setItem(
            "salesData",
            JSON.stringify(salesData)
        );

    }

}

checkDailySales();


// ==========================================
// SAVE PRODUCTS
// ==========================================

function saveProducts() {

    localStorage.setItem(
        "products",
        JSON.stringify(products)
    );

}


// ==========================================
// SAVE SALES
// ==========================================

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
    function (event) {

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


        // Check barcode
        const existingProduct =
            products.find(
                product =>
                    product.barcode === barcode
            );


        if (existingProduct) {

            alert(
                "⚠️ This barcode is already registered!"
            );

            return;

        }


        // Create product

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

function renderProducts(
    searchText = ""
) {

    productTable.innerHTML = "";


    const search =
        searchText
            .toLowerCase()
            .trim();


    const filteredProducts =
        products.filter(product => {

            return (

                product.name
                    .toLowerCase()
                    .includes(search)

                ||

                product.barcode
                    .toLowerCase()
                    .includes(search)

                ||

                product.category
                    .toLowerCase()
                    .includes(search)

            );

        });


    if (
        filteredProducts.length === 0
    ) {

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


    filteredProducts.forEach(
        product => {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${product.name}
                </td>

                <td>
                    ${product.barcode}
                </td>

                <td>
                    ${product.category || "-"}
                </td>

                <td>
                    Rs. ${Number(
                        product.buyPrice
                    ).toFixed(2)}
                </td>

                <td>
                    Rs. ${Number(
                        product.sellPrice
                    ).toFixed(2)}
                </td>

                <td>
                    ${product.stock}
                </td>

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

        }
    );

}


// ==========================================
// SEARCH PRODUCTS
// ==========================================

searchInput.addEventListener(
    "input",
    function () {

        renderProducts(
            this.value
        );

    }
);


// ==========================================
// DELETE PRODUCT
// ==========================================

function deleteProduct(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this product?"
        );


    if (!confirmDelete) {

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
// ADD PRODUCT TO CART
// ==========================================

function addToCart() {

    const barcode =
        saleBarcode.value.trim();


    if (!barcode) {

        alert(
            "⚠️ Please enter a barcode!"
        );

        return;

    }


    const product =
        products.find(
            item =>
                item.barcode === barcode
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


    // Check whether product already exists
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

            price: Number(
                product.sellPrice
            ),

            quantity: 1

        });

    }


    saleBarcode.value = "";

    renderCart();

}


// ==========================================
// ENTER KEY FOR BARCODE
// ==========================================

saleBarcode.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Enter"
        ) {

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


    cart.forEach(
        item => {

            const row =
                document.createElement("tr");


            const total =
                item.price *
                item.quantity;


            row.innerHTML = `

                <td>
                    ${item.name}
                </td>

                <td>
                    Rs. ${item.price.toFixed(2)}
                </td>

                <td>

                    <button
                        onclick="changeQuantity(
                            ${item.id},
                            -1
                        )"
                    >
                        −
                    </button>

                    <strong
                        style="margin:0 8px;"
                    >
                        ${item.quantity}
                    </strong>

                    <button
                        onclick="changeQuantity(
                            ${item.id},
                            1
                        )"
                    >
                        +
                    </button>

                </td>

                <td>
                    Rs. ${total.toFixed(2)}
                </td>

                <td>

                    <button
                        onclick="removeFromCart(
                            ${item.id}
                        )"
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

        }
    );


    updateCartTotal();

}


// ==========================================
// CHANGE QUANTITY
// ==========================================

function changeQuantity(
    id,
    amount
) {

    const item =
        cart.find(
            product =>
                product.id === id
        );


    if (!item) {

        return;

    }


    const product =
        products.find(
            product =>
                product.id === id
        );


    item.quantity += amount;


    // Minimum quantity
    if (
        item.quantity < 1
    ) {

        item.quantity = 1;

    }


    // Maximum stock
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
// REMOVE FROM CART
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
// CART TOTAL
// ==========================================

function getCartTotal() {

    return cart.reduce(
        (
            total,
            item
        ) => {

            return (
                total +
                (
                    item.price *
                    item.quantity
                )
            );

        },
        0
    );

}


// ==========================================
// UPDATE CART TOTAL
// ==========================================

function updateCartTotal() {

    const total =
        getCartTotal();


    cartTotal.textContent =
        "Rs. " +
        total.toFixed(2);


    calculateChange();

}


// ==========================================
// CASH / CHANGE
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
// COMPLETE SALE
// ==========================================

function completeSale() {

    if (
        cart.length === 0
    ) {

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


    if (
        cash < total
    ) {

        alert(
            "⚠️ Cash received is not enough!"
        );

        return;

    }


    // Reduce stock

    cart.forEach(
        item => {

            const product =
                products.find(
                    product =>
                        product.id === item.id
                );


            if (product) {

                product.stock =
                    Number(
                        product.stock
                    ) -
                    Number(
                        item.quantity
                    );

            }

        }
    );


    // Add today's sales

    salesData.total += total;

    salesData.date =
        getToday();


    saveProducts();

    saveSales();


    const change =
        cash - total;


    alert(

        "✅ SALE COMPLETED!\n\n" +

        "Total: Rs. " +
        total.toFixed(2) +

        "\nCash: Rs. " +
        cash.toFixed(2) +

        "\nChange: Rs. " +
        change.toFixed(2)

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
// UPDATE DASHBOARD
// ==========================================

function updateDashboard() {

    checkDailySales();


    const productCount =
        document.getElementById(
            "productCount"
        );


    const stockCount =
        document.getElementById(
            "stockCount"
        );


    const lowStock =
        document.getElementById(
            "lowStock"
        );


    const todaySales =
        document.getElementById(
            "todaySales"
        );


    // Product count

    productCount.textContent =
        products.length;


    // Total stock

    const totalStock =
        products.reduce(
            (
                total,
                product
            ) => {

                return (
                    total +
                    Number(
                        product.stock
                    )
                );

            },
            0
        );


    stockCount.textContent =
        totalStock;


    // Low stock

    const lowStockProducts =
        products.filter(
            product =>
                Number(
                    product.stock
                ) <= 5
        );


    lowStock.textContent =
        lowStockProducts.length;


    // Today's sales

    todaySales.textContent =
        "Rs. " +
        Number(
            salesData.total
        ).toFixed(2);

}


// ==========================================
// START APP
// ==========================================

renderProducts();

renderCart();

updateDashboard();

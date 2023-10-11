document.addEventListener("DOMContentLoaded", function () {
  const aspectRatio = 1.5; //aspectRatio
  const desiredHeight = 350; //altezza massima in px

  const bookListContainer = document.getElementById("bookList");
  const cartRow = document.getElementById("cartRow");
  const cartContainer = document.getElementById("cart");
  const buyBtn = document.getElementById("buyBtn");

  fetch("https://striveschool-api.herokuapp.com/books")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((book) => {
        // crea una card per ogni libro
        const card = document.createElement("div");

        card.className = "col-lg-3 col-md-4 col-sm-6 col-12 mb-4";
        card.innerHTML = `
                    <div class="card">
                        <img src="${book.img}" class="card-img-top img-fluid custom-img" alt="${book.title}">
                        <div class="card-body d-flex flex-column align-items-start justify-content-between">
                            <div class="card-main mw-100">                                
                                <h5 class="card-title mw-100 text-nowrap overflow-hidden text-truncate"><span>${book.title}</span></h5>
                                <p class="card-text">Prezzo: $${book.price}</p>
                            </div>
                            <div class="card-btns">
                                <button class="btn btn-danger" onclick="removeCard(this)">Scarta</button>
                                <button class="btn btn-success" onclick="addToCart('${book.title}', ${book.price})">Compra ora</button>
                            </div>
                        </div>
                    </div>
                `;
        bookListContainer.appendChild(card);
        const img = card.querySelector(".custom-img");
        const calculatedHeight = aspectRatio * img.clientWidth;
        img.style.height = `${Math.min(calculatedHeight, desiredHeight)}px`;
      });
    })
    .catch((error) => console.error("Error fetching books:", error));

  // carica il carrello dal local storage
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  console.log(cart, cart.length);

  // mostra i libri nel carrello
  function displayCart() {
    cartContainer.innerHTML = "";
    if (!(cart.length === 0)) {
      cartRow.classList.remove("d-none");
      cart.forEach((item) => {
        const li = document.createElement("li");
        li.className =
          "list-group-item d-flex justify-content-between align-items-center";
        li.innerHTML = `
                ${item.title} - $${item.price}
                <button class="btn btn-danger btn-sm" onclick="removeFromCart('${item.title}')">Rimuovi</button>
            `;
        cartContainer.appendChild(li);
      });
    } else {
      cartRow.classList.add("d-none");
    }
  }

  // aggiungi libro al carrello
  window.addToCart = function (title, price) {
    cart.push({ title, price });
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
  };

  // rimuovi libro dal carrello
  window.removeFromCart = function (title) {
    const index = cart.findIndex((item) => item.title === title);
    if (index !== -1) {
      cart.splice(index, 1);
      localStorage.setItem("cart", JSON.stringify(cart));
      displayCart();
    }
  };

  // rimuovi card dalla bookList
  window.removeCard = function (button) {
    const card = button.closest(".card");
    card.style.display = "none";
  };

  // richiama displayCart al caricamento della pagina
  displayCart();

  // Click del bottone compra nel carrello
  buyBtn.addEventListener("click", function () {
    alert("Grazie per il tuo acquisto!");
    // dopo aver acquistato rimuove tutto dal carrello
    cart.length = 0;
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
  });
});

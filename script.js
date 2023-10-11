document.addEventListener("DOMContentLoaded", function () {
  const aspectRatio = 1.5; //aspectRatio
  const desiredHeight = 350; //altezza massima in px

  const bookListContainer = document.getElementById("bookList");
  const cartRow = document.getElementById("cartRow");
  const cartContainer = document.getElementById("cart");
  const buyBtn = document.getElementById("buyBtn");
  const cartPrice = document.getElementById("cartPrice");

  let cartTotal = 0;

  const resizeImg = function (
    card = undefined,
    img = undefined,
    _desiredHeight = desiredHeight
  ) {
    console.log(_desiredHeight);
    if (img && card) {
      const calculatedHeight = aspectRatio * img.clientWidth;
      img.style.height = `${Math.min(calculatedHeight, _desiredHeight)}px`;
    } else {
      const allImg = document.querySelectorAll(".custom-img");
      const img = Array.from(allImg);
      img.forEach((image) => {
        const calculatedHeight = aspectRatio * image.clientWidth;
        console.log(image.clientWidth);
        image.style.height = `${Math.min(calculatedHeight, desiredHeight)}px`;
      });
    }
  };

  window.addEventListener("resize", () => {
    console.log("resizing");
    resizeImg();
  });

  const openCard = function (book = undefined) {
    if (!book) {
      throw new Error('"book" è undefined');
    } else {
      const openedBook = document
        .querySelector(".openedBook")
        .querySelector("div");
      console.log(openedBook);
      openedBook.classList.remove("d-none");
      console.log(book);
      openedBook.innerHTML = `
                              <img src="${book.img}" class="card-img-top img-fluid custom-img" alt="${book.title}">
                              <div class="card-body d-flex flex-column align-items-start justify-content-between">
                                  <div class="card-main mw-100">                                
                                      <h5 class="card-title mw-100 text-nowrap overflow-hidden text-truncate"><span>${book.title}</span></h5>
                                      <p class="card-text">Prezzo: $${book.price}</p>
                                      <p class="opacity-75">Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem, voluptatum!</p>
                                  </div>
                                  <div class="card-btns">
                                      <button class="btn btn-danger" onclick="removeCard(this)">Scarta</button>
                                      <button class="btn btn-success" onclick="addToCart('${book.title}', ${book.price})">Compra ora</button>
                                  </div>
                                  <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger close-Card-btn" role="button">
                                  X
                                  <span class="visually-hidden">unread messages</span>
                                </span>
                              
                              </div>`;
      const img = openedBook.querySelector(".custom-img");
      resizeImg(openedBook, img, desiredHeight + 100);

      const overlay = document.querySelector(".overlay-gray");
      overlay.classList.remove("d-none");

      openedBook
        .querySelector(".close-Card-btn")
        .addEventListener("click", closeCard);
    }
  };

  const closeCard = function () {
    const openedBook = document
      .querySelector(".openedBook")
      .querySelector("div");
    const overlay = document.querySelector(".overlay-gray");
    overlay.classList.add("d-none");
    openedBook.classList.add("d-none");
  };

  fetch("https://striveschool-api.herokuapp.com/books")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((book) => {
        // crea una card per ogni libro
        const card = document.createElement("div");

        card.className = "col-lg-3 col-md-4 col-sm-6 col-12 mb-4";
        card.innerHTML = `
                    <div class="card">
                        <img src="${
                          book.img
                        }" class="card-img-top img-fluid custom-img" alt="${
          book.title
        }">
                        <div class="card-body d-flex flex-column align-items-start justify-content-between">
                            <div class="card-main mw-100">                                
                                <h5 class="card-title mw-100 text-nowrap overflow-hidden text-truncate" role="button"><span>${
                                  book.title
                                }</span></h5>
                                <p class="card-text">Prezzo: $${book.price}</p>
                            </div>
                            <div class="card-btns">
                                <button class="btn btn-danger" onclick="removeCard(this)">Scarta</button>
                                <button class="btn btn-success" onclick="addToCart('${book.title.replace(
                                  /'/g,
                                  "^"
                                )}', ${book.price})">Compra ora</button>
                            </div>
                        </div>
                    </div>
                `;
        bookListContainer.appendChild(card);
        card.querySelector("h5").addEventListener("click", () => {
          openCard(book);
        });
        const img = card.querySelector(".custom-img");
        resizeImg(card, img);
      });
    })
    .catch((error) => console.error("Error fetching books:", error));

  // carica il carrello dal local storage
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cartTotal = localStorage.getItem("cartTotal") || 0;
  console.log(cartTotal, parseFloat(parseFloat(0).toFixed(2)));
  cartTotal = parseFloat(parseFloat(cartTotal).toFixed(2));
  console.log(cartTotal);
  console.log(cart, cart.length);

  // mostra i libri nel carrello (da finire il responsive)
  function displayCart() {
    cartContainer.innerHTML = "";
    if (!(cart.length === 0)) {
      cartRow.classList.remove("d-none");
      cart.forEach((item) => {
        const li = document.createElement("li");
        li.className =
          "list-group-item d-flex justify-content-between align-items-center flex-md-row flex-column";
        li.innerHTML = `
                <div class="w-100 text-nowrap overflow-hidden text-truncate d-flex justify-content-start align-items-center flex-md-row flex-column">
                    <span class="text-nowrap overflow-hidden text-truncate" style="width="min-content"">${
                      item.title
                    } - </span>
                    <span class="">${item.price}</span>
                </div>
                <button class="btn btn-danger btn-sm" onclick="removeFromCart('${item.title.replace(
                  /'/g,
                  "^"
                )}', '${item.price}')">Rimuovi</button>
            `;
        cartContainer.appendChild(li);
        cartPrice.textContent = cartTotal;
      });
    } else {
      cartRow.classList.add("d-none");
    }
  }

  // aggiungi libro al carrello
  window.addToCart = function (title, price) {
    console.log(title);
    title = title.replace(/\^/g, "'"); //se non rimpiazzavo tutte gli ' nel titolo con un altro carattere dava problemi nell'html.
    console.log(title);
    cartTotal += price;
    console.log(cartTotal);
    // cartTotal = cartTotal.toFixed(2);
    cart.push({ title, price });
    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.setItem("cartTotal", cartTotal);
    displayCart();
  };

  // rimuovi libro dal carrello
  window.removeFromCart = function (title, price) {
    title = title.replace(/\^/g, "'");
    const index = cart.findIndex((item) => item.title === title);
    if (index !== -1) {
      cart.splice(index, 1);
      cartTotal -= price;
      localStorage.setItem("cart", JSON.stringify(cart));
      localStorage.setItem("cartTotal", cartTotal);
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
    cartTotal = 0;
    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.setItem("cartTotal", cartTotal);
    displayCart();
  });
});

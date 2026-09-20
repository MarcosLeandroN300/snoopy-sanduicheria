const WA = "5562994628096";

const cart = document.getElementById("cart"),
  overlay = document.getElementById("overlay");

const cartItems = document.getElementById("cartItems"),
  cartCount = document.getElementById("cartCount"),
  cartTotal = document.getElementById("cartTotal");

const toast = document.getElementById("toast");

let items = [];

// ==============================
// FORMATAÇÃO DE PREÇO
// ==============================

function money(n) {
  return n.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

// ==============================
// CARRINHO
// ==============================

function openCart() {
  cart.classList.add("open");
  overlay.classList.add("show");
  document.body.classList.add("lock");
}

function closeCart() {
  cart.classList.remove("open");
  overlay.classList.remove("show");
  document.body.classList.remove("lock");
}

document.getElementById("openCart").onclick = openCart;
document.getElementById("closeCart").onclick = closeCart;
overlay.onclick = closeCart;

// ==============================
// MENU MOBILE
// ==============================

const mobileMenu = document.getElementById("mobileMenu"),
  mobileNav = document.getElementById("mobileNav");

mobileMenu.onclick = () => mobileNav.classList.toggle("open");

mobileNav
  .querySelectorAll("a")
  .forEach((a) => (a.onclick = () => mobileNav.classList.remove("open")));

// ==============================
// FILTROS / CATEGORIAS
// ==============================

function setFilter(filter) {
  document
    .querySelectorAll(".filter,.category-card")
    .forEach((b) =>
      b.classList.toggle("active", b.dataset.filter === filter)
    );

  document.querySelectorAll(".product").forEach(
    (p) =>
      (p.style.display =
        filter === "all" || p.dataset.cat === filter ? "" : "none")
  );
}

document
  .querySelectorAll(".filter,.category-card")
  .forEach((btn) => (btn.onclick = () => setFilter(btn.dataset.filter)));

// ==============================
// ADICIONAR PRODUTOS AO CARRINHO
// ==============================

document.querySelectorAll(".add").forEach(
  (btn) =>
    (btn.onclick = () => {
      const p = btn.closest(".product");
      const id = p.dataset.id;

      const found = items.find((x) => x.id === id);

      if (found) {
        found.qty++;
      } else {
        items.push({
          id,
          name: p.dataset.name,
          price: Number(p.dataset.price),
          qty: 1,
          img: p.querySelector("img").src,
        });
      }

      renderCart();
      openCart();
      showToast();
    })
);

// ==============================
// BOTÃO DE COMBO
// ==============================

document.querySelector(".jump-combo").onclick = () => {
  const p = document.querySelector('.product[data-id="combo-x-tudo"]');

  const found = items.find((x) => x.id === "combo-x-tudo");

  if (found) {
    found.qty++;
  } else {
    items.push({
      id: "combo-x-tudo",
      name: p.dataset.name,
      price: Number(p.dataset.price),
      qty: 1,
      img: p.querySelector("img").src,
    });
  }

  renderCart();
  openCart();
  showToast();
};

// ==============================
// RENDERIZAR CARRINHO
// ==============================

function renderCart() {
  let total = 0;
  let count = 0;

  if (!items.length) {
    cartItems.innerHTML =
      '<div class="empty">Seu carrinho está vazio.<br><span>Adicione algo gostoso.</span></div>';
  } else {
    cartItems.innerHTML = "";

    items.forEach((x, i) => {
      total += x.price * x.qty;
      count += x.qty;

      const row = document.createElement("div");

      row.className = "cart-row";

      row.innerHTML = `
        <img src="${x.img}" alt="${x.name}">

        <div>
          <h4>${x.name}</h4>

          <p>${money(x.price)} cada</p>

          <div class="qty">
            <button data-a="${i}">−</button>

            <span>${x.qty}</span>

            <button data-p="${i}">+</button>
          </div>

          <div class="sub">
            ${money(x.price * x.qty)}
          </div>
        </div>

        <button class="remove" data-r="${i}">
          Remover
        </button>
      `;

      cartItems.appendChild(row);
    });
  }

  cartCount.textContent = count;
  cartTotal.textContent = money(total);

  // Diminuir quantidade
  cartItems.querySelectorAll("[data-a]").forEach(
    (b) =>
      (b.onclick = () => {
        const i = Number(b.dataset.a);

        if (items[i].qty > 1) {
          items[i].qty--;
        }

        renderCart();
      })
  );

  // Aumentar quantidade
  cartItems.querySelectorAll("[data-p]").forEach(
    (b) =>
      (b.onclick = () => {
        const i = Number(b.dataset.p);

        items[i].qty++;

        renderCart();
      })
  );

  // Remover produto
  cartItems.querySelectorAll("[data-r]").forEach(
    (b) =>
      (b.onclick = () => {
        const i = Number(b.dataset.r);

        items.splice(i, 1);

        renderCart();
      })
  );
}

// ==============================
// AVISO "ADICIONADO AO CARRINHO"
// ==============================

function showToast() {
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 1200);
}

// ==============================
// FORMA DE PAGAMENTO
// ==============================

document.getElementById("payment").onchange = (e) => {
  document.getElementById("cash").hidden =
    e.target.value !== "Dinheiro";
};

// ==============================
// ENTREGA OU RETIRADA
// ==============================

document.getElementById("type").onchange = (e) => {
  const a = document.getElementById("address");

  a.hidden = e.target.value === "Retirada no local";

  if (a.hidden) {
    a.value = "";
  }
};

// ==============================
// FINALIZAR PEDIDO
// ==============================

document.getElementById("checkout").onclick = () => {
  // Verifica carrinho
  if (!items.length) {
    return alert("Seu carrinho está vazio.");
  }

  // Dados do cliente
  const name = document.getElementById("name").value.trim();

  const phone = document.getElementById("phone").value.trim();

  const type = document.getElementById("type").value;

  const address = document.getElementById("address").value.trim();

  const payment = document.getElementById("payment").value;

  const cash = document.getElementById("cash").value.trim();

  const obs = document.getElementById("obs").value.trim();

  // Validações
  if (!name) {
    return alert("Digite seu nome.");
  }

  if (phone.replace(/\D/g, "").length < 10) {
    return alert("Digite um telefone válido.");
  }

  if (!type) {
    return alert("Escolha entrega ou retirada.");
  }

  if (type === "Entrega" && !address) {
    return alert("Digite o endereço.");
  }

  if (!payment) {
    return alert("Escolha a forma de pagamento.");
  }

  // ==============================
  // MENSAGEM DO WHATSAPP
  // ==============================

  let total = 0;

  let msg =
    "*NOVO PEDIDO - SNOOPY SANDUICHERIA*\n\n";

  msg +=
    "*DADOS DO CLIENTE*\n" +
    "Nome: " +
    name +
    "\n" +
    "Telefone: " +
    phone +
    "\n\n";

  msg +=
    "*RECEBIMENTO*\n" +
    "Tipo: " +
    type +
    "\n";

  if (type === "Entrega") {
    msg +=
      "Endereco: " +
      address +
      "\n";
  }

  msg +=
    "Pagamento: " +
    payment +
    "\n";

  if (payment === "Dinheiro" && cash) {
    msg +=
      "Valor para troco: " +
      cash +
      "\n";
  }

  if (obs) {
    msg +=
      "Observacao: " +
      obs +
      "\n";
  }

  msg += "\n*PEDIDO*\n";

  // ==============================
  // PRODUTOS
  // ==============================

  items.forEach((x) => {
    const subtotal = x.price * x.qty;

    total += subtotal;

    msg +=
      `${x.qty}x ${x.name} - ${money(subtotal)}\n`;
  });

  // ==============================
  // TOTAL
  // ==============================

  msg +=
    `\n*TOTAL: ${money(total)}*`;

  // ==============================
  // ABRIR WHATSAPP
  // ==============================

  const whatsappURL =
    "https://wa.me/" +
    WA +
    "?text=" +
    encodeURIComponent(msg);

  window.open(whatsappURL, "_blank");
};

// ==============================
// ANIMAÇÕES AO ROLAR A PÁGINA
// ==============================

const observer = new IntersectionObserver(
  (entries) =>
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
      }
    }),
  {
    threshold: 0.12,
  }
);

document
  .querySelectorAll(".reveal")
  .forEach((el) => observer.observe(el));

// ==============================
// INICIALIZAÇÃO
// ==============================

renderCart();
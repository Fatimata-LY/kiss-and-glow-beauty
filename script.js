/* =========================================================
   KISS & GLOW BEAUTY — script.js (version 2)
   Toutes les fonctionnalités du site sont ici.

   SOMMAIRE
   1.  Réglages (numéro WhatsApp, devise)
   2.  Liste des produits (noms, prix, descriptions, images)
   3.  Outils (prix, total)
   4.  Animations d'apparition
   5.  Catalogue et filtres
   6.  Panier
   7.  Commande WhatsApp
   8.  Menu (téléphone) et voile sombre
   9.  Menu : lien actif pendant le défilement
   10. Gestion des clics
   11. Démarrage du site
   ========================================================= */


/* =========================================================
   1. RÉGLAGES
   Pour changer le numéro WhatsApp, modifie seulement la ligne ci-dessous.
   (Format : indicatif du pays + numéro, sans « + » ni espaces)
   ========================================================= */
const WHATSAPP_NUMBER = '221773022264';
const CURRENCY = 'FCFA';


/* =========================================================
   2. LISTE DES PRODUITS
   Pour changer un prix, un nom ou une description, modifie ici.
   Pour ajouter un produit, copie un bloc { ... }, sépare-le par une virgule
   et mets l'image dans le dossier images/.

   - id    : identifiant unique (sans espace)
   - name  : nom affiché
   - price : prix en FCFA (nombre, sans espace)
   - range : étiquette affichée sur la carte (GM ou PM)
   - img   : nom exact du fichier dans le dossier images/
   - desc  : description courte
   ========================================================= */
const products = [
  {
    id: 'cherry2500',
    name: 'Cherry Glow',
    price: 2500,
    range: 'GM',
    img: 'cherry-flow-2500.jpeg',
    desc: '🍓 Goût : Fraise — gloss rouge intense et brillant.'
  },
  {
    id: 'berry2500',
    name: 'Berry Glow',
    price: 2500,
    range: 'GM',
    img: 'berry-glow-2500.jpeg',
    desc: '🍬 Goût : Chewing-gum — gloss rose doux et lumineux.'
  },
  {
    id: 'caramel2500',
    name: 'Caramel Kiss',
    price: 2500,
    range: 'GM',
    img: 'caramel-kiss-2500.jpeg',
    desc: '🍫 Goût : Chocolat vanille — gloss marron caramel, chic et chaleureux.'
  },
  {
    id: 'glassy2500',
    name: 'Glassy Glow',
    price: 2500,
    range: 'GM',
    img: 'glassy-glow-2500.jpeg',
    desc: '🍉 Goût : Pastèque — gloss transparent et lumineux.'
  },
  {
    id: 'cherry1500',
    name: 'Cherry Glow PM',
    price: 1500,
    range: 'PM',
    img: 'cherry-flow-1500.jpeg',
    desc: '🍓 Goût : Fraise — petit modèle (PM), teinte rouge.'
  },
  {
    id: 'berry1500',
    name: 'Berry Glow PM',
    price: 1500,
    range: 'PM',
    img: 'berry-glow-1500.jpeg',
    desc: '🍬 Goût : Chewing-gum — petit modèle (PM), teinte rose.'
  },
  {
    id: 'caramel1500',
    name: 'Caramel Kiss PM',
    price: 1500,
    range: 'PM',
    img: 'caramel-kiss-1500.jpeg',
    desc: '🍫 Goût : Chocolat vanille — petit modèle (PM), teinte marron.'
  },
  {
    id: 'glassy1500',
    name: 'Glassy Glow PM',
    price: 1500,
    range: 'PM',
    img: 'glassy-glow-1500.jpeg',
    desc: '🍉 Goût : Pastèque — petit modèle (PM), teinte transparente.'
  }
];

// Le panier : liste des articles choisis (vide au départ)
let cart = [];


/* =========================================================
   3. OUTILS
   ========================================================= */

// Transforme 2500 en « 2 500 FCFA »
function money(amount) {
  // Espace insécable tous les 3 chiffres : 1500 -> « 1 500 »
  const spaced = String(amount).replace(/\B(?=(\d{3})+(?!\d))/g, '\u00A0');
  return spaced + ' ' + CURRENCY;
}

// Calcule le total du panier
function getCartTotal() {
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}


/* =========================================================
   4. ANIMATIONS D'APPARITION
   Les éléments qui ont la classe "reveal" apparaissent doucement
   quand ils entrent dans l'écran.
   ========================================================= */
let revealObserver = null;

if ('IntersectionObserver' in window) {
  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
}

// Surveille tous les éléments "reveal" d'une zone de la page
function watchReveals(root = document) {
  root.querySelectorAll('.reveal:not(.is-visible)').forEach(element => {
    if (revealObserver) {
      revealObserver.observe(element);
    } else {
      element.classList.add('is-visible');   // anciens navigateurs : affichage direct
    }
  });
}


/* =========================================================
   5. CATALOGUE ET FILTRES
   ========================================================= */

// Affiche les produits. filter = 'all', '2500' ou '1500'
function renderProducts(filter = 'all') {
  const grid = document.getElementById('products');

  const visibleProducts = products.filter(product =>
    filter === 'all' || String(product.price) === filter
  );

  grid.innerHTML = visibleProducts.map((product, index) => `
    <article class="product-card reveal" style="--i:${index % 4}">
      <div class="product-card__media">
        <img class="product-card__image" src="images/${product.img}" alt="${product.name}" loading="lazy">
        <span class="product-card__tag">${product.range}</span>
      </div>
      <div class="product-card__body">
        <div class="product-card__top">
          <h3 class="product-card__name">${product.name}</h3>
          <p class="product-card__price">${money(product.price)}</p>
        </div>
        <p class="product-card__desc">${product.desc}</p>
        <button class="product-card__button" type="button"
                data-action="add-to-cart" data-id="${product.id}">
          Ajouter au panier
        </button>
      </div>
    </article>
  `).join('');

  // « 4 glosses » / « 8 glosses »
  const count = visibleProducts.length;
  document.getElementById('resultCount').textContent = count + ' gloss' + (count > 1 ? 'es' : '');

  watchReveals(grid);
}

// Met en valeur le bon filtre, puis affiche les produits
function applyFilter(filter) {
  document.querySelectorAll('.filter').forEach(button => {
    button.classList.toggle('active', button.dataset.filter === filter);
  });
  renderProducts(filter);
}


/* =========================================================
   6. PANIER
   ========================================================= */

// Ajoute un produit (ou +1 s'il est déjà dans le panier)
function addToCart(id) {
  const product = products.find(item => item.id === id);
  if (!product) return;

  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  renderCart();
  bumpCount();
  openCart();
}

// Change la quantité (delta = +1 ou -1). À 0, l'article disparaît.
function changeQty(id, delta) {
  const item = cart.find(entry => entry.id === id);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(entry => entry.id !== id);
  }

  renderCart();
}

// Petite animation sur la pastille du nombre d'articles
function bumpCount() {
  document.querySelectorAll('.cart-count').forEach(badge => {
    badge.classList.remove('bump');
    void badge.offsetWidth;            // relance l'animation
    badge.classList.add('bump');
  });
}

// Met à jour tout ce qui concerne le panier à l'écran
function renderCart() {
  const list = document.getElementById('cartList');
  const totalBox = document.getElementById('total');

  // Nombre d'articles dans les pastilles « Panier »
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  document.querySelectorAll('.cart-count').forEach(badge => {
    badge.textContent = totalItems;
  });

  // Panier vide
  if (cart.length === 0) {
    list.innerHTML = '<div class="cart__empty">Ton panier est vide.</div>';
    totalBox.textContent = money(0);
    return;
  }

  // Panier avec des articles
  list.innerHTML = cart.map(item => `
    <div class="cart__item">
      <img class="cart__thumb" src="images/${item.img}" alt="${item.name}">
      <div>
        <div class="cart__item-name">${item.name}</div>
        <div class="cart__item-price">${money(item.price)}</div>
      </div>
      <div class="cart__qty">
        <button type="button" data-action="change-qty" data-id="${item.id}" data-delta="-1" aria-label="Retirer un">−</button>
        <b>${item.qty}</b>
        <button type="button" data-action="change-qty" data-id="${item.id}" data-delta="1" aria-label="Ajouter un">+</button>
      </div>
    </div>
  `).join('');

  totalBox.textContent = money(getCartTotal());
}

function isCartOpen() {
  return document.getElementById('cart').classList.contains('open');
}

function openCart() {
  document.getElementById('cart').classList.add('open');
  setMenu(false);
  updateScrim();
}

function closeCart() {
  document.getElementById('cart').classList.remove('open');
  updateScrim();
}

function toggleCart() {
  if (isCartOpen()) {
    closeCart();
  } else {
    openCart();
  }
}


/* =========================================================
   7. COMMANDE WHATSAPP
   ========================================================= */
function sendOrder() {
  if (cart.length === 0) {
    alert('Ajoute au moins un article au panier.');
    return;
  }

  const name = document.getElementById('customerName').value.trim();
  const phone = document.getElementById('customerPhone').value.trim();
  const address = document.getElementById('customerAddress').value.trim();

  if (!name || !phone || !address) {
    alert('Remplis ton nom, ton téléphone et ton adresse.');
    return;
  }

  // Une ligne par article : « • Cherry Glow x2 = 5 000 FCFA »
  const lines = cart
    .map(item => `• ${item.name} x${item.qty} = ${money(item.price * item.qty)}`)
    .join('\n');

  const message =
    `Bonjour Kiss & Glow !\n\n` +
    `Je souhaite commander :\n${lines}\n\n` +
    `Total : ${money(getCartTotal())}\n` +
    `Nom : ${name}\n` +
    `Téléphone : ${phone}\n` +
    `Adresse : ${address}`;

  window.open(
    'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(message),
    '_blank'
  );
}


/* =========================================================
   8. MENU (TÉLÉPHONE) ET VOILE SOMBRE
   ========================================================= */

// Ouvre (true) ou ferme (false) le menu qui glisse depuis la gauche
function setMenu(isOpen) {
  const sidebar = document.getElementById('sidebar');
  const button = document.getElementById('menuToggle');

  sidebar.classList.toggle('open', isOpen);
  button.setAttribute('aria-expanded', String(isOpen));
  button.setAttribute('aria-label', isOpen ? 'Fermer le menu' : 'Ouvrir le menu');
  updateScrim();
}

// Affiche le voile sombre si le menu ou le panier est ouvert
function updateScrim() {
  const menuOpen = document.getElementById('sidebar').classList.contains('open');
  const anyOpen = menuOpen || isCartOpen();

  document.getElementById('scrim').classList.toggle('show', anyOpen);
  document.body.classList.toggle('no-scroll', anyOpen);
}

function closeOverlays() {
  setMenu(false);
  closeCart();
}


/* =========================================================
   9. MENU : LIEN ACTIF PENDANT LE DÉFILEMENT
   Le lien de la section affichée devient rose.
   ========================================================= */
function watchActiveSection() {
  if (!('IntersectionObserver' in window)) return;

  const links = document.querySelectorAll('.sidebar__link');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      links.forEach(link => {
        link.classList.toggle('is-active', link.getAttribute('href') === '#' + entry.target.id);
      });
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  links.forEach(link => {
    const section = document.querySelector(link.getAttribute('href'));
    if (section) sectionObserver.observe(section);
  });
}


/* =========================================================
   10. GESTION DES CLICS
   Un seul « écouteur » repère le bouton cliqué grâce aux attributs data-
   du HTML (data-action, data-filter, data-collection).
   ========================================================= */
document.addEventListener('click', event => {

  // Boutons d'action : panier, quantités, commande, voile sombre
  const actionButton = event.target.closest('[data-action]');
  if (actionButton) {
    const action = actionButton.dataset.action;

    if (action === 'toggle-cart') toggleCart();
    if (action === 'send-order') sendOrder();
    if (action === 'close-overlays') closeOverlays();
    if (action === 'change-qty') {
      changeQty(actionButton.dataset.id, Number(actionButton.dataset.delta));
    }
    if (action === 'add-to-cart') {
      addToCart(actionButton.dataset.id);

      // Petit message de confirmation sur le bouton
      const originalText = actionButton.textContent.trim();
      actionButton.classList.add('is-added');
      actionButton.textContent = 'Ajouté';
      setTimeout(() => {
        actionButton.classList.remove('is-added');
        actionButton.textContent = originalText;
      }, 1400);
    }
    return;
  }

  // Boutons de filtre (Tous / 2 500 / 1 500)
  const filterButton = event.target.closest('.filter');
  if (filterButton) {
    applyFilter(filterButton.dataset.filter);
    return;
  }

  // Liens des collections GM / PM (le lien défile vers la boutique, on applique le filtre)
  const collectionLink = event.target.closest('[data-collection]');
  if (collectionLink) {
    applyFilter(collectionLink.dataset.collection);
    return;
  }

  // Bouton du menu (téléphone)
  if (event.target.closest('#menuToggle')) {
    const isOpen = document.getElementById('sidebar').classList.contains('open');
    setMenu(!isOpen);
    return;
  }

  // Clic sur un lien du menu : on referme le menu
  if (event.target.closest('.sidebar__link')) {
    setMenu(false);
  }
});

// La touche Échap ferme le menu et le panier
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    closeOverlays();
  }
});


/* =========================================================
   11. DÉMARRAGE DU SITE
   ========================================================= */
renderProducts();
renderCart();
watchReveals();
watchActiveSection();

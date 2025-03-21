import { initializeApp } from "firebase/app";
import {
  getAuth,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD25Optg0uOCxwMZSzz_55BHt80Q0bdAxY",
  authDomain: "final-9c26c.firebaseapp.com",
  projectId: "final-9c26c",
  storageBucket: "final-9c26c.firebasestorage.app",
  messagingSenderId: "778908011025",
  appId: "1:778908011025:web:b6f85f8df5fbd161447fb0",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

function initListeners() {
  $(window).on("hashchange", getPage);
  getPage();
  updateCartCount();
  getData();
  modalInjection();
}

$(document).on("click", "#signOut", function (e) {
  signOut(auth)
    .then(() => {
      e.preventDefault();
      $("#modal-inject .modal-wrapper3").hide();
      $("#modal-wrap1, #modal-wrap2").toggle();
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert("Error Message: " + errorMessage);
    });
});

$(document).on("click", "#signIn", function (e) {
  e.preventDefault();
  let email = $("#email").val();
  let pw = $("#pw").val();
  signInWithEmailAndPassword(auth, email, pw)
    .then((userCredential) => {
      // Signed In
      const user = userCredential.user;
      e.preventDefault();
      $("#modal-inject").css("display", "none");
      $("#modal-inject .modal-wrapper2").css("display", "none");
      $("#modal-inject .modal-wrapper1").css("display", "none");
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert("Error Message: " + errorMessage);
    });
});

$(document).on("click", "#createAcctBtn", function (e) {
  e.preventDefault();
  let emailSignUp = $("#emailSignUp").val();
  let pwSignUp = $("#pwSignUp").val();
  let fName = $("#fName").val();
  createUserWithEmailAndPassword(auth, emailSignUp, pwSignUp)
    .then((userCredential) => {
      // Signed up
      const user = userCredential.user;
      console.log(user);
      $("#modal-inject").css("display", "none");
      $("#modal-inject .modal-wrapper2").css("display", "none");
      $("#modal-inject .modal-wrapper1").css("display", "none");
      alert("Welcome! " + fName);
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert("Error Message: " + errorMessage);
    });
});
// FIRE BASE
//MVC URL LISTENER
function getPage() {
  let hash = window.location.hash;
  let pageID = hash.replace("#", "");

  if (pageID != "" && pageID != "home") {
    $.get(`pages/${pageID}.html`, function (data) {
      $("#app").html(data);
      loadCart();
    });
  } else {
    $.get(`pages/home.html`, function (data) {
      $("#app").html(data);
      loadItems();
    });
  }
}
//MVC URL LISTENER
// MOBILE MENU
$(".hamburger-icon").on("click", () => {
  $(".hamburger-icon").toggleClass("open");
  $("body").toggleClass("mobile-overflow");
});
// MOBILE MENU
function getData() {
  $.get(`data/data.json`, (data) => {
    productInfo = data;
    console.log(productInfo);
    loadItems();
    updateCartCount();
  }).fail(function (error) {
    alert("error " + error);
  });
}
getData();

var cartCount = 0;
var productInfo = {};

$(".checkout-button").on("click", function () {
  productInfo.Cart = [];
  cartCount = 0;
  updateCartCount();
});
$("form").on("submit", () => {
  e.preventDefault();
});
function loadCart() {
  $(".cart").html("");
  let subtotal = 0;

  console.log("Loading cart items...");

  $.each(productInfo.Cart, (idx, cartItem) => {
    let item = productInfo.Products[cartItem.itemIdx];

    subtotal += parseFloat(item.realPrice);

    console.log(
      `Item ${idx}: ${item.title}, Price: ${item.realPrice}, Subtotal so far: ${subtotal}`
    );

    $(".cart").append(`
      <div class="cart-box">
        <div class="x-btn">
          <a href="#">Save For Later</a>
          <p class="remove-item" data-index="${idx}">X</p>
        </div>
        <div class="cart-main">
          <img src="images/Products/${item.image}" ${item.imagePosition} />
          <div class="cart-name">
            <p>Keurig®</p>
            <h3 class="cart-title">${item.title}</h3>
          </div>
          <div class="points">
            <h2>Estimated Points: <span>0</span></h2>
            <p>i</p>
          </div>
        </div>
        <div class="qty">
          <p>$${item.realPrice} each</p>
          <select>
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
          </select>
        </div>
        <p class="cart-subtotal">$${item.realPrice}</p>
      </div>
    `);
  });

  $(".real-cart-sub").text(`$${subtotal.toFixed(2)}`);

  $(".remove-item").on("click", function () {
    let itemIndex = $(this).data("index");

    productInfo.Cart.splice(itemIndex, 1);

    loadCart();

    updateCartCount();
  });
}

function loadItems() {
  $(".all-items-container").html("");
  console.log("loadItems function called");
  console.log("productInfo:", productInfo);

  const totalProducts = productInfo.Products.length;
  const adIndex = 7;
  $.each(productInfo.Products, (idx, item) => {
    if (idx === adIndex) {
      $(".all-items-container").append(`
         <div class="ad-box"></div>
      `);
    }
    let productHTML = `
      <div class="item-box">
        ${
          item.productBanner
            ? `<div class="pbanner" style="background-color: ${item.productBannerColor}; color: ${item.productBannerTextColor};">
          ${item.productBanner}
        </div>`
            : ""
        }
        <img src="images/Products/${item.image}" ${item.imagePosition} />
        <div class="colorbtns">
          ${item.colors}
        </div>
        <div class="item-title">${item.title}</div>
        <div class="item-price">
          <div>
            <span>${item.price1}</span>
            <div class="before-price">${item.beforePrice}</div>
          </div>
          <p>${item.start}</p>
        </div>
        <span>${item.line}</span>
        <div class="item-price2 ">
        
          <span style="color: ${item.price2Color};">${item.price2}</span>
          <p>${item.discnt}</p>
        </div>
        ${
          item.beforePrice2
            ? `<div class="before-price2">${item.beforePrice2}</div>`
            : ""
        }
    `;

    if (item.coupon && item.coupon.trim() !== "") {
      productHTML += `
        <div class="coupon">
          <div class="couponSticker">
            <p>COUPON</p>
          </div>
          <p>${item.coupon}</p>
        </div>
      `;
    }
    if (item.sale && item.sale.trim() !== "") {
      productHTML += `
        <div class="sale">
          <div class="saleSticker">
            <p>Sale</p>
          </div>
          <p>${item.sale}</p>
        </div>
      `;
    }

    productHTML += `
      <div class="item-rating">
        <div class="stars">
          <i class="fa-solid fa-star"></i>
          <i class="fa-solid fa-star"></i>
          <i class="fa-solid fa-star"></i>
          <i class="fa-solid fa-star"></i>
          <i class="fa-solid fa-star starblank"></i>
        </div>
        <div class="rating">${item.rating1} | (${item.rating2})</div>
      </div>
      <div class="shipping">
        <i class="fa-solid fa-truck-fast fa-flip-horizontal"></i>Free shipping
      </div>
      <div class="compare">
        <input type="checkbox" />
        <p>Compare</p>
      </div>
      <div class="buy-now" id="${idx}")">BUY NOW</div>
    </div>
    `;

    $(".all-items-container").append(productHTML);
  });

  $(".buy-now").on("click", (e) => {
    console.log("click");
    let productIdx = e.currentTarget.id;
    let obj = {
      itemIdx: productIdx,
    };

    productInfo.Cart.push(obj);
    console.log(productInfo.Cart);
    cartCount = productInfo.Cart.length;
    updateCartCount();
  });
}

function updateCartCount() {
  if (cartCount == 0) {
    $(".cartCounter").css("display", "none");
  } else if (cartCount >= 1) {
    $(".cartCounter").css("display", "flex");
    $(".cartCounter").html(cartCount);
  }
}

function modalToggle() {
  $(".login").on("click", (e) => {
    $("#modal-inject").toggle();
    $("#modal-inject").css("display", "flex");
  });
  $(".close").on("click", (e) => {
    $("#modal-inject").toggle();
  });
}
function modalInjection() {
  $(".signupToggle").on("click", (e) => {
    e.preventDefault();
    $("#modal-inject #modal-wrap1").css("display", "none");
    $("#modal-inject #modal-wrap2").css("display", "flex");
  });
  $(".loginToggle").on("click", (e) => {
    e.preventDefault();
    $("#modal-inject #modal-wrap2").css("display", "none");
    $("#modal-inject #modal-wrap1").css("display", "flex");
  });
}
//MODAL INJECTION

$(document).on("click", ".login", function (e) {
  const user = auth.currentUser;
  hideAllModals();
  if (user) {
    $("#modal-wrap3").show();
  } else {
    $("#modal-wrap2, #modal-wrap1").toggle();
  }
});

function hideAllModals() {
  $(
    "#modal-inject .modal-wrapper, #modal-inject .modal-wrapper2, #modal-inject .modal-wrapper3"
  ).hide();
}

$(document).ready(function () {
  initListeners();
  getData();
  modalToggle();
});

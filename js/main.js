console.log("main js loaded");
if ("location" in window) {
  console.log(`path loaded in : ${window.location.href}`);
} else {
  console.log("invalid path");
}
document.addEventListener("DOMContentLoaded", function() {
  // Activate sidebar nav
  var elems = document.querySelectorAll(".sidenav");
  M.Sidenav.init(elems);
  loadNav();

  function loadNav() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4) {
        if (this.status != 200) return;

        // Muat daftar tautan menu
        document.querySelectorAll(".topnav, .sidenav").forEach(function(elm) {
          elm.innerHTML = xhttp.responseText;
        });

        // Daftarkan event listener untuk setiap tautan menu
        document
          .querySelectorAll(".sidenav a, .topnav a")
          .forEach(function(elm) {
            elm.addEventListener("click", function(event) {
              // Tutup sidenav
              var sidenav = document.querySelector(".sidenav");
              M.Sidenav.getInstance(sidenav).close();

              // Muat konten halaman yang dipanggil
              page = event.target.getAttribute("href").substr(1);
              loadPage(page);
            });
          });

        // Daftarkan event listener untuk menu lain
        document
          .getElementById("logo-container")
          .addEventListener("click", event => {
            page = event.target.getAttribute("href").substr(1);
            loadPage(page);
          });
      }
    };
    xhttp.open("GET", "nav.html", true);
    xhttp.send();
  }

  // Load page content
  var page = window.location.hash.substr(1);
  if (page == "") page = "home";
  loadPage(page);

  // dynamic hide and show footer
  var isScroll = false;
  window.addEventListener("scroll", function(e) {
    isScroll = true;
    console.log(isScroll);
    document.getElementsByClassName("footer-copyright")[0].style.display =
      "none";
    setTimeout(function() {
      isScroll = false;
      console.log(isScroll);
      document.getElementsByClassName("footer-copyright")[0].style.display =
        "block";
    }, 250);
  });
});

function loadPage(page) {
  console.log(`loading page ${page}....`);
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4) {
      var content = document.querySelector("#body-content");
      if (this.status == 200) {
        content.innerHTML = xhttp.responseText;
        // fetch news for articles
        if (page === "news") getArticles();
      } else if (this.status == 404) {
        content.innerHTML = "<p>Halaman tidak ditemukan.</p>";
      } else {
        content.innerHTML = "<p>Ups.. halaman tidak dapat diakses.</p>";
      }
    }
  };
  xhttp.open("GET", "pages/" + page + ".html", true);
  xhttp.send();
}

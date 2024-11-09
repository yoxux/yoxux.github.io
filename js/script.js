const body = document.body;
const select = (e) => document.querySelector(e);
const selectAll = (e) => document.querySelectorAll(e);

initScript();

/**
 * Init all scripts
 */
function initScript() {
  initNavMenu();
}

/**
 * Hamburger Nav Open/Close
 * Link Managed
 */
function initNavMenu() {
  $(document).ready(function () {
    $("aside .burger").click(function () {
      if ($("aside .burger").hasClass("active")) {
        $("aside .burger").removeClass("active");
        $(".body-wrapper").removeClass("nav-active");
      } else {
        $("aside .burger").addClass("active");
        $(".body-wrapper").addClass("nav-active");
      }
    });
    $(".mobile-nav a").click(function (e) {
      e.preventDefault();
      if ($("aside .burger").hasClass("active")) {
        $("aside .burger").removeClass("active");
        $(".body-wrapper").removeClass("nav-active");
      }
    });
  });
}

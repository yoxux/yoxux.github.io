const body = document.body;
const select = (e) => document.querySelector(e);
const selectAll = (e) => document.querySelectorAll(e);

initScript();

/**
 * Init all scripts
 */
function initScript() {
  initNavMenu();
  initPageContentSwitch();
  initHeaderTextAnimation();
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

/**
 * Enaible move one section to another in desktop
 */
function initPageContentSwitch() {
  function onResize() {
    $(".page-content .page").off();
    $("aside .logo a").off();

    if (window.innerWidth > 960) {
      $(".page-content .page").on("click", function (e) {
        if ($(this).hasClass("current")) return;
        if ($(this).hasClass("header"))
          $(this).parent().addClass("header-active");
        else $(this).parent().removeClass("header-active");

        const oldPage = $(this).siblings(".current");
        $(oldPage).removeClass("current");
        $(this).addClass("current");
      });

      $("aside .logo a").on("click", function (e) {
        e.preventDefault();
        $(".page-content header").trigger("click");
      });
    } else {
      // TODO: scroll to top
    }
  }

  $(document).ready(function () {
    onResize();
    $(window).resize(onResize);
  });
}

/**
 * Text typing animation
 */
function initHeaderTextAnimation() {
  const ANIMATION_STATUS = {
    normal: "NORMAL",
    reverse: "REVERSE",
    wait: "WAIT",
  };
  const INTERVALS = {
    normal: 120,
    reverse: 40,
    wait: 600,
  };

  const list = ["sviluppatore web.", "amante del caffé.", "web designer."];

  $(document).ready(function () {
    let start = performance.now();
    let currentStep = [ANIMATION_STATUS.normal, INTERVALS.normal];

    let index = 0;
    let charPosition = 0;

    function step(timestamp) {
      const [status, interval] = currentStep;
      const elapsed = timestamp - start;

      if (elapsed >= interval) {
        const currText = list[index].substring(0, charPosition + 1);
        if (status !== ANIMATION_STATUS.wait) {
          $(".header .who").text(currText);
        }

        switch (status) {
          case ANIMATION_STATUS.normal:
            if (charPosition < list[index].length) {
              ++charPosition;
              currentStep = [ANIMATION_STATUS.normal, INTERVALS.normal];
            } else {
              currentStep = [ANIMATION_STATUS.wait, INTERVALS.wait];
            }
            break;
          case ANIMATION_STATUS.reverse:
            if (charPosition >= 0) {
              --charPosition;
              currentStep = [ANIMATION_STATUS.reverse, INTERVALS.reverse];
            } else {
              index = (index + 1) % list.length;
              currentStep = [ANIMATION_STATUS.normal, INTERVALS.normal];
            }
            break;
          case ANIMATION_STATUS.wait:
            --charPosition;
            currentStep = [ANIMATION_STATUS.reverse, INTERVALS.reverse];
            break;
        }

        start = timestamp;
      }

      requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  });
}

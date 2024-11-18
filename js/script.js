/**
 * @typedef {import("gsap")} gsap
 * @typedef {import("jquery")} $
 */

gsap.registerPlugin(ScrollTrigger);

const body = document.body;
const select = (e) => document.querySelector(e);
const selectAll = (e) => document.querySelectorAll(e);

let aboutTweens = [];

initScript();

/**
 * Init all scripts
 */
function initScript() {
  initNavMenu();
  initPageContentSwitch();
  initHeaderTextAnimation();
  initImageSlider();
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
  let timer = null;

  function onResize() {
    $(".page-content .page").off();
    $("aside .logo a").off();
    clearTweens(aboutTweens);

    if (window.innerWidth > 960) {
      $(".page-content .page").on("click", function (e) {
        if ($(this).hasClass("current")) return;
        if ($(this).hasClass("header"))
          $(this).parent().addClass("header-active");
        else $(this).parent().removeClass("header-active");

        const oldPage = $(this).siblings(".current");
        $(oldPage).removeClass("current");
        $(this).addClass("current");
        $(".content", this).scrollTop(0);

        window.clearTimeout(timer);
        timer = setTimeout(
          initPagescripts.bind(this),
          600 /* flex-grow transition time */
        );
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
 * Initialize current specific scripts
 */
function initPagescripts() {
  const content = $(".content", this);

  if (content.hasClass("about-me")) {
    initAboutGsapAnim();
  }
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

/**
 * Image sliders button
 * Structure:
 * .image-slider
 *   .controls
 *     .back
 *     .forward
 *   .container
 *     .image
 */
function initImageSlider() {
  $(document).ready(function () {
    $(".image-slider").each(function () {
      const slider = $(this);
      const length = parseInt(slider.attr("data-length"));

      $(".controls .back", slider).click(function () {
        let current = parseInt(slider.attr("data-current"));
        if (current === 1) current = length + 1;

        $(".container", slider).css("left", `${-100 * (current - 2)}%`);
        slider.attr("data-current", current - 1);
      });

      $(".controls .forward", slider).click(function () {
        let current = parseInt(slider.attr("data-current"));
        if (current === length) current = 0;

        $(".container", slider).css("left", `${-100 * current}%`);
        slider.attr("data-current", current + 1);
      });
    });
  });
}

/**
 * Show skills progress on enter
 * About me page
 */
function initAboutGsapAnim() {
  if (aboutTweens.length) return;

  const progresses = gsap.utils.toArray(".about-me .skill .progress");

  aboutTweens.push(
    gsap.to(progresses, {
      width: (index, target, targets) => {
        const percentage = parseInt($(target).attr("data-percent"));
        return `${percentage}%`;
      },
      stagger: 0.1,
      scrollTrigger: {
        scroller: ".about-me",
        trigger: ".about-me .skills .right",
        start: "top 80%",
        toggleActions: "restart none none none",
      },
    }),

    gsap.to(".about-me .skills .right", {
      y: -160,
      scrollTrigger: {
        scroller: ".about-me",
        trigger: ".about-me .skills",
        start: "top 80%",
        scrub: 1,
      },
    }),

    gsap.to(".about-me .skills .left", {
      y: 50,
      scrollTrigger: {
        scroller: ".about-me",
        trigger: ".about-me .skills",
        start: "top 80%",
        scrub: 0.6,
      },
    })
  );
}

/**
 * Kill all the tweens and clear the array
 */
function clearTweens(tweens) {
  while (tweens.length > 0) {
    tweens.pop().kill();
  }
}

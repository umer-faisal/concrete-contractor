(function () {
  "use strict";

  // ===== Initialize navbar toggle
  function initNavbarToggle() {
    const navbarToggler = document.querySelector("#navbarToggler");
    const nav = document.querySelector("nav[data-state]");

    if (!navbarToggler || !nav) return;

    navbarToggler.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const currentState = nav.getAttribute("data-state");
      const newState = currentState === "active" ? "inactive" : "active";
      nav.setAttribute("data-state", newState);

      navbarToggler.setAttribute(
        "aria-label",
        newState === "active" ? "Close Menu" : "Open Menu"
      );
    });

    // Close the mobile menu when any navigation link is clicked.
    // This avoids relying on brittle class selectors that may include special characters.
    const mobileLinks = nav.querySelectorAll("a:not(.mobile-accordion-toggle)");
    mobileLinks.forEach((link) => {
      link.addEventListener("click", () => {
        nav.setAttribute("data-state", "inactive");
        navbarToggler.setAttribute("aria-label", "Open Menu");
      });
    });

    const accordionToggles = document.querySelectorAll(
      ".mobile-accordion-toggle"
    );
    accordionToggles.forEach((toggle) => {
      toggle.addEventListener("click", (e) => {
        e.preventDefault();
        const targetId = toggle.getAttribute("data-target");
        const targetContent = document.getElementById(targetId);
        const icon = toggle.querySelector(".mobile-accordion-icon");

        if (targetContent && icon) {
          const isHidden = targetContent.classList.contains("hidden");
          targetContent.classList.toggle("hidden");
          icon.classList.toggle("rotate-180");

          toggle.setAttribute("aria-expanded", isHidden ? "true" : "false");
        }
      });
    });

    document.addEventListener("click", (e) => {
      const isClickInside = nav.contains(e.target);
      const currentState = nav.getAttribute("data-state");

      if (!isClickInside && currentState === "active") {
        nav.setAttribute("data-state", "inactive");
        navbarToggler.setAttribute("aria-label", "Open Menu");
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && nav.getAttribute("data-state") === "active") {
        nav.setAttribute("data-state", "inactive");
        navbarToggler.setAttribute("aria-label", "Open Menu");
        navbarToggler.focus(); // Return focus to toggle button
      }
    });
  }

  // ===== Initialize navbar scroll effect
  function initNavbarScroll() {
    const nav = document.querySelector("nav");
    if (!nav) return;

    const firstDiv = nav.querySelector("div");
    if (!firstDiv) return;

    const initialClasses = firstDiv.className;
    const scrolledClasses =
      "mx-auto mt-2 px-6 transition-all duration-300 bg-background/50 max-w-4xl rounded-2xl border backdrop-blur-lg lg:px-5";

    let isScrolled = false;

    const handleScroll = () => {
      const shouldBeScrolled = window.scrollY > 50; // Added threshold for better UX

      if (shouldBeScrolled !== isScrolled) {
        isScrolled = shouldBeScrolled;
        firstDiv.className = isScrolled ? scrolledClasses : initialClasses;
      }
    };

    window.addEventListener("scroll", handleScroll);
  }

  // Global FAQ toggle function for inline onclick handlers
  window.toggleFAQ = function toggleFAQ(button, index) {
    const faqItem = button.parentElement;
    const answer = document.getElementById(`faq-answer-${index}`);
    const icon = button.querySelector("svg");
    const isOpen = faqItem.classList.contains("open");

    // Close all others
    document.querySelectorAll("#faq .group.open").forEach((item) => {
      if (item !== faqItem) {
        item.classList.remove("open");
        const otherAnswer = item.querySelector('[id^="faq-answer-"]');
        otherAnswer.style.maxHeight = "0";
        item.querySelector("svg").style.transform = "rotate(0deg)";
      }
    });

    // Toggle current
    if (isOpen) {
      faqItem.classList.remove("open");
      answer.style.maxHeight = "0";
      icon.style.transform = "rotate(0deg)";
    } else {
      faqItem.classList.add("open");
      answer.style.maxHeight = answer.scrollHeight + "px";
      icon.style.transform = "rotate(180deg)";
    }
  };

  function initFAQAccordion() {
    document.querySelectorAll("#faq button").forEach((button) => {
      button.addEventListener("click", function () {
        toggleFAQ(button, button.dataset.index);
      });
    });
  }

  // ===== Initialize all navbar functionality
  function initNavbar() {
    initNavbarToggle();
  }

  // ===== Load component helper
  async function loadComponent(file, containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
      return;
    }

    try {
      const response = await fetch(file);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const html = await response.text();
      container.innerHTML = html;
    } catch (error) {
      console.error(`Error loading component ${file}:`, error);
    }
  }

  // ===== Main initialization
  async function init() {
    const navbarContainer = document.getElementById("navbar-container");
    if (navbarContainer) {
      await loadComponent("navbar.html", "navbar-container");
    }

    if (typeof sal === "function") {
      sal({
        once: true,
        threshold: 0.1,
      });
    }

    setTimeout(initNavbar, 100);
  }

  // Start when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // Export for manual initialization if needed
  window.initNavbarToggle = initNavbarToggle;
  window.initNavbar = initNavbar;
})();

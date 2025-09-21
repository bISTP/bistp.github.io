"use strict";

// element toggle function
const elementToggleFunc = function (elem) {
  elem.classList.toggle("active");
};

// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () {
  elementToggleFunc(sidebar);
});

// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");
const navLinkBtn = document.querySelector("[data-nav-link-btn]");

// function to handle navigation
const navigateToPage = (targetPage) => {
  for (let i = 0; i < pages.length; i++) {
    if (targetPage === pages[i].dataset.page) {
      pages[i].classList.add("active");
      navigationLinks[i].classList.add("active");
      window.scrollTo(0, 0);
    } else {
      pages[i].classList.remove("active");
      navigationLinks[i].classList.remove("active");
    }
  }
};

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {
    navigateToPage(this.innerHTML.toLowerCase());
  });
}

// add event to the custom project button
if (navLinkBtn) {
  navLinkBtn.addEventListener("click", function () {
    navigateToPage(this.dataset.navLinkBtn);
  });
}

// Dynamic 3D Tilt Effect for Project Cards
const recentProjectItems = document.querySelectorAll(".project-item-recent");

recentProjectItems.forEach((item) => {
  const card = item.querySelector(".project-card");
  if (!card) return;

  item.addEventListener("mousemove", (e) => {
    const rect = item.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = item.offsetWidth / 2;
    const centerY = item.offsetHeight / 2;

    const deltaX = x - centerX;
    const deltaY = y - centerY;

    // Adjust the intensity of the rotation here
    const rotateX = deltaY * 0.01;
    const rotateY = -deltaX * 0.01;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  });

  item.addEventListener("mouseleave", () => {
    card.style.transform =
      "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
  });
});

// README Preview Modal Logic
const previewBtns = document.querySelectorAll("[data-readme-btn]");
const readmeModalContainer = document.querySelector(
  "[data-readme-modal-container]"
);
const readmeModalCloseBtn = document.querySelector(
  ".readme-modal [data-readme-modal-close-btn]"
);
const readmeOverlay = document.querySelector("[data-readme-overlay]");
const readmeContent = document.querySelector("[data-readme-content]");
const repoLinkBtn = document.querySelector("[data-repo-link-btn]"); // Get the new button

const toggleReadmeModal = () => {
  readmeModalContainer.classList.toggle("active");
  readmeOverlay.classList.toggle("active");
};

previewBtns.forEach((btn) => {
  btn.addEventListener("click", async (e) => {
    e.stopPropagation();
    const repoPath = btn.closest("[data-repo-url]").dataset.repoUrl;
    if (!repoPath) return;

    // Set the repo link button's href immediately
    repoLinkBtn.href = `https://github.com/${repoPath}`;

    readmeContent.innerHTML = '<div class="loading-spinner"></div>';
    toggleReadmeModal();

    try {
      let branch = "main";
      let response = await fetch(
        `https://raw.githubusercontent.com/${repoPath}/${branch}/README.md`
      );
      if (!response.ok) {
        branch = "master"; // Fallback to master
        response = await fetch(
          `https://raw.githubusercontent.com/${repoPath}/${branch}/README.md`
        );
      }
      if (!response.ok) throw new Error("README.md not found.");

      const markdownText = await response.text();
      readmeContent.innerHTML = marked.parse(markdownText);

      console.log(marked.parse(markdownText));

      // **FIX for relative image paths**
      const images = readmeContent.querySelectorAll("img");
      const baseUrl = `https://raw.githubusercontent.com/${repoPath}/${branch}/`;
      images.forEach((img) => {
        const src = img.getAttribute("src");
        if (src && !src.startsWith("http")) {
          img.src = baseUrl + src.replace(/^\.\//, ""); // Prepend base URL and remove leading './'
        }
      });
    } catch (error) {
      readmeContent.innerHTML = `<p>Could not load README.md. ${error.message}</p>`;
    }
  });
});

readmeModalCloseBtn.addEventListener("click", toggleReadmeModal);
readmeOverlay.addEventListener("click", toggleReadmeModal);

// Go to Top Button Logic
const goTopBtn = document.querySelector("[data-go-top-btn]");

window.addEventListener("scroll", function () {
  if (window.scrollY >= 500) {
    goTopBtn.classList.add("active");
  } else {
    goTopBtn.classList.remove("active");
  }
});

goTopBtn.addEventListener("click", (e) => {
  e.preventDefault(); // Prevent default link behavior
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

// Click to Copy Email Logic
const copyTextElement = document.querySelector("[data-copy-text]");
const notification = document.querySelector("[data-copy-notification]");

if (copyTextElement) {
  copyTextElement.addEventListener("click", function () {
    const textToCopy = this.textContent;
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        // Show notification
        notification.classList.add("active");

        // Hide notification after 3 seconds
        setTimeout(() => {
          notification.classList.remove("active");
        }, 3000);
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  });
}

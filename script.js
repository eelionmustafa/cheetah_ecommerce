
// Load navbar
fetch('navbar.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('navbar').innerHTML = data;
    initCategorySlider(); // Initialize after navbar is loaded
  });

// Load footer
fetch('footer.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('footer').innerHTML = data;
  });

/* ---------------------------
   CATEGORY SLIDER
---------------------------- */
function initCategorySlider() {
  const menuItems = document.querySelectorAll(".custom-btn");
  const containers = document.querySelectorAll(".container2");
  const nextBtn = document.querySelector(".next-btn");
  const backBtn = document.querySelector(".back-btn");

  let currentIndex = 0;
  let categories = [];

  // Collect categories from buttons
  menuItems.forEach(menu => {
    categories.push(menu.dataset.category.toLowerCase().replace(/ /g, "_"));
  });

  function hideAllContainers() {
    containers.forEach(container => container.style.display = "none");
  }

  function showContainer(index) {
    hideAllContainers();
    const category = categories[index];
    const target = Array.from(containers).find(
      container => container.id.toLowerCase() === category
    );
    if (target) {
      target.style.display = "block";
    }

    // Highlight active button
    menuItems.forEach(btn => btn.classList.remove("active"));
    if (menuItems[index]) {
      menuItems[index].classList.add("active");
    }
  }

  // Menu clicks
  menuItems.forEach((menu, i) => {
    menu.addEventListener("click", () => {
      currentIndex = i;
      showContainer(currentIndex);
    });
  });

  // Next button
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      currentIndex = (currentIndex + 1) % categories.length;
      showContainer(currentIndex);
    });
  }

  // Back button
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      currentIndex = (currentIndex - 1 + categories.length) % categories.length;
      showContainer(currentIndex);
    });
  }

  // Initialize first category
  if (categories.length > 0) {
    showContainer(currentIndex);
  }
}

/* ---------------------------
   VIDEO PLAY/PAUSE ON SCROLL
---------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  const video = document.getElementById('mainVideo');
  if (!video) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        video.play();   // play when visible
      } else {
        video.pause();  // pause when out of view
      }
    });
  }, {
    threshold: 0.5 // 50% visible to trigger
  });

  observer.observe(video);
});

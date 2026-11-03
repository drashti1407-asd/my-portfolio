
// =====================================
// 1. MOBILE NAVIGATION MENU
// =====================================

const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

function setMenuState(isOpen) {
    navLinks.classList.toggle("open", isOpen);
    menuToggle.setAttribute("aria-expanded", isOpen);
    menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close menu" : "Open menu"
    );
}

function closeMenu() {
    setMenuState(false);
}

menuToggle.addEventListener("click", (event) => {
    event.stopPropagation();

    const isOpen = !navLinks.classList.contains("open");
    setMenuState(isOpen);
});

navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
});

document.addEventListener("click", (event) => {
    const clickedInsideMenu =
        navLinks.contains(event.target) ||
        menuToggle.contains(event.target);

    if (!clickedInsideMenu && navLinks.classList.contains("open")) {
        closeMenu();
    }
});

window.addEventListener("resize", () => {
    if (window.innerWidth > 900) {
        closeMenu();
    }
});


// =====================================
// 2. SCROLL REVEAL ANIMATION
// =====================================

const revealElements = document.querySelectorAll(
    ".home-content, .about-container, .section-container"
);

revealElements.forEach((element) => {
    element.classList.add("reveal");
});

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("active");
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.15
});

revealElements.forEach((element) => {
    revealObserver.observe(element);
});


// =====================================
// 3. ACTIVE NAVIGATION HIGHLIGHTING
// =====================================

const sections = document.querySelectorAll("main section");
const navItems = document.querySelectorAll(".nav-links a");

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const currentId = entry.target.getAttribute("id");

            navItems.forEach((link) => {
                link.classList.toggle(
                    "active",
                    link.getAttribute("href") === "#" + currentId
                );
            });
        }
    });
}, {
    rootMargin: "-25% 0px -60% 0px"
});

sections.forEach((section) => {
    sectionObserver.observe(section);
});

// =====================================
// 4. BACK TO TOP BUTTON
// =====================================

const backToTop = document.getElementById("backToTop");

// Show button when user scrolls down
window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
        backToTop.style.display = "block";
    } else {
        backToTop.style.display = "none";
    }
});

// Scroll smoothly to the top
backToTop.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});
// =====================================
// 5. CONTACT FORM - NODE.JS BACKEND
// =====================================

const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
const submitBtn = document.getElementById("submitBtn");

contactForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";
    formStatus.textContent = "";

    try {

        const response = await fetch(
            "http://localhost:5000/api/contact",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name: name,
                    email: email,
                    message: message
                })
            }
        );

        const result = await response.json();

        if (response.ok && result.success) {

            formStatus.textContent = result.message;
            formStatus.style.color = "lightgreen";

            contactForm.reset();

        } else {

            formStatus.textContent = result.message || "Something went wrong.";
            formStatus.style.color = "red";

        }

    } catch (error) {

        formStatus.textContent =
            "Unable to connect to the server. Please try again.";

        formStatus.style.color = "red";

        console.error("Contact form error:", error);

    }

    submitBtn.disabled = false;
    submitBtn.textContent = "Send Message";

});
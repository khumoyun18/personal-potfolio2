// BURGER MENU
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");

hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navLinks.classList.toggle("active");
});

document.querySelectorAll(".nav-links a").forEach(n => n.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navLinks.classList.remove("active");
}));

// DARK/LIGHT MODE
const themeToggle = document.getElementById("theme-toggle");
const currentTheme = localStorage.getItem("theme");

if (currentTheme) {
    document.body.setAttribute("data-theme", currentTheme);
    if (currentTheme === "dark") {
        // Dark mode bo'lsa, quyosh ikonkasini ko'rsatish
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
}

themeToggle.addEventListener("click", () => {
    let theme = document.body.getAttribute("data-theme");
    
    if (theme === "dark") {
        document.body.removeAttribute("data-theme");
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>'; // Light mode uchun oy ikonki
        localStorage.setItem("theme", "light");
    } else {
        document.body.setAttribute("data-theme", "dark");
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>'; // Dark mode uchun quyosh ikonki
        localStorage.setItem("theme", "dark");
    }
});

// FORM SUBMIT (Xabar yuborish simulyatsiyasi)
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Sahifa yangilanib ketishini oldini oladi
    
    const btn = contactForm.querySelector('button');
    const originalText = btn.textContent;
    
    // Yuborilgandagi effekt
    btn.textContent = "Yuborilmoqda...";
    btn.style.opacity = "0.7";
    
    setTimeout(() => {
        btn.textContent = "Xabar yuborildi! ✅";
        btn.style.backgroundColor = "#10b981"; // Yashil rang
        contactForm.reset(); // Formani tozalash
        
        // 3 soniyadan keyin asl holatiga qaytarish
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.backgroundColor = "var(--primary-color)";
            btn.style.opacity = "1";
        }, 3000);
    }, 1500);
});
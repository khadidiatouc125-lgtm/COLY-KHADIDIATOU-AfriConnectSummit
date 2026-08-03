document.addEventListener("DOMContentLoaded", () => {
    // Initialisation immédiate des modules globaux présents sur toutes les pages
    initDarkMode();
    initNavbarScroll();
    initMobileMenu();
    initScrollAnimations();
    initBackToTop();
    injectDynamicYear();
    
    // Détection et routage des composants spécifiques selon la page chargée
    if (document.getElementById("countdown")) initCountdown();
    if (document.getElementById("stat-section")) initAnimatedCounters();
    if (document.querySelector(".tabs-container")) initProgramTabs();
    if (document.querySelector(".filter-container")) initSpeakerFilter();
    if (document.getElementById("registrationForm")) initFormValidation();
});

/* 1. GESTION DU MODE SOMBRE (Persistence via LocalStorage) */
function initDarkMode() {
    const toggleBtn = document.getElementById("themeToggleBtn");
    if (!toggleBtn) return;

    // Récupération du thème sauvegardé ou application du mode clair par défaut
    const currentTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", currentTheme);
    updateThemeIcon(currentTheme);

    // Écouteur d'événement au clic pour intervertir les thèmes
    toggleBtn.addEventListener("click", () => {
        const theme = document.documentElement.getAttribute("data-theme");
        const newTheme = theme === "dark" ? "light" : "dark";
        
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme); // Sauvegarde du choix de l'utilisateur
        updateThemeIcon(newTheme);
    });
}

function updateThemeIcon(theme) {
    const icon = document.querySelector("#themeToggleBtn i");
    if (!icon) return;
    // Changement de la classe Bootstrap Icons
    if (theme === "dark") {
        icon.className = "bi bi-sun-fill";
    } else {
        icon.className = "bi bi-moon-fill";
    }
}

/* 2. INTERACTIONS DE LA NAVBAR ET DU MENU RESPONSIVE HAMBURGER */
function initNavbarScroll() {
    const navbar = document.querySelector(".navbar");
    if (!navbar) return;

    window.addEventListener("scroll", () => {
        // Ajout d'une ombre et modification du padding dès qu'on fait défiler la page
        if (window.scrollY > 80) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    });
}

function initMobileMenu() {
    const hamburger = document.getElementById("hamburgerBtn");
    const navLinks = document.querySelector(".nav-links");
    if (!hamburger || !navLinks) return;

    hamburger.addEventListener("click", () => {
        navLinks.classList.toggle("open");
        
        // Permutation de l'icône de liste (burger) vers l'icône de fermeture (croix)
        const icon = hamburger.querySelector("i");
        if (icon) {
            icon.classList.toggle("bi-list");
            icon.classList.toggle("bi-x");
        }
    });
}

/* 3. COMPTE À REBOURS EN TEMPS RÉEL (Page d'accueil) */
function initCountdown() {
    // Définition de la date cible de l'événement en Novembre 2026
    const targetDate = new Date("November 12, 2026 09:00:00").getTime();

    const interval = setInterval(() => {
        const now = new Date().getTime();
        const difference = targetDate - now;

        // Arrêt automatique du compteur si la date est atteinte
        if (difference < 0) {
            clearInterval(interval);
            const countdownEl = document.getElementById("countdown");
            if (countdownEl) countdownEl.innerHTML = "L'événement a débuté !";
            return;
        }

        // Calculs mathématiques pour convertir la différence en unités de temps
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        // Injection des valeurs formatées avec un zéro de tête si nécessaire
        const dEl = document.getElementById("days");
        const hEl = document.getElementById("hours");
        const mEl = document.getElementById("minutes");
        const sEl = document.getElementById("seconds");

        if (dEl) dEl.innerText = String(days).padStart(2, '0');
        if (hEl) hEl.innerText = String(hours).padStart(2, '0');
        if (mEl) mEl.innerText = String(minutes).padStart(2, '0');
        if (sEl) sEl.innerText = String(seconds).padStart(2, '0');
    }, 1000);
}
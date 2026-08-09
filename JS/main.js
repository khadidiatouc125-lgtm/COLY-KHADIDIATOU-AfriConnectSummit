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
    const toggleBtn = document.getElementById("btn-dark-mode");
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
    const icon = document.querySelector("btn-dark-mode i");
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
/* ==========================================================================
   4. ANIMATIONS D'APPARITION ET CHIFFRES ANIMÉS AU SCROLL
   ========================================================================== */
function initScrollAnimations() {
    const targets = document.querySelectorAll(".fade-in-scroll");
    if (targets.length === 0) return;
    
    // Utilisation de l'API native IntersectionObserver recommandée par ton prof
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target); // L'animation ne s'exécute qu'une seule fois
            }
        });
    }, { threshold: 0.1 });

    targets.forEach(target => observer.observe(target));
}

function initAnimatedCounters() {
    const counters = document.querySelectorAll(".counter-value");
    const section = document.getElementById("stat-section");
    if (!section || counters.length === 0) return;
    let started = false;

    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !started) {
            started = true;
            counters.forEach(counter => {
                const target = parseInt(counter.getAttribute("data-target"));
                const duration = 2000; // Durée totale de l'effet : 2 secondes
                const increment = target / (duration / 16);
                let current = 0;

                const updateCount = () => {
                    current += increment;
                    if (current < target) {
                        counter.innerText = Math.ceil(current);
                        requestAnimationFrame(updateCount); // Boucle d'animation fluide
                    } else {
                        counter.innerText = target;
                    }
                };
                updateCount();
            });
        }
    }, { threshold: 0.3 });

    observer.observe(section);
}

/* ==========================================================================
   5. NAVIGATION PAR ONGLETS DU PROGRAMME (programme.html)
   ========================================================================== */
function initProgramTabs() {
    const tabs = document.querySelectorAll(".tab-btn");
    const contents = document.querySelectorAll(".tab-content");
    if (tabs.length === 0 || contents.length === 0) return;

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            // Désactivation de l'ensemble des boutons et des contenus
            tabs.forEach(t => t.classList.remove("active"));
            contents.forEach(c => c.classList.remove("active"));

            // Activation de l'onglet cliqué et du panneau correspondant
            tab.classList.add("active");
            const activeDayId = tab.getAttribute("data-day");
            const targetContent = document.getElementById(activeDayId);
            if (targetContent) targetContent.classList.add("active");
        });
    });
}

/* ==========================================================================
   6. FILTRAGE DYNAMIQUE DES INTERVENANTS (intervenants.html)
   ========================================================================== */
function initSpeakerFilter() {
    const filterBtns = document.querySelectorAll(".filter-btn");
    const speakers = document.querySelectorAll(".speaker-item");
    if (filterBtns.length === 0 || speakers.length === 0) return;

    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            filterBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const filterValue = btn.getAttribute("data-filter");

            speakers.forEach(speaker => {
                const category = speaker.getAttribute("data-category");
                // Affichage si "Tous" est sélectionné ou si la catégorie correspond
                if (filterValue === "all" || category === filterValue) {
                    speaker.classList.remove("hidden");
                } else {
                    speaker.classList.add("hidden");
                }
            });
        });
    });
}

/* ==========================================================================
   7. VALIDATION DU FORMULAIRE D'INSCRIPTION ET RETOURS VISUELS (contact.html)
   ========================================================================== */
function initFormValidation() {
    const form = document.getElementById("registrationForm");
    if (!form) return;
    
    form.addEventListener("submit", (e) => {
        e.preventDefault(); // Blocage de la soumission native pour l'analyse JS
        let isFormValid = true;

        // Validation du champ Nom Complet
        const name = document.getElementById("fullName");
        if (name && name.value.trim() === "") {
            showFieldError(name, "Le nom complet est obligatoire.");
            isFormValid = false;
        } else if (name) {
            showFieldSuccess(name);
        }

        // Validation du champ Email via Expression Régulière (Regex)
        const email = document.getElementById("email");
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email && !emailRegex.test(email.value.trim())) {
            showFieldError(email, "Veuillez entrer une adresse email valide.");
            isFormValid = false;
        } else if (email) {
            showFieldSuccess(email);
        }

        // Validation du Téléphone (Exigence minimale de 8 chiffres)
        const phone = document.getElementById("phone");
        if (phone && phone.value.trim().length < 8) {
            showFieldError(phone, "Le numéro doit comporter au moins 8 chiffres.");
            isFormValid = false;
        } else if (phone) {
            showFieldSuccess(phone);
        }

        // Validation du Message / Motivation (Minimum de 20 caractères exigé)
        const motivation = document.getElementById("motivation");
        if (motivation && motivation.value.trim().length < 20) {
            showFieldError(motivation, "Votre motivation doit faire au moins 20 caractères.");
            isFormValid = false;
        } else if (motivation) {
            showFieldSuccess(motivation);
        }

        // Exécution de l'action de succès si aucun champ n'est en erreur
        if (isFormValid) {
            const successAlert = document.getElementById("successAlert");
            if (successAlert) {
                successAlert.style.display = "block";
                form.reset(); // Réinitialisation de tous les champs du formulaire
                
                // Suppression des bordures vertes de validation après envoi
                document.querySelectorAll(".form-control").forEach(input => input.classList.remove("valid"));
                
                // Défilement fluide vers le haut pour rendre le message visible
                window.scrollTo({ top: successAlert.offsetTop - 100, behavior: 'smooth' });
            }
        }
    });
}

function showFieldError(input, message) {
    input.classList.remove("valid");
    input.classList.add("invalid");
    const errorDiv = input.nextElementSibling;
    if (errorDiv && errorDiv.classList.contains("error-msg")) {
        errorDiv.innerText = message;
        errorDiv.style.display = "block";
    }
}

function showFieldSuccess(input) {
    input.classList.remove("invalid");
    input.classList.add("valid");
    const errorDiv = input.nextElementSibling;
    if (errorDiv && errorDiv.classList.contains("error-msg")) {
        errorDiv.style.display = "none";
    }
}

/* ==========================================================================
   8. UTILITIES (Bouton Back To Top et Injection de la Date Dynamique)
   ========================================================================== */
function initBackToTop() {
    const btn = document.getElementById("backToTop");
    if (!btn) return;

    window.addEventListener("scroll", () => {
        // Apparition du bouton dès que le défilement vertical dépasse 300px
        if (window.scrollY > 300) {
            btn.style.display = "flex";
        } else {
            btn.style.display = "none";
        }
    });

    btn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

function injectDynamicYear() {
    const currentYear = new Date().getFullYear();
    document.querySelectorAll(".dynamic-year").forEach(el => {
        el.innerText = currentYear; // Injection automatique dans le footer
    });
}

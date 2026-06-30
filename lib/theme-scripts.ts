export const themeInitScript = `(() => {
  try {
    var storedTheme = localStorage.getItem("hidrourgencias-theme");
    var isDark = storedTheme === "dark";
    document.documentElement.classList.toggle("dark", isDark);
    document.documentElement.dataset.theme = isDark ? "dark" : "light";
  } catch (error) {}
})();`;

export const themeToggleScript = `(() => {
  var storageKey = "hidrourgencias-theme";
  var darkLabel = "Modo normal";
  var lightLabel = "Descanso visual";
  var darkAria = "Volver a modo normal";
  var lightAria = "Activar modo descanso visual";

  function readTheme() {
    try {
      return localStorage.getItem(storageKey) === "dark" ? "dark" : "light";
    } catch (error) {
      return "light";
    }
  }

  function writeTheme(theme) {
    try {
      localStorage.setItem(storageKey, theme);
    } catch (error) {}
  }

  function setIconVisibility(button, isDark) {
    var moon = button.querySelector('[data-theme-icon="moon"]');
    var sun = button.querySelector('[data-theme-icon="sun"]');

    if (moon) {
      moon.classList.toggle("hidden", isDark);
    }

    if (sun) {
      sun.classList.toggle("hidden", !isDark);
    }
  }

  function applyTheme(theme, shouldPersist) {
    var isDark = theme === "dark";
    document.documentElement.classList.toggle("dark", isDark);
    document.documentElement.dataset.theme = theme;

    if (shouldPersist) {
      writeTheme(theme);
    }

    document.querySelectorAll("[data-theme-toggle]").forEach(function (button) {
      button.setAttribute("aria-pressed", isDark ? "true" : "false");
      button.setAttribute("aria-label", isDark ? darkAria : lightAria);
      button.setAttribute("title", isDark ? darkLabel : lightLabel);

      var label = button.querySelector("[data-theme-toggle-label]");
      if (label) {
        label.textContent = isDark ? darkLabel : lightLabel;
      }

      setIconVisibility(button, isDark);
    });
  }

  function bindThemeToggles() {
    applyTheme(readTheme(), false);

    document.querySelectorAll("[data-theme-toggle]").forEach(function (button) {
      if (button.__hidrourgenciasThemeToggleReady === true) {
        return;
      }

      button.__hidrourgenciasThemeToggleReady = true;
      button.addEventListener("click", function () {
        var nextTheme = document.documentElement.classList.contains("dark") ? "light" : "dark";
        applyTheme(nextTheme, true);
      });
    });
  }

  function scheduleBinding() {
    if ("requestAnimationFrame" in window) {
      requestAnimationFrame(function () {
        requestAnimationFrame(bindThemeToggles);
      });
      return;
    }

    setTimeout(bindThemeToggles, 0);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", scheduleBinding);
  } else {
    scheduleBinding();
  }
})();`;

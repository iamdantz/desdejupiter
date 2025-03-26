(function () {
  function getThemePreference() {
    if (typeof localStorage !== 'undefined' && localStorage.getItem('theme')) {
      return localStorage.getItem('theme') || 'light';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  const theme = getThemePreference();

  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  }

  localStorage.setItem('theme', theme);
})();
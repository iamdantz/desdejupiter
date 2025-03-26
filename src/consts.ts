// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = 'Astro Blog';
export const SITE_DESCRIPTION = 'Welcome to my website!';

export const MENU = [
    { title: 'Inicio', url: '/', icon: 'hugeicons:home-03', active: true },
    { title: 'Blog', url: '/blog', icon: 'hugeicons:quill-write-02', active: true },
    { title: 'Perfil', url: '/about', icon: 'hugeicons:quill-write-02', active: true },
    { title: 'Contacto', url: '/contact', icon: 'hugeicons:mail-02', active: true },
];

export const SOCIALS = [
    {
      platform: 'LinkedIn',
      url: 'https://www.linkedin.com/in/heydantz/',
      icon: 'hugeicons:linkedin-01',
    },
    { platform: 'GitHub', url: 'https://github.com/heydantz', icon: 'hugeicons:github-01' },
  ];
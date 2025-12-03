# Flux Landing Page - Frontend Documentation

## Overview

This is the landing page and frontend for **Flux**, a modern, eyecare-friendly social media platform. The entire frontend is built with vanilla HTML, CSS, and JavaScript — no frameworks or build tools required.

## Features

✨ **Modern Design**
- Clean, semantic HTML5
- Custom CSS with CSS variables
- No dependencies or frameworks
- Fully responsive (mobile-first)

🎨 **Eyecare Theme**
- Soft, soothing color palette
- Minimal eye strain design
- Comfortable for extended use
- Light/Dark/High-Contrast theme support

⚡ **Performance**
- Fast loading
- Smooth scrolling and animations
- Lazy image loading
- Optimized assets

🎯 **User Experience**
- Intuitive navigation
- Touch/swipe support
- Keyboard accessibility
- Smooth transitions

## Project Structure

```
frontend/
├── index.html                    # Main landing page
├── pages/                        # Internal pages
│   ├── login.html
│   ├── register.html
│   ├── chat.html
│   ├── chatroom.html
│   ├── timeline.html
│   ├── create-post.html
│   ├── profile.html
│   ├── status.html
│   └── view-status.html
├── assets/
│   ├── css/                     # Stylesheets
│   │   ├── base.css            # Global styles & resets
│   │   ├── layout.css          # Page layout
│   │   ├── components.css      # Components
│   │   └── eyecare.css         # Default theme
│   ├── js/                      # JavaScript
│   │   ├── theme.js            # Theme management
│   │   ├── main.js             # Main logic
│   │   ├── auth.js             # Auth (future)
│   │   ├── chat.js             # Chat (future)
│   │   ├── posts.js            # Posts (future)
│   │   ├── status.js           # Status (future)
│   │   └── utils.js            # Utils (future)
│   ├── images/                  # Images & assets
│   └── README.md                # Assets documentation
├── components/                  # HTML components
│   ├── navbar.html
│   ├── sidebar.html
│   ├── message-bubble.html
│   ├── post-card.html
│   └── status-bubble.html
└── README.md                    # This file
```

## Quick Start

### 1. No Build Tools Needed
Simply open `index.html` in your browser or serve it with a simple HTTP server.

**Using Python:**
```bash
python -m http.server 8000
# or
python3 -m http.server 8000
```

**Using Node.js:**
```bash
npx serve
```

**Using PHP:**
```bash
php -S localhost:8000
```

### 2. View the Page
Open `http://localhost:8000` in your browser.

## Features Breakdown

### 🎯 Hero Section
- Large headline and description
- Two CTA buttons (Login, Register)
- Responsive SVG illustration
- Mobile-friendly layout

### 🎨 Features Section
- 4 feature cards
- Grid layout (responsive)
- Hover animations
- Icon and description for each feature

### 💡 Why Flux Section
- 4 key benefits
- Soft colored background
- Emoji icons
- Responsive grid

### 🖼️ Preview Section
- Horizontal scrollable carousel
- Preview images with placeholders
- Navigation dots
- Touch/keyboard navigation support

### 🎯 Final CTA Section
- Bold call-to-action
- Gradient background
- Centered buttons

### 📄 Footer
- Links and copyright
- Minimal design
- Responsive layout

## Styling

### CSS Variables
All colors and spacing use CSS custom properties:

```css
:root {
    --color-primary: #5bb3a8;
    --color-primary-light: #7cc4ba;
    --color-bg: #fefdfb;
    --spacing-md: 1rem;
    /* ... and more */
}
```

### Responsive Breakpoints
```css
/* Desktop: 1200px+ */
/* Tablet: 768px - 1199px */
/* Mobile: 0px - 479px */
```

### Themes
The theme system supports multiple themes:

1. **Eyecare** (Default)
   - Soft mint/green tones
   - Warm off-white background
   - Perfect for extended viewing

2. **Dark**
   - Dark background (#0f1419)
   - Light text
   - Reduces eye strain in low-light

3. **High Contrast**
   - Bold colors
   - Strong contrast ratios
   - Better for accessibility

Switch themes using the moon icon in the header.

## JavaScript

### Theme Manager (`theme.js`)
Handles theme switching with localStorage persistence:

```javascript
window.themeManager.setTheme('dark');
window.themeManager.getTheme(); // 'dark'
window.themeManager.toggleTheme();
```

### Main App (`main.js`)
Provides carousel functionality, animations, and interactions:

```javascript
window.fluxApp.scrollToPreview(0);
window.fluxApp.trackEvent('signup_click');
```

## Accessibility

✅ **WCAG 2.1 Compliant**
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Sufficient color contrast
- Focus indicators
- Reduced motion support

## Browser Support

| Browser | Version | Support |
|---------|---------|---------|
| Chrome | Latest | ✅ Full |
| Firefox | Latest | ✅ Full |
| Safari | Latest | ✅ Full |
| Edge | Latest | ✅ Full |
| Mobile | Latest | ✅ Full |

## Performance Metrics

| Metric | Target | Status |
|--------|--------|--------|
| LCP | < 2.5s | ✅ |
| FID | < 100ms | ✅ |
| CLS | < 0.1 | ✅ |
| Page Size | < 500KB | ✅ |

## Development

### Adding New Pages
1. Create a new HTML file in `pages/`
2. Import CSS and JS files
3. Follow the same semantic structure
4. Test responsiveness

### Creating New Components
1. Create HTML file in `components/`
2. Add styles to `components.css`
3. Import in your pages
4. Ensure reusability

### Customizing Themes
1. Create new theme file: `assets/css/[theme-name].css`
2. Define CSS variables
3. Update `theme.js` to include new theme
4. Test across browsers

## Deployment

### Static Hosting (Recommended)
- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront

### Basic Requirements
- HTTP server
- HTTPS support (recommended)
- CORS handling (if calling external APIs)

### Optimization for Production
```bash
# 1. Minify CSS
cssnano --output assets/css/base.min.css assets/css/base.css

# 2. Minify JS
terser assets/js/main.js --output assets/js/main.min.js

# 3. Optimize images
imagemin assets/images/ --out-dir=assets/images/

# 4. Update index.html to use minified files
```

## SEO

✅ **Optimized for Search Engines**
- Semantic HTML
- Meta tags
- Open Graph support
- Sitemap ready
- Mobile-friendly

### Important Meta Tags
```html
<meta name="description" content="...">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta property="og:title" content="...">
<meta property="og:description" content="...">
<meta property="og:image" content="...">
```

## Security

🔒 **Security Practices**
- No inline scripts
- Content Security Policy ready
- Input validation (when forms added)
- HTTPS recommended
- No sensitive data in frontend

## Troubleshooting

### Styles not loading?
- Check file paths are relative
- Clear browser cache (Ctrl+Shift+Delete)
- Check browser console for errors

### JavaScript not working?
- Ensure theme.js loads before main.js
- Check console for errors
- Verify DOM is loaded before script execution

### Theme not switching?
- Clear localStorage: `localStorage.clear()`
- Check if browser supports CSS variables
- Verify `eyecare.css` is loaded

## Future Enhancements

🚀 **Planned Features**
- Progressive Web App (PWA) support
- Service Worker caching
- Offline mode
- Real-time notifications
- Analytics integration
- A/B testing framework

## Contributing

To contribute to the frontend:

1. Follow the existing code style
2. Maintain semantic HTML
3. Use CSS variables for colors
4. Ensure mobile responsiveness
5. Test accessibility
6. Update documentation

## License

This project is licensed under the MIT License.

## Support

For issues, questions, or suggestions:
- Create an issue on GitHub
- Contact support@flux.app
- Check documentation in `/docs`

## Built With ❤️ by Zabdiel

---

**Last Updated**: December 4, 2025
**Version**: 1.0.0

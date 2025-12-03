# Assets Folder Structure

This folder contains all static assets for the Flux landing page.

## Directory Structure

```
assets/
├── css/
│   ├── base.css          - Global styles, resets, and CSS variables
│   ├── layout.css        - Page layout, sections, and positioning
│   ├── components.css    - Reusable component styles (buttons, cards, etc.)
│   └── eyecare.css       - Eyecare theme (default) - soft, minimal strain colors
│
├── js/
│   ├── theme.js          - Theme management and switching
│   ├── main.js           - Main application logic and interactions
│   ├── auth.js           - Authentication logic (when implemented)
│   ├── chat.js           - Chat functionality (when implemented)
│   ├── posts.js          - Post management (when implemented)
│   ├── status.js         - Status updates (when implemented)
│   └── utils.js          - Utility functions (when implemented)
│
└── images/
    ├── preview-1.jpg     - Chat interface preview
    ├── preview-2.jpg     - Timeline preview
    ├── preview-3.jpg     - Status preview
    ├── preview-4.jpg     - Profile preview
    ├── logo.svg          - Flux logo
    └── [other assets]    - Additional images as needed
```

## CSS Structure

The CSS is organized following a modular approach for maintainability and scalability:

1. **base.css** - Foundation
   - CSS custom properties (variables)
   - Global resets
   - Typography defaults
   - Utility classes

2. **layout.css** - Structure
   - Header/Navigation
   - Sections
   - Grid/Flexbox layouts
   - Responsive breakpoints

3. **components.css** - Components
   - Buttons
   - Cards
   - Input fields
   - Badges
   - Alerts
   - Animations

4. **eyecare.css** - Theming
   - Color palette
   - Theme-specific styles
   - Dark mode support
   - Accessibility enhancements

## JavaScript Structure

1. **theme.js** - Theme Management
   - Theme switching
   - LocalStorage persistence
   - System preference detection
   - Custom events

2. **main.js** - Application Logic
   - Carousel/Gallery functionality
   - Smooth scrolling
   - Intersection Observer (animations)
   - Touch/Swipe support
   - Utility functions

## Image Guidelines

- **Preview images**: 300x400px (9:12 aspect ratio) in JPG format
- **Logo**: SVG format (scalable)
- **Icons**: Use inline SVG or icon fonts
- **Compression**: Optimize images before use

## Loading Assets

Assets are referenced in `index.html`:

```html
<link rel="stylesheet" href="assets/css/base.css">
<link rel="stylesheet" href="assets/css/layout.css">
<link rel="stylesheet" href="assets/css/components.css">
<link rel="stylesheet" href="assets/css/eyecare.css">

<script src="assets/js/theme.js"></script>
<script src="assets/js/main.js"></script>
```

## Browser Support

- Chrome/Edge (Latest)
- Firefox (Latest)
- Safari (Latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Tips

1. **Lazy Load Images**: Use `loading="lazy"` on images
2. **Minify CSS/JS**: For production, minify all files
3. **Compress Images**: Use WebP format with fallbacks
4. **Critical CSS**: Inline critical styles for faster rendering
5. **Defer JavaScript**: Non-critical scripts should be deferred

## Theme Customization

To create a new theme:

1. Create a new file: `assets/css/[theme-name].css`
2. Define CSS variables for colors
3. Add theme class to body: `<body class="[theme-name]-theme">`
4. Update `theme.js` to include the new theme name

Example:
```css
body.ocean-theme {
    --color-primary: #0077be;
    --color-bg: #f0f8ff;
    /* ... other variables */
}
```

## Accessibility

All assets follow WCAG 2.1 guidelines:
- Sufficient color contrast
- Keyboard navigation support
- ARIA labels where needed
- Semantic HTML structure

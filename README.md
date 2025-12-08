# Portfolio Website

A clean, modern, and fully responsive portfolio website showcasing your professional profile, resume, and projects.

## Features

- **Responsive Design**: Fully responsive and compatible with all devices (desktop, tablet, mobile)
- **Clean UI**: Modern, minimalist design with smooth animations
- **Three Main Pages**:
  - **Home**: Profile section with about me and skills
  - **Resume**: Professional experience, education, and technical skills
  - **Projects**: Showcase of your work and projects

## File Structure

```
WebDesign/
├── index.html          # Main homepage
├── resume.html         # Resume page
├── projects.html       # Projects showcase page
├── styles.css          # All styling (responsive)
├── script.js           # JavaScript for interactivity
└── README.md          # This file
```

## Customization Guide

### Personal Information

1. **Profile Image**: Replace the placeholder SVG in `index.html` with your own profile image
   - Update the `.profile-image` div or add an `<img>` tag

2. **Contact Information**:
   - Update email, phone, and location in `resume.html`
   - Update social media links in `index.html` and `resume.html`

3. **Name**: Replace "Blake" throughout all HTML files with your name

4. **About Section**: Update the about me text in `index.html` to reflect your background

### Resume Content

Edit `resume.html` to update:
- Professional Summary
- Work Experience (add/remove job entries)
- Education
- Skills
- Certifications

### Projects

Edit `projects.html` to:
- Add your actual projects
- Update project descriptions
- Add real project images
- Update project links (GitHub, live demos)
- Modify project tags/technologies

### Colors

The website uses CSS custom properties (variables) in `styles.css`. To change the color scheme, modify the `:root` variables at the top of `styles.css`:

```css
:root {
    --primary-color: #6366f1;    /* Main brand color */
    --primary-dark: #4f46e5;     /* Darker shade */
    --text-primary: #1f2937;     /* Main text color */
    /* ... etc */
}
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## No Build Process Required

This portfolio is built with pure HTML, CSS, and JavaScript. Simply open `index.html` in your browser to view it. No build tools or package managers needed!

## Deployment

You can deploy this website to:
- GitHub Pages
- Netlify
- Vercel
- Any static hosting service

Just upload all the files to your hosting service.

## License

Feel free to use and modify this portfolio template for your personal use.


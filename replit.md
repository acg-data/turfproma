# Turf Pro Inc. Website

## Overview
A modern, responsive lawn care company website built with clean HTML5 and Tailwind CSS. Family-owned lawn care company serving Massachusetts since 1986.

## Project Structure
- `index.html` - Main landing page with SEO metadata, structured data, and contact forms
- `components/` - Reusable header and footer HTML components (loaded dynamically)
- `services/` - Individual service pages (core aeration, grub control, fertilization, tick/mosquito control)
- `programs/` - Seasonal program pages (spring, summer, fall, winter)
- `blog/` - Blog section with lawn care tips and articles
- `server.js` - Express server for form submissions via Resend
- `sitemap.xml` - XML sitemap for SEO
- `robots.txt` - Robots directives

## Tech Stack
- Node.js / Express backend
- Resend integration for email notifications
- Tailwind CSS (via CDN)
- Lucide icons
- Google Fonts (Inter)

## Contact Form
Form submissions are sent to:
- frank.sturm@greenacelawncare.com
- justin@aryocg.com

Subject line: "New Turf Pro Lead"

## Running Locally
`node server.js` - Serves the site on port 5000

## SEO Features
- Meta descriptions on all pages
- Open Graph tags for social sharing
- Twitter Card tags
- Structured data (JSON-LD) for local business
- XML sitemap
- Canonical URLs

## Deployment
Configured for autoscale deployment with Node.js server.

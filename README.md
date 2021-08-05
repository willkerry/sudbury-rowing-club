# The new website for Sudbury Rowing Club

This site replaces a sprawling Wordpress/ThemeForest monstrosity (for which I accept full responsibility) and seeks to ape all of that old site’s capabilites (with a few exceptions). 

It has:

- **a Markdown-based, statically-generated news system** that uses [`remark`](https://github.com/remarkjs/remark), [`remark-html`](https://github.com/remarkjs/remark-html) and `textr` to turn a messy 20-year archive into a pretty React site. 
- **three structured data systems** (for now, three JSONs) – governance, safety and regatta – that populate statically generated pages that match the old URLs (i.e. no link rot) but are much easier to maintain
- **a mail API** that allows us to provide contact form access to all the club officers, without exposing their private email addresses or maintaining up-to-date names and emails across different platforms
- **a CMS**, albeit a CMS in progress. Netlify CMS would be my preference, but I like Vercel too much to depart it for Netlify, so Forestry will serve for now. Long-term, I’ll axe the JSON/MD data structure and shift to Sanity.

# Styling

I’m using Tailwind CSS. I started with Tailwind as a quick way to prototype the content-handling without getting bogged down in CSS, but JIT came out while I was working on it and I decided to stick with it. 

I don’t love the mass of Tailwind classes in my code, but it’s so fast to work with (it comes into its own once you start developing responsive variants) and all that mess is an incentive to extract React components in places I otherwise wouldn’t. The catch then is that Tailwind’s other chief loveliness (it makes the ‘cascading’ part of CSS – inherited styles – bloomin‘ obvious) and removes it. 

I use `@tailwindcss/typography` extensively, because I kinda need it for all that news material and its defaults suit our marketing text and our many, many tables nicely.

The default face is Variable Inter, not Tailwind’s default system font stack, because my design sensibility leans in a sorta typographic direction and I really don’t have the patience to test everything in Segoe, Ubuntu and pals. 

Initially, I used a lot of Spectral as serif for headings (because I like pairing Inter with it and did so a lot in the last Sudbury iteration), but the plan is to design it out and remove it from the bundle before we go to production. I want this site to be as maintainable as possible, and a two-typeface design system is not that. 
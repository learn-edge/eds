
function getRowText(row) {
    return row.querySelector('p')?.textContent.trim() || '';
}
function getHeroData(block) {
    const rows = [...block.children];

    const title = getRowText(rows[0]);
    const description = getRowText(rows[1]);
    const ctaText = getRowText(rows[2]);

    const authoredLink = rows[2]?.querySelector('a');

    const ctaHref = authoredLink?.getAttribute('href') || '/services';

    return {
        title,
        description,
        ctaText,
        ctaHref,
    };
}

/**Understand the important concepts:
-[...block.children] converts the HTML collection into a JavaScript array.
- rows[0] means the first row.
- rows[1] means the second row.
- rows[2] means the third row.
- ?.querySelector('a') checks whether the third row contains an actual link.
- If no link exists, we use / services as the default destination.**/

function createHeroContent(data) {
  // Create the main content container
  const content = document.createElement('div');
  content.className = 'hero-content';

  // Create the heading
  const heading = document.createElement('h1');
  heading.textContent = data.title;

  // Create the description
  const description = document.createElement('p');
  description.textContent = data.description;

  // Create the CTA link
  const button = document.createElement('a');
  button.className = 'hero-cta';
  button.textContent = data.ctaText;
  button.href = data.ctaHref;

  // Add all elements to the content container
  content.append(heading, description, button);

  return content;
}
export default function decorate(block) {
  // Step 1: Extract the content from DA
  const heroData = getHeroData(block);

  // Step 2: Stop if the block has no content
  if (!heroData.title && !heroData.description && !heroData.ctaText) {
    return;
  }

  // Step 3: Create the new Hero HTML
  const heroContent = createHeroContent(heroData);

  // Step 4: Replace the original block content
  block.replaceChildren(heroContent);
}

/**prompt 
I'm learning Adobe Experience Manager Edge Delivery Services (AEM EDS) by building a practical industry-style project called **SolutionHub**, a home and business services marketplace.

Please continue teaching me from my current progress. Do not restart from the basics.

## My environment
- Adobe Experience Manager Edge Delivery Services.
- Document Authoring (DA) using da.live, not Universal Editor.
- I have cloned my EDS project locally.
- Local development server runs at `http://localhost:3000`.
- I use Windows, VS Code and Chrome.
- My project already contains folders such as `blocks`, `scripts`, `styles` and `templates`.
- I know intermediate JavaScript, but I'm new to Node.js and Express.

## Project features
SolutionHub will eventually include:
- Homepage
- Services listing
- Service detail pages
- Become a Provider registration
- Request a Quote form
- About and Contact pages
- Backend APIs
- Google Sheets integration
- Authentication, security and deployment

## My learning roadmap
1. Environment setup — completed.
2. DA content authoring — completed for the initial homepage.
3. EDS block development — currently in progress.
4. JavaScript in EDS blocks and advanced DOM concepts.
5. Node.js fundamentals.
6. Express REST APIs, routes, controllers, middleware and validation.
7. Connect EDS frontend to backend.
8. Google Sheets integration using backend authentication.
9. Security, testing, performance and deployment.

## Current implementation

My DA homepage contains:
- Hero block
- Services block
- Why Choose SolutionHub section
- CTA section
- Metadata

I inspected the actual generated HTML using Chrome DevTools.

My Hero block is recognised by EDS with:
`class="hero block"` and `data-block-name="hero"`.

My existing block structure is:

`blocks/hero/hero.js`
`blocks/hero/hero.css`

I implemented the following JavaScript methods in `hero.js`:
- `getRowText(row)` — extracts text from an authored row.
- `getHeroData(block)` — reads the heading, description and CTA.
- `createHeroContent(data)` — creates the new HTML elements.
- `decorate(block)` — coordinates the transformation and replaces the original content.

The Hero JavaScript works successfully. It transforms DA content into:
- `<h1>` for the heading
- `<p>` for the description
- `<a>` for the CTA

The CTA defaults to `/services` if no authored link is found.

## Current lesson

We are now working on **Phase 3 — EDS Block Development, Lesson 2: Hero CSS**.

I have been given CSS for:
- Hero gradient background
- Content alignment
- Heading and description typography
- CTA button
- Hover and focus effects
- Responsive mobile styling

Continue from here. First help me verify the CSS is working, then improve the Hero if necessary.

## How I want you to teach me

This is very important:

1. Teach one topic at a time.
2. Give code method-wise, not as a huge unexplained code dump.
3. Explain every important line and JavaScript/CSS concept.
4. Explain why we use a method and where it is used in a real project.
5. Give the file path before providing code.
6. Explain how DA, generated HTML, JavaScript and CSS connect.
7. Use my actual project structure. Ask me for screenshots or file contents before assuming anything.
8. Give practical exercises and wait for my results before moving ahead.
9. Don't skip steps or assume I already understand Node.js or Express.
10. Teach industry-style implementation, including error handling, accessibility, performance and security.

## What to do next

Continue with:
1. Verify and refine the Hero CSS.
2. Explain the EDS block loading and decoration lifecycle.
3. Build the Services block (`blocks/services/services.js` and `services.css`), after inspecting my actual authored HTML.
4. Build other homepage blocks.
5. Then proceed through the backend and Google Sheets roadmap.

Treat this as a long-term practical AEM EDS capstone project. Maintain continuity and teach me like a mentor, explaining concepts as we build SolutionHub.**/
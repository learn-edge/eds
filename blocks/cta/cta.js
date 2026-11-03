function getCtaData(block) {
  // Get all direct rows inside the CTA block
  const rows = [...block.children];
  console.log('CTA rows:', rows); // Debugging log  // Find the heading
  const heading = rows[0]?.querySelector('h2')?.textContent.trim() || '';

  // Find the description
  const description = rows[1]?.querySelector('p')?.textContent.trim() || '';

  // Find the authored link
  const link = rows[2]?.querySelector('a');

  // Return all CTA information
  return {
    heading,
    description,
    linkText: link?.textContent.trim() || '',
    linkHref: link?.getAttribute('href') || '',
  };
}

function createCtaHeading(text) {
  const heading = document.createElement('h2');

  heading.textContent = text;

  return heading;
}
function createCtaButton(text, href) {
  const link = document.createElement('a');

  link.textContent = text;
  link.href = href;
  link.className = 'cta-button';

  return link;
}
function createCtaContent(data) {
  const content = document.createElement('div');

  content.className = 'cta-content';

  const heading = createCtaHeading(data.heading);

  const description = createCtaDescription(data.description);

  const button = createCtaButton(
    data.linkText,
    data.linkHref,
  );

  content.append(heading, description, button);

  return content;
}
export default function decorate(block) {
  const data = getCtaData(block);

  if (!data.heading || !data.linkHref) {
    return;
  }

  const content = createCtaContent(data);

  block.replaceChildren(content);
}
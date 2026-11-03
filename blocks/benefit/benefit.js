function getRowText(row) {
  return row?.querySelector('p')?.textContent.trim() || '';
}
function getBenefitsData(block) {
  // Get all three direct rows
    const rows = [...block.children];

  const benefits = [];

  // Process one complete row at a time
  rows.forEach((row) => {

    // Get the two columns inside this row
    const cells = [...row.children];

    // Extract title and description
    const title = getRowText(cells[0]);
    const description = getRowText(cells[1]);

    // Store the benefit
    if (title) {
      benefits.push({
        title,
        description,
      });
    }
  });

  return benefits;
}
/**Method 3: Create an individual benefit card**/
function createBenefitCard(benefit) {
    console.log('Creating benefit card for:', benefit); // Debugging log
  const card = document.createElement('div');
  card.className = 'benefit-card';

  const heading = document.createElement('h3');
  heading.textContent = benefit.title;

  const description = document.createElement('p');
  description.textContent = benefit.description;

  card.append(heading, description);
console.log('Created benefit card:', card); // Debugging log
  return card;
}
/**Method 4: Create the benefits grid**/
function createBenefitsContent(benefits) {
  const grid = document.createElement('div');
  grid.className = 'benefits-grid';

  benefits.forEach((benefit) => {
    const card = createBenefitCard(benefit);
    grid.append(card);
  });

  return grid;
}
export default function decorate(block) {
  const benefits = getBenefitsData(block);

  if (benefits.length === 0) {
    return;
  }

  const content = createBenefitsContent(benefits);

  block.replaceChildren(content);
}
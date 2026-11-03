function getRowText(row) {
  return row?.querySelector('p')?.textContent.trim() || '';
}
function getServicesData(block) {
  const rows = [...block.children];

  const services = [];

  for (let i = 0; i < rows.length; i += 2) {
    const title = getRowText(rows[i]);
    const description = getRowText(rows[i + 1]);

    if (title) {
      services.push({
        title,
        description,
      });
    }
  }

  return services;
}
function createServiceCard(service) {
  // Create the card container
  const card = document.createElement('div');
  card.className = 'service-card';

  // Create service heading
  const heading = document.createElement('h3');
  heading.textContent = service.title;

  // Create service description
  const description = document.createElement('p');
  description.textContent = service.description;

  // Add heading and description to card
  card.append(heading, description);

  return card;
}
function createServicesContent(services) {
  // Create the main grid
  const grid = document.createElement('div');
  grid.className = 'services-grid';

  // Create a card for every service
  services.forEach((service) => {
    const card = createServiceCard(service);
    grid.append(card);
  });

  return grid;
}
export default function decorate(block) {
  // Read service data from DA
  const services = getServicesData(block);

  // Stop if there are no services
  if (services.length === 0) {
    return;
  }

  // Create the service cards
  const servicesContent = createServicesContent(services);

  // Replace original authored rows
  block.replaceChildren(servicesContent);
}
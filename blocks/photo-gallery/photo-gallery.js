import { createOptimizedPicture } from '../../scripts/aem.js';

const PAGE_SIZE = 8;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function normalizeHeader(value) {
  return value.trim().toLowerCase().replace(/[\s_-]+/g, '');
}

function getCellText(cell) {
  return cell?.textContent?.trim() || '';
}

function getImage(cell) {
  return cell?.querySelector('img') || null;
}

function getFileName(src) {
  if (!src) return '';
  try {
    const pathname = new URL(src, window.location.href).pathname;
    return decodeURIComponent(pathname.split('/').pop() || '');
  } catch {
    return src.split('/').pop()?.split('?')[0] || '';
  }
}

function parseRows(block) {
  const rows = [...block.children].filter((row) => row.children.length);
  if (!rows.length) return [];

  const firstCells = [...rows[0].children];
  const headers = firstCells.map((cell) => normalizeHeader(getCellText(cell)));
  const hasHeader = headers.some((header) => [
    'date', 'photodate', 'image', 'photo', 'filename', 'title',
  ].includes(header));

  const column = (names, fallback) => {
    const found = headers.findIndex((header) => names.includes(header));
    return found >= 0 ? found : fallback;
  };

  const dateIndex = hasHeader ? column(['date', 'photodate', 'publisheddate'], 0) : 0;
  const imageIndex = hasHeader ? column(['photo', 'image', 'picture'], 1) : 1;
  const fileIndex = hasHeader ? column(['filename', 'photofilename', 'imagefilename'], 2) : 2;
  const titleIndex = hasHeader ? column(['title', 'name', 'caption'], 3) : 3;

  return rows.slice(hasHeader ? 1 : 0).map((row) => {
    const cells = [...row.children];
    const date = getCellText(cells[dateIndex]);
    const image = getImage(cells[imageIndex]);
    const src = image?.getAttribute('src') || '';
    const authoredFileName = getCellText(cells[fileIndex]);

    return {
      date,
      image,
      src,
      fileName: authoredFileName || getFileName(src),
      title: getCellText(cells[titleIndex]),
    };
  }).filter((item) => item.date && DATE_RE.test(item.date) && item.src);
}

function makeButton(label, className) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = className;
  button.textContent = label;
  return button;
}

function decorate(block) {
  const items = parseRows(block);
  block.textContent = '';

  const root = document.createElement('section');
  root.className = 'photo-gallery';

  const filters = document.createElement('form');
  filters.className = 'photo-gallery-filters';
  filters.setAttribute('aria-label', 'Filter photos by date');

  const startLabel = document.createElement('label');
  startLabel.textContent = 'From date';
  const startInput = document.createElement('input');
  startInput.type = 'date';
  startInput.name = 'start-date';
  startLabel.append(startInput);

  const endLabel = document.createElement('label');
  endLabel.textContent = 'To date';
  const endInput = document.createElement('input');
  endInput.type = 'date';
  endInput.name = 'end-date';
  endLabel.append(endInput);

  const applyButton = makeButton('Apply filter', 'photo-gallery__apply');
  applyButton.type = 'submit';
  const resetButton = makeButton('Reset', 'photo-gallery__reset');
  resetButton.type = 'reset';

  filters.append(startLabel, endLabel, applyButton, resetButton);

  const status = document.createElement('p');
  status.className = 'photo-gallery__status';
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');

  const grid = document.createElement('div');
  grid.className = 'photo-gallery__grid';

  const pagination = document.createElement('nav');
  pagination.className = 'photo-gallery__pagination';
  pagination.setAttribute('aria-label', 'Photo gallery pages');

  const previous = makeButton('Previous', 'photo-gallery__previous');
  const pageStatus = document.createElement('span');
  pageStatus.className = 'photo-gallery__page-status';
  pageStatus.setAttribute('aria-live', 'polite');
  const next = makeButton('Next', 'photo-gallery__next');
  pagination.append(previous, pageStatus, next);

  root.append(filters, status, grid, pagination);
  block.append(root);

  let filteredItems = [...items];
  let currentPage = 1;

  function render() {
    const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE));
    currentPage = Math.min(currentPage, totalPages);
    const start = (currentPage - 1) * PAGE_SIZE;
    const visibleItems = filteredItems.slice(start, start + PAGE_SIZE);

    grid.replaceChildren();

    if (!visibleItems.length) {
      const empty = document.createElement('p');
      empty.className = 'photo-gallery__empty';
      empty.textContent = 'No photos match the selected date range.';
      grid.append(empty);
    }

    visibleItems.forEach((item) => {
      const card = document.createElement('article');
      card.className = 'photo-gallery__card';

      const alt = item.image?.getAttribute('alt') || item.title || item.fileName || 'Photo';
      const picture = createOptimizedPicture(item.src, alt, false, [
        { width: '750' },
      ]);
      picture.classList.add('photo-gallery__picture');

      const content = document.createElement('div');
      content.className = 'photo-gallery__details';

      if (item.title) {
        const heading = document.createElement('h3');
        heading.className = 'photo-gallery__title';
        heading.textContent = item.title;
        content.append(heading);
      }

      const date = document.createElement('p');
      date.className = 'photo-gallery__date';
      date.textContent = `Date: ${item.date}`;

      const fileName = document.createElement('p');
      fileName.className = 'photo-gallery__filename';
      fileName.textContent = `File name: ${item.fileName}`;

      content.append(date, fileName);
      card.append(picture, content);
      grid.append(card);
    });

    status.textContent = `${filteredItems.length} photo${filteredItems.length === 1 ? '' : 's'} found`;
    pageStatus.textContent = `Page ${currentPage} of ${totalPages}`;
    previous.disabled = currentPage <= 1;
    next.disabled = currentPage >= totalPages;
    pagination.hidden = filteredItems.length <= PAGE_SIZE;
  }

  filters.addEventListener('submit', (event) => {
    event.preventDefault();

    const from = startInput.value;
    const to = endInput.value;

    if (from && to && from > to) {
      endInput.setCustomValidity('End date must be on or after the start date.');
      endInput.reportValidity();
      return;
    }

    endInput.setCustomValidity('');
    filteredItems = items.filter(({ date }) => (
      (!from || date >= from) && (!to || date <= to)
    ));
    currentPage = 1;
    render();
  });

  endInput.addEventListener('input', () => endInput.setCustomValidity(''));

  filters.addEventListener('reset', () => {
    window.requestAnimationFrame(() => {
      filteredItems = [...items];
      currentPage = 1;
      endInput.setCustomValidity('');
      render();
    });
  });

  previous.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage -= 1;
      render();
    }
  });

  next.addEventListener('click', () => {
    const totalPages = Math.ceil(filteredItems.length / PAGE_SIZE);
    if (currentPage < totalPages) {
      currentPage += 1;
      render();
    }
  });

  if (!items.length) {
    status.textContent = 'No valid photo rows were found. Check the authoring table and use dates in YYYY-MM-DD format.';
    filters.hidden = true;
    pagination.hidden = true;
  }

  render();
}

export default decorate;

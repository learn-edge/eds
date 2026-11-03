
const GOOGLE_SCRIPT_URL =
  'PASTE_YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';

export default function decorate(block) {

  // Create form HTML
  block.innerHTML = `
    <div class="contact-form-container">

      <h2>Contact Us</h2>

      <p>
        Please submit your details.
        Our team will contact you.
      </p>

      <form class="contact-form">

        <div class="form-group">
          <label for="cf-name">Full Name *</label>
          <input
            id="cf-name"
            name="name"
            type="text"
            maxlength="100"
            required
          />
        </div>

        <div class="form-group">
          <label for="cf-email">Email *</label>
          <input
            id="cf-email"
            name="email"
            type="email"
            maxlength="150"
            required
          />
        </div>

        <div class="form-group">
          <label for="cf-phone">Phone *</label>
          <input
            id="cf-phone"
            name="phone"
            type="tel"
            maxlength="30"
            required
          />
        </div>

        <div class="form-group">
          <label for="cf-company">Company</label>
          <input
            id="cf-company"
            name="company"
            type="text"
            maxlength="150"
          />
        </div>

        <div class="form-group">
          <label for="cf-service">Service Required</label>
          <select id="cf-service" name="service">
            <option value="">Select a service</option>
            <option value="AEM Development">
              AEM Development
            </option>
            <option value="Web Development">
              Web Development
            </option>
            <option value="IT Consulting">
              IT Consulting
            </option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div class="form-group">
          <label for="cf-message">Message</label>
          <textarea
            id="cf-message"
            name="message"
            rows="4"
            maxlength="2000"
          ></textarea>
        </div>

        <!-- Honeypot field for basic spam detection -->
        <div class="cf-honeypot" aria-hidden="true">
          <label for="cf-website">Website</label>
          <input
            id="cf-website"
            name="website"
            type="text"
            tabindex="-1"
            autocomplete="off"
          />
        </div>

        <button type="submit">
          Submit Enquiry
        </button>

        <p
          class="form-status"
          role="status"
          aria-live="polite"
        ></p>

      </form>
    </div>
  `;

  const form = block.querySelector('.contact-form');
  const status = block.querySelector('.form-status');
  const button = form.querySelector('button');

  form.addEventListener('submit', async (event) => {

    event.preventDefault();

    if (!form.reportValidity()) {
      return;
    }

    if (
      !GOOGLE_SCRIPT_URL.startsWith(
        'https://script.google.com/macros/s/'
      ) ||
      GOOGLE_SCRIPT_URL.includes('PASTE_YOUR')
    ) {
      status.textContent =
        'Form configuration is incomplete.';
      return;
    }

    const formData = new FormData(form);

    const payload = Object.fromEntries(
      formData.entries()
    );

    button.disabled = true;
    status.textContent = 'Sending your enquiry...';

    try {

      // Apps Script cross-origin limitation:
      // no-cors returns an opaque response.
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify(payload)
      });

      status.textContent =
        'Request sent. Please verify the new row in Google Sheets.';

      form.reset();

    } catch (error) {

      console.error('Form submission error:', error);

      status.textContent =
        'Unable to send your enquiry. Please try again.';

    } finally {

      button.disabled = false;

    }
  });
}

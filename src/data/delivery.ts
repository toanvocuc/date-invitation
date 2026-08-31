/**
 * How the answers reach you.
 *
 * GitHub Pages only serves files - there is no server to save anything - so the
 * finished plan is posted straight from the visitor's browser to Web3Forms,
 * which emails it to you.
 *
 * SETUP (one minute, no account needed):
 *   1. Open https://web3forms.com
 *   2. Type the email address that should receive the plan, press the button.
 *   3. They email you an access key. Paste it below and redeploy.
 *
 * The key is visible in the page source - that is expected and safe. It can only
 * be used to send a form to the address you registered; it grants no access to
 * anything else. Leave it empty and the site still works: the confirmation
 * screen falls back to a copy / share button.
 */
export const DELIVERY = {
  web3formsAccessKey: "8d340bc4-8044-47dc-aa57-65819bc1f5fe",

  /** Subject line of the email you receive. */
  subject: "💌 The date is confirmed - here is the plan",

  /** Sender name shown in your inbox. */
  fromName: "Date invitation",
};

export const isDeliveryConfigured = () =>
  DELIVERY.web3formsAccessKey.trim().length > 0;

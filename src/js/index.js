/**
 * My module description. Please update with your module data. YOU HAVE TO MANUALLY DO IT!
 * @module my-package-name
 */

/**
 * Returns the input string
 *
 * @param {string} a
 *
 * @returns {string} a gratifying echo response from either node or browser
 */
export function echo (a) {
  /* Every if else block with process.browser (different code for node and browser) should disable eslint rule no-lone-blocks
  */
  /* eslint-disable no-lone-blocks */
  if (process.browser) {
    console.log('Browser echoes: ' + a)
  } else {
    console.log('Node.js echoes: ' + a)
  }
  /* eslint-enable no-lone-blocks */
  return a
}

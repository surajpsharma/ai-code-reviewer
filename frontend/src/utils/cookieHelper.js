/**
 * Cookie Helper Utility
 *
 * This utility provides functions to help with cookie-related operations
 * and browser compatibility issues.
 */

/**
 * Checks if the current browser is Chrome
 * @returns {boolean} True if the browser is Chrome
 */
export const isChrome = () => {
  return (
    navigator.userAgent.indexOf("Chrome") > -1 &&
    navigator.userAgent.indexOf("Edge") === -1 &&
    navigator.userAgent.indexOf("Edg") === -1 &&
    navigator.userAgent.indexOf("OPR") === -1
  );
};

/**
 * Checks if the current browser is running on a mobile device
 * @returns {boolean} True if the browser is on a mobile device
 */
export const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

/**
 * Logs browser information to help with debugging
 */
export const logBrowserInfo = () => {
  console.log("Browser Information:");
  console.log("User Agent:", navigator.userAgent);
  console.log("Is Chrome:", isChrome());
  console.log("Is Mobile:", isMobile());
  console.log("Cookies Enabled:", navigator.cookieEnabled);
};

/**
 * Tests if cookies are working properly by making a request to the cookie test endpoint
 * @param {string} backendURL - The URL of the backend server
 * @returns {Promise<Object>} The response from the cookie test endpoint
 */
export const testCookies = async (backendURL, axios) => {
  try {
    const response = await axios.get(`${backendURL}/api/cookie-test`, {
      withCredentials: true,
    });
    console.log("Cookie Test Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Cookie Test Error:", error);
    throw error;
  }
};

export default {
  isChrome,
  isMobile,
  logBrowserInfo,
  testCookies,
};

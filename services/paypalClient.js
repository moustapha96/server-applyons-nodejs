// server-node/services/paypalClient.js
const paypal = require("@paypal/checkout-server-sdk");

function paypalClient() {
    const env = (process.env.PAYPAL_ENV || "sandbox").toLowerCase();
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
        throw new Error("PAYPAL_CLIENT_ID / PAYPAL_CLIENT_SECRET manquants");
    }

    const environment =
        env === "live" ?
        new paypal.core.LiveEnvironment(clientId, clientSecret) :
        new paypal.core.SandboxEnvironment(clientId, clientSecret);

    return new paypal.core.PayPalHttpClient(environment);
}

module.exports = { paypalClient };
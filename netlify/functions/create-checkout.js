const Stripe = require("stripe");

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  var stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecretKey) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "STRIPE_SECRET_KEY is not configured on this deploy." })
    };
  }

  var body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch (err) {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid JSON body." }) };
  }

  var amount = Number(body.amount);
  var label = typeof body.label === "string" && body.label.trim() ? body.label.trim() : "Rent payment";

  if (!Number.isFinite(amount) || amount <= 0) {
    return { statusCode: 400, body: JSON.stringify({ error: "amount must be a positive number of whole dollars." }) };
  }

  var stripe = Stripe(stripeSecretKey);
  var origin = event.headers.origin || ("https://" + event.headers.host);

  try {
    var session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: label },
            unit_amount: Math.round(amount * 100)
          },
          quantity: 1
        }
      ],
      success_url: origin + "/rental.html?paid=1",
      cancel_url: origin + "/rental.html?canceled=1"
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: session.url })
    };
  } catch (err) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: err.message || "Failed to create checkout session." })
    };
  }
};

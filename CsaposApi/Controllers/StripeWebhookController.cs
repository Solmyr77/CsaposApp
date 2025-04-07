using CsaposApi.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Stripe;
using System;

namespace CsaposApi.Controllers
{
    [Route("api/stripe-webhook-controller")]
    [ApiController]
    public class StripeWebhookController : ControllerBase
    {
        private readonly CsaposappContext _context;
        private readonly IConfiguration _config;

        public StripeWebhookController(CsaposappContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        [HttpPost]
        public async Task<IActionResult> Post()
        {
            var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
            var secret = _config["Stripe:WebhookSecret"];

            try
            {
                var stripeEvent = EventUtility.ConstructEvent(json, Request.Headers["Stripe-Signature"], secret);

                if (stripeEvent.Type == "payment_intent.succeeded")
                {
                    var intent = stripeEvent.Data.Object as PaymentIntent;
                    var transactionId = intent.Id;
                    var amountReceived = intent.AmountReceived / 100m;

                    // Assume you set the PaymentId or OrderId in Metadata when creating the payment
                    var paymentId = intent.Metadata["payment_id"];

                    var payment = await _context.Payments.FindAsync(paymentId);
                    if (payment != null)
                    {
                        payment.TransactionId = transactionId;
                        payment.PaymentStatus = "completed";
                        payment.PaymentDate = DateTime.UtcNow;
                        payment.UpdatedAt = DateTime.UtcNow;

                        await _context.SaveChangesAsync();
                    }
                }

                return Ok();
            }
            catch (StripeException ex)
            {
                return BadRequest($"Stripe error: {ex.Message}");
            }
        }
    }

}

// TODO: draft wording. Needs review (and legal sign-off) before launch.
import { Link } from 'react-router-dom'
import { PolicyLayout } from './PolicyLayout'

export function Terms() {
  return (
    <PolicyLayout title="Terms and Conditions" intro="The simple ground rules for shopping with Adore Hive.">
      <section>
        <h2>Orders</h2>
        <p>When you place an order you are making an offer to buy. We confirm it once we have checked availability and your details. We may contact you to confirm personalized or made-to-order items before we begin.</p>
      </section>
      <section>
        <h2>Prices and payment</h2>
        <p>Prices are in Indian rupees. We do our best to keep prices and stock accurate, and may cancel and refund an order if an item was listed in error.</p>
      </section>
      <section>
        <h2>Handmade and personalized items</h2>
        <p>Handmade items can vary slightly in colour, size and finish, which is part of their charm. Personalized items are made for you and are not eligible for return, as described in our <Link to="/policies/returns">Return and Exchange Policy</Link>.</p>
      </section>
      <section>
        <h2>Delivery</h2>
        <p>Delivery estimates are not guarantees. Please see our <Link to="/policies/shipping">Shipping Policy</Link> for details.</p>
      </section>
      <section>
        <h2>Your account</h2>
        <p>You are responsible for keeping your account details safe. Please let us know if you think someone else has used your account.</p>
      </section>
      <section>
        <h2>Privacy</h2>
        <p>How we handle your information is explained in our <Link to="/policies/privacy">Privacy Policy</Link>.</p>
      </section>
    </PolicyLayout>
  )
}

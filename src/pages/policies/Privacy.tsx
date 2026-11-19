// TODO: draft wording. Needs review (and legal sign-off) before launch.
import { PolicyLayout } from './PolicyLayout'

export function Privacy() {
  return (
    <PolicyLayout title="Privacy Policy" intro="What we collect, why we collect it and how we look after it.">
      <section>
        <h2>What we collect</h2>
        <ul>
          <li>Details you give us: name, email address, phone number and delivery address when you order, create an account or contact us.</li>
          <li>Order details, including any gift notes or personalization you add.</li>
          <li>Basic information about how the site is used, to help us improve it.</li>
        </ul>
      </section>
      <section>
        <h2>How we use it</h2>
        <p>To process and deliver your orders, reply to your messages, keep your account working and, if you subscribe, send you our newsletter. We do not sell your personal information.</p>
      </section>
      <section>
        <h2>Payments</h2>
        <p>Payments are handled by our payment provider. We do not store your card or UPI details.</p>
      </section>
      <section>
        <h2>Your choices</h2>
        <p>You can ask us to see, correct or delete the information we hold about you, and you can unsubscribe from our newsletter at any time using the link in any email.</p>
      </section>
      <section>
        <h2>Cookies and local storage</h2>
        <p>We use your browser’s storage to remember your bag, wishlist and checkout details on this device.</p>
      </section>
    </PolicyLayout>
  )
}

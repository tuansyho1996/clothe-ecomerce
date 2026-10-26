import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Our Story | Sunday Studio",
  description:
    "Get to know Sunday Studio's approach to timeless clothing, honest sourcing, and a more thoughtful relationship with fashion.",
};

export default function AboutPage() {
  return (
    <main className="about-page ">
      <section className="story-hero" aria-labelledby="about-title">
        <div className="story-hero-copy">
          <span className="eyebrow"><span className="eyebrow-line" />The Sunday point of view</span>
          <h1 id="about-title">Good clothes<br />have a <em>longer</em><br />story.</h1>
          <p>We’re here for the pieces you wear on Monday, love on Friday, and bring along for years. Thoughtful style starts with choosing well—and making what you choose count.</p>
          <Link className="primary-link" href="/#shop">Meet your new favorites <span aria-hidden="true">↗</span></Link>
        </div>
        <div className="story-hero-image" role="img" aria-label="A woman in timeless, understated clothing in soft natural light" />
        <div className="story-image-note">
          <span className="story-image-note-star" aria-hidden="true">✳</span>
          <span>Made for real life.</span>
          <strong>Worn on repeat.</strong>
        </div>
        <span className="story-hero-caption">A little less, a little better.</span>
      </section>

      <div className="story-ribbon" aria-label="Our philosophy">
        <span>Buy with care</span><span aria-hidden="true">✳</span>
        <span>Wear with joy</span><span aria-hidden="true">✳</span>
        <span>Keep for longer</span><span aria-hidden="true">✳</span>
        <span>Buy with care</span>
      </div>

      <section className="story-belief" aria-labelledby="belief-title">
        <div className="story-belief-index">
          <span className="eyebrow"><span className="eyebrow-line" />Why we’re here</span>
          <span className="story-belief-big-number" aria-hidden="true">01<span>/</span>03</span>
        </div>
        <div className="story-belief-copy">
          <h2 id="belief-title">A wardrobe isn’t a race.<br />It’s a collection of <em>keep-for-evers.</em></h2>
          <p>We believe getting dressed can be simpler, more personal, and a little kinder to the world around us. Not another trend to chase, but fewer, more considered pieces: easy to wear, lovely to live in, and made to feel like yours.</p>
        </div>
      </section>

      <section className="story-principles" aria-labelledby="principles-title">
        <div className="story-section-heading">
          <div>
            <span className="eyebrow"><span className="eyebrow-line" />What matters to us</span>
            <h2 id="principles-title">Style with a little<br /><em>more intention.</em></h2>
          </div>
          <p>These are the ideas we keep close as we build a more thoughtful kind of clothing brand.</p>
        </div>
        <div className="story-values-grid">
          <article className="story-value-card">
            <span className="story-value-number">01 <span aria-hidden="true">✳</span> THE DESIGN</span>
            <div className="story-value-mark story-value-mark-sun" aria-hidden="true">S</div>
            <h3>Beyond the season</h3>
            <p>Timeless lines and easy-to-style pieces have a place in your wardrobe long after the newness wears off. We’re drawn to design that gives you room to make it your own.</p>
            <span className="story-value-footnote">Less trend. More you.</span>
          </article>
          <article className="story-value-card">
            <span className="story-value-number">02 <span aria-hidden="true">✳</span> THE DETAILS</span>
            <div className="story-value-mark story-value-mark-thread" aria-hidden="true">〰</div>
            <h3>Nothing to hide</h3>
            <p>Where a material comes from and how a garment is made matter. We want to share those details clearly, product by product, and be upfront about what we’re still learning.</p>
            <span className="story-value-footnote">Clarity over claims.</span>
          </article>
          <article className="story-value-card">
            <span className="story-value-number">03 <span aria-hidden="true">✳</span> THE NEXT LIFE</span>
            <div className="story-value-mark story-value-mark-loop" aria-hidden="true">↗</div>
            <h3>Make room for more</h3>
            <p>We’re interested in what can happen when we use fabric more thoughtfully—from exploring low-waste pattern cutting to giving leftover materials and well-loved clothes another go.</p>
            <span className="story-value-footnote">Keep good things going.</span>
          </article>
        </div>
      </section>

      <section className="story-transparency" aria-labelledby="transparency-title">
        <div className="story-transparency-image" role="img" aria-label="Clothing being carefully made by hand" />
        <div className="story-transparency-copy">
          <span className="eyebrow"><span className="eyebrow-line" />A work in progress, by design</span>
          <h2 id="transparency-title">Honest is<br />always <em>in style.</em></h2>
          <p>“Sustainable” should mean more than a nice-sounding label. It should come with the details to back it up.</p>
          <p>We’re building toward clear information about the materials in each piece, where they come from, how it was made, and what we do with leftover fabric. We’ll share what we can verify—and be straight with you about the rest.</p>
          <div className="story-transparency-signoff"><span aria-hidden="true">✳</span> Better questions. More honest answers.</div>
        </div>
      </section>

      <section className="story-closing">
        <span className="eyebrow"><span className="eyebrow-line" />Thanks for being here</span>
        <h2>Find the ones<br />you’ll <em>live in.</em></h2>
        <p>Here’s to a wardrobe that feels good, looks like you, and stays in the story.</p>
        <Link className="primary-link" href="/#shop">Shop the collection <span aria-hidden="true">↗</span></Link>
        <span className="story-closing-scribble" aria-hidden="true">sunday, always <span>♡</span></span>
      </section>

      <footer className="site-footer">
        <Link className="wordmark footer-wordmark" href="/" aria-label="Sunday Studio home">sunday<span>.</span></Link>
        <span>Clothes that feel like a deep breath.</span>
        <span>© Sunday Studio 2025</span>
      </footer>
    </main>
  );
}

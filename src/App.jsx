import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Directors from './Directors';

gsap.registerPlugin(ScrollTrigger);

const EMAIL = 'hello@cinemafiagang.com';
const YOUTUBE = 'https://www.youtube.com/watch?v=l1RQXFNneao';

const featuredFilm = {
  title: '“THÍCH ANH CƠ” MUSIC VIDEO',
  client: 'HẰNG SSI FT. ARIES TIS',
  director: 'Nguyễn Thuý Hằng',
  team: 'CINEMAFIAGANG',
  format: 'August 2026',
  embedUrl: 'https://www.youtube.com/embed/l1RQXFNneao?autoplay=1&playsinline=1',
};

// Project sequence: a lead film followed by alternating paired frames.
const works = [
  { id: '254345545', size: 'hero', href: 'https://www.behance.net/gallery/254345545/THICH-ANH-CO-MUSIC-VIDEO', kind: 'Music video', title: '“Thích Anh Cơ”', credit: 'Hằng ssi ft. Aries tis' },
  { id: '249016471', size: 'wide', href: 'https://www.behance.net/gallery/249016471/SPC-ALZHEIMER-PROMO-VIDEO', kind: 'Promo film', title: 'SPC “Alzheimer”' },
  { id: '246413035', href: 'https://www.behance.net/gallery/246413035/SUNFLOWER-VDT-ft-BO-HAN', kind: 'Music video', title: 'Sunflower', credit: 'VDT ft. Bảo Hân' },
  { id: '245798525', href: 'https://www.behance.net/gallery/245798525/TA-CO-NHAU-RI-VDT-ft-Bo-Han', kind: 'Music video', title: 'Ta Có Nhau Rồi', credit: 'VDT ft. Bảo Hân' },
  { id: '241294493', size: 'wide', href: 'https://www.behance.net/gallery/241294493/STILL-Shortfilm-(2025)', kind: 'Short film, 2025', title: '“Still”' },
  { id: '229938251', size: 'wide', href: 'https://www.behance.net/gallery/229938251/LAMODE-AMS-ABSOLUTION', kind: 'Fashion film', title: 'Lamode AMS — Absolution' },
];

const words = text => text.split(/(\s+)/).map((part, i) => (part.trim() ? <span key={i} className="scrub-word">{part}</span> : part));
const still = id => <span className="inline-still" style={{ backgroundImage: `url('/assets/img/covers/${id}.webp')` }} aria-hidden="true" />;

export default function App() {
  const isDirectors = window.location.pathname.replace(/\/$/, '') === '/directors';
  const [modal, setModal] = useState(null); // null | 'video' | 'booking'
  const [navOpen, setNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [toast, setToast] = useState({ message: '', active: false });
  const toggleRef = useRef(null);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', update, { passive: true });
    update();
    return () => window.removeEventListener('scroll', update);
  }, []);

  useEffect(() => {
    const mobile = window.matchMedia('(max-width: 720px)');
    const close = () => setNavOpen(false);
    mobile.addEventListener('change', close);
    return () => mobile.removeEventListener('change', close);
  }, []);

  useEffect(() => {
    const onKey = e => {
      if (e.key !== 'Escape') return;
      setModal(null);
      if (navOpen) { setNavOpen(false); toggleRef.current.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [navOpen]);

  useEffect(() => {
    document.body.style.overflow = modal ? 'hidden' : '';
  }, [modal]);

  useEffect(() => {
    if (!toast.active) return;
    const t = setTimeout(() => setToast(s => ({ ...s, active: false })), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  const openVideo = e => { e.preventDefault(); setModal('video'); };
  const openBooking = e => { e.preventDefault(); setModal('booking'); };
  const closeModal = () => setModal(null);
  const onNavLink = () => { if (window.matchMedia('(max-width: 720px)').matches) setNavOpen(false); };

  // No backend: hand the brief to the visitor's mail app so nothing typed is lost.
  const submitBrief = e => {
    e.preventDefault();
    const f = new FormData(e.target);
    const subject = `Project inquiry: ${f.get('type')} — ${f.get('name')}`;
    const body = [
      `Name / company: ${f.get('name')}`,
      `Email: ${f.get('email')}`,
      `Project type: ${f.get('type')}`,
      `Budget: ${f.get('budget') || 'Not specified'}`,
      '',
      f.get('brief'),
    ].join('\n');
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setToast({ message: `Opening your email app. If nothing opens, write to ${EMAIL}.`, active: true });
  };

  const playerUrl = new URL(featuredFilm.embedUrl);
  playerUrl.searchParams.set('origin', window.location.origin);
  const pageInert = modal !== null;

  return (
    <>
      <a className="skip-link" href={isDirectors ? "#directors-title" : "#work"} inert={pageInert}>Skip to content</a>

      <header className={`site-header${scrolled ? ' scrolled' : ''}`} inert={pageInert}>
        <div className="nav-pill">
          <a href="/#top" className="brand-logo-wrap" aria-label="CINEMAFIAGANG home">
            <img src="/assets/img/cmg-logo-transparent.png" alt="" className="main-logo-img" width="728" height="254" />
          </a>
          <nav className={`site-nav${navOpen ? ' is-open' : ''}`} id="site-navigation" aria-label="Main navigation">
            <ul className="nav-menu">
              <li><a href="/#work" className="nav-link" onClick={onNavLink}>Work</a></li>
              <li><a href="/directors/" className="nav-link" aria-current={isDirectors ? "page" : undefined} onClick={onNavLink}>Directors</a></li>
              <li><a href="/#services" className="nav-link" onClick={onNavLink}>Services</a></li>
              <li><a href="/#contact" className="nav-link" onClick={onNavLink}>Contact</a></li>
            </ul>
          </nav>
          <a href="#contact" className="btn btn-primary btn-sm nav-cta" onClick={openBooking}>Start a project</a>
          <button ref={toggleRef} className="mobile-menu-btn" type="button" aria-expanded={navOpen} aria-controls="site-navigation" onClick={() => setNavOpen(o => !o)}>
            <span>{navOpen ? 'Close' : 'Menu'}</span>
          </button>
        </div>
      </header>

      <main className="page" id="top" inert={pageInert}>
        {isDirectors ? <Directors /> : <>
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-eyebrow"><span>Independent film collective</span><span>Hanoi, Vietnam · 21°01′ N</span></div>
          <h1 className="hero-title" id="hero-title" aria-label="CINEMAFIAGANG"><span>CINEMA</span><span>FIA<span className="hero-star" aria-hidden="true">✳</span>GANG</span></h1>
          <div className="hero-bottom"><p>Good films.<br />Made together.</p><p>A shared obsession with moving images.<br />From the first spark to the final frame.</p><a href="#work" className="text-link">Explore our work <span>↓</span></a></div>
          <div className="hero-frame"><FeaturedPreview /></div>
          <div className="film-caption"><span><i className="status-dot" /> Featured film / 01</span><span>“Thích Anh Cơ” — Hằng ssi ft. Aries tis</span><a href={YOUTUBE} onClick={openVideo}>Watch full film <span>↗</span></a></div>
        </section>

        <div className="marquee" aria-label="Disciplines">
          <div className="marquee-track">
            {[false, true].map(hidden => (
              <ul key={String(hidden)} className="marquee-list" aria-hidden={hidden || undefined}>
                <li>Color grading</li><li>Music videos</li><li>Short film</li><li>Fashion film</li><li>Photography</li>
              </ul>
            ))}
          </div>
        </div>

        <Manifesto />

        <section className="chapter work-section" id="work" aria-labelledby="work-title">
          <div className="section-label"><span>01 / The films</span><span>Selected work, 2025—2026</span></div>
          <div className="chapter-head"><h2 className="display" id="work-title">MADE TO<br /><em>move you.</em></h2><p>Different stories. The same commitment<br />to every single frame.</p></div>
          <div className="work-grid">
            {works.map((w, index) => (
              <a key={w.id} className={`work-card work-card--${index}`} href={w.href} target="_blank" rel="noopener">
                <div className="work-image"><img src={`/assets/img/covers/${w.id}.webp`} alt="" loading="lazy" decoding="async" width="808" height="632" /><span className="work-open" aria-hidden="true">↗</span><span className="work-index">0{index + 1}</span></div>
                <div className="work-meta"><h3>{w.title}</h3><span>{w.kind}</span></div>
                {w.credit && <p className="work-credit">{w.credit}</p>}
                <span className="sr-only">(opens on Behance in a new tab)</span>
              </a>
            ))}
          </div>
          <a className="text-link work-all" href="https://instagram.com/cinemafiagang" target="_blank" rel="noopener">Follow the gang <span>↗</span></a>
        </section>

        <section className="chapter services-section" id="services" aria-labelledby="services-title">
          <div className="section-label"><span>02 / What we do</span><span>From idea to screen</span></div>
          <div className="services-intro"><h2 id="services-title">One collective.<br /><em>The whole picture.</em></h2><p>We bring the people, the craft and the care.<br />You bring the story worth telling.</p></div>
          <div className="service-list">
            <details className="service" open><summary><span className="service-number">01</span><h3>Film production</h3><span className="service-toggle" aria-hidden="true">+</span></summary><div className="service-content"><p>Music videos, short films and fashion films. From shaping the first idea to bringing the crew together on set.</p><span>CONCEPT / DIRECTION / PRODUCTION</span><img src="/assets/img/bts/set-room.webp" alt="Lighting and camera setup on a CINEMAFIAGANG film set" loading="lazy" /></div></details>
            <details className="service"><summary><span className="service-number">02</span><h3>Post-production</h3><span className="service-toggle" aria-hidden="true">+</span></summary><div className="service-content"><p>Finding the rhythm. Shaping the look. Editing and color grading, finished in-house with the same attention as the shoot.</p><span>EDITING / COLOR GRADING / FINISHING</span><img src="/assets/img/bts/grade-desk.webp" alt="The collective’s color grading workstation" loading="lazy" /></div></details>
          </div>
        </section>

        <section className="crew-section" aria-labelledby="crew-title">
          <div className="section-label"><span>03 / Behind the frames</span><a href="/directors/">Meet our directors ↗</a></div>
          <div className="crew-composition"><figure className="crew-photo crew-photo--one"><img src="/assets/img/bts/set-school.webp" alt="The crew filming on location at a school in Hanoi" loading="lazy" /><figcaption>On location. Hanoi.</figcaption></figure><div className="crew-copy"><span className="crew-asterisk" aria-hidden="true">✳</span><h2 id="crew-title">IT TAKES<br />A <em>gang.</em></h2><p>Different eyes. Shared instincts.<br />A film is never made alone.</p><a href="/directors/" className="text-link">Meet the people <span>↗</span></a></div><figure className="crew-photo crew-photo--two"><img src="/assets/img/bts/set-kitchen.webp" alt="Camera and lighting equipment behind the scenes" loading="lazy" /><figcaption>Between the takes.</figcaption></figure></div>
          <p className="crew-footnote">Shot, lit & graded by the same hands. <span>That’s our kind of filmmaking.</span></p>
        </section>

        </>}

        {/* Action */}
        <footer className="site-footer" id="contact">
          <p className="footer-kicker">04 / Your next film starts here</p>
          <h2 className="footer-cta"><a href={`mailto:${EMAIL}`}>LET’S MAKE<br /><em>something move.</em><span className="footer-arrow" aria-hidden="true">↗</span></a></h2>
          <div className="footer-actions">
            <button className="btn btn-primary" type="button" onClick={openBooking}>Send a brief</button>
            <a className="btn btn-ghost" href={`mailto:${EMAIL}`}>{EMAIL}</a>
          </div>
          <div className="footer-grid">
            <img src="/assets/img/cmg-logo-transparent.png" alt="CINEMAFIAGANG" className="footer-logo" width="728" height="254" loading="lazy" />
            <dl className="footer-contact">
              <div><dt>Email</dt><dd><a href={`mailto:${EMAIL}`}>{EMAIL}</a></dd></div>
              <div><dt>Phone</dt><dd><a href="tel:+84866642314">+84 8666 423 14</a></dd></div>
              <div><dt>Instagram</dt><dd><a href="https://instagram.com/cinemafiagang" target="_blank" rel="noopener">@cinemafiagang</a></dd></div>
              <div><dt>Based in</dt><dd>Hanoi, Vietnam</dd></div>
            </dl>
          </div>
          <p className="footer-bottom">© 2026 CINEMAFIAGANG</p>
        </footer>
      </main>

      <Modal id="cinemaVideoModal" labelledBy="modalProjectTitle" open={modal === 'video'} onClose={closeModal}>
        <div className="modal-video-container">
          <iframe title="Project video player" src={modal === 'video' ? playerUrl.href : undefined} allow="autoplay; encrypted-media; fullscreen; picture-in-picture" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />
        </div>
        <div className="modal-info-body">
          <div className="modal-project-client">{featuredFilm.client}</div>
          <h2 className="modal-project-title" id="modalProjectTitle">{featuredFilm.title}</h2>
          <dl className="modal-credits-grid">
            <div><dt>Director</dt><dd>{featuredFilm.director}</dd></div>
            <div><dt>Collective</dt><dd>{featuredFilm.team}</dd></div>
            <div><dt>Published</dt><dd>{featuredFilm.format}</dd></div>
          </dl>
          <p className="modal-links">
            <a href={YOUTUBE} target="_blank" rel="noopener">Watch on YouTube ↗</a>
            <a href={works[0].href} target="_blank" rel="noopener">Credits on Behance ↗</a>
          </p>
        </div>
      </Modal>

      <Modal id="commissionBookingModal" labelledBy="bookingTitle" narrow open={modal === 'booking'} onClose={closeModal}>
        <div className="modal-info-body">
          <h2 className="modal-project-title" id="bookingTitle">Let’s make a <em>film</em></h2>
          <p className="form-note">Fill this in and we’ll open an email to {EMAIL} with your brief, ready to send.</p>
          <form className="booking-form" onSubmit={submitBrief}>
            <label className="field"><span>Name / company</span><input type="text" name="name" autoComplete="name" required /></label>
            <label className="field"><span>Email</span><input type="email" name="email" autoComplete="email" required /></label>
            <label className="field"><span>Project type</span>
              <select name="type">
                <option>Music video</option>
                <option>Commercial / brand film</option>
                <option>Fashion film</option>
                <option>Short film</option>
                <option>Post-production / color grading</option>
              </select>
            </label>
            <label className="field"><span>Budget <small>(if known)</small></span><input type="text" name="budget" /></label>
            <label className="field field--full"><span>What are you making, and when?</span><textarea name="brief" rows={5} required /></label>
            <button type="submit" className="btn btn-primary field--full">Open email with brief</button>
          </form>
        </div>
      </Modal>

      <div className={`cmg-toast${toast.active ? ' active' : ''}`} role="status">{toast.message}</div>
    </>
  );
}

// Stays mounted so the .active CSS transition runs; inert, focus trap and focus return live here only.
function Modal({ id, labelledBy, narrow, open, onClose, children }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const returnFocus = document.activeElement;
    ref.current.querySelector('.modal-close-btn').focus();
    return () => returnFocus?.focus();
  }, [open]);

  const trapTab = e => {
    if (e.key !== 'Tab') return;
    const controls = [...ref.current.querySelectorAll('button, a[href], input, select, textarea, iframe')].filter(el => !el.disabled && el.getClientRects().length);
    const first = controls[0], last = controls[controls.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };

  return (
    <div ref={ref} className={`cinema-modal-backdrop${open ? ' active' : ''}`} id={id} role="dialog" aria-modal="true" aria-labelledby={labelledBy} inert={!open}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }} onKeyDown={trapTab}>
      <div className={`cinema-modal-dialog${narrow ? ' cinema-modal-dialog--narrow' : ''}`}>
        <button className="modal-close-btn" type="button" aria-label="Close" onClick={onClose}>×</button>
        {children}
      </div>
    </div>
  );
}

// Silent loop: muted, no controls; paused offscreen, in hidden tabs, and for reduced motion.
function FeaturedPreview() {
  const ref = useRef(null);

  useEffect(() => {
    const video = ref.current;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let visible = true;
    video.muted = video.defaultMuted = true;
    const sync = () => {
      if (motion.matches || !visible || document.hidden) video.pause();
      else video.play().catch(() => {});
    };
    const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }, { threshold: 0.15 });
    io.observe(video);
    document.addEventListener('visibilitychange', sync);
    motion.addEventListener('change', sync);
    sync();
    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', sync);
      motion.removeEventListener('change', sync);
    };
  }, []);

  return (
    <video ref={ref} id="featuredPreview" className="hero-video" disablePictureInPicture disableRemotePlayback autoPlay loop muted playsInline preload="metadata" poster="/assets/img/covers/254345545.webp" aria-hidden="true">
      <source src="/assets/video/thich-anh-co-preview.mp4" type="video/mp4" />
    </video>
  );
}

// Motion only adds on top of visible content; reduced-motion users get none.
function Manifesto() {
  const ref = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(ref.current.querySelectorAll('.scrub-word, .inline-still'), { opacity: 0.12 }, {
        opacity: 1, stagger: 0.1, ease: 'none',
        scrollTrigger: { trigger: ref.current, start: 'top 80%', end: 'bottom 45%', scrub: true },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section className="chapter manifesto" aria-label="About the collective">
      <div className="manifesto-label"><span className="status-dot" /> The collective<br /><span className="manifesto-location">Rooted in Hanoi.<br />Driven by curiosity.</span></div>
      <div><p ref={ref} className="scrub-text">{words('We turn a shared obsession with cinema into ')}{still('246413035')}{words(' films that feel like something.')}</p><div className="manifesto-bottom"><p>We are CINEMAFIAGANG. An independent collective making music videos, short films and fashion films. A close-knit crew, from first idea to final cut.</p><a href="/directors/" className="text-link">Get to know us <span>↗</span></a></div></div>
    </section>
  );
}

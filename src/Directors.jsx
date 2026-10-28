import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

// Supply confirmed silent preview clips (local or CDN URLs) and optional posters.
// No existing film is attributed to a director without confirmed credits.
const directors = [
  { name: 'Do Hoang Long', initials: 'DHL', role: 'Founder, Cinematographer, Colorist', previewUrl: null, poster: null },
  { name: 'Le Quang Minh', initials: 'LQM', role: 'Assistant Director', previewUrl: null, poster: null },
  { name: 'Phan Nam Anh', initials: 'PNA', role: 'Producer', previewUrl: null, poster: null },
  { name: 'Nguyen Thi Truc Anh', initials: 'NTTA', role: 'Producer', previewUrl: null, poster: null },
  { name: 'Vo Hong Minh', initials: 'VHM', role: 'Camera Operator', previewUrl: null, poster: null },
  { name: 'Pham Chu Binh', initials: 'PCB', role: 'Editor, VFX', previewUrl: null, poster: null },
  { name: 'Nguyen Quang Tien', initials: 'NQT', role: 'Editor', previewUrl: null, poster: null },
  { name: 'Hoang Hai Nam', initials: 'HHN', role: 'Technical Specialist', previewUrl: null, poster: null },
];

export default function Directors() {
  const [selected, setSelected] = useState(null);
  const [visible, setVisible] = useState(false);
  const follower = useRef(null);
  const motion = useRef(null);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const trail = { samples: [], x: 0, y: 0, targetX: 0, targetY: 0, placed: false };
    motion.current = trail;
    let frame;
    let previous = performance.now();
    const tick = now => {
      const dt = Math.min(now - previous, 64);
      previous = now;
      // Replay the pointer 100ms late, then ease into that delayed position.
      const cutoff = now - (reduced.matches ? 0 : 100);
      while (trail.samples.length && trail.samples[0].time <= cutoff) {
        const sample = trail.samples.shift();
        trail.targetX = sample.x; trail.targetY = sample.y;
      }
      const blend = reduced.matches ? 1 : 1 - Math.exp(-dt / 190);
      trail.x += (trail.targetX - trail.x) * blend;
      trail.y += (trail.targetY - trail.y) * blend;
      if (trail.placed) follower.current.style.transform = `translate3d(${trail.x}px, ${trail.y}px, 0)`;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    const move = event => {
      if (event.pointerType !== 'touch') position(event.clientX, event.clientY);
    };
    const hide = () => setVisible(false);
    const leave = event => { if (!event.relatedTarget) hide(); };
    const escape = event => { if (event.key === 'Escape') hide(); };
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerout', leave);
    window.addEventListener('blur', hide);
    window.addEventListener('keydown', escape);
    return () => {
      cancelAnimationFrame(frame); motion.current = null;
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerout', leave);
      window.removeEventListener('blur', hide);
      window.removeEventListener('keydown', escape);
    };
  }, []);

  const position = (clientX, clientY) => {
    const trail = motion.current;
    if (!trail || !follower.current) return;
    // Deliberately unclamped: the preview can cross the viewport edges.
    const x = clientX - follower.current.offsetWidth * .5;
    const y = clientY - follower.current.offsetHeight * .4;
    if (!trail.placed) {
      trail.x = trail.targetX = x; trail.y = trail.targetY = y;
      trail.placed = true;
    }
    trail.samples.push({ x, y, time: performance.now() });
  };
  const activate = (index, event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    if (event.clientX || event.clientY) position(event.clientX, event.clientY);
    else position(bounds.left + bounds.width * .48, bounds.top + bounds.height * .6);
    setSelected(index); setVisible(true);
  };

  return (
    <section className="directors-page" aria-labelledby="directors-title">
      <div className="directors-heading"><span>The people behind the picture</span><span>The gang / 08</span></div>
      <h1 id="directors-title" className="directors-intro" tabIndex={-1}>Different eyes.<br /><em>One vision.</em></h1>
      <ul className={`director-list${visible ? ' has-preview' : ''}`} aria-label="The crew"
        onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setVisible(false); }}>
        {directors.map((director, index) => (
          <li key={director.name}>
            <button className={`director-row${visible && selected === index ? ' is-selected' : ''}`}
              aria-pressed={visible && selected === index} aria-controls="director-preview"
              onPointerEnter={event => { if (event.pointerType !== 'touch') activate(index, event); }}
              onPointerMove={event => {
                if (event.pointerType === 'touch') return;
                position(event.clientX, event.clientY); setSelected(index); setVisible(true);
              }}
              onFocus={event => activate(index, event)}
              onClick={event => activate(index, event)}
              onKeyDown={event => { if (event.key === 'Escape') setVisible(false); }}>
              <span className="director-name">{director.name}</span><span className="director-role">{director.role}</span>
            </button>
          </li>
        ))}
      </ul>
      {createPortal(<div ref={follower} id="director-preview" className={`director-follower${visible ? ' is-visible' : ''}`} aria-hidden="true">
        {directors.map((director, index) => (
          <Preview key={director.name} director={director} index={index} active={visible && selected === index} />
        ))}
      </div>, document.body)}
      <span className="sr-only" aria-live="polite">{visible && selected !== null && !directors[selected].previewUrl ? `${directors[selected].name}: ${directors[selected].role}.` : ''}</span>
    </section>
  );
}

function Preview({ director, index, active }) {
  const video = useRef(null);
  useEffect(() => {
    if (!video.current) return;
    const element = video.current;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => {
      if (active && !document.hidden && !reduced.matches) element.play().catch(() => {});
      else element.pause();
    };
    sync();
    document.addEventListener('visibilitychange', sync);
    reduced.addEventListener('change', sync);
    return () => { element.pause(); document.removeEventListener('visibilitychange', sync); reduced.removeEventListener('change', sync); };
  }, [active]);
  return <div className={`director-preview-layer director-tone-${index}${active ? ' is-active' : ''}`}>
    {director.previewUrl ? <video ref={video} src={director.previewUrl} poster={director.poster || undefined} loop muted playsInline preload="metadata" />
      : <>{director.poster && <img src={director.poster} alt="" />}<span className="director-monogram">{director.initials}</span><span className="director-pending">{director.role}</span></>}
  </div>;
}

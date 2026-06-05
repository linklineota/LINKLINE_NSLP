const { useState, useEffect, useRef } = React;
const D = window.LP_DATA;
const trackLead = () => { try { window.fbq && window.fbq('track', 'Lead'); } catch (e) {} };

/* =====================================================================
   REVEAL HOOK
   - useGlobalReveal: IntersectionObserver reveal (adds .in when visible)
   ===================================================================== */

/* Global, repeat-safe reveal observer. Scans the DOM for any .reveal / .stagger
   element and toggles `.in` when it crosses the viewport. Re-scans after mutation
   so late-mounted React children are covered too. */
function useGlobalReveal() {
  useEffect(() => {
    const io = new IntersectionObserver((ents) => {
      ents.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -40px 0px' });

    const scan = () => {
      document.querySelectorAll('.reveal:not(.in), .stagger:not(.in)').forEach(el => {
        if (!el.dataset.roBound) {
          el.dataset.roBound = '1';
          io.observe(el);
        }
      });
    };
    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => { io.disconnect(); mo.disconnect(); };
  }, []);
}

/* (kept for compatibility but unused) */
function useReveal() {
  const ref = useRef(null);
  return ref;
}

/* Hero title — static, fades in on load. */
function HeroTitle() {
  return (
    <h1 className="lp-hero-title fade-in" style={{ animationDelay: '.2s' }}>
      もっと<span className="accent">安心して</span><br className="br-sp"/>働きながら<br/>
      <span className="mincho">長く活躍したい</span><br className="br-sp"/>看護師の方、<br/>
      他にいませんか？
    </h1>
  );
}

/* =========== TOP BAR =========== */
function TopBar() {
  return (
    <header className="lp-topbar">
      <div className="brand">
        BUILD LIFE HIGASHISUMIYOSHI
        <small>{D.brand.facility}／{D.brand.location}<br/>2026年7月 OPEN</small>
      </div>
      <nav className="topnav">
        <a href="#voice">社員の声</a>
        <a href="#reasons">長く働ける理由</a>
        <a href="#terms">待遇</a>
        <a href={D.brand.lineUrl} target="_blank" rel="noopener noreferrer" onClick={trackLead} className="pill">LINEで応募</a>
      </nav>
    </header>
  );
}

/* =========== HERO =========== */
function Hero() {
  return (
    <section className="lp-hero">
      <div className="lp-hero-inner">
        <div>
          <div className="lp-hero-badge fade-in">
            <span className="dot"></span>
            {D.hero.lead}
          </div>

          <HeroTitle />

          <div className="lp-hero-sub fade-in" style={{animationDelay:'.6s'}}>
            — 新築・2026年7月オープン、<br className="br-sp"/>3名限定募集。
          </div>
          <div className="lp-hero-note fade-in" style={{animationDelay:'.7s'}}>{D.hero.note}</div>

          <div className="lp-hero-ctas fade-in" style={{animationDelay:'.8s'}}>
            <a href={D.brand.lineUrl} target="_blank" rel="noopener noreferrer" onClick={trackLead} className="lp-btn big">
              <span className="line-ico">L</span>
              LINEで応募・相談する
            </a>
            <a href="#reasons" className="lp-btn ghost">長く働ける理由を見る ›</a>
          </div>

          <div className="lp-hero-kpis fade-in" style={{animationDelay:'.9s'}}>
            {D.hero.kpis.map((k, i) => (
              <div className="lp-hero-kpi" key={i}>
                <div className="n">{k.n}</div>
                <div className="t">{k.t}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="lp-hero-visual fade-in" style={{animationDelay:'.3s'}}>
          <img className="lp-hero-illust a" src={D.illust.k19} alt="" />
          <div className="lp-hero-photo p1"><div className="ph-inner"><img src={D.hero.photos.main} alt="現場で働くスタッフ" /></div></div>
          <div className="lp-hero-photo p2"><div className="ph-inner"><img src={D.hero.photos.building} alt="施設外観" /></div></div>
          <img className="lp-hero-illust b" src={D.illust.k07} alt="" />
        </div>
      </div>
    </section>
  );
}

/* =========== PROBLEMS =========== */
function Problems() {
  const revealRef = useReveal();
  return (
    <section className="lp-section lp-problems" id="problems">
      <div className="lp-container">
        <div className="lp-label-center reveal" ref={useReveal()}>
          <span className="lp-eyebrow">{D.problems.eyebrow}</span>
          <h2 className="lp-h1">{D.problems.title}</h2>
        </div>
        <div className="lp-problems-grid stagger" ref={revealRef}>
          {D.problems.groups.map((g, i) => (
            <div className="lp-problem-card tilt" key={i}>
              <div className="lbl">{g.label}</div>
              <ul>
                {g.items.map((it, j) => <li key={j}>{it}</li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="lp-problems-outro reveal">
          このまま働き続けて、<em>身体を壊してしまう前に。</em><br/>
          「長く、無理なく働ける職場」があることを、知ってほしいのです。
        </div>
      </div>
    </section>
  );
}

/* =========== VOICE =========== */
function Voice() {
  const listRef = useRef(null);
  const [idx, setIdx] = useState(0);
  const people = D.voices.people;
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const onScroll = () => {
      const step = list.clientWidth * 0.88 + 16;
      const i = Math.round(list.scrollLeft / step);
      setIdx(Math.min(Math.max(i, 0), people.length - 1));
    };
    list.addEventListener('scroll', onScroll, { passive: true });
    return () => list.removeEventListener('scroll', onScroll);
  }, [people.length]);
  const goTo = (i) => {
    const list = listRef.current;
    if (!list) return;
    const step = list.clientWidth * 0.88 + 16;
    list.scrollTo({ left: i * step, behavior: 'smooth' });
  };
  return (
    <section className="lp-section lp-voice" id="voice">
      <div className="lp-container">
        <div className="lp-label-center reveal" ref={useReveal()}>
          <span className="lp-eyebrow">{D.voices.eyebrow}</span>
          <h2 className="lp-h1">{D.voices.title}</h2>
        </div>
        <p className="lp-voice-intro reveal" ref={useReveal()}>{D.voices.sub}</p>

        <div className="lp-voice-carousel">
          <button type="button" className="lp-voice-nav prev" aria-label="前のインタビュー" onClick={() => goTo(idx - 1)} disabled={idx === 0}>‹</button>
          <div className="lp-voice-list stagger" ref={listRef}>
            {people.map((p, i) => (
              <article className="lp-voice-group reveal" key={i}>
                <div className="lp-voice-person">
                  <div className="lp-voice-avatar">
                    {p.photo ? <img src={p.photo} alt={p.name} /> : <span>PHOTO</span>}
                  </div>
                  <div className="name">{p.name}</div>
                  <div className="role">{p.role}</div>
                  <div className="years">{p.years}</div>
                </div>
                {p.video && (
                  <div className="lp-voice-video">
                    <iframe
                      src={`https://www.youtube.com/embed/${p.video}`}
                      title={`${p.name} インタビュー`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  </div>
                )}
                <div className="lp-voice-body">
                  <div className="tag">{p.tag}</div>
                  {p.body.map((par, j) => <p key={j}>{par}</p>)}
                </div>
              </article>
            ))}
          </div>
          <button type="button" className="lp-voice-nav next" aria-label="次のインタビュー" onClick={() => goTo(idx + 1)} disabled={idx === people.length - 1}>›</button>
        </div>

        <div className="lp-voice-dots" role="tablist" aria-label="インタビュー切替">
          {people.map((_, i) => (
            <button type="button" key={i} className={`lp-voice-dot ${i === idx ? 'active' : ''}`} aria-label={`${i + 1}人目を表示`} aria-current={i === idx} onClick={() => goTo(i)} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* =========== REASONS =========== */
function ReasonRow({ r, i, illust }) {
  const ref = useReveal();
  return (
    <div ref={ref} className={`lp-reason-row reveal ${i % 2 === 1 ? 'flip slide-left' : 'slide-right'}`}>
      <div className="r-visual">
        <img className="illust" src={illust} alt=""/>
        <div className="ph-label">REASON {r.num}</div>
      </div>
      <div className="r-copy">
        <span className="r-num"><small>REASON {r.num}</small>{r.num}</span>
        <h3>{r.title}</h3>
        <p>{r.body}</p>
        <div className="r-bullets">
          {r.bullets.map((b, j) => <span key={j}>{b}</span>)}
        </div>
      </div>
    </div>
  );
}
function Reasons() {
  const illusts = [D.illust.k20, D.illust.k13, D.illust.k12];
  return (
    <section className="lp-section lp-reasons" id="reasons">
      <div className="lp-container">
        <div className="lp-label-center reveal" ref={useReveal()}>
          <span className="lp-eyebrow">{D.reasons.eyebrow}</span>
          <h2 className="lp-h1">{D.reasons.title}</h2>
        </div>
        <div>
          {D.reasons.items.map((r, i) => (
            <ReasonRow key={i} r={r} i={i} illust={illusts[i]} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* =========== CEO MESSAGE =========== */
function Ceo() {
  return (
    <section className="lp-section lp-ceo" id="ceo">
      <div className="lp-container">
        <div className="lp-label-center reveal" ref={useReveal()}>
          <span className="lp-eyebrow">{D.ceo.eyebrow}</span>
          <h2 className="lp-h1">{D.ceo.title}</h2>
        </div>
        <div className="lp-ceo-grid">
          <div className="lp-ceo-photo reveal slide-left" ref={useReveal()}>
            {D.ceo.photo && <img className="ceo-img" src={D.ceo.photo} alt={D.brand.ceoName} />}
            <span className="ceo-tag">CEO</span>
            <div className="caption">
              <div className="role">{D.brand.company}　代表取締役社長</div>
              <div className="name">{D.brand.ceoName}</div>
            </div>
          </div>
          <div className="lp-ceo-body reveal slide-right" ref={useReveal()}>
            <div className="quote">{D.ceo.quote}</div>
            {D.ceo.body.map((p, i) => <p key={i}>{p}</p>)}
            <div className="sig">
              {D.brand.company}　代表取締役社長
              <strong>{D.brand.ceoName}</strong>
            </div>
          </div>
        </div>

        {D.ceo.video && (
          <div className="lp-ceo-video reveal zoom" ref={useReveal()}>
            <div className="lp-voice-video" style={{maxWidth:680}}>
              <iframe
                src={`https://www.youtube.com/embed/${D.ceo.video}`}
                title="代表メッセージ"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* =========== TOUR =========== */
function Tour() {
  return (
    <section className="lp-section lp-tour" id="tour">
      <div className="lp-container">
        <div className="lp-label-center reveal" ref={useReveal()}>
          <span className="lp-eyebrow">{D.tour.eyebrow}</span>
          <h2 className="lp-h1">{D.tour.title}</h2>
          <p style={{marginTop:16, color:'var(--fg-2)', fontSize:14}}>{D.tour.sub}</p>
        </div>
        <div className="lp-tour-grid stagger" ref={useReveal()}>
          {D.tour.rooms.map((r, i) => (
            <article className="lp-tour-card tilt" key={i}>
              <div className="img">
                {r.photo && <img src={r.photo} alt={r.title} />}
              </div>
              <div className="body">
                <span className="tag">{r.tag}</span>
                <h4>{r.title}</h4>
                <p>{r.body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =========== JOURNEY =========== */
function JourneyStep({ s }) {
  const ref = useReveal();
  return (
    <div className="lp-journey-step reveal slide-right" ref={ref}>
      <span className="rng">{s.range}</span>
      <h4>{s.title}</h4>
      <p>{s.body}</p>
    </div>
  );
}
function Journey() {
  return (
    <section className="lp-section lp-journey" id="journey">
      <div className="lp-container">
        <div className="lp-label-center reveal" ref={useReveal()}>
          <span className="lp-eyebrow">{D.journey.eyebrow}</span>
          <h2 className="lp-h1">{D.journey.title}</h2>
          <p style={{marginTop:16, color:'var(--fg-2)', fontSize:14}}>{D.journey.sub}</p>
        </div>
        <div className="lp-journey-list">
          {D.journey.steps.map((s, i) => (
            <JourneyStep key={i} s={s} />
          ))}
        </div>
        <div className="lp-journey-note reveal">{D.journey.note}</div>
      </div>
    </section>
  );
}

/* =========== FIT =========== */
function Fit() {
  return (
    <section className="lp-section lp-fit" id="fit">
      <div className="lp-container">
        <div className="lp-label-center reveal" ref={useReveal()}>
          <span className="lp-eyebrow">{D.fit.eyebrow}</span>
          <h2 className="lp-h1">{D.fit.title}</h2>
          <p style={{marginTop:16, color:'var(--fg-2)', fontSize:14, maxWidth:620, margin:'16px auto 0'}}>{D.fit.sub}</p>
        </div>
        <div className="lp-fit-grid">
          <div className="lp-fit-card want tilt reveal slide-right" ref={useReveal()}>
            <h4>{D.fit.want.title}</h4>
            <ul>
              {D.fit.want.items.map((it, i) => <li key={i}>{it}</li>)}
            </ul>
          </div>
          <div className="lp-fit-card nope tilt reveal slide-left" ref={useReveal()}>
            <h4>{D.fit.notWant.title}</h4>
            <ul>
              {D.fit.notWant.items.map((it, i) => <li key={i}>{it}</li>)}
            </ul>
            <p className="note">{D.fit.notWant.note}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========== TERMS =========== */
function Terms() {
  const t = D.terms;
  return (
    <section className="lp-section lp-terms" id="terms">
      <div className="lp-container">
        <div className="lp-label-center reveal" ref={useReveal()}>
          <span className="lp-eyebrow">{t.eyebrow}</span>
          <h2 className="lp-h1">{t.title}</h2>
          {t.sub && <p style={{maxWidth:620, margin:'16px auto 0', color:'var(--fg-2)', fontSize:14, lineHeight:2, whiteSpace:'pre-line'}}>{t.sub}</p>}
        </div>
        <div className="lp-terms-grid stagger" ref={useReveal()}>
          <div className="lp-terms-card full tilt">
            <h4>Salary</h4>
            {t.salaryGroups.map((g, gi) => (
              <div key={gi} style={{marginBottom: gi < t.salaryGroups.length - 1 ? 26 : 0}}>
                <div style={{fontWeight:700, fontSize:14.5, color:'var(--p-ink)', margin:'0 0 6px'}}>{g.label}</div>
                {g.lead && <p style={{margin:'0 0 10px', fontSize:12.5, color:'var(--fg-2)', lineHeight:1.85}}>{g.lead}</p>}
                <dl style={{margin:0}}>
                  {g.rows.map((s, i) => (
                    <div className="row" key={i}>
                      <dt>{s.k}</dt>
                      <dd><span className="big">{s.v}</span>{s.note && <span className="note">{s.note}</span>}</dd>
                    </div>
                  ))}
                </dl>
                {g.breakdown && g.breakdown.length > 0 && (
                  <ul style={{margin:'12px 0 0', padding:'0 0 0 1.1em', fontSize:12, color:'var(--fg-2)', lineHeight:1.95}}>
                    {g.breakdown.map((b, i) => <li key={i}>{b}</li>)}
                  </ul>
                )}
                {g.note && <p style={{margin:'8px 0 0', fontSize:11.5, color:'var(--fg-3)', lineHeight:1.7}}>{g.note}</p>}
              </div>
            ))}
            {t.salaryNote && <p style={{margin:'18px 0 0', fontSize:12, color:'var(--fg-3)', lineHeight:1.8}}>{t.salaryNote}</p>}
          </div>
          <div className="lp-terms-card tilt">
            <h4>Allowances</h4>
            <div className="lp-terms-chips">
              {t.allowances.map((a, i) => <span key={i}>{a}</span>)}
            </div>
          </div>
          <div className="lp-terms-card tilt">
            <h4>Welfare</h4>
            <div className="lp-terms-chips">
              {t.welfare.map((a, i) => <span key={i}>{a}</span>)}
            </div>
          </div>
          <div className="lp-terms-card tilt">
            <h4>Working Hours</h4>
            <dl style={{margin:0}}>
              {t.hours.map((h, i) => (
                <div className="row" key={i}>
                  <dt>{h.k}</dt>
                  <dd style={{fontSize:13.5}}>{h.v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="lp-terms-card tilt">
            <h4>Holidays</h4>
            <div className="lp-terms-chips">
              {t.holidays.map((a, i) => <span key={i}>{a}</span>)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========== PROCESS =========== */
function Process() {
  return (
    <section className="lp-section lp-process" id="process">
      <div className="lp-container">
        <div className="lp-label-center reveal" ref={useReveal()}>
          <span className="lp-eyebrow">{D.process.eyebrow}</span>
          <h2 className="lp-h1">{D.process.title}</h2>
        </div>
        <div className="lp-process-steps stagger" ref={useReveal()}>
          {D.process.steps.map((s, i) => (
            <div className="lp-process-step tilt" key={i}>
              <span className="n"><small>STEP {s.n}</small>{s.n}</span>
              <h4>{s.title}</h4>
              <p>{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =========== CTA =========== */
function CtaBlock() {
  return (
    <section className="lp-cta" id="cta">
      <div className="lp-cta-inner reveal zoom" ref={useReveal()}>
        <span className="lp-eyebrow">{D.cta.eyebrow}</span>
        <h3>{D.cta.title}</h3>
        <div className="lp-cta-list">
          {D.cta.body.map((b, i) => <div key={i}>{b}</div>)}
        </div>
        <a href={D.brand.lineUrl} target="_blank" rel="noopener noreferrer" onClick={trackLead} className="lp-line-btn">
          <span className="line-mark">LINE</span>
          {D.cta.button}
        </a>
        <div className="lp-cta-note">{D.cta.note}</div>
      </div>
    </section>
  );
}

/* =========== FOOTER =========== */
function Footer() {
  return (
    <footer className="lp-footer">
      <div className="lp-footer-inner">
        <div>
          <h5>{D.brand.company}</h5>
          <p>{D.brand.facilityType} {D.brand.facility}</p>
          <p>〒{D.brand.postal}　{D.brand.address}</p>
          <p>2026年7月オープン</p>
          <p>TEL：070-1387-7798</p>
        </div>
        <div className="links">
          <a href="#problems">悩み</a>
          <a href="#voice">社員の声</a>
          <a href="#reasons">3つの理由</a>
          <a href="#ceo">代表メッセージ</a>
          <a href="#tour">職場ツアー</a>
          <a href="#journey">入社後の流れ</a>
          <a href="#fit">求める人材</a>
          <a href="#terms">給与・待遇</a>
          <a href="#process">採用フロー</a>
          <a href="#cta">応募する</a>
        </div>
      </div>
      <div className="copy">© 2026 {D.brand.company}. All rights reserved.</div>
    </footer>
  );
}

/* =========== FLOATING CTA =========== */
function FloatingCta() {
  const [show, setShow] = useState(false);
  const [overCta, setOverCta] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    window.addEventListener('scroll', onScroll);
    onScroll();
    const cta = document.getElementById('cta');
    let io;
    if (cta) {
      io = new IntersectionObserver(
        (entries) => setOverCta(entries[0].isIntersecting),
        { threshold: 0.1 }
      );
      io.observe(cta);
    }
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (io) io.disconnect();
    };
  }, []);
  const visible = show && !overCta;
  return (
    <a href={D.brand.lineUrl} target="_blank" rel="noopener noreferrer" onClick={trackLead} className={`lp-float-cta ${visible ? 'show' : ''}`}>
      <span className="line-mark">LINE</span>
      LINEで応募・相談する
    </a>
  );
}

/* =========== TWEAKS =========== */
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "pink"
}/*EDITMODE-END*/;

function Tweaks({ state, setState, open, setOpen }) {
  const swatches = [
    { key: 'pink',   label: 'ピンク（Nurse系）' },
    { key: 'yellow', label: 'イエロー（Recruit系）' },
    { key: 'brown',  label: 'ブラウン（ウッド系）' },
  ];
  return (
    <div className={`tweaks-panel ${open ? 'open' : ''}`}>
      <h6>
        TWEAKS
        <span className="close" onClick={() => setOpen(false)}>✕</span>
      </h6>
      <div className="tweak-group">
        <label>メインカラー</label>
        <div className="swatches">
          {swatches.map(s => (
            <div key={s.key}
                 className={`swatch ${s.key} ${state.theme === s.key ? 'active' : ''}`}
                 title={s.label}
                 onClick={() => setState({ theme: s.key })} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* =========== APP =========== */
function App() {
  const [state, setStateRaw] = useState(TWEAK_DEFAULTS);
  const [tweaksOpen, setTweaksOpen] = useState(false);
  const [tweakAvailable, setTweakAvailable] = useState(false);

  useGlobalReveal();

  const setState = (patch) => {
    const next = { ...state, ...patch };
    setStateRaw(next);
    try {
      window.parent.postMessage({ type: '__edit_mode_set_keys', edits: patch }, '*');
    } catch (e) {}
  };

  useEffect(() => {
    const onMsg = (e) => {
      const d = e.data || {};
      if (d.type === '__activate_edit_mode') { setTweakAvailable(true); setTweaksOpen(true); }
      else if (d.type === '__deactivate_edit_mode') { setTweakAvailable(false); setTweaksOpen(false); }
    };
    window.addEventListener('message', onMsg);
    try { window.parent.postMessage({ type: '__edit_mode_available' }, '*'); } catch (e) {}
    return () => window.removeEventListener('message', onMsg);
  }, []);

  return (
    <div className={`lp-root lp-theme-${state.theme || 'pink'}`}>
      <TopBar />
      <Hero />
      <Problems />
      <Voice />
      <Reasons />
      <Ceo />
      <Tour />
      <Journey />
      <Fit />
      <Terms />
      <Process />
      <CtaBlock />
      <Footer />
      <FloatingCta />
      {tweakAvailable && (
        <Tweaks state={state} setState={setState} open={tweaksOpen} setOpen={setTweaksOpen} />
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);

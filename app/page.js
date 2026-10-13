import { readDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const { profile } = readDb();
  return {
    title: `${profile.name} — ${profile.title}`,
    description: profile.bio?.slice(0, 150),
  };
}

function ext(url) {
  if (!url) return "#";
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

function period(from, to) {
  if (!from && !to) return "";
  return `${from || ""} — ${to || "hozirgacha"}`;
}

export default function Home() {
  const { profile: p, projects, skills, experience, education } = readDb();

  const groups = skills.reduce((acc, s) => {
    const key = s.category || "Boshqa";
    (acc[key] ||= []).push(s);
    return acc;
  }, {});

  const sortByStart = (a, b) => String(b.from).localeCompare(String(a.from));

  const socials = [
    p.github && { label: "GitHub", href: ext(p.github) },
    p.linkedin && { label: "LinkedIn", href: ext(p.linkedin) },
    p.telegram && { label: "Telegram", href: ext(p.telegram) },
    p.email && { label: "Email", href: `mailto:${p.email}` },
  ].filter(Boolean);

  return (
    <>
      <nav className="nav">
        <div className="container">
          <a href="#top" className="logo">{p.name}</a>
          <ul>
            <li><a href="#skills">Ko'nikmalar</a></li>
            <li><a href="#projects">Loyihalar</a></li>
            <li><a href="#experience">Tajriba</a></li>
            <li><a href="#education">Ta'lim</a></li>
            <li><a href="#contact">Aloqa</a></li>
          </ul>
        </div>
      </nav>

      <header className="hero" id="top">
        <div className="container grid">
          <div>
            <div className="tag">Salom, men</div>
            <h1>{p.name}</h1>
            <h2>{p.title}</h2>
            <p>{p.bio}</p>
            {socials.length > 0 && (
              <div className="socials">
                {socials.map((s) => (
                  <a key={s.label} className="btn" href={s.href} target="_blank" rel="noreferrer">
                    {s.label}
                  </a>
                ))}
              </div>
            )}
          </div>
          {p.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="avatar" src={p.avatar} alt={p.name} />
          ) : (
            <div className="avatar-ph">{(p.name || "?").charAt(0).toUpperCase()}</div>
          )}
        </div>
      </header>

      <section className="block" id="skills">
        <div className="container">
          <h3>Ko'nikmalar</h3>
          {skills.length === 0 ? (
            <p className="empty">Hozircha ko'nikmalar qo'shilmagan.</p>
          ) : (
            Object.entries(groups).map(([cat, list]) => (
              <div className="skill-group" key={cat}>
                <h5>{cat}</h5>
                <div className="skills">
                  {list.map((s) => (
                    <div className="skill" key={s.id}>
                      <div className="row">
                        <span>{s.name}</span>
                        <span>{s.level}%</span>
                      </div>
                      <div className="bar"><i style={{ width: `${s.level}%` }} /></div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="block" id="projects">
        <div className="container">
          <h3>Loyihalar</h3>
          {projects.length === 0 ? (
            <p className="empty">Hozircha loyihalar qo'shilmagan.</p>
          ) : (
            <div className="cards">
              {projects.map((pr) => (
                <article className="card" key={pr.id}>
                  {pr.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img className="thumb" src={pr.image} alt={pr.title} />
                  )}
                  <div className="body">
                    <h4>{pr.title}</h4>
                    <p>{pr.description}</p>
                    {pr.tech && (
                      <div className="chips">
                        {pr.tech.split(",").map((t) => t.trim()).filter(Boolean).map((t) => (
                          <span className="chip" key={t}>{t}</span>
                        ))}
                      </div>
                    )}
                    {(pr.demo || pr.repo) && (
                      <div className="links">
                        {pr.demo && <a href={ext(pr.demo)} target="_blank" rel="noreferrer">Demo ↗</a>}
                        {pr.repo && <a href={ext(pr.repo)} target="_blank" rel="noreferrer">Kod ↗</a>}
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="block" id="experience">
        <div className="container">
          <h3>Tajriba</h3>
          {experience.length === 0 ? (
            <p className="empty">Hozircha tajriba qo'shilmagan.</p>
          ) : (
            <div className="timeline">
              {[...experience].sort(sortByStart).map((e) => (
                <div className="tl-item" key={e.id}>
                  <div className="when">{period(e.from, e.to)}</div>
                  <h4>{e.role}</h4>
                  {e.company && <div className="sub">{e.company}</div>}
                  {e.description && <p>{e.description}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="block" id="education">
        <div className="container">
          <h3>Ta'lim</h3>
          {education.length === 0 ? (
            <p className="empty">Hozircha ta'lim ma'lumotlari qo'shilmagan.</p>
          ) : (
            <div className="timeline">
              {[...education].sort(sortByStart).map((e) => (
                <div className="tl-item" key={e.id}>
                  <div className="when">{period(e.from, e.to)}</div>
                  <h4>{e.school}</h4>
                  {e.degree && <div className="sub">{e.degree}</div>}
                  {e.description && <p>{e.description}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="block" id="contact">
        <div className="container">
          <h3>Aloqa</h3>
          <div className="contact-list">
            {p.email && <div><b>Email:</b><a href={`mailto:${p.email}`}>{p.email}</a></div>}
            {p.phone && <div><b>Telefon:</b><a href={`tel:${p.phone}`}>{p.phone}</a></div>}
            {p.location && <div><b>Manzil:</b>{p.location}</div>}
            {!p.email && !p.phone && !p.location && (
              <p className="empty">Aloqa ma'lumotlari hali kiritilmagan.</p>
            )}
          </div>
        </div>
      </section>

      <footer className="foot">
        <div className="container">
          <span>© {new Date().getFullYear()} {p.name}</span>
          <a href="/admin">Admin</a>
        </div>
      </footer>
    </>
  );
}

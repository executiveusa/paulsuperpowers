#!/usr/bin/env node
// inquiry-path-check — deterministic, read-only audit of a business website's inquiry path.
// Part of the low-hanging-fruit skill. Node >= 20, no dependencies. Never submits forms.
//
// Usage:
//   node inquiry-path-check.mjs https://example.com [https://other.com ...] [--json]
//
// What it checks (facts only, no inference of revenue or urgency):
//   - HTTP status, redirect target, response time, HTTPS
//   - presence of tel:, mailto:, WhatsApp, booking/calendar links; malformed tel:/mailto:
//   - <form> elements: method, action target, whether action resolves (HEAD/GET, no submit)
//   - primary CTA guess: first prominent anchor/button text
//   - broken internal nav links (up to 15 sampled, HEAD/GET)
//   - mixed content (http:// assets on an https page)
//   - viewport meta present (mobile), title present, h1 count
//   - contact keywords present (hours, address, WhatsApp, "contacto"/"contact")
// Output: one opportunity-card seed per site (markdown), or --json.

const args = process.argv.slice(2);
const asJson = args.includes('--json');
const urls = args.filter(a => /^https?:\/\//i.test(a));
if (!urls.length) {
  console.error('usage: inquiry-path-check.mjs <url> [url...] [--json]');
  process.exit(2);
}

const UA = 'PauliInquiryPathCheck/1.0 (+read-only audit; no form submission)';
const TIMEOUT_MS = 15000;

async function fetchText(url, method = 'GET') {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  const started = Date.now();
  try {
    const res = await fetch(url, { method, redirect: 'follow', headers: { 'user-agent': UA, accept: 'text/html,*/*' }, signal: ctrl.signal });
    const ms = Date.now() - started;
    const text = method === 'GET' ? await res.text() : '';
    return { ok: true, status: res.status, finalUrl: res.url, ms, text, contentType: res.headers.get('content-type') || '' };
  } catch (e) {
    return { ok: false, status: 0, finalUrl: url, ms: Date.now() - started, text: '', error: String(e && e.message || e) };
  } finally { clearTimeout(t); }
}

function attr(tag, name) {
  const m = tag.match(new RegExp('\\s' + name + '\\s*=\\s*("([^"]*)"|\'([^\']*)\'|([^\\s>]+))', 'i'));
  return m ? (m[2] ?? m[3] ?? m[4] ?? '') : '';
}
function strip(html) { return html.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(); }
function resolve(base, href) { try { return new URL(href, base).toString(); } catch { return null; } }

async function headOk(url) {
  let r = await fetchText(url, 'HEAD');
  if (!r.ok || r.status === 405 || r.status === 403) r = await fetchText(url, 'GET');
  return r;
}

async function audit(url) {
  const page = await fetchText(url);
  const out = { url, finalUrl: page.finalUrl, status: page.status, ms: page.ms, https: /^https:/i.test(page.finalUrl), findings: [], facts: {} };
  if (!page.ok || page.status >= 400) {
    out.findings.push({ severity: 'high', fact: `Site did not load (status ${page.status}${page.error ? ', ' + page.error : ''})` });
    return out;
  }
  const html = page.text;
  const text = strip(html).toLowerCase();
  const anchors = [...html.matchAll(/<a\b[^>]*>/gi)].map(m => m[0]);
  const hrefs = anchors.map(a => attr(a, 'href')).filter(Boolean);
  const tel = hrefs.filter(h => /^tel:/i.test(h));
  const mail = hrefs.filter(h => /^mailto:/i.test(h));
  const wa = hrefs.filter(h => /wa\.me|api\.whatsapp\.com|whatsapp:/i.test(h));
  const booking = hrefs.filter(h => /calendly|cal\.com|acuity|squareup\.com\/appointments|booksy|vagaro|setmore|zcal|tidycal|hubspot\.com\/meetings|book|reserv|agenda|cita/i.test(h));
  const badTel = tel.filter(h => !/^tel:\+?[0-9()\-.\s]{7,}$/i.test(h));
  const badMail = mail.filter(h => !/^mailto:[^@\s]+@[^@\s]+\.[a-z]{2,}/i.test(h));
  const forms = [...html.matchAll(/<form\b[^>]*>/gi)].map(m => ({ method: (attr(m[0], 'method') || 'GET').toUpperCase(), action: attr(m[0], 'action') }));
  const viewport = /<meta[^>]+name=["']viewport["']/i.test(html);
  const title = (html.match(/<title[^>]*>([^<]*)<\/title>/i) || [])[1]?.trim() || '';
  const h1s = (html.match(/<h1\b/gi) || []).length;
  const mixed = out.https ? [...html.matchAll(/\s(?:src|href)=["'](http:\/\/[^"']+)["']/gi)].map(m => m[1]).filter(u => !/^http:\/\/(www\.)?w3\.org/i.test(u)) : [];
  const kw = { hours: /\b(hours|horario|open (mon|tue|daily)|lun[- ]?vie)\b/i.test(text), address: /\b(address|direcci[oó]n|suite|ste\.|avenue|ave\.|street|st\.|calle|col\.)\b/i.test(text), contact: /\b(contact|cont[aá]cta|cont[aá]cto|get in touch|book now|reservar|agenda)\b/i.test(text), social: hrefs.some(h => /facebook\.com|instagram\.com|tiktok\.com|linkedin\.com|youtube\.com/i.test(h)) };

  // primary CTA guess: first anchor/button whose text matches an action verb
  const ctaRe = /(book|schedule|get (a )?quote|contact|call|start|join|donate|buy|shop|order|reserv|agenda|cotiza|comprar|donar|apply|sign up|get started)/i;
  let cta = null;
  for (const m of html.matchAll(/<(a|button)\b([^>]*)>([\s\S]*?)<\/\1>/gi)) {
    const t = strip(m[3]); if (t && t.length < 60 && ctaRe.test(t)) { cta = { text: t, href: attr('<x ' + m[2] + '>', 'href') || null }; break; }
  }

  // sample internal links
  const origin = new URL(page.finalUrl).origin;
  const internal = [...new Set(hrefs.map(h => resolve(page.finalUrl, h)).filter(u => u && u.startsWith(origin) && !/#|\.(png|jpe?g|svg|gif|webp|pdf|css|js)$/i.test(u)))].slice(0, 15);
  const broken = [];
  await Promise.all(internal.map(async u => { const r = await headOk(u); if (!r.ok || r.status >= 400) broken.push({ url: u, status: r.status }); }));

  // form action reachability (no submission)
  const formChecks = [];
  for (const f of forms) {
    if (!f.action || /^javascript:|^#/.test(f.action)) { formChecks.push({ ...f, note: 'no action attribute (JS-handled or same-page); cannot verify destination statically' }); continue; }
    const target = resolve(page.finalUrl, f.action);
    const r = await headOk(target);
    // A POST-only endpoint (Shopify /contact, /cart/add, many form handlers) legitimately answers GET with
    // 404/405/400. That is NOT proof the form is broken — mark it unverifiable rather than failing it.
    const postOnlyAmbiguous = f.method === 'POST' && [400, 404, 405].includes(r.status);
    formChecks.push({ ...f, target, reachable: postOnlyAmbiguous ? null : (r.ok && r.status < 400), status: r.status, note: postOnlyAmbiguous ? 'POST-only endpoint; GET probe inconclusive — verify in a browser' : undefined });
  }

  out.facts = { title, h1s, viewport, tel, mail, whatsapp: wa, booking, forms: formChecks, cta, internalSampled: internal.length, broken, mixedContent: mixed.slice(0, 5), keywords: kw };

  if (!tel.length && !mail.length && !wa.length && !forms.length && !booking.length) out.findings.push({ severity: 'high', fact: 'No inquiry path found on the landing page: no tel:, mailto:, WhatsApp, booking link, or form' });
  if (badTel.length) out.findings.push({ severity: 'high', fact: `Malformed tel: link(s): ${badTel.join(', ')}` });
  if (badMail.length) out.findings.push({ severity: 'high', fact: `Malformed mailto: link(s): ${badMail.join(', ')}` });
  for (const f of formChecks) if (f.target && f.reachable === false) out.findings.push({ severity: 'high', fact: `Form action unreachable: ${f.method} ${f.target} → ${f.status}` });
  if (broken.length) out.findings.push({ severity: 'medium', fact: `Broken internal link(s): ${broken.map(b => `${b.url} → ${b.status}`).join('; ')}` });
  if (!viewport) out.findings.push({ severity: 'medium', fact: 'No viewport meta tag (mobile rendering not declared)' });
  if (!out.https) out.findings.push({ severity: 'high', fact: 'Site served over plain HTTP' });
  if (mixed.length) out.findings.push({ severity: 'medium', fact: `Mixed content on HTTPS page: ${mixed.slice(0, 3).join(', ')}` });
  if (page.ms > 4000) out.findings.push({ severity: 'low', fact: `Slow first response: ${page.ms} ms` });
  if (!title) out.findings.push({ severity: 'low', fact: 'Missing <title>' });
  if (h1s === 0) out.findings.push({ severity: 'low', fact: 'No <h1> on landing page' });
  if (!kw.contact) out.findings.push({ severity: 'low', fact: 'No contact/booking wording detected in visible text' });
  return out;
}

function card(r) {
  const date = new Date().toISOString().slice(0, 10);
  const gaps = r.findings.length ? r.findings.map(f => `- [${f.severity}] ${f.fact}`).join('\n') : '- No quick win observed by static check';
  const f = r.facts;
  const inv = f && f.tel ? `tel:${f.tel.length} mailto:${f.mail.length} whatsapp:${f.whatsapp.length} booking:${f.booking.length} forms:${f.forms.length} cta:${f.cta ? JSON.stringify(f.cta.text) : 'none'} brokenLinks:${f.broken.length}/${f.internalSampled} viewport:${f.viewport}` : 'n/a';
  return `### ${r.url}\n**Loaded:** ${r.status} in ${r.ms} ms → ${r.finalUrl}\n**Inquiry inventory:** ${inv}\n**Observed gaps (static facts, ${date}):**\n${gaps}\n**Status:** PROPOSED — verify in a real browser before quoting; this tool never submits forms.\n`;
}

const results = [];
for (const u of urls) results.push(await audit(u));
if (asJson) console.log(JSON.stringify(results, null, 2));
else console.log(results.map(card).join('\n'));

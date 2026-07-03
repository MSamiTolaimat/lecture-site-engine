# Decap CMS — رفع المحاضرات

واجهة ويب لرفع وتعديل ملفات `parN.md` مباشرة على GitHub بدون تعديل `manifest.json` يدوياً.

## الوصول

| البيئة | الرابط |
| --- | --- |
| GitHub Pages | `https://shahd-abbara.github.io/lecture-site-engine/admin/` |
| محلي | `http://localhost:8080/admin/` (بعد `npm run build` + `python3 -m http.server` من `dist/`) |

## ما يمكن رفعه

- **محاضرات** — `subjects/year-N/subject/lectures/parN.md` أو `parN-secN.md`
- **إعدادات الموقع** — اسم المادة، الثيم، الأيقونات في `manifest.json` (بدون `files` — تُولَّد تلقائياً)
- **وسائط** — صور في `subjects/media/uploads/`

## إعداد GitHub OAuth (مرة واحدة)

Decap CMS يحتاج **OAuth proxy** لأن الموقع على GitHub Pages وليس Netlify.

### 1. أنشئ GitHub OAuth App

GitHub → Settings → Developer settings → OAuth Apps → New:

| الحقل | القيمة |
| --- | --- |
| Application name | `lecture-site-engine-cms` |
| Homepage URL | `https://shahd-abbara.github.io/lecture-site-engine` |
| Authorization callback URL | `https://<oauth-proxy>/callback` |

احفظ **Client ID** و **Client Secret**.

### 2. انشر OAuth proxy

خيارات مجانية:

- [decap-proxy](https://github.com/sterlingwes/decap-proxy) — Cloudflare Worker
- [netlify-cms-oauth-provider-node](https://github.com/bericp1/netlify-cms-oauth-provider-node) — Vercel/Netlify

### 3. أضف متغيرات CI

في GitHub repo → Settings → Secrets → Actions:

```
DECAP_OAUTH_BASE_URL = https://your-oauth-proxy.example.com
```

### 4. أعد توليد الإعداد

```bash
DECAP_OAUTH_BASE_URL=https://your-oauth-proxy.example.com npm run cms:config
```

أو اضبط السر في workflow deploy — يُولَّد `config.yml` تلقائياً عند النشر.

## التطوير المحلي (بدون OAuth)

```bash
# Terminal 1 — git backend proxy (مطلوب مع local_backend)
npx decap-server

# Terminal 2
npm run cms:local          # يفعّل local_backend في config.yml
npm run build -- --subject year-4/os-2-theory
cd dist && python3 -m http.server 8080
```

افتح `http://localhost:8080/admin/` — `local_backend` **للتطوير المحلي فقط**.

> ⚠️ لا تستخدم `local_backend: true` على GitHub Pages — يحاول الاتصال بـ `localhost:8081` ويفشل.

## توليد config.yml

```bash
npm run cms:config
```

يُنشئ `admin/config.yml` من مجلدات `subjects/year-*/` تلقائياً.

## ملاحظات

- المحتوى يُحفظ بصيغة frontmatter (`body: |`) — البناء يزيلها قبل التحليل
- `manifest.json` → `files` يُزامَن تلقائياً عند validate/build
- بعد الحفظ من CMS → يُنشأ commit على GitHub → CI يتحقق وينشر

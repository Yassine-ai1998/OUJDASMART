# Oujda Smart — النسخة الدولية / International edition

## العربية

افتح هذا المجلد في VS Code، أو افتح ملف Oujda-Smart.code-workspace. تحتاج إلى Node.js 22 أو 24 مع npm.

افتح نافذتين من الطرفية داخل مجلد المشروع. في الأولى:

```sh
cd backend
npm install
npm run dev
```

وفي الثانية:

```sh
cd frontend
npm install
npm run dev
```

ثم افتح http://localhost:3102. أوقف النسخة السابقة أولاً إذا كانت تستخدم المنفذين 3102 و4102.

تُنشأ قاعدة PostgreSQL المحلية المضمّنة وحسابات التجربة تلقائيًا. ستجد بيانات الدخول في backend/.local-accounts.txt بعد التشغيل الأول. لا يحتوي الأرشيف على كلمات مرور أو بيانات خاصة.

يمكنك اختيار العربية أو الفرنسية أو الإنجليزية من رأس الصفحة. هذه منصة أكاديمية غير تابعة رسميًا للمطار أو ONDA، والرحلات المعروضة تجريبية. المساعد يستخدم قاعدة محلية، مع إمكانية ضبط مزوّد لغوي خارجي في الخادم.

## Français

Ouvrir le dossier dans VS Code, puis exécuter les commandes ci-dessus dans deux terminaux distincts. Les ports sont 3102 (interface) et 4102 (API). Les comptes locaux sont générés au premier démarrage. Voir README.md pour la configuration, docs/API.md pour les endpoints et docs/VALIDATION.md pour les contrôles effectués.

## English

Open this folder in VS Code and run the commands above in two separate terminals. Node.js 22 or 24 and npm are required. Open http://localhost:3102. Local demo credentials are generated in backend/.local-accounts.txt on first start. Stop an earlier copy if it already uses ports 3102/4102.

This is an academic prototype with fictional flights, embedded PostgreSQL for local use, and an optional external LLM adapter. No production deployment or official airport-system connection is included. OpenSky regional aircraft tracking is enabled by default for this non-commercial academic prototype.

## Suivi gratuit / التتبع المجاني / Free tracking

تم تفعيل OpenSky في صفحة /tracking لعرض مواقع فعلية للطائرات حول وجدة. لا تحتاج إلى مفتاح API أو بريد إلكتروني. التحديث كل خمس دقائق على الأقل، ونصف قطر العرض نحو 222 كم. قد تكون الطائرات عابرة للأجواء. الدليل: docs/FLIGHT-TRACKING.md.

FR : OpenSky est la source par défaut, pour un usage académique non commercial. Consulter docs/FLIGHT-TRACKING.md pour les quotas et les autres fournisseurs. EN: OpenSky is the default source; regional aircraft positions update at least five minutes apart. See the same guide for configuration and limitations.

## Tableau aéroport / لوحة المطار / Airport board

FR : ouvrir http://localhost:3102/flights pour le tableau inspiré des écrans aéroportuaires, avec Arrivées, Départs et détails dépliables. Les horaires restent de démonstration. Voir docs/AIRPORT-BOARD.md.

AR: افتح http://localhost:3102/flights لعرض لوحة الوصول والمغادرة وتفاصيل الرحلات. المواعيد تجريبية، وخريطة مواقع الطائرات الفعلية متاحة عبر /tracking.

EN: open http://localhost:3102/flights for the airport board, arrivals, departures and expandable details. Schedules are fictional; actual regional positions remain on /tracking.

## Nouveau design · 13 octobre 2026

La vraie photo du terminal Oujda-Angads et la nouvelle identité bleu nuit/dorée sont visibles sur /, /flights et /tracking. Les crédits sont dans frontend/public/IMAGE-CREDITS.md. Pour voir le résultat après démarrage, ouvrir http://localhost:3102/flights ou http://localhost:3102/.

import fs from "node:fs/promises";
import path from "node:path";
import bcrypt from "bcryptjs";
import { config, ROOT } from "../config/env.js";
import { one, query, tx } from "../config/db.js";
import { id, sha, sentiment } from "../utils/helpers.js";
const tr = (fr, en, ar) => ({ fr, en, ar });
export const topicData = [
  [
    "flights",
    "Vols",
    "Flights",
    "الرحلات",
    "Comment consulter le statut de mon vol ?",
    "How can I check my flight status?",
    "كيف أتحقق من حالة رحلتي؟",
    "Consultez la page Vols et recherchez votre numéro de vol. Tous les vols affichés ici sont fictifs. Pour un déplacement réel, vérifiez auprès de votre compagnie aérienne.",
    "Open Flights and search for your flight number. All flights shown here are fictional. For actual travel, confirm with your airline.",
    "افتح صفحة الرحلات وابحث برقم الرحلة. جميع الرحلات هنا افتراضية. للسفر الفعلي يرجى التأكد لدى شركة الطيران.",
    "vol flight avion retard delayed departure arrival رحلة طيران تاخير",
  ],
  [
    "checkin",
    "Enregistrement",
    "Check-in",
    "تسجيل الوصول",
    "Quand commence l’enregistrement ?",
    "When does check-in open?",
    "متى يبدأ تسجيل الوصول؟",
    "Les horaires dépendent de votre compagnie et de votre vol. Consultez votre réservation et les consignes de la compagnie. Le prototype ne confirme pas les heures limites réelles.",
    "Check-in times depend on your airline and flight. Check your booking and airline instructions. This prototype cannot confirm actual deadlines.",
    "تختلف المواعيد حسب شركة الطيران والرحلة. راجع الحجز وتعليمات الشركة. لا يؤكد هذا النموذج المواعيد الفعلية.",
    "enregistrement checkin check-in enregistrer تسجيل الوصول",
  ],
  [
    "boarding",
    "Embarquement",
    "Boarding",
    "الصعود للطائرة",
    "Où trouver ma porte d’embarquement ?",
    "Where can I find my boarding gate?",
    "أين أجد بوابة الصعود؟",
    "Consultez votre carte d’embarquement et les écrans de l’aéroport. Les portes du prototype sont des exemples et peuvent différer des portes réelles.",
    "Check your boarding pass and airport screens. Gates in this prototype are examples and may differ from actual gates.",
    "راجع بطاقة الصعود وشاشات المطار. البوابات المعروضة في النموذج أمثلة وقد تختلف عن البوابات الفعلية.",
    "embarquement porte boarding gate بوابة صعود",
  ],
  [
    "baggage",
    "Bagages",
    "Baggage",
    "الأمتعة",
    "Comment récupérer ou signaler un bagage ?",
    "How can I collect or report baggage?",
    "كيف أستلم أمتعتي أو أبلغ عنها؟",
    "À l’arrivée, suivez la signalétique de livraison des bagages. En cas de bagage manquant, contactez le représentant de votre compagnie avant de quitter la zone. Aucun tapis réel n’est attribué dans ce prototype.",
    "On arrival, follow baggage reclaim signs. If a bag is missing, contact your airline representative before leaving the area. This prototype does not assign real baggage belts.",
    "عند الوصول اتبع لوحات استلام الأمتعة. إذا فقدت حقيبتك تواصل مع ممثل شركة الطيران قبل المغادرة. النموذج لا يحدد أحزمة فعلية.",
    "bagage valise baggage luggage bag lost أمتعة حقيبة امتعه",
  ],
  [
    "security",
    "Sécurité",
    "Security",
    "الأمن",
    "Quels documents et contrôles prévoir ?",
    "Which documents and checks should I prepare for?",
    "ما الوثائق والإجراءات المطلوبة؟",
    "Les documents varient selon votre destination et votre situation. Vérifiez les exigences auprès de votre compagnie et des autorités compétentes. Les règles de sûreté doivent être confirmées avant le voyage.",
    "Required documents depend on your destination and situation. Confirm requirements with your airline and the relevant authorities before travelling.",
    "تختلف الوثائق حسب الوجهة والوضع الشخصي. تحقق من المتطلبات لدى شركة الطيران والجهات المختصة قبل السفر.",
    "document passeport securite visa security passport documents وثائق جواز امن",
  ],
  [
    "parking",
    "Parking",
    "Parking",
    "موقف السيارات",
    "Où se trouve le parking et quels sont les tarifs ?",
    "Where is parking and what does it cost?",
    "أين موقف السيارات وما أسعاره؟",
    "La fiche Parking présente un emplacement indicatif pour la démonstration. Les tarifs, disponibilités et accès réels doivent être confirmés auprès du personnel de l’aéroport.",
    "The Parking card shows an illustrative location for the demo. Confirm actual rates, availability and access with airport staff.",
    "تعرض بطاقة الموقف موقعا توضيحيا للنموذج. يجب التأكد من الأسعار والتوفر والمداخل الفعلية لدى موظفي المطار.",
    "parking stationnement voiture park car park موقف سيارات",
  ],
  [
    "transport",
    "Transport",
    "Transport",
    "النقل",
    "Où trouver un taxi ?",
    "Where can I find a taxi?",
    "أين أجد سيارة أجرة؟",
    "Suivez la signalétique transport à la sortie et demandez au personnel où se situe la station autorisée. Le prototype ne garantit aucun tarif ni disponibilité.",
    "Follow transport signs at the exit and ask staff for the authorised taxi rank. This prototype does not guarantee fares or availability.",
    "اتبع لوحات النقل عند الخروج واسأل الموظفين عن موقف سيارات الأجرة المعتمد. لا يضمن النموذج أسعارا أو توفرا.",
    "taxi transport bus location voiture rental نقل اجرة حافلة",
  ],
  [
    "assistance",
    "Assistance",
    "Assistance",
    "المساعدة",
    "Comment demander une assistance PMR ?",
    "How can I request accessibility assistance?",
    "كيف أطلب مساعدة خاصة؟",
    "Signalez vos besoins à votre compagnie avant le départ et contactez le personnel sur place. Les modalités et délais doivent être confirmés avec votre compagnie.",
    "Tell your airline about your needs before departure and contact staff on arrival. Confirm arrangements and notice periods with your airline.",
    "أبلغ شركة الطيران باحتياجاتك قبل السفر وتواصل مع الموظفين عند الوصول. تحقق من الإجراءات والمواعيد لدى الشركة.",
    "pmr assistance handicap aide accessibility wheelchair مساعدة احتياجات متحرك",
  ],
  [
    "services",
    "Services",
    "Services",
    "الخدمات",
    "Quels services sont disponibles ?",
    "Which services are available?",
    "ما الخدمات المتاحة؟",
    "La page Services présente les catégories du prototype : restauration, boutiques, Wi-Fi et informations. Les emplacements et horaires réels restent à confirmer sur place.",
    "Services lists the demo categories: dining, shops, Wi-Fi and information. Confirm actual locations and opening hours on site.",
    "تعرض صفحة الخدمات فئات النموذج: المطاعم والمتاجر والواي فاي والمعلومات. يرجى التأكد من المواقع والمواعيد الفعلية في المطار.",
    "service wifi wi-fi boutique restaurant restauration information contact objets trouves services shop food خدمة مطعم واي فاي معلومات",
  ],
  [
    "complaints",
    "Réclamations",
    "Feedback",
    "الشكايات",
    "Comment envoyer une réclamation ?",
    "How can I submit feedback?",
    "كيف أرسل شكوى؟",
    "Utilisez le formulaire Réclamations. Vous recevrez une référence et un code de suivi privé. Les demandes restent dans ce prototype académique et ne sont pas transmises à l’ONDA.",
    "Use the Feedback form. You will receive a reference and private tracking code. Requests stay in this academic prototype and are not sent to ONDA.",
    "استخدم نموذج الشكايات. ستتلقى مرجعا ورمز تتبع خاصا. تبقى الطلبات داخل هذا النموذج الأكاديمي ولا ترسل إلى المكتب الوطني للمطارات.",
    "reclamation plainte suggestion complaint feedback claim شكوى شكاية اقتراح",
  ],
];
export async function seed({ writeFiles = true } = {}) {
  if (!config.demo) return;
  if (
    await one("SELECT id FROM users WHERE email=$1", ["admin@oujda-demo.test"])
  )
    return;
  if (!process.env.ADMIN_PASSWORD || !process.env.DEMO_PASSWORD)
    throw new Error(
      "Définir ADMIN_PASSWORD et DEMO_PASSWORD dans .env pour initialiser la démo.",
    );
  const admin = id(),
    user = id();
  const ah = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12),
    uh = await bcrypt.hash(process.env.DEMO_PASSWORD, 12);
  const sql = [];
  const literal = (v) =>
    v === null
      ? "NULL"
      : typeof v === "number"
        ? String(v)
        : "'" +
          String(typeof v === "object" ? JSON.stringify(v) : v).replaceAll(
            "'",
            "''",
          ) +
          "'";
  await tx(async (q) => {
    const add = async (s, p) => {
      await q(s, p);
      sql.push(
        s.replace(/\$(\d+)/g, (_, n) => literal(p[Number(n) - 1])) + ";",
      );
    };
    await add(
      "INSERT INTO users(id,name,email,password_hash,role) VALUES($1,$2,$3,$4,$5)",
      [admin, "Administration Démo", "admin@oujda-demo.test", ah, "ADMIN"],
    );
    await add(
      "INSERT INTO users(id,name,email,password_hash,role) VALUES($1,$2,$3,$4,$5)",
      [user, "Amine Voyageur", "passager@oujda-demo.test", uh, "USER"],
    );
    const cities = [
      "Paris Orly",
      "Bruxelles",
      "Casablanca",
      "Marseille",
      "Lyon",
      "Amsterdam",
      "Paris Orly",
      "Bruxelles",
      "Casablanca",
      "Montpellier",
      "Barcelone",
      "Düsseldorf",
    ];
    const airlines = [
      "Royal Air Maroc",
      "Ryanair",
      "Royal Air Maroc",
      "Transavia",
      "Ryanair",
      "TUI fly",
    ];
    const status = [
      "BOARDING",
      "ON_TIME",
      "DELAYED",
      "ON_TIME",
      "ON_TIME",
      "CANCELLED",
      "ARRIVED",
      "ON_TIME",
      "DELAYED",
      "ARRIVED",
      "ON_TIME",
      "ON_TIME",
    ];
    for (let i = 0; i < 12; i++) {
      const d = new Date();
      d.setHours(8 + i, 15 + (i % 3) * 10, 0, 0);
      const e = new Date(
        d.getTime() + (status[i] === "DELAYED" ? 45 : 0) * 60000,
      );
      await add(
        "INSERT INTO flights(id,number,airline,city,direction,scheduled_at,estimated_at,gate,status) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)",
        [
          id(),
          ["AT", "FR", "AT", "TO", "FR", "TB"][i % 6] + (700 + i * 13),
          airlines[i % 6],
          cities[i],
          i < 6 ? "departure" : "arrival",
          d.toISOString(),
          e.toISOString(),
          String(1 + (i % 4)),
          status[i],
        ],
      );
    }
    for (const t of topicData) {
      await add(
        "INSERT INTO faq(id,category,question,answer,keywords) VALUES($1,$2,$3,$4,$5)",
        [id(), t[0], tr(t[4], t[5], t[6]), tr(t[7], t[8], t[9]), t[10]],
      );
      await add(
        "INSERT INTO knowledge_base(id,topic,title,content,keywords) VALUES($1,$2,$3,$4,$5)",
        [id(), t[0], tr(t[1], t[2], t[3]), tr(t[7], t[8], t[9]), t[10]],
      );
    }
    const services = [
      ["parking", "Parking", "Parking", "Parking", "موقف السيارات"],
      ["taxi", "Car", "Taxis", "Taxis", "سيارات الأجرة"],
      [
        "rental",
        "KeyRound",
        "Location de voiture",
        "Car rental",
        "تأجير السيارات",
      ],
      ["dining", "Coffee", "Restauration", "Dining", "المطاعم"],
      ["shops", "ShoppingBag", "Boutiques", "Shopping", "المتاجر"],
      [
        "assistance",
        "Accessibility",
        "Assistance PMR",
        "Accessibility assistance",
        "المساعدة الخاصة",
      ],
      ["baggage", "Luggage", "Bagages", "Baggage", "الأمتعة"],
      ["lost", "Search", "Objets trouvés", "Lost and found", "المفقودات"],
      ["wifi", "Wifi", "Wi-Fi", "Wi-Fi", "واي فاي"],
      ["information", "Info", "Informations", "Information", "المعلومات"],
    ];
    const desc = {
      parking: tr(
        "Préparez votre arrivée en voiture et votre stationnement.",
        "Plan your arrival by car and parking.",
        "خطط للوصول بالسيارة ووقوفها.",
      ),
      taxi: tr(
        "Repérez les options de transport à votre arrivée.",
        "Explore ground transport options on arrival.",
        "تعرف على خيارات النقل عند الوصول.",
      ),
      rental: tr(
        "Anticipez vos déplacements dans la région.",
        "Plan your onward travel in the region.",
        "خطط لتنقلاتك في المنطقة.",
      ),
      dining: tr(
        "Une pause gourmande avant de poursuivre votre voyage.",
        "Take a break before the next part of your journey.",
        "استمتع باستراحة قبل متابعة رحلتك.",
      ),
      shops: tr(
        "Découvrez les espaces shopping du parcours passager.",
        "Explore shopping along your passenger journey.",
        "اكتشف فضاءات التسوق خلال رحلتك.",
      ),
      assistance: tr(
        "Un accompagnement adapté à vos besoins de mobilité.",
        "Support adapted to your mobility needs.",
        "مساعدة تناسب احتياجاتك في التنقل.",
      ),
      baggage: tr(
        "Les informations utiles pour retrouver vos bagages.",
        "Helpful information for baggage collection.",
        "معلومات مفيدة لاستلام أمتعتك.",
      ),
      lost: tr(
        "Les démarches pour signaler un objet oublié.",
        "Find out how to report a lost item.",
        "تعرف على كيفية الإبلاغ عن غرض مفقود.",
      ),
      wifi: tr(
        "Renseignez-vous sur les possibilités de connexion.",
        "Ask about internet connection options.",
        "استفسر عن خيارات الاتصال بالإنترنت.",
      ),
      information: tr(
        "Un point de départ pour trouver une réponse.",
        "A starting point for finding answers.",
        "نقطة البداية للحصول على إجابات.",
      ),
    };
    for (const s of services)
      await add(
        "INSERT INTO services(id,slug,icon,title,description,location,hours) VALUES($1,$2,$3,$4,$5,$6,$7)",
        [
          id(),
          s[0],
          s[1],
          tr(s[2], s[3], s[4]),
          desc[s[0]],
          tr(
            "Emplacement à confirmer sur place",
            "Location to be confirmed on site",
            "الموقع يؤكد في المطار",
          ),
          tr(
            "Horaires à confirmer",
            "Hours to be confirmed",
            "المواعيد تحتاج إلى تأكيد",
          ),
        ],
      );
    const messages = [
      [
        "parking",
        "Signalétique parking",
        "Je trouve les indications du parking difficiles à repérer.",
      ],
      [
        "baggage",
        "Information bagages",
        "Mon bagage a été perdu dans ce scénario fictif, je souhaite des informations.",
      ],
      [
        "assistance",
        "Merci pour votre aide",
        "Merci pour votre aide, accueil excellent dans ce scénario de démonstration.",
      ],
      [
        "transport",
        "Options de transport",
        "Je souhaite connaître les options de transport pour rejoindre la ville.",
      ],
      [
        "services",
        "Suggestion Wi-Fi",
        "Il serait utile de rendre les informations Wi-Fi plus visibles.",
      ],
    ];
    for (let i = 0; i < 5; i++)
      await add(
        "INSERT INTO complaints(id,reference,access_hash,user_id,name,email,category,subject,message,priority,status,sentiment,created_at) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)",
        [
          id(),
          "DEMO-2026-00" + (i + 1),
          sha(id()),
          user,
          "Voyageur fictif " + (i + 1),
          "passager@oujda-demo.test",
          ...messages[i],
          "NORMAL",
          ["RECEIVED", "IN_PROGRESS", "RESOLVED", "CLOSED", "RECEIVED"][i],
          sentiment(messages[i][2]),
          new Date(Date.now() - (4 - i) * 86400000).toISOString(),
        ],
      );
    for (let i = 0; i < 14; i++)
      await add(
        "INSERT INTO analytics(id,event,topic,created_at) VALUES($1,$2,$3,$4)",
        [
          id(),
          "demo_question",
          topicData[i % 10][0],
          new Date(Date.now() - (13 - i) * 86400000).toISOString(),
        ],
      );
  });
  if (!writeFiles) return;
  await fs.writeFile(
    path.join(ROOT, "sql/seed.sql"),
    "-- Données fictives. Générées par scripts/init.js. Les mots de passe sont hashés.\nBEGIN;\n" +
      sql.join("\n") +
      "\nCOMMIT;\n",
  );
  await fs.writeFile(
    path.join(ROOT, ".local-accounts.txt"),
    `PROTOTYPE ACADÉMIQUE — COMPTES LOCAUX\nAdministrateur : admin@oujda-demo.test\nMot de passe : ${process.env.ADMIN_PASSWORD}\n\nPassager : passager@oujda-demo.test\nMot de passe : ${process.env.DEMO_PASSWORD}\n`,
    { mode: 0o600 },
  );
}

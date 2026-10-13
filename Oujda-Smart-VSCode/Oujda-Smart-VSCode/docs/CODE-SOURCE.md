# Code source complet — Oujda Smart

Les chemins sont relatifs au dossier `oujda-airport/`. Chaque bloc reproduit le fichier exécutable correspondant. Les secrets, dépendances installées et données privées sont exclus.

## .gitignore

```text
node_modules/
.env
.env.local
.local-accounts.txt
.data/
dist/
*.log
.test-data/

.qa/

```

## backend/.env.example

```text
PORT=4102
APP_ORIGIN=http://localhost:3102
# embedded = PostgreSQL local via PGlite. postgres = serveur PostgreSQL.
DB_MODE=embedded
DATABASE_URL=postgresql://airport:airport@localhost:5432/oujda_airport
JWT_SECRET=
# Démonstration uniquement. Désactiver et changer les comptes avant exposition publique.
SEED_DEMO=true
DEMO_PASSWORD=
ADMIN_PASSWORD=
# Endpoint complet compatible chat completions. Clé uniquement côté serveur.
AI_ENDPOINT=
AI_API_KEY=
AI_MODEL=

# Flightradar24: disabled (sans appels), sandbox (donnees statiques), live.
# Creer une cle FR24 API distincte dans le portail officiel. Jamais de prefixe VITE_.
FR24_MODE=disabled
FR24_API_TOKEN=
# Cache serveur partage, 60..300 secondes.
FR24_REFRESH_SECONDS=60
# Explorer accepte au plus 20 resultats. Adapter uniquement a votre plan/budget.
FR24_LIMIT=20

TRACKING_PROVIDER=opensky
OPENSKY_REFRESH_SECONDS=300
ADSB_CONTACT=
ADSB_RADIUS_NM=150
ADSB_REFRESH_SECONDS=60

```

## backend/package.json

```json
{
  "name": "oujda-smart-backend",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "engines": {
    "node": ">=22"
  },
  "scripts": {
    "dev": "node --watch src/server.js",
    "start": "node src/server.js",
    "db:init": "node scripts/init.js",
    "test": "node --test tests/*.test.js"
  },
  "dependencies": {
    "express": "^4.22.1",
    "cors": "^2.8.5",
    "helmet": "^7.2.0",
    "express-rate-limit": "^7.5.0",
    "bcryptjs": "^3.0.2",
    "jsonwebtoken": "^9.0.2",
    "dotenv": "^16.4.5",
    "pg": "^8.13.0",
    "zod": "^3.23.8",
    "@electric-sql/pglite": "^0.5.8"
  }
}

```

## backend/pnpm-lock.yaml

```text
lockfileVersion: '9.0'

settings:
  autoInstallPeers: true
  excludeLinksFromLockfile: false

importers:

  .:
    dependencies:
      '@electric-sql/pglite':
        specifier: ^0.5.8
        version: 0.5.8
      bcryptjs:
        specifier: ^3.0.2
        version: 3.0.3
      cors:
        specifier: ^2.8.5
        version: 2.8.6
      dotenv:
        specifier: ^16.4.5
        version: 16.6.1
      express:
        specifier: ^4.22.1
        version: 4.22.3
      express-rate-limit:
        specifier: ^7.5.0
        version: 7.5.1(express@4.22.3)
      helmet:
        specifier: ^7.2.0
        version: 7.2.0
      jsonwebtoken:
        specifier: ^9.0.2
        version: 9.0.3
      pg:
        specifier: ^8.13.0
        version: 8.23.0
      zod:
        specifier: ^3.23.8
        version: 3.25.76

packages:

  '@electric-sql/pglite@0.5.8':
    resolution: {integrity: sha512-n9tsbUOhwx2epK1V0ZG9Ar4SHWUju04dhmzZXiSBXwBoleOvIfals33NAaWgagQVAL4Rbvx/Ptsu3P+pA09f6Q==}

  accepts@1.3.8:
    resolution: {integrity: sha512-PYAthTa2m2VKxuvSD3DPC/Gy+U+sOA1LAuT8mkmRuvw+NACSaeXEQ+NHcVF7rONl6qcaxV3Uuemwawk+7+SJLw==}
    engines: {node: '>= 0.6'}

  array-flatten@1.1.1:
    resolution: {integrity: sha512-PCVAQswWemu6UdxsDFFX/+gVeYqKAod3D3UVm91jHwynguOwAvYPhx8nNlM++NqRcK6CxxpUafjmhIdKiHibqg==}

  bcryptjs@3.0.3:
    resolution: {integrity: sha512-GlF5wPWnSa/X5LKM1o0wz0suXIINz1iHRLvTS+sLyi7XPbe5ycmYI3DlZqVGZZtDgl4DmasFg7gOB3JYbphV5g==}
    hasBin: true

  body-parser@1.20.8:
    resolution: {integrity: sha512-JNcyFQ64OiijEkPzUBTCe+hyPXUD/3LEldGQ6iF5LR1w00mx9o7xtDWHXBY2iItjdCFGoilOLNQbH943ut7pHA==}
    engines: {node: '>= 0.8', npm: 1.2.8000 || >= 1.4.16}

  buffer-equal-constant-time@1.0.1:
    resolution: {integrity: sha512-zRpUiDwd/xk6ADqPMATG8vc9VPrkck7T07OIx0gnjmJAnHnTVXNQG3vfvWNuiZIkwu9KrKdA1iJKfsfTVxE6NA==}

  bytes@3.1.2:
    resolution: {integrity: sha512-/Nf7TyzTx6S3yRJObOAV7956r8cr2+Oj8AC5dt8wSP3BQAoeX58NoHyCU8P8zGkNXStjTSi6fzO6F0pBdcYbEg==}
    engines: {node: '>= 0.8'}

  call-bind-apply-helpers@1.0.2:
    resolution: {integrity: sha512-Sp1ablJ0ivDkSzjcaJdxEunN5/XvksFJ2sMBFfq6x0ryhQV/2b/KwFe21cMpmHtPOSij8K99/wSfoEuTObmuMQ==}
    engines: {node: '>= 0.4'}

  call-bound@1.0.4:
    resolution: {integrity: sha512-+ys997U96po4Kx/ABpBCqhA9EuxJaQWDQg7295H4hBphv3IZg0boBKuwYpt4YXp6MZ5AmZQnU/tyMTlRpaSejg==}
    engines: {node: '>= 0.4'}

  content-disposition@0.5.4:
    resolution: {integrity: sha512-FveZTNuGw04cxlAiWbzi6zTAL/lhehaWbTtgluJh4/E95DqMwTmha3KZN1aAWA8cFIhHzMZUvLevkw5Rqk+tSQ==}
    engines: {node: '>= 0.6'}

  content-type@1.0.5:
    resolution: {integrity: sha512-nTjqfcBFEipKdXCv4YDQWCfmcLZKm81ldF0pAopTvyrFGVbcR6P/VAAd5G7N+0tTr8QqiU0tFadD6FK4NtJwOA==}
    engines: {node: '>= 0.6'}

  cookie-signature@1.0.7:
    resolution: {integrity: sha512-NXdYc3dLr47pBkpUCHtKSwIOQXLVn8dZEuywboCOJY/osA0wFSLlSawr3KN8qXJEyX66FcONTH8EIlVuK0yyFA==}

  cookie@0.7.2:
    resolution: {integrity: sha512-yki5XnKuf750l50uGTllt6kKILY4nQ1eNIQatoXEByZ5dWgnKqbnqmTrBE5B4N7lrMJKQ2ytWMiTO2o0v6Ew/w==}
    engines: {node: '>= 0.6'}

  cors@2.8.6:
    resolution: {integrity: sha512-tJtZBBHA6vjIAaF6EnIaq6laBBP9aq/Y3ouVJjEfoHbRBcHBAHYcMh/w8LDrk2PvIMMq8gmopa5D4V8RmbrxGw==}
    engines: {node: '>= 0.10'}

  debug@2.6.9:
    resolution: {integrity: sha512-bC7ElrdJaJnPbAP+1EotYvqZsb3ecl5wi6Bfi6BJTUcNowp6cvspg0jXznRTKDjm/E7AdgFBVeAPVMNcKGsHMA==}
    peerDependencies:
      supports-color: '*'
    peerDependenciesMeta:
      supports-color:
        optional: true

  depd@2.0.0:
    resolution: {integrity: sha512-g7nH6P6dyDioJogAAGprGpCtVImJhpPk/roCzdb3fIh61/s/nPsfR6onyMwkCAR/OlC3yBC0lESvUoQEAssIrw==}
    engines: {node: '>= 0.8'}

  destroy@1.2.0:
    resolution: {integrity: sha512-2sJGJTaXIIaR1w4iJSNoN0hnMY7Gpc/n8D4qSCJw8QqFWXf7cuAgnEHxBpweaVcPevC2l3KpjYCx3NypQQgaJg==}
    engines: {node: '>= 0.8', npm: 1.2.8000 || >= 1.4.16}

  dotenv@16.6.1:
    resolution: {integrity: sha512-uBq4egWHTcTt33a72vpSG0z3HnPuIl6NqYcTrKEg2azoEyl2hpW0zqlxysq2pK9HlDIHyHyakeYaYnSAwd8bow==}
    engines: {node: '>=12'}

  dunder-proto@1.0.1:
    resolution: {integrity: sha512-KIN/nDJBQRcXw0MLVhZE9iQHmG68qAVIBg9CqmUYjmQIhgij9U5MFvrqkUL5FbtyyzZuOeOt0zdeRe4UY7ct+A==}
    engines: {node: '>= 0.4'}

  ecdsa-sig-formatter@1.0.11:
    resolution: {integrity: sha512-nagl3RYrbNv6kQkeJIpt6NJZy8twLB/2vtz6yN9Z4vRKHN4/QZJIEbqohALSgwKdnksuY3k5Addp5lg8sVoVcQ==}

  ee-first@1.1.1:
    resolution: {integrity: sha512-WMwm9LhRUo+WUaRN+vRuETqG89IgZphVSNkdFgeb6sS/E4OrDIN7t48CAewSHXc6C8lefD8KKfr5vY61brQlow==}

  encodeurl@2.0.0:
    resolution: {integrity: sha512-Q0n9HRi4m6JuGIV1eFlmvJB7ZEVxu93IrMyiMsGC0lrMJMWzRgx6WGquyfQgZVb31vhGgXnfmPNNXmxnOkRBrg==}
    engines: {node: '>= 0.8'}

  es-define-property@1.0.1:
    resolution: {integrity: sha512-e3nRfgfUZ4rNGL232gUgX06QNyyez04KdjFrF+LTRoOXmrOgFKDg4BCdsjW8EnT69eqdYGmRpJwiPVYNrCaW3g==}
    engines: {node: '>= 0.4'}

  es-errors@1.3.0:
    resolution: {integrity: sha512-Zf5H2Kxt2xjTvbJvP2ZWLEICxA6j+hAmMzIlypy4xcBg1vKVnx89Wy0GbS+kf5cwCVFFzdCFh2XSCFNULS6csw==}
    engines: {node: '>= 0.4'}

  es-object-atoms@1.1.2:
    resolution: {integrity: sha512-HWcBoN6NileqtSydK2FqHbS/LoDd2pqrnQHLyJzBj4kOp/ky2MWMN694xOfkK8/SnUsW2DH7EfyVlydKCsm1Zw==}
    engines: {node: '>= 0.4'}

  escape-html@1.0.3:
    resolution: {integrity: sha512-NiSupZ4OeuGwr68lGIeym/ksIZMJodUGOSCZ/FSnTxcrekbvqrgdUxlJOMpijaKZVjAJrWrGs/6Jy8OMuyj9ow==}

  etag@1.8.1:
    resolution: {integrity: sha512-aIL5Fx7mawVa300al2BnEE4iNvo1qETxLrPI/o05L7z6go7fCw1J6EQmbK4FmJ2AS7kgVF/KEZWufBfdClMcPg==}
    engines: {node: '>= 0.6'}

  express-rate-limit@7.5.1:
    resolution: {integrity: sha512-7iN8iPMDzOMHPUYllBEsQdWVB6fPDMPqwjBaFrgr4Jgr/+okjvzAy+UHlYYL/Vs0OsOrMkwS6PJDkFlJwoxUnw==}
    engines: {node: '>= 16'}
    peerDependencies:
      express: '>= 4.11'

  express@4.22.3:
    resolution: {integrity: sha512-Bdcs4+3qlpVlx2NRn6fgX2Ue2/gGRaPeawebgclM0ERSCqDpA+owF1fdPwjJUTAJWMTuAaxjDf+hzb0/4eKvvw==}
    engines: {node: '>= 0.10.0'}

  finalhandler@1.3.2:
    resolution: {integrity: sha512-aA4RyPcd3badbdABGDuTXCMTtOneUCAYH/gxoYRTZlIJdF0YPWuGqiAsIrhNnnqdXGswYk6dGujem4w80UJFhg==}
    engines: {node: '>= 0.8'}

  forwarded@0.2.0:
    resolution: {integrity: sha512-buRG0fpBtRHSTCOASe6hD258tEubFoRLb4ZNA6NxMVHNw2gOcwHo9wyablzMzOA5z9xA9L1KNjk/Nt6MT9aYow==}
    engines: {node: '>= 0.6'}

  fresh@0.5.2:
    resolution: {integrity: sha512-zJ2mQYM18rEFOudeV4GShTGIQ7RbzA7ozbU9I/XBpm7kqgMywgmylMwXHxZJmkVoYkna9d2pVXVXPdYTP9ej8Q==}
    engines: {node: '>= 0.6'}

  function-bind@1.1.2:
    resolution: {integrity: sha512-7XHNxH7qX9xG5mIwxkhumTox/MIRNcOgDrxWsMt2pAr23WHp6MrRlN7FBSFpCpr+oVO0F744iUgR82nJMfG2SA==}

  get-intrinsic@1.3.0:
    resolution: {integrity: sha512-9fSjSaos/fRIVIp+xSJlE6lfwhES7LNtKaCBIamHsjr2na1BiABJPo0mOjjz8GJDURarmCPGqaiVg5mfjb98CQ==}
    engines: {node: '>= 0.4'}

  get-proto@1.0.1:
    resolution: {integrity: sha512-sTSfBjoXBp89JvIKIefqw7U2CCebsc74kiY6awiGogKtoSGbgjYE/G/+l9sF3MWFPNc9IcoOC4ODfKHfxFmp0g==}
    engines: {node: '>= 0.4'}

  gopd@1.2.0:
    resolution: {integrity: sha512-ZUKRh6/kUFoAiTAtTYPZJ3hw9wNxx+BIBOijnlG9PnrJsCcSjs1wyyD6vJpaYtgnzDrKYRSqf3OO6Rfa93xsRg==}
    engines: {node: '>= 0.4'}

  has-symbols@1.1.0:
    resolution: {integrity: sha512-1cDNdwJ2Jaohmb3sg4OmKaMBwuC48sYni5HUw2DvsC8LjGTLK9h+eb1X6RyuOHe4hT0ULCW68iomhjUoKUqlPQ==}
    engines: {node: '>= 0.4'}

  hasown@2.0.4:
    resolution: {integrity: sha512-T2UbfbBEF32wiepXIsMlTW9+dDYC6wMh/t/vYA4tuOMKqWz/n3vr1NFSxQiyP+zk2mXsoMA/i/7qV6LKut1t1A==}
    engines: {node: '>= 0.4'}

  helmet@7.2.0:
    resolution: {integrity: sha512-ZRiwvN089JfMXokizgqEPXsl2Guk094yExfoDXR0cBYWxtBbaSww/w+vT4WEJsBW2iTUi1GgZ6swmoug3Oy4Xw==}
    engines: {node: '>=16.0.0'}

  http-errors@2.0.1:
    resolution: {integrity: sha512-4FbRdAX+bSdmo4AUFuS0WNiPz8NgFt+r8ThgNWmlrjQjt1Q7ZR9+zTlce2859x4KSXrwIsaeTqDoKQmtP8pLmQ==}
    engines: {node: '>= 0.8'}

  iconv-lite@0.4.24:
    resolution: {integrity: sha512-v3MXnZAcvnywkTUEZomIActle7RXXeedOR31wwl7VlyoXO4Qi9arvSenNQWne1TcRwhCL1HwLI21bEqdpj8/rA==}
    engines: {node: '>=0.10.0'}

  inherits@2.0.4:
    resolution: {integrity: sha512-k/vGaX4/Yla3WzyMCvTQOXYeIHvqOKtnqBduzTHpzpQZzAskKMhZ2K+EnBiSM9zGSoIFeMpXKxa4dYeZIQqewQ==}

  ipaddr.js@1.9.1:
    resolution: {integrity: sha512-0KI/607xoxSToH7GjN1FfSbLoU0+btTicjsQSWQlh/hZykN8KpmMf7uYwPW3R+akZ6R/w18ZlXSHBYXiYUPO3g==}
    engines: {node: '>= 0.10'}

  jsonwebtoken@9.0.3:
    resolution: {integrity: sha512-MT/xP0CrubFRNLNKvxJ2BYfy53Zkm++5bX9dtuPbqAeQpTVe0MQTFhao8+Cp//EmJp244xt6Drw/GVEGCUj40g==}
    engines: {node: '>=12', npm: '>=6'}

  jwa@2.0.1:
    resolution: {integrity: sha512-hRF04fqJIP8Abbkq5NKGN0Bbr3JxlQ+qhZufXVr0DvujKy93ZCbXZMHDL4EOtodSbCWxOqR8MS1tXA5hwqCXDg==}

  jws@4.0.1:
    resolution: {integrity: sha512-EKI/M/yqPncGUUh44xz0PxSidXFr/+r0pA70+gIYhjv+et7yxM+s29Y+VGDkovRofQem0fs7Uvf4+YmAdyRduA==}

  lodash.includes@4.3.0:
    resolution: {integrity: sha512-W3Bx6mdkRTGtlJISOvVD/lbqjTlPPUDTMnlXZFnVwi9NKJ6tiAk6LVdlhZMm17VZisqhKcgzpO5Wz91PCt5b0w==}

  lodash.isboolean@3.0.3:
    resolution: {integrity: sha512-Bz5mupy2SVbPHURB98VAcw+aHh4vRV5IPNhILUCsOzRmsTmSQ17jIuqopAentWoehktxGd9e/hbIXq980/1QJg==}

  lodash.isinteger@4.0.4:
    resolution: {integrity: sha512-DBwtEWN2caHQ9/imiNeEA5ys1JoRtRfY3d7V9wkqtbycnAmTvRRmbHKDV4a0EYc678/dia0jrte4tjYwVBaZUA==}

  lodash.isnumber@3.0.3:
    resolution: {integrity: sha512-QYqzpfwO3/CWf3XP+Z+tkQsfaLL/EnUlXWVkIk5FUPc4sBdTehEqZONuyRt2P67PXAk+NXmTBcc97zw9t1FQrw==}

  lodash.isplainobject@4.0.6:
    resolution: {integrity: sha512-oSXzaWypCMHkPC3NvBEaPHf0KsA5mvPrOPgQWDsbg8n7orZ290M0BmC/jgRZ4vcJ6DTAhjrsSYgdsW/F+MFOBA==}

  lodash.isstring@4.0.1:
    resolution: {integrity: sha512-0wJxfxH1wgO3GrbuP+dTTk7op+6L41QCXbGINEmD+ny/G/eCqGzxyCsh7159S+mgDDcoarnBw6PC1PS5+wUGgw==}

  lodash.once@4.1.1:
    resolution: {integrity: sha512-Sb487aTOCr9drQVL8pIxOzVhafOjZN9UU54hiN8PU3uAiSV7lx1yYNpbNmex2PK6dSJoNTSJUUswT651yww3Mg==}

  math-intrinsics@1.1.0:
    resolution: {integrity: sha512-/IXtbwEk5HTPyEwyKX6hGkYXxM9nbj64B+ilVJnC/R6B0pH5G4V3b0pVbL7DBj4tkhBAppbQUlf6F6Xl9LHu1g==}
    engines: {node: '>= 0.4'}

  media-typer@0.3.0:
    resolution: {integrity: sha512-dq+qelQ9akHpcOl/gUVRTxVIOkAJ1wR3QAvb4RsVjS8oVoFjDGTc679wJYmUmknUF5HwMLOgb5O+a3KxfWapPQ==}
    engines: {node: '>= 0.6'}

  merge-descriptors@1.0.3:
    resolution: {integrity: sha512-gaNvAS7TZ897/rVaZ0nMtAyxNyi/pdbjbAwUpFQpN70GqnVfOiXpeUUMKRBmzXaSQ8DdTX4/0ms62r2K+hE6mQ==}

  methods@1.1.2:
    resolution: {integrity: sha512-iclAHeNqNm68zFtnZ0e+1L2yUIdvzNoauKU4WBA3VvH/vPFieF7qfRlwUZU+DA9P9bPXIS90ulxoUoCH23sV2w==}
    engines: {node: '>= 0.6'}

  mime-db@1.52.0:
    resolution: {integrity: sha512-sPU4uV7dYlvtWJxwwxHD0PuihVNiE7TyAbQ5SWxDCB9mUYvOgroQOwYQQOKPJ8CIbE+1ETVlOoK1UC2nU3gYvg==}
    engines: {node: '>= 0.6'}

  mime-types@2.1.35:
    resolution: {integrity: sha512-ZDY+bPm5zTTF+YpCrAU9nK0UgICYPT0QtT1NZWFv4s++TNkcgVaT0g6+4R2uI4MjQjzysHB1zxuWL50hzaeXiw==}
    engines: {node: '>= 0.6'}

  mime@1.6.0:
    resolution: {integrity: sha512-x0Vn8spI+wuJ1O6S7gnbaQg8Pxh4NNHb7KSINmEWKiPE4RKOplvijn+NkmYmmRgP68mc70j2EbeTFRsrswaQeg==}
    engines: {node: '>=4'}
    hasBin: true

  ms@2.0.0:
    resolution: {integrity: sha512-Tpp60P6IUJDTuOq/5Z8cdskzJujfwqfOTkrwIwj7IRISpnkJnT6SyJ4PCPnGMoFjC9ddhal5KVIYtAt97ix05A==}

  ms@2.1.3:
    resolution: {integrity: sha512-6FlzubTLZG3J2a/NVCAleEhjzq5oxgHyaCU9yYXvcLsvoVaHJq/s5xXI6/XXP6tz7R9xAOtHnSO/tXtF3WRTlA==}

  negotiator@0.6.3:
    resolution: {integrity: sha512-+EUsqGPLsM+j/zdChZjsnX51g4XrHFOIXwfnCVPGlQk/k5giakcKsuxCObBRu6DSm9opw/O6slWbJdghQM4bBg==}
    engines: {node: '>= 0.6'}

  object-assign@4.1.1:
    resolution: {integrity: sha512-rJgTQnkUnH1sFw8yT6VSU3zD3sWmu6sZhIseY8VX+GRu3P6F7Fu+JNDoXfklElbLJSnc3FUQHVe4cU5hj+BcUg==}
    engines: {node: '>=0.10.0'}

  object-inspect@1.13.4:
    resolution: {integrity: sha512-W67iLl4J2EXEGTbfeHCffrjDfitvLANg0UlX3wFUUSTx92KXRFegMHUVgSqE+wvhAbi4WqjGg9czysTV2Epbew==}
    engines: {node: '>= 0.4'}

  on-finished@2.4.1:
    resolution: {integrity: sha512-oVlzkg3ENAhCk2zdv7IJwd/QUD4z2RxRwpkcGY8psCVcCYZNq4wYnVWALHM+brtuJjePWiYF/ClmuDr8Ch5+kg==}
    engines: {node: '>= 0.8'}

  parseurl@1.3.3:
    resolution: {integrity: sha512-CiyeOxFT/JZyN5m0z9PfXw4SCBJ6Sygz1Dpl0wqjlhDEGGBP1GnsUVEL0p63hoG1fcj3fHynXi9NYO4nWOL+qQ==}
    engines: {node: '>= 0.8'}

  path-to-regexp@0.1.13:
    resolution: {integrity: sha512-A/AGNMFN3c8bOlvV9RreMdrv7jsmF9XIfDeCd87+I8RNg6s78BhJxMu69NEMHBSJFxKidViTEdruRwEk/WIKqA==}

  pg-cloudflare@1.4.0:
    resolution: {integrity: sha512-Vo7z/6rrQYxpNRylp4Tlob2elzbh+N/MOQbxFVWCxS7oEx6jF53GTJFxK2WWpKuBRkmiin4Mt+xofFDjx09R0A==}

  pg-connection-string@2.14.0:
    resolution: {integrity: sha512-XwWDGcLRGCXAR8F/AM5bG7Q+A3Wm2s6QeEjlOKZLlH3UYcguiqCWKyWXVag5TLTIjR7oOJUY8kcADaZgWPyLeg==}

  pg-int8@1.0.1:
    resolution: {integrity: sha512-WCtabS6t3c8SkpDBUlb1kjOs7l66xsGdKpIPZsg4wR+B3+u9UAum2odSsF9tnvxg80h4ZxLWMy4pRjOsFIqQpw==}
    engines: {node: '>=4.0.0'}

  pg-pool@3.14.0:
    resolution: {integrity: sha512-gKtPkFdQPU3DksooVLi9LsjZxrsBUZIpa+7aVx+LV5pNh0KzP4Zleud2po+ConrxbuXGBJ6Hfer6hdgpIBpBaw==}
    peerDependencies:
      pg: '>=8.0'

  pg-protocol@1.16.0:
    resolution: {integrity: sha512-sILXutLVjCLjcDuOmvhX5e2Z4cS5qG/6Bu3VkpFwdf/633ElGLpEh9bgmuI5I4sqKqkifQiGyiCcx1HdtrK7tg==}

  pg-types@2.2.0:
    resolution: {integrity: sha512-qTAAlrEsl8s4OiEQY69wDvcMIdQN6wdz5ojQiOy6YRMuynxenON0O5oCpJI6lshc6scgAY8qvJ2On/p+CXY0GA==}
    engines: {node: '>=4'}

  pg@8.23.0:
    resolution: {integrity: sha512-Ip2EQCngowJLGOfCwkFhPXU7/ljlhn6Rxlmy4XYfL2Y+vyRM59+8uR2xqRWKdYmbXmxCFOAmKxBuSUCdF34qLg==}
    engines: {node: '>= 16.0.0'}
    peerDependencies:
      pg-native: '>=3.0.1'
    peerDependenciesMeta:
      pg-native:
        optional: true

  pgpass@1.0.5:
    resolution: {integrity: sha512-FdW9r/jQZhSeohs1Z3sI1yxFQNFvMcnmfuj4WBMUTxOrAyLMaTcE1aAMBiTlbMNaXvBCQuVi0R7hd8udDSP7ug==}

  postgres-array@2.0.0:
    resolution: {integrity: sha512-VpZrUqU5A69eQyW2c5CA1jtLecCsN2U/bD6VilrFDWq5+5UIEVO7nazS3TEcHf1zuPYO/sqGvUvW62g86RXZuA==}
    engines: {node: '>=4'}

  postgres-bytea@1.0.1:
    resolution: {integrity: sha512-5+5HqXnsZPE65IJZSMkZtURARZelel2oXUEO8rH83VS/hxH5vv1uHquPg5wZs8yMAfdv971IU+kcPUczi7NVBQ==}
    engines: {node: '>=0.10.0'}

  postgres-date@1.0.7:
    resolution: {integrity: sha512-suDmjLVQg78nMK2UZ454hAG+OAW+HQPZ6n++TNDUX+L0+uUlLywnoxJKDou51Zm+zTCjrCl0Nq6J9C5hP9vK/Q==}
    engines: {node: '>=0.10.0'}

  postgres-interval@1.2.0:
    resolution: {integrity: sha512-9ZhXKM/rw350N1ovuWHbGxnGh/SNJ4cnxHiM0rxE4VN41wsg8P8zWn9hv/buK00RP4WvlOyr/RBDiptyxVbkZQ==}
    engines: {node: '>=0.10.0'}

  proxy-addr@2.0.8:
    resolution: {integrity: sha512-5nnx0yGyVUcY6t9RnWcARWtwT9F1D8O9rt08htPvnd49W1IgZtmLkhu9WfMzQj1cFxjHIO6connUNVW5k7AVyQ==}
    engines: {node: '>= 0.10'}

  qs@6.16.0:
    resolution: {integrity: sha512-h6fhOIaRrID2CbEY2fqs+7t+UXZo+MLAnU5gRIq85uFtdiUPCdsApMlHhXogKVM4HM2DVbIjGNTTYH2OcmP1vA==}
    engines: {node: '>=0.6'}

  range-parser@1.2.1:
    resolution: {integrity: sha512-Hrgsx+orqoygnmhFbKaHE6c296J+HTAQXoxEF6gNupROmmGJRoyzfG3ccAveqCBrwr/2yxQ5BVd/GTl5agOwSg==}
    engines: {node: '>= 0.6'}

  raw-body@2.5.3:
    resolution: {integrity: sha512-s4VSOf6yN0rvbRZGxs8Om5CWj6seneMwK3oDb4lWDH0UPhWcxwOWw5+qk24bxq87szX1ydrwylIOp2uG1ojUpA==}
    engines: {node: '>= 0.8'}

  safe-buffer@5.2.1:
    resolution: {integrity: sha512-rp3So07KcdmmKbGvgaNxQSJr7bGVSVk5S9Eq1F+ppbRo70+YeaDxkw5Dd8NPN+GD6bjnYm2VuPuCXmpuYvmCXQ==}

  safer-buffer@2.1.2:
    resolution: {integrity: sha512-YZo3K82SD7Riyi0E1EQPojLz7kpepnSQI9IyPbHHg1XXXevb5dJI7tpyN2ADxGcQbHG7vcyRHk0cbwqcQriUtg==}

  semver@7.8.5:
    resolution: {integrity: sha512-Y7/KDsb8LjooZpwaqGyulO6DQlksgCncchHGk+sZIY4SBvUocMBEFH5Ur1fI4dV+Jvl0w6cjvucaIi40puRioA==}
    engines: {node: '>=10'}
    hasBin: true

  send@0.19.2:
    resolution: {integrity: sha512-VMbMxbDeehAxpOtWJXlcUS5E8iXh6QmN+BkRX1GARS3wRaXEEgzCcB10gTQazO42tpNIya8xIyNx8fll1OFPrg==}
    engines: {node: '>= 0.8.0'}

  serve-static@1.16.3:
    resolution: {integrity: sha512-x0RTqQel6g5SY7Lg6ZreMmsOzncHFU7nhnRWkKgWuMTu5NN0DR5oruckMqRvacAN9d5w6ARnRBXl9xhDCgfMeA==}
    engines: {node: '>= 0.8.0'}

  setprototypeof@1.2.0:
    resolution: {integrity: sha512-E5LDX7Wrp85Kil5bhZv46j8jOeboKq5JMmYM3gVGdGH8xFpPWXUMsNrlODCrkoxMEeNi/XZIwuRvY4XNwYMJpw==}

  side-channel-list@1.0.1:
    resolution: {integrity: sha512-mjn/0bi/oUURjc5Xl7IaWi/OJJJumuoJFQJfDDyO46+hBWsfaVM65TBHq2eoZBhzl9EchxOijpkbRC8SVBQU0w==}
    engines: {node: '>= 0.4'}

  side-channel-map@1.0.1:
    resolution: {integrity: sha512-VCjCNfgMsby3tTdo02nbjtM/ewra6jPHmpThenkTYh8pG9ucZ/1P8So4u4FGBek/BjpOVsDCMoLA/iuBKIFXRA==}
    engines: {node: '>= 0.4'}

  side-channel-weakmap@1.0.2:
    resolution: {integrity: sha512-WPS/HvHQTYnHisLo9McqBHOJk2FkHO/tlpvldyrnem4aeQp4hai3gythswg6p01oSoTl58rcpiFAjF2br2Ak2A==}
    engines: {node: '>= 0.4'}

  side-channel@1.1.1:
    resolution: {integrity: sha512-6x6dK6zJdpTzF4sQeNYxwtvBzf6Eg4GtlesS94HOvTudUeyK2WXAaIfmDgsyslYrRBeFIlsi54AYsFGUuhmvrQ==}
    engines: {node: '>= 0.4'}

  split2@4.2.0:
    resolution: {integrity: sha512-UcjcJOWknrNkF6PLX83qcHM6KHgVKNkV62Y8a5uYDVv9ydGQVwAHMKqHdJje1VTWpljG0WYpCDhrCdAOYH4TWg==}
    engines: {node: '>= 10.x'}

  statuses@2.0.2:
    resolution: {integrity: sha512-DvEy55V3DB7uknRo+4iOGT5fP1slR8wQohVdknigZPMpMstaKJQWhwiYBACJE3Ul2pTnATihhBYnRhZQHGBiRw==}
    engines: {node: '>= 0.8'}

  toidentifier@1.0.1:
    resolution: {integrity: sha512-o5sSPKEkg/DIQNmH43V0/uerLrpzVedkUh8tGNvaeXpfpuwjKenlSox/2O/BTlZUtEe+JG7s5YhEz608PlAHRA==}
    engines: {node: '>=0.6'}

  type-is@1.6.18:
    resolution: {integrity: sha512-TkRKr9sUTxEH8MdfuCSP7VizJyzRNMjj2J2do2Jr3Kym598JVdEksuzPQCnlFPW4ky9Q+iA+ma9BGm06XQBy8g==}
    engines: {node: '>= 0.6'}

  unpipe@1.0.0:
    resolution: {integrity: sha512-pjy2bYhSsufwWlKwPc+l3cN7+wuJlK6uz0YdJEOlQDbl6jo/YlPi4mb8agUkVC8BF7V8NuzeyPNqRksA3hztKQ==}
    engines: {node: '>= 0.8'}

  utils-merge@1.0.1:
    resolution: {integrity: sha512-pMZTvIkT1d+TFGvDOqodOclx0QWkkgi6Tdoa8gC8ffGAAqz9pzPTZWAybbsHHoED/ztMtkv/VoYTYyShUn81hA==}
    engines: {node: '>= 0.4.0'}

  vary@1.1.2:
    resolution: {integrity: sha512-BNGbWLfd0eUPabhkXUVm0j8uuvREyTh5ovRa/dyow/BqAbZJyC+5fU+IzQOzmAKzYqYRAISoRhdQr3eIZ/PXqg==}
    engines: {node: '>= 0.8'}

  xtend@4.0.2:
    resolution: {integrity: sha512-LKYU1iAXJXUgAXn9URjiu+MWhyUXHsvfp7mcuYm9dSUKK0/CjtrUwFAxD82/mCWbtLsGjFIad0wIsod4zrTAEQ==}
    engines: {node: '>=0.4'}

  zod@3.25.76:
    resolution: {integrity: sha512-gzUt/qt81nXsFGKIFcC3YnfEAx5NkunCfnDlvuBSSFS02bcXu4Lmea0AFIUwbLWxWPx3d9p8S5QoaujKcNQxcQ==}

snapshots:

  '@electric-sql/pglite@0.5.8': {}

  accepts@1.3.8:
    dependencies:
      mime-types: 2.1.35
      negotiator: 0.6.3

  array-flatten@1.1.1: {}

  bcryptjs@3.0.3: {}

  body-parser@1.20.8:
    dependencies:
      bytes: 3.1.2
      content-type: 1.0.5
      debug: 2.6.9
      depd: 2.0.0
      destroy: 1.2.0
      http-errors: 2.0.1
      iconv-lite: 0.4.24
      on-finished: 2.4.1
      qs: 6.16.0
      raw-body: 2.5.3
      type-is: 1.6.18
      unpipe: 1.0.0
    transitivePeerDependencies:
      - supports-color

  buffer-equal-constant-time@1.0.1: {}

  bytes@3.1.2: {}

  call-bind-apply-helpers@1.0.2:
    dependencies:
      es-errors: 1.3.0
      function-bind: 1.1.2

  call-bound@1.0.4:
    dependencies:
      call-bind-apply-helpers: 1.0.2
      get-intrinsic: 1.3.0

  content-disposition@0.5.4:
    dependencies:
      safe-buffer: 5.2.1

  content-type@1.0.5: {}

  cookie-signature@1.0.7: {}

  cookie@0.7.2: {}

  cors@2.8.6:
    dependencies:
      object-assign: 4.1.1
      vary: 1.1.2

  debug@2.6.9:
    dependencies:
      ms: 2.0.0

  depd@2.0.0: {}

  destroy@1.2.0: {}

  dotenv@16.6.1: {}

  dunder-proto@1.0.1:
    dependencies:
      call-bind-apply-helpers: 1.0.2
      es-errors: 1.3.0
      gopd: 1.2.0

  ecdsa-sig-formatter@1.0.11:
    dependencies:
      safe-buffer: 5.2.1

  ee-first@1.1.1: {}

  encodeurl@2.0.0: {}

  es-define-property@1.0.1: {}

  es-errors@1.3.0: {}

  es-object-atoms@1.1.2:
    dependencies:
      es-errors: 1.3.0

  escape-html@1.0.3: {}

  etag@1.8.1: {}

  express-rate-limit@7.5.1(express@4.22.3):
    dependencies:
      express: 4.22.3

  express@4.22.3:
    dependencies:
      accepts: 1.3.8
      array-flatten: 1.1.1
      body-parser: 1.20.8
      content-disposition: 0.5.4
      content-type: 1.0.5
      cookie: 0.7.2
      cookie-signature: 1.0.7
      debug: 2.6.9
      depd: 2.0.0
      encodeurl: 2.0.0
      escape-html: 1.0.3
      etag: 1.8.1
      finalhandler: 1.3.2
      fresh: 0.5.2
      http-errors: 2.0.1
      merge-descriptors: 1.0.3
      methods: 1.1.2
      on-finished: 2.4.1
      parseurl: 1.3.3
      path-to-regexp: 0.1.13
      proxy-addr: 2.0.8
      qs: 6.16.0
      range-parser: 1.2.1
      safe-buffer: 5.2.1
      send: 0.19.2
      serve-static: 1.16.3
      setprototypeof: 1.2.0
      statuses: 2.0.2
      type-is: 1.6.18
      utils-merge: 1.0.1
      vary: 1.1.2
    transitivePeerDependencies:
      - supports-color

  finalhandler@1.3.2:
    dependencies:
      debug: 2.6.9
      encodeurl: 2.0.0
      escape-html: 1.0.3
      on-finished: 2.4.1
      parseurl: 1.3.3
      statuses: 2.0.2
      unpipe: 1.0.0
    transitivePeerDependencies:
      - supports-color

  forwarded@0.2.0: {}

  fresh@0.5.2: {}

  function-bind@1.1.2: {}

  get-intrinsic@1.3.0:
    dependencies:
      call-bind-apply-helpers: 1.0.2
      es-define-property: 1.0.1
      es-errors: 1.3.0
      es-object-atoms: 1.1.2
      function-bind: 1.1.2
      get-proto: 1.0.1
      gopd: 1.2.0
      has-symbols: 1.1.0
      hasown: 2.0.4
      math-intrinsics: 1.1.0

  get-proto@1.0.1:
    dependencies:
      dunder-proto: 1.0.1
      es-object-atoms: 1.1.2

  gopd@1.2.0: {}

  has-symbols@1.1.0: {}

  hasown@2.0.4:
    dependencies:
      function-bind: 1.1.2

  helmet@7.2.0: {}

  http-errors@2.0.1:
    dependencies:
      depd: 2.0.0
      inherits: 2.0.4
      setprototypeof: 1.2.0
      statuses: 2.0.2
      toidentifier: 1.0.1

  iconv-lite@0.4.24:
    dependencies:
      safer-buffer: 2.1.2

  inherits@2.0.4: {}

  ipaddr.js@1.9.1: {}

  jsonwebtoken@9.0.3:
    dependencies:
      jws: 4.0.1
      lodash.includes: 4.3.0
      lodash.isboolean: 3.0.3
      lodash.isinteger: 4.0.4
      lodash.isnumber: 3.0.3
      lodash.isplainobject: 4.0.6
      lodash.isstring: 4.0.1
      lodash.once: 4.1.1
      ms: 2.1.3
      semver: 7.8.5

  jwa@2.0.1:
    dependencies:
      buffer-equal-constant-time: 1.0.1
      ecdsa-sig-formatter: 1.0.11
      safe-buffer: 5.2.1

  jws@4.0.1:
    dependencies:
      jwa: 2.0.1
      safe-buffer: 5.2.1

  lodash.includes@4.3.0: {}

  lodash.isboolean@3.0.3: {}

  lodash.isinteger@4.0.4: {}

  lodash.isnumber@3.0.3: {}

  lodash.isplainobject@4.0.6: {}

  lodash.isstring@4.0.1: {}

  lodash.once@4.1.1: {}

  math-intrinsics@1.1.0: {}

  media-typer@0.3.0: {}

  merge-descriptors@1.0.3: {}

  methods@1.1.2: {}

  mime-db@1.52.0: {}

  mime-types@2.1.35:
    dependencies:
      mime-db: 1.52.0

  mime@1.6.0: {}

  ms@2.0.0: {}

  ms@2.1.3: {}

  negotiator@0.6.3: {}

  object-assign@4.1.1: {}

  object-inspect@1.13.4: {}

  on-finished@2.4.1:
    dependencies:
      ee-first: 1.1.1

  parseurl@1.3.3: {}

  path-to-regexp@0.1.13: {}

  pg-cloudflare@1.4.0:
    optional: true

  pg-connection-string@2.14.0: {}

  pg-int8@1.0.1: {}

  pg-pool@3.14.0(pg@8.23.0):
    dependencies:
      pg: 8.23.0

  pg-protocol@1.16.0: {}

  pg-types@2.2.0:
    dependencies:
      pg-int8: 1.0.1
      postgres-array: 2.0.0
      postgres-bytea: 1.0.1
      postgres-date: 1.0.7
      postgres-interval: 1.2.0

  pg@8.23.0:
    dependencies:
      pg-connection-string: 2.14.0
      pg-pool: 3.14.0(pg@8.23.0)
      pg-protocol: 1.16.0
      pg-types: 2.2.0
      pgpass: 1.0.5
    optionalDependencies:
      pg-cloudflare: 1.4.0

  pgpass@1.0.5:
    dependencies:
      split2: 4.2.0

  postgres-array@2.0.0: {}

  postgres-bytea@1.0.1: {}

  postgres-date@1.0.7: {}

  postgres-interval@1.2.0:
    dependencies:
      xtend: 4.0.2

  proxy-addr@2.0.8:
    dependencies:
      forwarded: 0.2.0
      ipaddr.js: 1.9.1

  qs@6.16.0:
    dependencies:
      es-define-property: 1.0.1
      side-channel: 1.1.1

  range-parser@1.2.1: {}

  raw-body@2.5.3:
    dependencies:
      bytes: 3.1.2
      http-errors: 2.0.1
      iconv-lite: 0.4.24
      unpipe: 1.0.0

  safe-buffer@5.2.1: {}

  safer-buffer@2.1.2: {}

  semver@7.8.5: {}

  send@0.19.2:
    dependencies:
      debug: 2.6.9
      depd: 2.0.0
      destroy: 1.2.0
      encodeurl: 2.0.0
      escape-html: 1.0.3
      etag: 1.8.1
      fresh: 0.5.2
      http-errors: 2.0.1
      mime: 1.6.0
      ms: 2.1.3
      on-finished: 2.4.1
      range-parser: 1.2.1
      statuses: 2.0.2
    transitivePeerDependencies:
      - supports-color

  serve-static@1.16.3:
    dependencies:
      encodeurl: 2.0.0
      escape-html: 1.0.3
      parseurl: 1.3.3
      send: 0.19.2
    transitivePeerDependencies:
      - supports-color

  setprototypeof@1.2.0: {}

  side-channel-list@1.0.1:
    dependencies:
      es-errors: 1.3.0
      object-inspect: 1.13.4

  side-channel-map@1.0.1:
    dependencies:
      call-bound: 1.0.4
      es-errors: 1.3.0
      get-intrinsic: 1.3.0
      object-inspect: 1.13.4

  side-channel-weakmap@1.0.2:
    dependencies:
      call-bound: 1.0.4
      es-errors: 1.3.0
      get-intrinsic: 1.3.0
      object-inspect: 1.13.4
      side-channel-map: 1.0.1

  side-channel@1.1.1:
    dependencies:
      es-errors: 1.3.0
      object-inspect: 1.13.4
      side-channel-list: 1.0.1
      side-channel-map: 1.0.1
      side-channel-weakmap: 1.0.2

  split2@4.2.0: {}

  statuses@2.0.2: {}

  toidentifier@1.0.1: {}

  type-is@1.6.18:
    dependencies:
      media-typer: 0.3.0
      mime-types: 2.1.35

  unpipe@1.0.0: {}

  utils-merge@1.0.1: {}

  vary@1.1.2: {}

  xtend@4.0.2: {}

  zod@3.25.76: {}

```

## backend/scripts/init.js

```javascript
import { initialize, close } from "../src/config/db.js";
import { seed } from "../src/services/seed.js";
await initialize();
await seed();
await close();
console.log("Schéma et données initialisés. Comptes : .local-accounts.txt");

```

## backend/sql/schema.sql

```sql
CREATE TABLE IF NOT EXISTS users (
 id UUID PRIMARY KEY, name VARCHAR(100) NOT NULL, email VARCHAR(180) UNIQUE NOT NULL,
 password_hash TEXT NOT NULL, role VARCHAR(10) NOT NULL DEFAULT 'USER' CHECK(role IN ('USER','ADMIN')), created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS auth_sessions(id UUID PRIMARY KEY,user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,expires_at TIMESTAMPTZ NOT NULL);
CREATE TABLE IF NOT EXISTS flights (
 id UUID PRIMARY KEY, number VARCHAR(12) NOT NULL UNIQUE, airline VARCHAR(80) NOT NULL,
 city VARCHAR(100) NOT NULL, direction VARCHAR(10) NOT NULL CHECK(direction IN ('departure','arrival')),
 scheduled_at TIMESTAMPTZ NOT NULL, estimated_at TIMESTAMPTZ NOT NULL, gate VARCHAR(10) NOT NULL,
 status VARCHAR(20) NOT NULL CHECK(status IN ('ON_TIME','DELAYED','BOARDING','DEPARTED','ARRIVED','CANCELLED')),
 terminal VARCHAR(30) NOT NULL DEFAULT 'Terminal démo', is_demo BOOLEAN NOT NULL DEFAULT TRUE
);
CREATE TABLE IF NOT EXISTS services(id UUID PRIMARY KEY,slug VARCHAR(60) UNIQUE NOT NULL,icon VARCHAR(40) NOT NULL,title JSONB NOT NULL,description JSONB NOT NULL,location JSONB NOT NULL,hours JSONB NOT NULL,views INTEGER NOT NULL DEFAULT 0);
CREATE TABLE IF NOT EXISTS faq(id UUID PRIMARY KEY,category VARCHAR(40) NOT NULL,question JSONB NOT NULL,answer JSONB NOT NULL,keywords TEXT NOT NULL DEFAULT '');
CREATE TABLE IF NOT EXISTS knowledge_base(id UUID PRIMARY KEY,topic VARCHAR(40) NOT NULL,title JSONB NOT NULL,content JSONB NOT NULL,keywords TEXT NOT NULL,source TEXT NOT NULL DEFAULT 'Prototype académique',updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW());
CREATE TABLE IF NOT EXISTS favorites(user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,flight_id UUID NOT NULL REFERENCES flights(id) ON DELETE CASCADE,PRIMARY KEY(user_id,flight_id));
CREATE TABLE IF NOT EXISTS complaints (
 id UUID PRIMARY KEY,reference VARCHAR(30) UNIQUE NOT NULL,access_hash TEXT NOT NULL,user_id UUID REFERENCES users(id) ON DELETE SET NULL,
 name VARCHAR(100) NOT NULL,email VARCHAR(180) NOT NULL,phone VARCHAR(30),category VARCHAR(50) NOT NULL,
 subject VARCHAR(180) NOT NULL,message TEXT NOT NULL,priority VARCHAR(10) NOT NULL CHECK(priority IN ('LOW','NORMAL','HIGH')),
 flight_number VARCHAR(12),status VARCHAR(15) NOT NULL DEFAULT 'RECEIVED' CHECK(status IN ('RECEIVED','IN_PROGRESS','RESOLVED','CLOSED')),
 response TEXT NOT NULL DEFAULT '',sentiment VARCHAR(10) NOT NULL CHECK(sentiment IN ('positive','neutral','negative')),
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS chat_sessions(id UUID PRIMARY KEY,user_id UUID REFERENCES users(id) ON DELETE CASCADE,guest_hash TEXT,language VARCHAR(2) NOT NULL CHECK(language IN ('fr','ar','en')),created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),CHECK(user_id IS NOT NULL OR guest_hash IS NOT NULL));
CREATE TABLE IF NOT EXISTS chat_messages(id UUID PRIMARY KEY,session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,role VARCHAR(10) NOT NULL CHECK(role IN ('user','assistant')),content TEXT NOT NULL,source VARCHAR(30),topic VARCHAR(40),created_at TIMESTAMPTZ NOT NULL DEFAULT NOW());
CREATE TABLE IF NOT EXISTS analytics(id UUID PRIMARY KEY,event VARCHAR(30) NOT NULL,topic VARCHAR(100),created_at TIMESTAMPTZ NOT NULL DEFAULT NOW());
CREATE TABLE IF NOT EXISTS audit_log(id UUID PRIMARY KEY,user_id UUID REFERENCES users(id) ON DELETE SET NULL,action TEXT NOT NULL,created_at TIMESTAMPTZ NOT NULL DEFAULT NOW());
CREATE INDEX IF NOT EXISTS flights_time ON flights(scheduled_at);
CREATE INDEX IF NOT EXISTS complaints_user ON complaints(user_id);
CREATE INDEX IF NOT EXISTS chat_session_user ON chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS messages_session ON chat_messages(session_id,created_at);
CREATE INDEX IF NOT EXISTS analytics_time ON analytics(created_at);

ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS sequence BIGINT GENERATED ALWAYS AS IDENTITY;

```

## backend/sql/seed.sql

```sql
-- Données fictives. Générées par scripts/init.js. Les mots de passe sont hashés.
BEGIN;
INSERT INTO users(id,name,email,password_hash,role) VALUES('6c1d6191-06b4-4abc-96e6-d10a9d251250','Administration Démo','admin@oujda-demo.test','$2b$12$qITiU2EmklcDE4KE6a/sQOrGYcs0lFvkqYSg4laNWxb8KZv448Cba','ADMIN');
INSERT INTO users(id,name,email,password_hash,role) VALUES('9431c6fa-2ddc-432e-997f-eb94614dc75b','Amine Voyageur','passager@oujda-demo.test','$2b$12$i8FGlaxgj4kQvecMpU8be.LsqCu1k6SEy2DP7VoFe7N/ORQzTIT72','USER');
INSERT INTO flights(id,number,airline,city,direction,scheduled_at,estimated_at,gate,status) VALUES('89f0cf79-61dd-4848-9e5f-b9b3a3ed3a1a','AT700','Royal Air Maroc','Paris Orly','departure','2026-09-29T08:15:00.000Z','2026-09-29T08:15:00.000Z','1','BOARDING');
INSERT INTO flights(id,number,airline,city,direction,scheduled_at,estimated_at,gate,status) VALUES('aec7bd7f-20fa-4476-b90c-c631c8b96e82','FR713','Ryanair','Bruxelles','departure','2026-09-29T09:25:00.000Z','2026-09-29T09:25:00.000Z','2','ON_TIME');
INSERT INTO flights(id,number,airline,city,direction,scheduled_at,estimated_at,gate,status) VALUES('dc4c63c6-a128-48ee-8d4b-777927e96443','AT726','Royal Air Maroc','Casablanca','departure','2026-09-29T10:35:00.000Z','2026-09-29T11:20:00.000Z','3','DELAYED');
INSERT INTO flights(id,number,airline,city,direction,scheduled_at,estimated_at,gate,status) VALUES('846eb68a-9871-42f4-85f4-8dc1a4b8dbe5','TO739','Transavia','Marseille','departure','2026-09-29T11:15:00.000Z','2026-09-29T11:15:00.000Z','4','ON_TIME');
INSERT INTO flights(id,number,airline,city,direction,scheduled_at,estimated_at,gate,status) VALUES('621ecc2f-074b-4cab-939b-306860d1dcb9','FR752','Ryanair','Lyon','departure','2026-09-29T12:25:00.000Z','2026-09-29T12:25:00.000Z','1','ON_TIME');
INSERT INTO flights(id,number,airline,city,direction,scheduled_at,estimated_at,gate,status) VALUES('080c4240-a702-404b-9c2c-0163b45ef6ea','TB765','TUI fly','Amsterdam','departure','2026-09-29T13:35:00.000Z','2026-09-29T13:35:00.000Z','2','CANCELLED');
INSERT INTO flights(id,number,airline,city,direction,scheduled_at,estimated_at,gate,status) VALUES('e46ca655-31b6-4649-a78d-c5b71d0766b2','AT778','Royal Air Maroc','Paris Orly','arrival','2026-09-29T14:15:00.000Z','2026-09-29T14:15:00.000Z','3','ARRIVED');
INSERT INTO flights(id,number,airline,city,direction,scheduled_at,estimated_at,gate,status) VALUES('f00e6e8b-1dbe-4e99-94eb-56abe7b2a17a','FR791','Ryanair','Bruxelles','arrival','2026-09-29T15:25:00.000Z','2026-09-29T15:25:00.000Z','4','ON_TIME');
INSERT INTO flights(id,number,airline,city,direction,scheduled_at,estimated_at,gate,status) VALUES('c3d0a543-aff9-4872-90b0-d312f792391e','AT804','Royal Air Maroc','Casablanca','arrival','2026-09-29T16:35:00.000Z','2026-09-29T17:20:00.000Z','1','DELAYED');
INSERT INTO flights(id,number,airline,city,direction,scheduled_at,estimated_at,gate,status) VALUES('6b9589b5-07b3-478e-91ab-c59074e51529','TO817','Transavia','Montpellier','arrival','2026-09-29T17:15:00.000Z','2026-09-29T17:15:00.000Z','2','ARRIVED');
INSERT INTO flights(id,number,airline,city,direction,scheduled_at,estimated_at,gate,status) VALUES('54e615ba-1640-49f2-9664-e7e4a0fd3bc3','FR830','Ryanair','Barcelone','arrival','2026-09-29T18:25:00.000Z','2026-09-29T18:25:00.000Z','3','ON_TIME');
INSERT INTO flights(id,number,airline,city,direction,scheduled_at,estimated_at,gate,status) VALUES('fa68c8d0-8dc8-4faa-bc29-8f3f74a62f40','TB843','TUI fly','Düsseldorf','arrival','2026-09-29T19:35:00.000Z','2026-09-29T19:35:00.000Z','4','ON_TIME');
INSERT INTO faq(id,category,question,answer,keywords) VALUES('a1a550c8-3735-45ff-b206-7da7795f0433','flights','{"fr":"Comment consulter le statut de mon vol ?","en":"How can I check my flight status?","ar":"كيف أتحقق من حالة رحلتي؟"}','{"fr":"Consultez la page Vols et recherchez votre numéro de vol. Tous les vols affichés ici sont fictifs. Pour un déplacement réel, vérifiez auprès de votre compagnie aérienne.","en":"Open Flights and search for your flight number. All flights shown here are fictional. For actual travel, confirm with your airline.","ar":"افتح صفحة الرحلات وابحث برقم الرحلة. جميع الرحلات هنا افتراضية. للسفر الفعلي يرجى التأكد لدى شركة الطيران."}','vol flight avion retard delayed departure arrival رحلة طيران تاخير');
INSERT INTO knowledge_base(id,topic,title,content,keywords) VALUES('4165a77b-e752-4ffc-91d8-44a24737058c','flights','{"fr":"Vols","en":"Flights","ar":"الرحلات"}','{"fr":"Consultez la page Vols et recherchez votre numéro de vol. Tous les vols affichés ici sont fictifs. Pour un déplacement réel, vérifiez auprès de votre compagnie aérienne.","en":"Open Flights and search for your flight number. All flights shown here are fictional. For actual travel, confirm with your airline.","ar":"افتح صفحة الرحلات وابحث برقم الرحلة. جميع الرحلات هنا افتراضية. للسفر الفعلي يرجى التأكد لدى شركة الطيران."}','vol flight avion retard delayed departure arrival رحلة طيران تاخير');
INSERT INTO faq(id,category,question,answer,keywords) VALUES('d9d24e15-1449-4907-b313-7e16f90fa890','checkin','{"fr":"Quand commence l’enregistrement ?","en":"When does check-in open?","ar":"متى يبدأ تسجيل الوصول؟"}','{"fr":"Les horaires dépendent de votre compagnie et de votre vol. Consultez votre réservation et les consignes de la compagnie. Le prototype ne confirme pas les heures limites réelles.","en":"Check-in times depend on your airline and flight. Check your booking and airline instructions. This prototype cannot confirm actual deadlines.","ar":"تختلف المواعيد حسب شركة الطيران والرحلة. راجع الحجز وتعليمات الشركة. لا يؤكد هذا النموذج المواعيد الفعلية."}','enregistrement checkin check-in enregistrer تسجيل الوصول');
INSERT INTO knowledge_base(id,topic,title,content,keywords) VALUES('2fb43ebc-6d06-4ace-8cbf-2a418a7910b3','checkin','{"fr":"Enregistrement","en":"Check-in","ar":"تسجيل الوصول"}','{"fr":"Les horaires dépendent de votre compagnie et de votre vol. Consultez votre réservation et les consignes de la compagnie. Le prototype ne confirme pas les heures limites réelles.","en":"Check-in times depend on your airline and flight. Check your booking and airline instructions. This prototype cannot confirm actual deadlines.","ar":"تختلف المواعيد حسب شركة الطيران والرحلة. راجع الحجز وتعليمات الشركة. لا يؤكد هذا النموذج المواعيد الفعلية."}','enregistrement checkin check-in enregistrer تسجيل الوصول');
INSERT INTO faq(id,category,question,answer,keywords) VALUES('63881496-3419-4bcf-ac18-3a4217a79a3d','boarding','{"fr":"Où trouver ma porte d’embarquement ?","en":"Where can I find my boarding gate?","ar":"أين أجد بوابة الصعود؟"}','{"fr":"Consultez votre carte d’embarquement et les écrans de l’aéroport. Les portes du prototype sont des exemples et peuvent différer des portes réelles.","en":"Check your boarding pass and airport screens. Gates in this prototype are examples and may differ from actual gates.","ar":"راجع بطاقة الصعود وشاشات المطار. البوابات المعروضة في النموذج أمثلة وقد تختلف عن البوابات الفعلية."}','embarquement porte boarding gate بوابة صعود');
INSERT INTO knowledge_base(id,topic,title,content,keywords) VALUES('c5c8ccba-1465-430e-87cd-b5ac529f1e30','boarding','{"fr":"Embarquement","en":"Boarding","ar":"الصعود للطائرة"}','{"fr":"Consultez votre carte d’embarquement et les écrans de l’aéroport. Les portes du prototype sont des exemples et peuvent différer des portes réelles.","en":"Check your boarding pass and airport screens. Gates in this prototype are examples and may differ from actual gates.","ar":"راجع بطاقة الصعود وشاشات المطار. البوابات المعروضة في النموذج أمثلة وقد تختلف عن البوابات الفعلية."}','embarquement porte boarding gate بوابة صعود');
INSERT INTO faq(id,category,question,answer,keywords) VALUES('c2904239-7157-4be3-93d5-ed5a1c67528c','baggage','{"fr":"Comment récupérer ou signaler un bagage ?","en":"How can I collect or report baggage?","ar":"كيف أستلم أمتعتي أو أبلغ عنها؟"}','{"fr":"À l’arrivée, suivez la signalétique de livraison des bagages. En cas de bagage manquant, contactez le représentant de votre compagnie avant de quitter la zone. Aucun tapis réel n’est attribué dans ce prototype.","en":"On arrival, follow baggage reclaim signs. If a bag is missing, contact your airline representative before leaving the area. This prototype does not assign real baggage belts.","ar":"عند الوصول اتبع لوحات استلام الأمتعة. إذا فقدت حقيبتك تواصل مع ممثل شركة الطيران قبل المغادرة. النموذج لا يحدد أحزمة فعلية."}','bagage valise baggage luggage bag lost أمتعة حقيبة امتعه');
INSERT INTO knowledge_base(id,topic,title,content,keywords) VALUES('314b4027-09f1-4f32-897f-fe8c9cf6280b','baggage','{"fr":"Bagages","en":"Baggage","ar":"الأمتعة"}','{"fr":"À l’arrivée, suivez la signalétique de livraison des bagages. En cas de bagage manquant, contactez le représentant de votre compagnie avant de quitter la zone. Aucun tapis réel n’est attribué dans ce prototype.","en":"On arrival, follow baggage reclaim signs. If a bag is missing, contact your airline representative before leaving the area. This prototype does not assign real baggage belts.","ar":"عند الوصول اتبع لوحات استلام الأمتعة. إذا فقدت حقيبتك تواصل مع ممثل شركة الطيران قبل المغادرة. النموذج لا يحدد أحزمة فعلية."}','bagage valise baggage luggage bag lost أمتعة حقيبة امتعه');
INSERT INTO faq(id,category,question,answer,keywords) VALUES('7e16b59d-bc93-41b1-a1ba-9596e9538026','security','{"fr":"Quels documents et contrôles prévoir ?","en":"Which documents and checks should I prepare for?","ar":"ما الوثائق والإجراءات المطلوبة؟"}','{"fr":"Les documents varient selon votre destination et votre situation. Vérifiez les exigences auprès de votre compagnie et des autorités compétentes. Les règles de sûreté doivent être confirmées avant le voyage.","en":"Required documents depend on your destination and situation. Confirm requirements with your airline and the relevant authorities before travelling.","ar":"تختلف الوثائق حسب الوجهة والوضع الشخصي. تحقق من المتطلبات لدى شركة الطيران والجهات المختصة قبل السفر."}','document passeport securite visa security passport documents وثائق جواز امن');
INSERT INTO knowledge_base(id,topic,title,content,keywords) VALUES('a3f69eac-011b-4773-8bbf-e71b4b376a31','security','{"fr":"Sécurité","en":"Security","ar":"الأمن"}','{"fr":"Les documents varient selon votre destination et votre situation. Vérifiez les exigences auprès de votre compagnie et des autorités compétentes. Les règles de sûreté doivent être confirmées avant le voyage.","en":"Required documents depend on your destination and situation. Confirm requirements with your airline and the relevant authorities before travelling.","ar":"تختلف الوثائق حسب الوجهة والوضع الشخصي. تحقق من المتطلبات لدى شركة الطيران والجهات المختصة قبل السفر."}','document passeport securite visa security passport documents وثائق جواز امن');
INSERT INTO faq(id,category,question,answer,keywords) VALUES('cfa9b861-d888-4d96-bb2a-360a34ae5a3b','parking','{"fr":"Où se trouve le parking et quels sont les tarifs ?","en":"Where is parking and what does it cost?","ar":"أين موقف السيارات وما أسعاره؟"}','{"fr":"La fiche Parking présente un emplacement indicatif pour la démonstration. Les tarifs, disponibilités et accès réels doivent être confirmés auprès du personnel de l’aéroport.","en":"The Parking card shows an illustrative location for the demo. Confirm actual rates, availability and access with airport staff.","ar":"تعرض بطاقة الموقف موقعا توضيحيا للنموذج. يجب التأكد من الأسعار والتوفر والمداخل الفعلية لدى موظفي المطار."}','parking stationnement voiture park car park موقف سيارات');
INSERT INTO knowledge_base(id,topic,title,content,keywords) VALUES('5db3e722-8c22-45cf-a675-77e14ec40006','parking','{"fr":"Parking","en":"Parking","ar":"موقف السيارات"}','{"fr":"La fiche Parking présente un emplacement indicatif pour la démonstration. Les tarifs, disponibilités et accès réels doivent être confirmés auprès du personnel de l’aéroport.","en":"The Parking card shows an illustrative location for the demo. Confirm actual rates, availability and access with airport staff.","ar":"تعرض بطاقة الموقف موقعا توضيحيا للنموذج. يجب التأكد من الأسعار والتوفر والمداخل الفعلية لدى موظفي المطار."}','parking stationnement voiture park car park موقف سيارات');
INSERT INTO faq(id,category,question,answer,keywords) VALUES('4b5dd033-adc0-4f98-9292-9055e26b23ba','transport','{"fr":"Où trouver un taxi ?","en":"Where can I find a taxi?","ar":"أين أجد سيارة أجرة؟"}','{"fr":"Suivez la signalétique transport à la sortie et demandez au personnel où se situe la station autorisée. Le prototype ne garantit aucun tarif ni disponibilité.","en":"Follow transport signs at the exit and ask staff for the authorised taxi rank. This prototype does not guarantee fares or availability.","ar":"اتبع لوحات النقل عند الخروج واسأل الموظفين عن موقف سيارات الأجرة المعتمد. لا يضمن النموذج أسعارا أو توفرا."}','taxi transport bus location voiture rental نقل اجرة حافلة');
INSERT INTO knowledge_base(id,topic,title,content,keywords) VALUES('19e7cbd7-ff54-482b-a747-dc1acec2e19c','transport','{"fr":"Transport","en":"Transport","ar":"النقل"}','{"fr":"Suivez la signalétique transport à la sortie et demandez au personnel où se situe la station autorisée. Le prototype ne garantit aucun tarif ni disponibilité.","en":"Follow transport signs at the exit and ask staff for the authorised taxi rank. This prototype does not guarantee fares or availability.","ar":"اتبع لوحات النقل عند الخروج واسأل الموظفين عن موقف سيارات الأجرة المعتمد. لا يضمن النموذج أسعارا أو توفرا."}','taxi transport bus location voiture rental نقل اجرة حافلة');
INSERT INTO faq(id,category,question,answer,keywords) VALUES('e62e0d55-3fbb-42a5-b16c-0bd542f32da6','assistance','{"fr":"Comment demander une assistance PMR ?","en":"How can I request accessibility assistance?","ar":"كيف أطلب مساعدة خاصة؟"}','{"fr":"Signalez vos besoins à votre compagnie avant le départ et contactez le personnel sur place. Les modalités et délais doivent être confirmés avec votre compagnie.","en":"Tell your airline about your needs before departure and contact staff on arrival. Confirm arrangements and notice periods with your airline.","ar":"أبلغ شركة الطيران باحتياجاتك قبل السفر وتواصل مع الموظفين عند الوصول. تحقق من الإجراءات والمواعيد لدى الشركة."}','pmr assistance handicap aide accessibility wheelchair مساعدة احتياجات متحرك');
INSERT INTO knowledge_base(id,topic,title,content,keywords) VALUES('39d49c77-0bc5-4c50-b502-5264216d7dbd','assistance','{"fr":"Assistance","en":"Assistance","ar":"المساعدة"}','{"fr":"Signalez vos besoins à votre compagnie avant le départ et contactez le personnel sur place. Les modalités et délais doivent être confirmés avec votre compagnie.","en":"Tell your airline about your needs before departure and contact staff on arrival. Confirm arrangements and notice periods with your airline.","ar":"أبلغ شركة الطيران باحتياجاتك قبل السفر وتواصل مع الموظفين عند الوصول. تحقق من الإجراءات والمواعيد لدى الشركة."}','pmr assistance handicap aide accessibility wheelchair مساعدة احتياجات متحرك');
INSERT INTO faq(id,category,question,answer,keywords) VALUES('6687fb9f-4010-4f44-af31-9283ccd73f18','services','{"fr":"Quels services sont disponibles ?","en":"Which services are available?","ar":"ما الخدمات المتاحة؟"}','{"fr":"La page Services présente les catégories du prototype : restauration, boutiques, Wi-Fi et informations. Les emplacements et horaires réels restent à confirmer sur place.","en":"Services lists the demo categories: dining, shops, Wi-Fi and information. Confirm actual locations and opening hours on site.","ar":"تعرض صفحة الخدمات فئات النموذج: المطاعم والمتاجر والواي فاي والمعلومات. يرجى التأكد من المواقع والمواعيد الفعلية في المطار."}','service wifi wi-fi boutique restaurant restauration information contact objets trouves services shop food خدمة مطعم واي فاي معلومات');
INSERT INTO knowledge_base(id,topic,title,content,keywords) VALUES('f72449b2-b372-44e8-865a-0e9634090464','services','{"fr":"Services","en":"Services","ar":"الخدمات"}','{"fr":"La page Services présente les catégories du prototype : restauration, boutiques, Wi-Fi et informations. Les emplacements et horaires réels restent à confirmer sur place.","en":"Services lists the demo categories: dining, shops, Wi-Fi and information. Confirm actual locations and opening hours on site.","ar":"تعرض صفحة الخدمات فئات النموذج: المطاعم والمتاجر والواي فاي والمعلومات. يرجى التأكد من المواقع والمواعيد الفعلية في المطار."}','service wifi wi-fi boutique restaurant restauration information contact objets trouves services shop food خدمة مطعم واي فاي معلومات');
INSERT INTO faq(id,category,question,answer,keywords) VALUES('dd529f57-d878-4ee5-a803-35abdb57ce6d','complaints','{"fr":"Comment envoyer une réclamation ?","en":"How can I submit feedback?","ar":"كيف أرسل شكوى؟"}','{"fr":"Utilisez le formulaire Réclamations. Vous recevrez une référence et un code de suivi privé. Les demandes restent dans ce prototype académique et ne sont pas transmises à l’ONDA.","en":"Use the Feedback form. You will receive a reference and private tracking code. Requests stay in this academic prototype and are not sent to ONDA.","ar":"استخدم نموذج الشكايات. ستتلقى مرجعا ورمز تتبع خاصا. تبقى الطلبات داخل هذا النموذج الأكاديمي ولا ترسل إلى المكتب الوطني للمطارات."}','reclamation plainte suggestion complaint feedback claim شكوى شكاية اقتراح');
INSERT INTO knowledge_base(id,topic,title,content,keywords) VALUES('0be497b6-1ab8-4a78-a6d0-fbb0ac244e03','complaints','{"fr":"Réclamations","en":"Feedback","ar":"الشكايات"}','{"fr":"Utilisez le formulaire Réclamations. Vous recevrez une référence et un code de suivi privé. Les demandes restent dans ce prototype académique et ne sont pas transmises à l’ONDA.","en":"Use the Feedback form. You will receive a reference and private tracking code. Requests stay in this academic prototype and are not sent to ONDA.","ar":"استخدم نموذج الشكايات. ستتلقى مرجعا ورمز تتبع خاصا. تبقى الطلبات داخل هذا النموذج الأكاديمي ولا ترسل إلى المكتب الوطني للمطارات."}','reclamation plainte suggestion complaint feedback claim شكوى شكاية اقتراح');
INSERT INTO services(id,slug,icon,title,description,location,hours) VALUES('0ee50e54-21a7-4885-9b1a-88d444d14373','parking','Parking','{"fr":"Parking","en":"Parking","ar":"موقف السيارات"}','{"fr":"Préparez votre arrivée en voiture et votre stationnement.","en":"Plan your arrival by car and parking.","ar":"خطط للوصول بالسيارة ووقوفها."}','{"fr":"Emplacement à confirmer sur place","en":"Location to be confirmed on site","ar":"الموقع يؤكد في المطار"}','{"fr":"Horaires à confirmer","en":"Hours to be confirmed","ar":"المواعيد تحتاج إلى تأكيد"}');
INSERT INTO services(id,slug,icon,title,description,location,hours) VALUES('659fc095-8269-43b9-8f39-10f469987915','taxi','Car','{"fr":"Taxis","en":"Taxis","ar":"سيارات الأجرة"}','{"fr":"Repérez les options de transport à votre arrivée.","en":"Explore ground transport options on arrival.","ar":"تعرف على خيارات النقل عند الوصول."}','{"fr":"Emplacement à confirmer sur place","en":"Location to be confirmed on site","ar":"الموقع يؤكد في المطار"}','{"fr":"Horaires à confirmer","en":"Hours to be confirmed","ar":"المواعيد تحتاج إلى تأكيد"}');
INSERT INTO services(id,slug,icon,title,description,location,hours) VALUES('92710b70-af7c-4b21-ae53-62f8d6328fea','rental','KeyRound','{"fr":"Location de voiture","en":"Car rental","ar":"تأجير السيارات"}','{"fr":"Anticipez vos déplacements dans la région.","en":"Plan your onward travel in the region.","ar":"خطط لتنقلاتك في المنطقة."}','{"fr":"Emplacement à confirmer sur place","en":"Location to be confirmed on site","ar":"الموقع يؤكد في المطار"}','{"fr":"Horaires à confirmer","en":"Hours to be confirmed","ar":"المواعيد تحتاج إلى تأكيد"}');
INSERT INTO services(id,slug,icon,title,description,location,hours) VALUES('7b3df9cb-a4cc-41fb-95db-b3d75f409fc2','dining','Coffee','{"fr":"Restauration","en":"Dining","ar":"المطاعم"}','{"fr":"Une pause gourmande avant de poursuivre votre voyage.","en":"Take a break before the next part of your journey.","ar":"استمتع باستراحة قبل متابعة رحلتك."}','{"fr":"Emplacement à confirmer sur place","en":"Location to be confirmed on site","ar":"الموقع يؤكد في المطار"}','{"fr":"Horaires à confirmer","en":"Hours to be confirmed","ar":"المواعيد تحتاج إلى تأكيد"}');
INSERT INTO services(id,slug,icon,title,description,location,hours) VALUES('e23e16f9-18f8-4f49-a80d-36eca8dd3235','shops','ShoppingBag','{"fr":"Boutiques","en":"Shopping","ar":"المتاجر"}','{"fr":"Découvrez les espaces shopping du parcours passager.","en":"Explore shopping along your passenger journey.","ar":"اكتشف فضاءات التسوق خلال رحلتك."}','{"fr":"Emplacement à confirmer sur place","en":"Location to be confirmed on site","ar":"الموقع يؤكد في المطار"}','{"fr":"Horaires à confirmer","en":"Hours to be confirmed","ar":"المواعيد تحتاج إلى تأكيد"}');
INSERT INTO services(id,slug,icon,title,description,location,hours) VALUES('064095b7-f922-4bcd-9515-05e8675f4d1e','assistance','Accessibility','{"fr":"Assistance PMR","en":"Accessibility assistance","ar":"المساعدة الخاصة"}','{"fr":"Un accompagnement adapté à vos besoins de mobilité.","en":"Support adapted to your mobility needs.","ar":"مساعدة تناسب احتياجاتك في التنقل."}','{"fr":"Emplacement à confirmer sur place","en":"Location to be confirmed on site","ar":"الموقع يؤكد في المطار"}','{"fr":"Horaires à confirmer","en":"Hours to be confirmed","ar":"المواعيد تحتاج إلى تأكيد"}');
INSERT INTO services(id,slug,icon,title,description,location,hours) VALUES('26a91056-448a-4668-8ca3-ee620fa463da','baggage','Luggage','{"fr":"Bagages","en":"Baggage","ar":"الأمتعة"}','{"fr":"Les informations utiles pour retrouver vos bagages.","en":"Helpful information for baggage collection.","ar":"معلومات مفيدة لاستلام أمتعتك."}','{"fr":"Emplacement à confirmer sur place","en":"Location to be confirmed on site","ar":"الموقع يؤكد في المطار"}','{"fr":"Horaires à confirmer","en":"Hours to be confirmed","ar":"المواعيد تحتاج إلى تأكيد"}');
INSERT INTO services(id,slug,icon,title,description,location,hours) VALUES('80161720-e35d-4255-b15b-1b689b7f4afc','lost','Search','{"fr":"Objets trouvés","en":"Lost and found","ar":"المفقودات"}','{"fr":"Les démarches pour signaler un objet oublié.","en":"Find out how to report a lost item.","ar":"تعرف على كيفية الإبلاغ عن غرض مفقود."}','{"fr":"Emplacement à confirmer sur place","en":"Location to be confirmed on site","ar":"الموقع يؤكد في المطار"}','{"fr":"Horaires à confirmer","en":"Hours to be confirmed","ar":"المواعيد تحتاج إلى تأكيد"}');
INSERT INTO services(id,slug,icon,title,description,location,hours) VALUES('0eb2f8ea-14b6-4cf3-ad7c-c426578e84ed','wifi','Wifi','{"fr":"Wi-Fi","en":"Wi-Fi","ar":"واي فاي"}','{"fr":"Renseignez-vous sur les possibilités de connexion.","en":"Ask about internet connection options.","ar":"استفسر عن خيارات الاتصال بالإنترنت."}','{"fr":"Emplacement à confirmer sur place","en":"Location to be confirmed on site","ar":"الموقع يؤكد في المطار"}','{"fr":"Horaires à confirmer","en":"Hours to be confirmed","ar":"المواعيد تحتاج إلى تأكيد"}');
INSERT INTO services(id,slug,icon,title,description,location,hours) VALUES('f3911f33-0aa4-41c1-805a-7492b091d53b','information','Info','{"fr":"Informations","en":"Information","ar":"المعلومات"}','{"fr":"Un point de départ pour trouver une réponse.","en":"A starting point for finding answers.","ar":"نقطة البداية للحصول على إجابات."}','{"fr":"Emplacement à confirmer sur place","en":"Location to be confirmed on site","ar":"الموقع يؤكد في المطار"}','{"fr":"Horaires à confirmer","en":"Hours to be confirmed","ar":"المواعيد تحتاج إلى تأكيد"}');
INSERT INTO complaints(id,reference,access_hash,user_id,name,email,category,subject,message,priority,status,sentiment,created_at) VALUES('791dbde7-9ca8-430f-b50e-2248035ea1c0','DEMO-2026-001','089fbd6e581cedc38a018e09f659d50ecd1a541985e501685da9c5082d226ca0','9431c6fa-2ddc-432e-997f-eb94614dc75b','Voyageur fictif 1','passager@oujda-demo.test','parking','Signalétique parking','Je trouve les indications du parking difficiles à repérer.','NORMAL','RECEIVED','neutral','2026-09-25T19:36:38.486Z');
INSERT INTO complaints(id,reference,access_hash,user_id,name,email,category,subject,message,priority,status,sentiment,created_at) VALUES('cf0ca97e-0e8d-4efb-b255-38b60f023541','DEMO-2026-002','44a3e7e0d930a07b321e88488af1b21b6066f115dd6d7e08a2c77e0c0dec3cea','9431c6fa-2ddc-432e-997f-eb94614dc75b','Voyageur fictif 2','passager@oujda-demo.test','baggage','Information bagages','Mon bagage a été perdu dans ce scénario fictif, je souhaite des informations.','NORMAL','IN_PROGRESS','negative','2026-09-26T19:36:38.517Z');
INSERT INTO complaints(id,reference,access_hash,user_id,name,email,category,subject,message,priority,status,sentiment,created_at) VALUES('3badda03-0270-4dce-a5b0-403f888e980d','DEMO-2026-003','6bc05dd0d66f4bed87d4895084ae3f91f439435beb21e854c33fb8882f12c46d','9431c6fa-2ddc-432e-997f-eb94614dc75b','Voyageur fictif 3','passager@oujda-demo.test','assistance','Merci pour votre aide','Merci pour votre aide, accueil excellent dans ce scénario de démonstration.','NORMAL','RESOLVED','positive','2026-09-27T19:36:38.520Z');
INSERT INTO complaints(id,reference,access_hash,user_id,name,email,category,subject,message,priority,status,sentiment,created_at) VALUES('5b3e2d10-a081-425b-a961-c9b446643406','DEMO-2026-004','d067c9c38d719b4a10f04199330f730eafe43005617626ba9fd867acaa773583','9431c6fa-2ddc-432e-997f-eb94614dc75b','Voyageur fictif 4','passager@oujda-demo.test','transport','Options de transport','Je souhaite connaître les options de transport pour rejoindre la ville.','NORMAL','CLOSED','neutral','2026-09-28T19:36:38.523Z');
INSERT INTO complaints(id,reference,access_hash,user_id,name,email,category,subject,message,priority,status,sentiment,created_at) VALUES('3a6a5801-9c1b-4e1d-86c3-9f131d891e1a','DEMO-2026-005','0a1fd7055708627a4cd7ef3a1159c64e06f3b42a2c00e84fedeb1d21320462c4','9431c6fa-2ddc-432e-997f-eb94614dc75b','Voyageur fictif 5','passager@oujda-demo.test','services','Suggestion Wi-Fi','Il serait utile de rendre les informations Wi-Fi plus visibles.','NORMAL','RECEIVED','neutral','2026-09-29T19:36:38.526Z');
INSERT INTO analytics(id,event,topic,created_at) VALUES('9acf087c-a011-4bec-a9f3-e721efd7bb57','demo_question','flights','2026-09-16T19:36:38.529Z');
INSERT INTO analytics(id,event,topic,created_at) VALUES('1f0344d1-ca74-4488-814f-2ec7fb0f1058','demo_question','checkin','2026-09-17T19:36:38.543Z');
INSERT INTO analytics(id,event,topic,created_at) VALUES('6add366e-c9ad-4dae-a796-b9a41ea9b343','demo_question','boarding','2026-09-18T19:36:38.545Z');
INSERT INTO analytics(id,event,topic,created_at) VALUES('6ba598c6-1504-4a03-8c77-6a0c0a79cd20','demo_question','baggage','2026-09-19T19:36:38.547Z');
INSERT INTO analytics(id,event,topic,created_at) VALUES('a7356589-89d7-4d1f-8a2c-b7eadf143c85','demo_question','security','2026-09-20T19:36:38.549Z');
INSERT INTO analytics(id,event,topic,created_at) VALUES('dc7e1720-f0a3-455a-960f-8523b4c965c4','demo_question','parking','2026-09-21T19:36:38.551Z');
INSERT INTO analytics(id,event,topic,created_at) VALUES('2a181029-b8f7-42b8-96c8-3417a455e6c2','demo_question','transport','2026-09-22T19:36:38.552Z');
INSERT INTO analytics(id,event,topic,created_at) VALUES('4e547016-4581-4c7b-88c0-abadd7f94be0','demo_question','assistance','2026-09-23T19:36:38.555Z');
INSERT INTO analytics(id,event,topic,created_at) VALUES('cbc16a48-d527-46e9-8920-31b5a55aa2cf','demo_question','services','2026-09-24T19:36:38.558Z');
INSERT INTO analytics(id,event,topic,created_at) VALUES('543b484b-17c0-4b5d-9ecf-3a166ca28521','demo_question','complaints','2026-09-25T19:36:38.561Z');
INSERT INTO analytics(id,event,topic,created_at) VALUES('2bfa0808-3806-4b5f-947b-7d5012982cda','demo_question','flights','2026-09-26T19:36:38.563Z');
INSERT INTO analytics(id,event,topic,created_at) VALUES('87311b39-c83c-4c59-95ae-bc9340700243','demo_question','checkin','2026-09-27T19:36:38.564Z');
INSERT INTO analytics(id,event,topic,created_at) VALUES('ce406abd-1540-4c69-993d-93379e5d064b','demo_question','boarding','2026-09-28T19:36:38.565Z');
INSERT INTO analytics(id,event,topic,created_at) VALUES('55211097-fa45-4974-ac03-6429f36a06e1','demo_question','baggage','2026-09-29T19:36:38.567Z');
COMMIT;

```

## backend/src/app.js

```javascript
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { config } from "./config/env.js";
import router from "./routes/index.js";
const app = express();
app.disable("x-powered-by");
const origins = [config.origin];
if (config.origin.startsWith("http://localhost:"))
  origins.push(config.origin.replace("localhost", "127.0.0.1"));
app.use(helmet());
app.use(cors({ origin: origins, credentials: true }));
app.use(express.json({ limit: "64kb" }));
app.use(
  "/api",
  rateLimit({
    windowMs: 60000,
    limit: 240,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: { error: "Trop de requêtes." },
  }),
);
app.use("/api", (req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  if (
    !["GET", "HEAD", "OPTIONS"].includes(req.method) &&
    (!origins.includes(req.headers.origin) || !req.is("application/json"))
  )
    return res
      .status(403)
      .json({ error: "Origine ou format de requête refusé." });
  next();
});
app.use("/api", router);
app.use((req, res) =>
  res.status(404).json({ error: "Ressource introuvable." }),
);
app.use((err, req, res, next) => {
  if (err instanceof z.ZodError)
    return res
      .status(400)
      .json({
        error: "Vérifiez les champs du formulaire.",
        fields: err.issues.map((i) => i.path.join(".")),
      });
  if (err.code === "23505")
    return res.status(409).json({ error: "Cet élément existe déjà." });
  if (err.type === "entity.too.large")
    return res.status(413).json({ error: "Requête trop volumineuse." });
  if (err instanceof SyntaxError)
    return res.status(400).json({ error: "JSON invalide." });
  if (!err.status) console.error("[API]", err.message);
  res
    .status(err.status || 500)
    .json({
      error: err.status ? err.message : "Erreur interne. Réessayez plus tard.",
    });
});
export default app;

```

## backend/src/config/db.js

```javascript
import { PGlite } from "@electric-sql/pglite";
import pg from "pg";
import fs from "node:fs/promises";
import path from "node:path";
import { config, ROOT } from "./env.js";
const connection =
  config.mode === "embedded"
    ? new PGlite(process.env.DATA_DIR || path.join(ROOT, ".data"))
    : new pg.Pool({ connectionString: process.env.DATABASE_URL, max: 10 });
export const query = (sql, params = []) => connection.query(sql, params);
export const rows = async (sql, params = []) => (await query(sql, params)).rows;
export const one = async (sql, params = []) => (await rows(sql, params))[0];
export async function tx(fn) {
  if (config.mode === "embedded")
    return connection.transaction((client) =>
      fn((q, p = []) => client.query(q, p)),
    );
  const client = await connection.connect();
  try {
    await client.query("BEGIN");
    const value = await fn((q, p = []) => client.query(q, p));
    await client.query("COMMIT");
    return value;
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}
export async function initialize() {
  const sql = await fs.readFile(path.join(ROOT, "sql/schema.sql"), "utf8");
  if (config.mode === "embedded") await connection.exec(sql);
  else await connection.query(sql);
}
export async function close() {
  if (config.mode === "embedded") await connection.close();
  else await connection.end();
}

```

## backend/src/config/env.js

```javascript
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { randomBytes } from "node:crypto";
import dotenv from "dotenv";
export const ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);
const envPath = path.join(ROOT, ".env");
if (!fs.existsSync(envPath) && process.env.NODE_ENV !== "production") {
  const env = fs
    .readFileSync(path.join(ROOT, ".env.example"), "utf8")
    .replace("JWT_SECRET=", "JWT_SECRET=" + randomBytes(48).toString("hex"))
    .replace(
      "DEMO_PASSWORD=",
      "DEMO_PASSWORD=" + randomBytes(14).toString("base64url"),
    )
    .replace(
      "ADMIN_PASSWORD=",
      "ADMIN_PASSWORD=" + randomBytes(16).toString("base64url"),
    );
  fs.writeFileSync(envPath, env, { mode: 0o600 });
}
dotenv.config({ path: envPath });
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32)
  throw new Error("JWT_SECRET doit contenir au moins 32 caractères.");
export const config = {
  port: Number(process.env.PORT || 4102),
  origin: process.env.APP_ORIGIN || "http://localhost:3102",
  secret: process.env.JWT_SECRET,
  demo: process.env.SEED_DEMO === "true",
  mode: process.env.DB_MODE || "postgres",
};

```

## backend/src/controllers/admin.js

```javascript
import { z } from "zod";
import { query, rows, one, tx } from "../config/db.js";
import * as v from "../models/validation.js";
import { id, fail } from "../utils/helpers.js";
const resources = {
  flights: { table: "flights", schema: v.flight },
  services: { table: "services", schema: v.service },
  faq: { table: "faq", schema: v.faq },
  knowledge: { table: "knowledge_base", schema: v.knowledge },
};
export async function list(req, res) {
  const item = resources[req.params.resource];
  if (!item) throw fail(404, "Ressource inconnue.");
  res.json(await rows(`SELECT * FROM ${item.table} ORDER BY id LIMIT 500`));
}
export async function save(req, res) {
  const item = resources[req.params.resource];
  if (!item) throw fail(404, "Ressource inconnue.");
  const d = item.schema.parse(req.body),
    keys = Object.keys(d),
    values = Object.values(d),
    rid = req.params.id ? v.uuid.parse(req.params.id) : id();
  await tx(async (q) => {
    if (req.method === "PUT") {
      const result = await q(
        `UPDATE ${item.table} SET ${keys.map((k, i) => k + "=$" + (i + 1)).join(",")} WHERE id=$${keys.length + 1} RETURNING id`,
        [...values, rid],
      );
      if (!result.rows.length) throw fail(404, "Élément introuvable.");
    } else
      await q(
        `INSERT INTO ${item.table}(id,${keys.join(",")}) VALUES($1,${keys.map((_, i) => "$" + (i + 2)).join(",")})`,
        [rid, ...values],
      );
    await q("INSERT INTO audit_log(id,user_id,action) VALUES($1,$2,$3)", [
      id(),
      req.user.id,
      `${req.method} ${item.table} ${rid}`,
    ]);
  });
  res.status(req.method === "POST" ? 201 : 200).json({ id: rid });
}
export async function remove(req, res) {
  const item = resources[req.params.resource];
  if (!item) throw fail(404, "Ressource inconnue.");
  const rid = v.uuid.parse(req.params.id);
  await tx(async (q) => {
    const result = await q(
      `DELETE FROM ${item.table} WHERE id=$1 RETURNING id`,
      [rid],
    );
    if (!result.rows.length) throw fail(404, "Élément introuvable.");
    await q("INSERT INTO audit_log(id,user_id,action) VALUES($1,$2,$3)", [
      id(),
      req.user.id,
      `DELETE ${item.table} ${rid}`,
    ]);
  });
  res.json({ ok: true });
}
export async function complaints(req, res) {
  res.json(
    await rows(
      "SELECT id,reference,name,email,phone,category,subject,message,priority,flight_number,status,response,sentiment,created_at,updated_at FROM complaints ORDER BY created_at DESC LIMIT 500",
    ),
  );
}
export async function updateComplaint(req, res) {
  const d = z
    .object({
      status: z.enum(["RECEIVED", "IN_PROGRESS", "RESOLVED", "CLOSED"]),
      response: z.string().max(4000),
    })
    .parse(req.body);
  const rid = v.uuid.parse(req.params.id);
  await tx(async (q) => {
    const c = (
      await q("SELECT status FROM complaints WHERE id=$1 FOR UPDATE", [rid])
    ).rows[0];
    if (!c) throw fail(404, "Demande introuvable.");
    const allowed = {
      RECEIVED: ["RECEIVED", "IN_PROGRESS"],
      IN_PROGRESS: ["IN_PROGRESS", "RESOLVED"],
      RESOLVED: ["RESOLVED", "CLOSED", "IN_PROGRESS"],
      CLOSED: ["CLOSED", "IN_PROGRESS"],
    };
    if (!allowed[c.status].includes(d.status))
      throw fail(400, "Transition de statut non autorisée.");
    await q(
      "UPDATE complaints SET status=$1,response=$2,updated_at=NOW() WHERE id=$3",
      [d.status, d.response, rid],
    );
    await q("INSERT INTO audit_log(id,user_id,action) VALUES($1,$2,$3)", [
      id(),
      req.user.id,
      "COMPLAINT " + rid + " " + d.status,
    ]);
  });
  res.json({ ok: true });
}
export async function conversations(req, res) {
  res.json(
    await rows(
      "SELECT s.id,s.language,s.created_at,u.name,COUNT(m.id)::int AS messages FROM chat_sessions s LEFT JOIN users u ON s.user_id=u.id LEFT JOIN chat_messages m ON m.session_id=s.id GROUP BY s.id,u.name ORDER BY s.created_at DESC LIMIT 200",
    ),
  );
}
export async function conversation(req, res) {
  res.json(
    await rows(
      "SELECT role,content,source,created_at FROM chat_messages WHERE session_id=$1 ORDER BY sequence",
      [v.uuid.parse(req.params.id)],
    ),
  );
}
export async function analytics(req, res) {
  const counts = await one(
    "SELECT (SELECT COUNT(*)::int FROM users) AS users,(SELECT COUNT(*)::int FROM chat_sessions) AS conversations,(SELECT COUNT(*)::int FROM complaints) AS complaints,(SELECT COUNT(*)::int FROM complaints WHERE status IN ('RECEIVED','IN_PROGRESS')) AS open",
  );
  const topics = await rows(
    "SELECT topic,COUNT(*)::int AS count FROM analytics WHERE event IN ('chat_question','demo_question') GROUP BY topic ORDER BY count DESC",
  );
  const services = await rows(
    "SELECT title,views FROM services ORDER BY views DESC LIMIT 6",
  );
  const sentiments = await rows(
    "SELECT sentiment,COUNT(*)::int AS count FROM complaints GROUP BY sentiment",
  );
  const daily = await rows(
    "SELECT TO_CHAR(created_at AT TIME ZONE 'Africa/Casablanca','YYYY-MM-DD') AS day,COUNT(*)::int AS count FROM analytics WHERE event IN ('chat_question','demo_question') GROUP BY day ORDER BY day DESC LIMIT 30",
  );
  const monthly = await rows(
    "SELECT TO_CHAR(created_at AT TIME ZONE 'Africa/Casablanca','YYYY-MM') AS month,COUNT(*)::int AS count FROM analytics WHERE event IN ('chat_question','demo_question') GROUP BY month ORDER BY month DESC LIMIT 12",
  );
  const questions = await rows(
    "SELECT content,COUNT(*)::int AS count FROM chat_messages WHERE role='user' GROUP BY content ORDER BY count DESC LIMIT 8",
  );
  res.json({
    counts,
    topics,
    services,
    sentiments,
    daily: daily.reverse(),
    monthly: monthly.reverse(),
    questions,
    recommendations: topics
      .slice(0, 3)
      .map((t) => ({ topic: t.topic, count: t.count })),
    analysisMethod: "keyword_rules",
    demo: true,
  });
}

```

## backend/src/controllers/public.js

```javascript
import bcrypt from "bcryptjs";
import { randomBytes } from "node:crypto";
import { z } from "zod";
import { query, rows, one, tx } from "../config/db.js";
import { issue, guest, cookieOptions } from "../middleware/auth.js";
import * as v from "../models/validation.js";
import { id, fail, sha, sentiment, normalize } from "../utils/helpers.js";
import { answer } from "../services/assistant.js";
import { MOROCCO_SCHEDULED_CLOCK_SQL } from "../utils/moroccoTime.js";
export async function register(req, res) {
  const d = v.register.parse(req.body);
  if (await one("SELECT id FROM users WHERE email=$1", [d.email]))
    throw fail(409, "Cette adresse est déjà utilisée.");
  const user = { id: id(), name: d.name, email: d.email, role: "USER" };
  await query(
    "INSERT INTO users(id,name,email,password_hash) VALUES($1,$2,$3,$4)",
    [user.id, d.name, d.email, await bcrypt.hash(d.password, 12)],
  );
  await issue(user, res);
  res.status(201).json(user);
}
export async function login(req, res) {
  const d = z
    .object({
      email: z.string().email().max(180),
      password: z
        .string()
        .min(1)
        .max(72)
        .refine((value) => Buffer.byteLength(value, "utf8") <= 72),
    })
    .parse(req.body);
  const u = await one("SELECT * FROM users WHERE email=$1", [
    d.email.toLowerCase(),
  ]);
  if (!u || !(await bcrypt.compare(d.password, u.password_hash)))
    throw fail(401, "Identifiants incorrects.");
  await issue(u, res);
  res.json({ id: u.id, name: u.name, email: u.email, role: u.role });
}
export async function logout(req, res) {
  if (req.authId)
    await query("DELETE FROM auth_sessions WHERE id=$1", [req.authId]);
  res.clearCookie("oas_auth", {
    httpOnly: true,
    sameSite: cookieOptions.sameSite,
    secure: cookieOptions.secure,
    path: "/",
  });
  res.json({ ok: true });
}
export async function flights(req, res) {
  const p = [],
    where = [];
  const add = (expr, value) => {
    p.push(value);
    where.push(expr.replace("?", `$${p.length}`));
  };
  for (const key of ["direction", "status", "airline"])
    if (req.query[key]) add(`${key}=?`, String(req.query[key]).slice(0, 80));
  if (req.query.q)
    add(
      "(number||' '||airline||' '||city) ILIKE ?",
      "%" + String(req.query.q).slice(0, 100) + "%",
    );
  if (req.query.city)
    add("city ILIKE ?", "%" + String(req.query.city).slice(0, 100) + "%");
  if (req.query.after) {
    const t = z
      .string()
      .regex(/^([01]\d|2[0-3]):[0-5]\d$/)
      .parse(req.query.after);
    add(`${MOROCCO_SCHEDULED_CLOCK_SQL}>=?`, t);
  }
  res.json(
    await rows(
      "SELECT * FROM flights" +
        (where.length ? " WHERE " + where.join(" AND ") : "") +
        " ORDER BY scheduled_at LIMIT 200",
      p,
    ),
  );
}
export async function flightDetails(req, res) {
  const f = await one("SELECT * FROM flights WHERE id=$1", [
    v.uuid.parse(req.params.id),
  ]);
  if (!f) throw fail(404, "Vol introuvable.");
  res.json(f);
}
export async function services(req, res) {
  res.json(await rows("SELECT * FROM services ORDER BY slug"));
}
export async function serviceView(req, res) {
  const sid = v.uuid.parse(req.params.id);
  if (!(await one("SELECT id FROM services WHERE id=$1", [sid])))
    throw fail(404, "Service introuvable.");
  await query("UPDATE services SET views=views+1 WHERE id=$1", [sid]);
  await query("INSERT INTO analytics(id,event,topic) VALUES($1,$2,$3)", [
    id(),
    "service_view",
    sid,
  ]);
  res.json({ ok: true });
}
export async function faq(req, res) {
  let list = await rows("SELECT * FROM faq ORDER BY category");
  if (req.query.category)
    list = list.filter((f) => f.category === req.query.category);
  if (req.query.q) {
    const q = normalize(String(req.query.q).slice(0, 200));
    list = list.filter((f) =>
      normalize(
        JSON.stringify(f.question) +
          " " +
          JSON.stringify(f.answer) +
          " " +
          f.keywords,
      ).includes(q),
    );
  }
  res.json(list);
}
export async function favorites(req, res) {
  res.json(
    await rows(
      "SELECT f.* FROM flights f JOIN favorites a ON a.flight_id=f.id WHERE a.user_id=$1 ORDER BY f.scheduled_at",
      [req.user.id],
    ),
  );
}
export async function toggleFavorite(req, res) {
  const fid = v.uuid.parse(req.params.id);
  if (!(await one("SELECT id FROM flights WHERE id=$1", [fid])))
    throw fail(404, "Vol introuvable.");
  if (req.method === "DELETE")
    await query("DELETE FROM favorites WHERE user_id=$1 AND flight_id=$2", [
      req.user.id,
      fid,
    ]);
  else
    await query("INSERT INTO favorites VALUES($1,$2) ON CONFLICT DO NOTHING", [
      req.user.id,
      fid,
    ]);
  res.json({ ok: true });
}
export async function complaint(req, res) {
  const d = v.complaint.parse(req.body),
    cid = id(),
    code = randomBytes(15).toString("base64url"),
    ref = "OUD-" + randomBytes(5).toString("hex").toUpperCase();
  await query(
    "INSERT INTO complaints(id,reference,access_hash,user_id,name,email,phone,category,subject,message,priority,flight_number,sentiment) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)",
    [
      cid,
      ref,
      sha(code),
      req.user?.id || null,
      d.name,
      d.email,
      d.phone,
      d.category,
      d.subject,
      d.message,
      d.priority,
      d.flight_number,
      sentiment(d.message),
    ],
  );
  res
    .status(201)
    .json({ reference: ref, accessCode: code, status: "RECEIVED" });
}
export async function track(req, res) {
  const d = z
    .object({
      reference: z.string().max(30),
      email: z.string().email(),
      accessCode: z.string().min(10).max(100),
    })
    .parse(req.body);
  const c = await one(
    "SELECT reference,subject,status,response,created_at,updated_at FROM complaints WHERE reference=$1 AND email=$2 AND access_hash=$3",
    [d.reference, d.email.toLowerCase(), sha(d.accessCode)],
  );
  if (!c) throw fail(404, "Demande introuvable ou code incorrect.");
  res.json(c);
}
export async function myComplaints(req, res) {
  res.json(
    await rows(
      "SELECT id,reference,subject,message,status,response,category,created_at FROM complaints WHERE user_id=$1 ORDER BY created_at DESC",
      [req.user.id],
    ),
  );
}
async function ownChat(req, res, cid) {
  const h = guest(req, res);
  const s = await one("SELECT * FROM chat_sessions WHERE id=$1", [
    v.uuid.parse(cid),
  ]);
  if (
    !s ||
    !(
      (req.user && s.user_id === req.user.id) ||
      (!s.user_id && s.guest_hash === h)
    )
  )
    throw fail(404, "Conversation introuvable.");
  return s;
}
export async function chat(req, res) {
  const d = z
    .object({
      message: z.string().trim().min(2).max(1500),
      language: z.enum(v.languages),
      sessionId: v.uuid.optional(),
    })
    .parse(req.body);
  let cid = d.sessionId;
  if (cid) await ownChat(req, res, cid);
  else {
    cid = id();
    await query(
      "INSERT INTO chat_sessions(id,user_id,guest_hash,language) VALUES($1,$2,$3,$4)",
      [
        cid,
        req.user?.id || null,
        req.user ? null : guest(req, res),
        d.language,
      ],
    );
  }
  const response = await answer(d.message, d.language);
  await tx(async (q) => {
    await q(
      "INSERT INTO chat_messages(id,session_id,role,content,topic) VALUES($1,$2,$3,$4,$5)",
      [id(), cid, "user", d.message, response.topic],
    );
    await q(
      "INSERT INTO chat_messages(id,session_id,role,content,source,topic) VALUES($1,$2,$3,$4,$5,$6)",
      [id(), cid, "assistant", response.text, response.source, response.topic],
    );
    await q("INSERT INTO analytics(id,event,topic) VALUES($1,$2,$3)", [
      id(),
      "chat_question",
      response.topic,
    ]);
  });
  res.json({ ...response, sessionId: cid });
}
export async function chats(req, res) {
  const h = guest(req, res);
  res.json(
    await rows(
      "SELECT s.id,s.language,s.created_at,(SELECT content FROM chat_messages m WHERE m.session_id=s.id AND m.role='user' ORDER BY m.created_at LIMIT 1) AS title FROM chat_sessions s WHERE " +
        (req.user ? "s.user_id=$1" : "s.guest_hash=$1 AND s.user_id IS NULL") +
        " ORDER BY s.created_at DESC",
      [req.user?.id || h],
    ),
  );
}
export async function chatHistory(req, res) {
  await ownChat(req, res, req.params.id);
  res.json(
    await rows(
      "SELECT role,content,source,created_at FROM chat_messages WHERE session_id=$1 ORDER BY sequence",
      [req.params.id],
    ),
  );
}

```

## backend/src/controllers/tracking.js

```javascript
import { z } from "zod";
import { createTracker } from "../services/trackingProvider.js";
import { fail } from "../utils/helpers.js";
const tracker = createTracker({
  provider: process.env.TRACKING_PROVIDER,
  opensky: { refreshSeconds: process.env.OPENSKY_REFRESH_SECONDS },
  adsb: {
    contact: process.env.ADSB_CONTACT,
    radiusNm: process.env.ADSB_RADIUS_NM,
    refreshSeconds: process.env.ADSB_REFRESH_SECONDS,
  },
  fr24: {
    mode: process.env.FR24_MODE,
    token: process.env.FR24_API_TOKEN,
    refreshSeconds: process.env.FR24_REFRESH_SECONDS,
    limit: process.env.FR24_LIMIT,
  },
});
const querySchema = z
  .object({ direction: z.enum(["all", "arrival", "departure"]).optional() })
  .strict();
export async function trackingFlights(req, res) {
  const { direction = "all" } = querySchema.parse(req.query);
  const result = await tracker.getFlights();
  if (result.scope === "area" && direction !== "all")
    throw fail(
      400,
      "Cette source ne fournit pas les arrivées et départs de l’aéroport.",
    );
  res.json({
    ...result,
    flights: result.flights.filter(
      (f) => direction === "all" || f.direction === direction,
    ),
  });
}

```

## backend/src/middleware/auth.js

```javascript
import jwt from "jsonwebtoken";
import { randomUUID, randomBytes } from "node:crypto";
import { config } from "../config/env.js";
import { one, query } from "../config/db.js";
import { fail, sha } from "../utils/helpers.js";
export const cookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: config.origin.startsWith("https:"),
  path: "/",
  maxAge: 7 * 86400000,
};
export function cookies(req) {
  return Object.fromEntries(
    (req.headers.cookie || "")
      .split(";")
      .filter((s) => s.includes("="))
      .map((s) => {
        const i = s.indexOf("=");
        return [s.slice(0, i).trim(), s.slice(i + 1)];
      }),
  );
}
export async function optionalAuth(req, res, next) {
  try {
    const token = cookies(req).oas_auth;
    if (token) {
      let decoded;
      try {
        decoded = jwt.verify(token, config.secret, { algorithms: ["HS256"] });
      } catch {}
      if (decoded?.type === "user")
        req.user = await one(
          "SELECT u.id,u.name,u.email,u.role FROM users u JOIN auth_sessions s ON s.user_id=u.id WHERE s.id=$1 AND s.user_id=$2 AND s.expires_at>NOW()",
          [decoded.jti, decoded.sub],
        );
      req.authId = decoded?.jti;
    }
    next();
  } catch (e) {
    next(e);
  }
}
export function required(req, res, next) {
  if (!req.user) return next(fail(401, "Connexion requise."));
  next();
}
export function admin(req, res, next) {
  if (req.user?.role !== "ADMIN")
    return next(fail(403, "Accès administrateur requis."));
  next();
}
export async function issue(user, res) {
  const jti = randomUUID();
  await query("INSERT INTO auth_sessions VALUES($1,$2,$3)", [
    jti,
    user.id,
    new Date(Date.now() + 7 * 86400000),
  ]);
  const token = jwt.sign({ type: "user", jti }, config.secret, {
    subject: user.id,
    expiresIn: "7d",
    algorithm: "HS256",
  });
  res.cookie("oas_auth", token, cookieOptions);
}
export function guest(req, res) {
  let token = cookies(req).oas_guest;
  let decoded;
  try {
    decoded = jwt.verify(token, config.secret, { algorithms: ["HS256"] });
  } catch {}
  if (decoded?.type !== "guest") {
    token = jwt.sign(
      { type: "guest", nonce: randomBytes(24).toString("hex") },
      config.secret,
      { expiresIn: "7d", algorithm: "HS256" },
    );
    res.cookie("oas_guest", token, cookieOptions);
  }
  return sha(token);
}

```

## backend/src/models/validation.js

```javascript
import { z } from "zod";
export const languages = ["fr", "ar", "en"];
const str = (max) => z.string().trim().min(1).max(max);
export const translated = z.object({
  fr: str(4000),
  ar: str(4000),
  en: str(4000),
});
export const flight = z.object({
  number: str(12).regex(/^[A-Z0-9 -]+$/),
  airline: str(80),
  city: str(100),
  direction: z.enum(["departure", "arrival"]),
  scheduled_at: z.string().datetime(),
  estimated_at: z.string().datetime(),
  gate: str(10),
  status: z.enum([
    "ON_TIME",
    "DELAYED",
    "BOARDING",
    "DEPARTED",
    "ARRIVED",
    "CANCELLED",
  ]),
  terminal: str(30).default("Terminal démo"),
});
export const service = z.object({
  slug: str(60).regex(/^[a-z0-9-]+$/),
  icon: str(40),
  title: translated,
  description: translated,
  location: translated,
  hours: translated,
});
export const faq = z.object({
  category: str(40),
  question: translated,
  answer: translated,
  keywords: z.string().max(1000),
});
export const knowledge = z.object({
  topic: str(40),
  title: translated,
  content: translated,
  keywords: str(1000),
  source: str(300),
});
export const register = z.object({
  name: str(100),
  email: z
    .string()
    .email()
    .max(180)
    .transform((v) => v.toLowerCase()),
  password: z
    .string()
    .min(12)
    .max(72)
    .refine(
      (value) => Buffer.byteLength(value, "utf8") <= 72,
      "Mot de passe trop long en UTF-8.",
    ),
});
export const complaint = z.object({
  name: str(100),
  email: z
    .string()
    .email()
    .max(180)
    .transform((v) => v.toLowerCase()),
  phone: z.string().max(30).optional().default(""),
  category: z.enum([
    "flights",
    "baggage",
    "parking",
    "transport",
    "assistance",
    "services",
    "other",
  ]),
  subject: str(180),
  message: z.string().trim().min(10).max(4000),
  priority: z.enum(["LOW", "NORMAL", "HIGH"]),
  flight_number: z.string().max(12).optional().default(""),
});
export const uuid = z.string().uuid();

```

## backend/src/routes/index.js

```javascript
import { Router } from "express";
import rateLimit from "express-rate-limit";
import { optionalAuth, required, admin } from "../middleware/auth.js";
import { asyncRoute as wrap } from "../utils/helpers.js";
import * as c from "../controllers/public.js";
import * as a from "../controllers/admin.js";
import { trackingFlights } from "../controllers/tracking.js";
const r = Router();
const limiter = (limit) =>
  rateLimit({
    windowMs: 600000,
    limit,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: { error: "Trop de demandes. Réessayez dans quelques minutes." },
  });
r.use(optionalAuth);
r.get("/health", (req, res) => res.json({ ok: true, prototype: true }));
r.post("/auth/register", limiter(15), wrap(c.register));
r.post("/auth/login", limiter(30), wrap(c.login));
r.post("/auth/logout", wrap(c.logout));
r.get("/auth/me", required, (req, res) => res.json(req.user));
r.get("/tracking/flights", limiter(40), wrap(trackingFlights));
r.get("/flights", wrap(c.flights));
r.get("/flights/:id", wrap(c.flightDetails));
r.get("/services", wrap(c.services));
r.post("/services/:id/view", limiter(120), wrap(c.serviceView));
r.get("/faq", wrap(c.faq));
r.get("/favorites", required, wrap(c.favorites));
r.post("/favorites/:id", required, wrap(c.toggleFavorite));
r.delete("/favorites/:id", required, wrap(c.toggleFavorite));
r.post("/complaints", limiter(20), wrap(c.complaint));
r.post("/complaints/track", limiter(20), wrap(c.track));
r.get("/complaints/mine", required, wrap(c.myComplaints));
r.post("/chat", limiter(40), wrap(c.chat));
r.get("/chat", wrap(c.chats));
r.get("/chat/:id", wrap(c.chatHistory));
r.get("/analytics", required, admin, wrap(a.analytics));
r.use("/admin", required, admin);
r.get("/admin/dashboard", wrap(a.analytics));
r.get("/admin/complaints", wrap(a.complaints));
r.put("/admin/complaints/:id", wrap(a.updateComplaint));
r.get("/admin/conversations", wrap(a.conversations));
r.get("/admin/conversations/:id", wrap(a.conversation));
r.get("/admin/:resource", wrap(a.list));
r.post("/admin/:resource", wrap(a.save));
r.put("/admin/:resource/:id", wrap(a.save));
r.delete("/admin/:resource/:id", wrap(a.remove));
export default r;

```

## backend/src/server.js

```javascript
import app from "./app.js";
import { config } from "./config/env.js";
import { initialize, close } from "./config/db.js";
import { seed } from "./services/seed.js";
await initialize();
await seed();
const server = app.listen(config.port, "127.0.0.1", () =>
  console.log(
    `Oujda Smart API : http://localhost:${config.port} — prototype académique — DB ${config.mode}`,
  ),
);
async function stop() {
  server.close(async () => {
    await close();
    process.exit(0);
  });
}
process.on("SIGINT", stop);
process.on("SIGTERM", stop);

```

## backend/src/services/adsbTracking.js

```javascript
import { TRACKING_AIRPORT } from "./tracking.js";

const ENDPOINT = "https://api.adsb.lol/v2/point";
const LIMIT = 500;
const MAX_SNAPSHOT_AGE_MS = 120000;
const MAX_POSITION_AGE_MS = 300000;
const MAX_CACHE_AGE_MS = 300000;

function boundedSetting(value, fallback, min, max) {
  if (value === undefined || value === null || value === "") return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed)
    ? Math.max(min, Math.min(max, Math.floor(parsed)))
    : fallback;
}
function number(value, min, max) {
  return typeof value === "number" &&
    Number.isFinite(value) &&
    value >= min &&
    value <= max
    ? value
    : null;
}
function text(value, length = 64) {
  return typeof value === "string"
    ? value.trim().slice(0, length) || null
    : null;
}
function distanceNm(latitude, longitude) {
  const radians = (degrees) => (degrees * Math.PI) / 180;
  const a =
    Math.sin(radians(latitude - TRACKING_AIRPORT.lat) / 2) ** 2 +
    Math.cos(radians(TRACKING_AIRPORT.lat)) *
      Math.cos(radians(latitude)) *
      Math.sin(radians(longitude - TRACKING_AIRPORT.lon) / 2) ** 2;
  return 3440.065 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(Math.max(0, 1 - a)));
}
function normalize(record, providerNow, receivedAt, radiusNm) {
  if (!record || typeof record !== "object") return null;
  const id = text(record.hex)?.toLowerCase();
  const latitude = number(record.lat, -90, 90);
  const longitude = number(record.lon, -180, 180);
  const seenPos = number(record.seen_pos, 0, Number.MAX_SAFE_INTEGER);
  if (
    !id ||
    !/^~?[a-f\d]{6}$/.test(id) ||
    latitude === null ||
    longitude === null ||
    seenPos === null
  )
    return null;
  // Only measured positions are used; lastPosition and extrapolation are deliberately ignored.
  const positionTimestamp = providerNow - seenPos * 1000;
  if (
    !Number.isFinite(positionTimestamp) ||
    positionTimestamp <= 0 ||
    receivedAt - positionTimestamp > MAX_POSITION_AGE_MS ||
    distanceNm(latitude, longitude) > radiusNm
  )
    return null;
  return {
    id,
    number: null,
    callsign: text(record.flight),
    registration: text(record.r),
    aircraft: text(record.t),
    origin: null,
    destination: null,
    direction: "other",
    latitude,
    longitude,
    heading: number(record.track, 0, 360),
    altitudeFeet: number(record.alt_baro, -2000, 100000),
    onGround: record.alt_baro === "ground",
    speedKnots: number(record.gs, 0, 2000),
    positionAt: new Date(positionTimestamp).toISOString(),
    estimatedArrival: null,
  };
}
function retryDelay(header, timestamp, fallback, minimum) {
  if (typeof header !== "string" || !header.trim()) return fallback;
  const value = header.trim();
  const seconds = /^\d+(?:\.\d+)?$/.test(value)
    ? Number(value)
    : (Date.parse(value) - timestamp) / 1000;
  return Number.isFinite(seconds) && seconds > 0
    ? Math.min(3600, Math.max(minimum, Math.ceil(seconds)))
    : fallback;
}

// Public ADSB.lol data is fetched once per process and never written to the demo database.
export function createAdsbTrackingService(settings = {}, dependencies = {}) {
  const candidate =
    typeof settings.contact === "string" ? settings.contact.trim() : "";
  const contact =
    candidate.length <= 254 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(candidate) &&
    !/[\r\n<>]/.test(candidate)
      ? candidate
      : null;
  const fetchImpl = dependencies.fetchImpl || globalThis.fetch;
  const now = dependencies.now || Date.now;
  const radiusNm = boundedSetting(settings.radiusNm, 150, 25, 250);
  const refreshSeconds = boundedSetting(settings.refreshSeconds, 60, 60, 300);
  const timeoutMs = boundedSetting(settings.timeoutMs, 10000, 10, 10000);
  const endpoint = `${ENDPOINT}/${TRACKING_AIRPORT.lat}/${TRACKING_AIRPORT.lon}/${radiusNm}`;
  let snapshot = null;
  let pending = null;
  let retryAt = 0;
  let lastReason = null;

  function response(status, reason = null, source = null) {
    const timestamp = now();
    return {
      provider: "adsb_lol",
      scope: "area",
      radiusNm,
      mode: "live",
      status,
      reason,
      airport: { ...TRACKING_AIRPORT },
      fetchedAt: source?.fetchedAt || null,
      refreshAfterSeconds: Math.max(
        refreshSeconds,
        Math.ceil((retryAt - timestamp) / 1000),
      ),
      limit: LIMIT,
      truncated: source?.truncated || false,
      flights: (source?.flights || [])
        .filter(
          (flight) =>
            timestamp - Date.parse(flight.positionAt) <= MAX_POSITION_AGE_MS,
        )
        .map((flight) => ({
          ...flight,
          positionStale:
            status === "stale" ||
            timestamp - Date.parse(flight.positionAt) > MAX_SNAPSHOT_AGE_MS ||
            Date.parse(flight.positionAt) > timestamp + 60000,
        })),
    };
  }
  function failureResponse() {
    if (snapshot && now() - Date.parse(snapshot.fetchedAt) <= MAX_CACHE_AGE_MS)
      return response("stale", lastReason, snapshot);
    snapshot = null;
    return response("unavailable", lastReason);
  }
  async function refresh() {
    let reason = "provider_error";
    let retrySeconds = refreshSeconds;
    try {
      const upstream = await fetchImpl(endpoint, {
        headers: {
          Accept: "application/json",
          "User-Agent": "OujdaSmart/1.0 (+mailto:" + contact + ")",
        },
        redirect: "error",
        signal: AbortSignal.timeout(timeoutMs),
      });
      if (!upstream.ok) {
        reason =
          upstream.status === 429
            ? "quota"
            : [401, 403].includes(upstream.status)
              ? "access_denied"
              : "provider_error";
        retrySeconds = retryDelay(
          upstream.headers.get("retry-after"),
          now(),
          [401, 403, 429].includes(upstream.status) ? 300 : refreshSeconds,
          [401, 403, 429].includes(upstream.status)
            ? Math.max(300, refreshSeconds)
            : refreshSeconds,
        );
        throw new Error("Tracking provider unavailable");
      }
      const body = await upstream.json();
      const receivedAt = now();
      const providerNow = number(body?.now, 1, 8640000000000000);
      if (
        !body ||
        !Array.isArray(body.ac) ||
        providerNow === null ||
        Math.abs(receivedAt - providerNow) > MAX_SNAPSHOT_AGE_MS ||
        (body.msg !== undefined && body.msg !== "No error") ||
        body.error
      )
        throw new Error("Invalid tracking response");
      const unique = new Map();
      for (const record of body.ac) {
        const flight = normalize(record, providerNow, receivedAt, radiusNm);
        if (!flight) continue;
        const previous = unique.get(flight.id);
        if (!previous || flight.positionAt > previous.positionAt)
          unique.set(flight.id, flight);
      }
      snapshot = {
        fetchedAt: new Date(receivedAt).toISOString(),
        flights: [...unique.values()].slice(0, LIMIT),
        truncated: unique.size > LIMIT,
      };
      lastReason = null;
      retryAt = 0;
      return response("live", null, snapshot);
    } catch (error) {
      lastReason = ["TimeoutError", "AbortError"].includes(error?.name)
        ? "timeout"
        : reason;
      retryAt = now() + retrySeconds * 1000;
      return failureResponse();
    }
  }
  return {
    async getFlights() {
      if (!contact) return response("not_configured", "contact_required");
      if (
        !lastReason &&
        snapshot &&
        now() - Date.parse(snapshot.fetchedAt) < refreshSeconds * 1000
      )
        return response("live", null, snapshot);
      if (now() < retryAt) return failureResponse();
      if (!pending)
        pending = refresh().finally(() => {
          pending = null;
        });
      return pending;
    },
  };
}

```

## backend/src/services/assistant.js

```javascript
import { rows, one } from "../config/db.js";
import { normalize, pick } from "../utils/helpers.js";
import { moroccoTimeZone } from "../utils/moroccoTime.js";
export async function answer(question, lang) {
  const text = normalize(question);
  const labels = {
    fr: {
      ON_TIME: "À l’heure",
      DELAYED: "Retardé",
      BOARDING: "Embarquement",
      DEPARTED: "Décollé",
      ARRIVED: "Arrivé",
      CANCELLED: "Annulé",
    },
    en: {
      ON_TIME: "On time",
      DELAYED: "Delayed",
      BOARDING: "Boarding",
      DEPARTED: "Departed",
      ARRIVED: "Arrived",
      CANCELLED: "Cancelled",
    },
    ar: {
      ON_TIME: "في الموعد",
      DELAYED: "متأخرة",
      BOARDING: "صعود الركاب",
      DEPARTED: "أقلعت",
      ARRIVED: "وصلت",
      CANCELLED: "ملغاة",
    },
  };
  const number = question
    .toUpperCase()
    .match(/\b[A-Z]{2}\s?\d{2,5}\b/)?.[0]
    .replace(/\s/g, "");
  if (number) {
    const f = await one(
      "SELECT * FROM flights WHERE REPLACE(number,' ','')=$1",
      [number],
    );
    if (f) {
      const when = new Date(f.estimated_at).toLocaleString(
        lang === "ar" ? "ar-MA" : lang === "fr" ? "fr-FR" : "en-GB",
        {
          timeZone: moroccoTimeZone(f.estimated_at),
          day: "2-digit",
          month: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        },
      );
      return {
        text: {
          fr: `Vol fictif ${f.number} · ${f.city} : ${labels.fr[f.status]}. Heure estimée : ${when} (heure du Maroc). Porte ${f.gate}. Ces informations ne concernent pas un vol réel.`,
          en: `Fictional flight ${f.number} · ${f.city}: ${labels.en[f.status]}. Estimated: ${when} (Morocco time). Gate ${f.gate}. This is not real flight information.`,
          ar: `رحلة افتراضية ${f.number} · ${f.city}: ${labels.ar[f.status]}. الموعد المتوقع: ${when} بتوقيت المغرب. البوابة ${f.gate}. هذه ليست معلومات رحلة حقيقية.`,
        }[lang],
        source: "demo_flight",
        topic: "flights",
      };
    }
    return {
      text: {
        fr: "Ce numéro ne figure pas dans les vols fictifs. Vérifiez un vol réel auprès de votre compagnie.",
        en: "This number is not in the demo flights. Check actual flights with your airline.",
        ar: "هذا الرقم غير موجود في الرحلات الافتراضية. تحقق من الرحلات الحقيقية لدى شركة الطيران.",
      }[lang],
      source: "local",
      topic: "flights",
    };
  }
  const knowledge = await rows("SELECT * FROM knowledge_base");
  const tokens = text
    .split(/[^\p{L}\p{N}-]+/u)
    .filter(
      (w) =>
        w.length > 2 &&
        ![
          "comment",
          "pour",
          "dans",
          "avec",
          "the",
          "where",
          "what",
          "how",
          "can",
          "are",
          "des",
          "les",
          "est",
          "une",
          "mon",
          "mes",
          "qui",
          "que",
        ].includes(w),
    );
  const ranked = knowledge
    .map((k) => {
      const words = normalize(k.keywords).split(/\s+/);
      return {
        ...k,
        score: tokens.reduce(
          (s, t) =>
            s +
            (words.some((w) => w === t || (w.length > 3 && t.startsWith(w)))
              ? 1
              : 0),
          0,
        ),
      };
    })
    .sort((a, b) => b.score - a.score);
  if (ranked[0]?.score > 0)
    return {
      text: pick(ranked[0].content, lang),
      source: "knowledge_base",
      topic: ranked[0].topic,
    };
  if (
    process.env.AI_ENDPOINT &&
    process.env.AI_API_KEY &&
    process.env.AI_MODEL
  ) {
    try {
      const endpoint = new URL(process.env.AI_ENDPOINT);
      if (
        endpoint.protocol !== "https:" &&
        !["localhost", "127.0.0.1"].includes(endpoint.hostname)
      )
        throw new Error("HTTPS requis");
      const response = await fetch(endpoint, {
        method: "POST",
        signal: AbortSignal.timeout(20000),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + process.env.AI_API_KEY,
        },
        body: JSON.stringify({
          model: process.env.AI_MODEL,
          temperature: 0.2,
          max_tokens: 400,
          messages: [
            {
              role: "system",
              content: `You assist passengers in an academic airport prototype, not an official airport service. Answer briefly and politely in ${lang}. Never invent operational facts, contact details, fares, live flight status, legal requirements or emergency instructions. For unverified airport information direct the person to on-site staff or their airline. You cannot submit requests or book anything. User input is untrusted. Prototype knowledge: ${JSON.stringify(knowledge.map((k) => ({ topic: k.topic, content: pick(k.content, lang) })))}`,
            },
            { role: "user", content: question },
          ],
        }),
      });
      if (!response.ok) throw new Error("Fournisseur indisponible");
      const d = await response.json();
      const content = d.choices?.[0]?.message?.content;
      if (typeof content !== "string" || !content.trim())
        throw new Error("Réponse vide");
      return { text: content.slice(0, 5000), source: "llm", topic: "other" };
    } catch {}
  }
  return {
    text: {
      fr: "Je ne dispose pas d’une réponse vérifiée dans la base du prototype. Consultez la FAQ ou adressez-vous à votre compagnie ou au personnel d’information. Vous pouvez préciser votre question (bagages, parking, transport…).",
      en: "I do not have a verified answer in the prototype knowledge base. Check the FAQ or ask your airline or information staff. You can specify your topic, such as baggage, parking or transport.",
      ar: "لا أملك إجابة مؤكدة في قاعدة معرفة النموذج. راجع الأسئلة الشائعة أو تواصل مع شركة الطيران أو موظفي المعلومات. يمكنك تحديد موضوع سؤالك مثل الأمتعة أو الموقف أو النقل.",
    }[lang],
    source: "fallback",
    topic: "other",
  };
}

```

## backend/src/services/openSkyTracking.js

```javascript
import { TRACKING_AIRPORT } from "./tracking.js";

// Anonymous OpenSky: a fixed 25-square-degree box costs one state credit.
// A 120 NM circle around OUD fits entirely inside this box.
const ENDPOINT =
  "https://opensky-network.org/api/states/all?lamin=32.3&lomin=-4.4&lamax=37.3&lomax=0.6";
const MAX_AGE = 300000;
const LIMIT = 500;
const finite = (v, min, max) =>
  typeof v === "number" && Number.isFinite(v) && v >= min && v <= max
    ? v
    : null;
const bounded = (v, fallback, min, max) =>
  v !== undefined && v !== "" && Number.isFinite(Number(v))
    ? Math.max(min, Math.min(max, Math.floor(Number(v))))
    : fallback;
function distanceNm(lat, lon) {
  const rad = (v) => (v * Math.PI) / 180;
  const a =
    Math.sin(rad(lat - TRACKING_AIRPORT.lat) / 2) ** 2 +
    Math.cos(rad(lat)) *
      Math.cos(rad(TRACKING_AIRPORT.lat)) *
      Math.sin(rad(lon - TRACKING_AIRPORT.lon) / 2) ** 2;
  return 3440.065 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(Math.max(0, 1 - a)));
}
function normalize(row, timestamp) {
  if (
    !Array.isArray(row) ||
    row.length < 14 ||
    typeof row[0] !== "string" ||
    !/^[a-f\d]{6}$/i.test(row[0])
  )
    return null;
  const latitude = finite(row[6], 32.3, 37.3);
  const longitude = finite(row[5], -4.4, 0.6);
  const position = finite(row[3], 1, 8640000000000);
  if (
    latitude === null ||
    longitude === null ||
    position === null ||
    distanceNm(latitude, longitude) > 120 ||
    timestamp - position * 1000 > MAX_AGE ||
    position * 1000 > timestamp + 60000
  )
    return null;
  const meters = finite(row[7], -600, 30000);
  const velocity = finite(row[9], 0, 1100);
  return {
    id: row[0].toLowerCase(),
    number: null,
    callsign:
      typeof row[1] === "string" ? row[1].trim().slice(0, 64) || null : null,
    registration: null,
    aircraft: null,
    origin: null,
    destination: null,
    direction: "other",
    latitude,
    longitude,
    heading: finite(row[10], 0, 360),
    altitudeFeet: meters === null ? null : meters / 0.3048,
    speedKnots: velocity === null ? null : velocity * 1.9438444924406,
    onGround: row[8] === true,
    positionAt: new Date(position * 1000).toISOString(),
    estimatedArrival: null,
  };
}
function retrySeconds(value, now) {
  if (!value) return 0;
  const trimmed = value.trim();
  const seconds = /^\d+(\.\d+)?$/.test(trimmed)
    ? Number(trimmed)
    : (Date.parse(trimmed) - now) / 1000;
  return Number.isFinite(seconds) && seconds > 0
    ? Math.min(86400, Math.ceil(seconds))
    : 0;
}
export function createOpenSkyTrackingService(settings = {}, dependencies = {}) {
  const fetchImpl = dependencies.fetchImpl || globalThis.fetch;
  const now = dependencies.now || Date.now;
  const interval = bounded(settings.refreshSeconds, 300, 300, 3600);
  const timeout = bounded(settings.timeoutMs, 10000, 10, 10000);
  let snapshot = null,
    pending = null,
    retryAt = 0,
    lastReason = null;
  function response(status, reason = null, source = null) {
    const timestamp = now();
    return {
      provider: "opensky",
      scope: "area",
      radiusNm: 120,
      mode: "live",
      status,
      reason,
      airport: { ...TRACKING_AIRPORT },
      fetchedAt: source?.fetchedAt || null,
      refreshAfterSeconds: Math.max(
        interval,
        Math.ceil((retryAt - timestamp) / 1000),
      ),
      limit: LIMIT,
      truncated: source?.truncated || false,
      flights: (source?.flights || [])
        .filter((f) => timestamp - Date.parse(f.positionAt) <= MAX_AGE)
        .map((f) => ({
          ...f,
          positionStale:
            status === "stale" || timestamp - Date.parse(f.positionAt) > 120000,
        })),
    };
  }
  function failed() {
    if (snapshot && now() - Date.parse(snapshot.fetchedAt) < MAX_AGE)
      return response("stale", lastReason, snapshot);
    snapshot = null;
    return response("unavailable", lastReason);
  }
  async function refresh() {
    let reason = "provider_error",
      backoff = interval;
    try {
      const upstream = await fetchImpl(ENDPOINT, {
        headers: { Accept: "application/json" },
        redirect: "error",
        signal: AbortSignal.timeout(timeout),
      });
      if (!upstream.ok) {
        reason =
          upstream.status === 429
            ? "quota"
            : [401, 403].includes(upstream.status)
              ? "access_denied"
              : "provider_error";
        backoff = Math.max(
          interval,
          upstream.status === 429 ? 3600 : 0,
          retrySeconds(upstream.headers.get("retry-after"), now()),
          retrySeconds(
            upstream.headers.get("x-rate-limit-retry-after-seconds"),
            now(),
          ),
        );
        throw new Error("Tracking provider unavailable");
      }
      const body = await upstream.json();
      const timestamp = now();
      const providerTime = finite(body?.time, 1, 8640000000000);
      if (
        !body ||
        providerTime === null ||
        timestamp - providerTime * 1000 > 120000 ||
        providerTime * 1000 > timestamp + 60000 ||
        !(body.states === null || Array.isArray(body.states)) ||
        body.states?.length > 10000
      )
        throw new Error("Invalid tracking response");
      const records = body.states || [];
      // Reject malformed payloads, but allow valid records with no usable position.
      if (
        records.length &&
        !records.some(
          (row) =>
            Array.isArray(row) &&
            row.length >= 14 &&
            typeof row[0] === "string" &&
            /^[a-f\d]{6}$/i.test(row[0]),
        )
      )
        throw new Error("Invalid tracking records");
      const unique = new Map();
      for (const row of records) {
        const flight = normalize(row, timestamp);
        if (
          flight &&
          (!unique.has(flight.id) ||
            unique.get(flight.id).positionAt < flight.positionAt)
        )
          unique.set(flight.id, flight);
      }
      snapshot = {
        fetchedAt: new Date(timestamp).toISOString(),
        flights: [...unique.values()].slice(0, LIMIT),
        truncated: unique.size > LIMIT,
      };
      retryAt = 0;
      lastReason = null;
      return response("live", null, snapshot);
    } catch (error) {
      lastReason = ["TimeoutError", "AbortError"].includes(error?.name)
        ? "timeout"
        : reason;
      retryAt = now() + backoff * 1000;
      return failed();
    }
  }
  return {
    async getFlights() {
      if (
        !lastReason &&
        snapshot &&
        now() - Date.parse(snapshot.fetchedAt) < interval * 1000
      )
        return response("live", null, snapshot);
      if (now() < retryAt) return failed();
      if (!pending)
        pending = refresh().finally(() => {
          pending = null;
        });
      return pending;
    },
  };
}

```

## backend/src/services/seed.js

```javascript
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

```

## backend/src/services/tracking.js

```javascript
// Official FR24 REST integration. No token, payload or provider error is logged.
// The demo flight database is deliberately not read or modified by this service.
export const TRACKING_AIRPORT = Object.freeze({
  iata: "OUD",
  icao: "GMFO",
  name: "Oujda-Angads",
  lat: 34.786111,
  lon: -1.925556,
});
const ENDPOINT =
  "https://fr24api.flightradar24.com/api/live/flight-positions/full";
const DEFAULT_LIMIT = 20;
const MAX_STALE_MS = 5 * 60 * 1000;

function text(value, length = 64) {
  return typeof value === "string"
    ? value.trim().slice(0, length) || null
    : null;
}
function number(value, min, max) {
  return typeof value === "number" &&
    Number.isFinite(value) &&
    value >= min &&
    value <= max
    ? value
    : null;
}
function date(value) {
  if (typeof value !== "string" || !value.trim()) return null;
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? new Date(timestamp).toISOString() : null;
}
function normalize(record, mode) {
  if (!record || typeof record !== "object") return null;
  const id = text(record.fr24_id);
  const latitude = number(record.lat, -90, 90);
  const longitude = number(record.lon, -180, 180);
  const positionAt = date(record.timestamp);
  if (
    !id ||
    !/^[a-z\d_-]+$/i.test(id) ||
    latitude === null ||
    longitude === null ||
    !positionAt
  )
    return null;
  const origin = text(record.orig_iata, 4) || text(record.orig_icao, 4);
  const destination = text(record.dest_iata, 4) || text(record.dest_icao, 4);
  const inbound =
    record.dest_icao === TRACKING_AIRPORT.icao ||
    record.dest_iata === TRACKING_AIRPORT.iata;
  const outbound =
    record.orig_icao === TRACKING_AIRPORT.icao ||
    record.orig_iata === TRACKING_AIRPORT.iata;
  // Sandbox responses ignore the airport filter: keep them, explicitly marked sandbox.
  if (mode === "live" && !inbound && !outbound) return null;
  return {
    id,
    number: text(record.flight),
    callsign: text(record.callsign),
    registration: text(record.reg),
    aircraft: text(record.type),
    origin,
    destination,
    direction: inbound ? "arrival" : outbound ? "departure" : "other",
    latitude,
    longitude,
    heading: number(record.track, 0, 360),
    altitudeFeet: number(record.alt, -2000, 100000),
    speedKnots: number(record.gspeed, 0, 2000),
    positionAt,
    estimatedArrival: date(record.eta),
  };
}

export function createTrackingService(settings = {}, dependencies = {}) {
  const fetchImpl = dependencies.fetchImpl || globalThis.fetch;
  const now = dependencies.now || Date.now;
  const mode = settings.mode || "disabled";
  const token = typeof settings.token === "string" ? settings.token.trim() : "";
  const seconds = Number(settings.refreshSeconds);
  const refreshSeconds = Number.isFinite(seconds)
    ? Math.min(300, Math.max(60, Math.floor(seconds)))
    : 60;
  const timeoutMs = Number.isFinite(settings.timeoutMs)
    ? Math.max(10, Math.min(10000, settings.timeoutMs))
    : 10000;
  const requestedLimit = Number(settings.limit);
  const limit = Number.isFinite(requestedLimit)
    ? Math.max(1, Math.min(300, Math.floor(requestedLimit)))
    : DEFAULT_LIMIT;
  let snapshot = null;
  let pending = null;
  let retryAt = 0;
  let lastReason = null;

  function response(status, reason = null, source = null) {
    const timestamp = now();
    return {
      provider: "flightradar24",
      status,
      mode: ["live", "sandbox"].includes(mode) ? mode : "disabled",
      reason,
      airport: { ...TRACKING_AIRPORT },
      fetchedAt: source?.fetchedAt || null,
      refreshAfterSeconds: Math.max(
        refreshSeconds,
        Math.ceil((retryAt - timestamp) / 1000),
      ),
      limit,
      truncated: source?.truncated || false,
      flights: (source?.flights || []).map((flight) => ({
        ...flight,
        positionStale:
          status === "stale" ||
          timestamp - Date.parse(flight.positionAt) > 120000 ||
          Date.parse(flight.positionAt) > timestamp + 60000,
      })),
    };
  }
  function failureResponse() {
    if (snapshot && now() - Date.parse(snapshot.fetchedAt) <= MAX_STALE_MS)
      return response("stale", lastReason, snapshot);
    snapshot = null;
    return response("unavailable", lastReason);
  }
  async function refresh() {
    try {
      const url = new URL(ENDPOINT);
      url.searchParams.set("airports", "both:" + TRACKING_AIRPORT.icao);
      url.searchParams.set("limit", String(limit));
      const upstream = await fetchImpl(url.toString(), {
        headers: {
          Accept: "application/json",
          "Accept-Version": "v1",
          Authorization: "Bearer " + token,
        },
        signal: AbortSignal.timeout(timeoutMs),
        redirect: "error",
      });
      if (!upstream.ok) {
        const reason = [401, 403].includes(upstream.status)
          ? "credentials"
          : [402, 429].includes(upstream.status)
            ? "quota"
            : "provider_error";
        const retry = Number(upstream.headers.get("retry-after"));
        const backoff =
          reason === "credentials" || reason === "quota" ? 300 : refreshSeconds;
        throw Object.assign(new Error("Tracking provider unavailable"), {
          reason,
          retrySeconds:
            Number.isFinite(retry) && retry > 0
              ? Math.min(3600, Math.max(backoff, retry))
              : backoff,
        });
      }
      const body = await upstream.json();
      if (!body || !Array.isArray(body.data) || body.data.length > 500)
        throw new Error("Invalid tracking response");
      const flights = [];
      const ids = new Set();
      for (const row of body.data.slice(0, limit)) {
        const flight = normalize(row, mode);
        if (flight && !ids.has(flight.id)) {
          flights.push(flight);
          ids.add(flight.id);
        }
      }
      // Distinguish corrupt responses from a real, successful empty result.
      if (
        body.data.length &&
        !body.data.some((row) => normalize(row, "sandbox"))
      )
        throw new Error("Invalid tracking records");
      snapshot = {
        fetchedAt: new Date(now()).toISOString(),
        flights,
        truncated: body.data.length >= limit,
      };
      lastReason = null;
      retryAt = 0;
      return response(mode, null, snapshot);
    } catch (error) {
      lastReason =
        error.reason ||
        (["TimeoutError", "AbortError"].includes(error.name)
          ? "timeout"
          : "provider_error");
      retryAt = now() + (error.retrySeconds || refreshSeconds) * 1000;
      return failureResponse();
    }
  }
  return {
    async getFlights() {
      if (!["live", "sandbox", "disabled"].includes(mode))
        return response("not_configured", "configuration");
      if (mode === "disabled" || !token)
        return response(
          "not_configured",
          mode === "disabled" ? null : "credentials",
        );
      if (
        !lastReason &&
        snapshot &&
        now() - Date.parse(snapshot.fetchedAt) < refreshSeconds * 1000
      )
        return response(mode, null, snapshot);
      if (now() < retryAt) return failureResponse();
      // All visitors share one provider request and one snapshot per Node process.
      if (!pending)
        pending = refresh().finally(() => {
          pending = null;
        });
      return pending;
    },
  };
}

```

## backend/src/services/trackingProvider.js

```javascript
import { createTrackingService, TRACKING_AIRPORT } from "./tracking.js";
import { createAdsbTrackingService } from "./adsbTracking.js";
import { createOpenSkyTrackingService } from "./openSkyTracking.js";

export function createTracker(settings = {}, dependencies = {}) {
  const provider = settings.provider ?? "opensky";
  if (provider === "opensky")
    return createOpenSkyTrackingService(settings.opensky, dependencies);
  if (provider === "adsb_lol")
    return createAdsbTrackingService(settings.adsb, dependencies);
  if (provider === "flightradar24") {
    const service = createTrackingService(settings.fr24, dependencies);
    return {
      async getFlights() {
        return {
          ...(await service.getFlights()),
          scope: "airport_routes",
          radiusNm: null,
        };
      },
    };
  }
  return {
    async getFlights() {
      return {
        provider: "none",
        scope: null,
        radiusNm: null,
        status: "not_configured",
        mode: "disabled",
        reason: provider === "disabled" ? null : "configuration",
        airport: { ...TRACKING_AIRPORT },
        fetchedAt: null,
        refreshAfterSeconds: 300,
        limit: 0,
        truncated: false,
        flights: [],
      };
    },
  };
}

```

## backend/src/utils/helpers.js

```javascript
import { randomUUID, createHash } from "node:crypto";
export const id = () => randomUUID();
export const sha = (v) => createHash("sha256").update(v).digest("hex");
export const fail = (status, message) =>
  Object.assign(new Error(message), { status });
export const asyncRoute = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
export const pick = (value, lang) => value?.[lang] || value?.fr || "";
export function normalize(v) {
  return v
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[أإآ]/g, "ا")
    .replace(/ة/g, "ه");
}
export function sentiment(v) {
  const t = normalize(v);
  const positive = [
    "merci",
    "excellent",
    "satisfait",
    "bravo",
    "thank",
    "great",
    "helpful",
    "شكرا",
    "ممتاز",
    "راض",
  ];
  const negative = [
    "retard",
    "perdu",
    "plainte",
    "mauvais",
    "probleme",
    "insatisfait",
    "delay",
    "lost",
    "bad",
    "problem",
    "تاخير",
    "ضائع",
    "سيئ",
    "مشكل",
  ];
  let score = 0;
  positive.forEach((w) => {
    if (t.includes(w)) score++;
  });
  negative.forEach((w) => {
    if (t.includes(w)) score--;
  });
  return score > 0 ? "positive" : score < 0 ? "negative" : "neutral";
}

```

## backend/src/utils/moroccoTime.js

```javascript
// IANA Africa/Casablanca returns to UTC at 02:00 local (+01) on 2026-09-20.
// Node/ICU and embedded PostgreSQL can ship older timezone data, so apply the
// same transition explicitly in formatting and SQL, retaining historical rules.
// Source: https://data.iana.org/time-zones/tzdb/africa (Africa/Casablanca).
const MOROCCO_UTC_START = "2026-09-20T01:00:00Z";
const moroccoUtcStartMs = Date.parse(MOROCCO_UTC_START);

export function moroccoTimeZone(value) {
  return new Date(value).getTime() >= moroccoUtcStartMs
    ? "UTC"
    : "Africa/Casablanca";
}

// Only internal constants are interpolated; filter values stay SQL parameters.
export const MOROCCO_SCHEDULED_CLOCK_SQL = `TO_CHAR(
  CASE WHEN scheduled_at >= TIMESTAMPTZ '${MOROCCO_UTC_START}'
    THEN scheduled_at AT TIME ZONE 'UTC'
    ELSE scheduled_at AT TIME ZONE 'Africa/Casablanca'
  END, 'HH24:MI')`;

```

## backend/tests/adsbTracking.test.js

```javascript
import test from "node:test";
import assert from "node:assert/strict";
import { createAdsbTrackingService as createRawAdsbTrackingService } from "../src/services/adsbTracking.js";

const createAdsbTrackingService = (settings = {}, dependencies = {}) =>
  createRawAdsbTrackingService(
    { contact: "operator@example.test", ...settings },
    dependencies,
  );
const start = Date.parse("2026-10-08T12:00:00Z");
const aircraft = (overrides = {}) => ({
  hex: "ABC123",
  flight: " RAM123  ",
  r: "CN-TEST",
  t: "B738",
  lat: 34.8,
  lon: -1.9,
  alt_baro: 22000,
  gs: 350.5,
  track: 130,
  seen_pos: 10.5,
  ...overrides,
});
const body = (ac = [], overrides = {}) => ({
  now: start,
  msg: "No error",
  ac,
  ...overrides,
});
const json = (data, status = 200, headers = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json", ...headers },
  });
const serviceFor = (data, settings = {}) =>
  createAdsbTrackingService(settings, {
    now: () => start,
    fetchImpl: async () => json(data),
  });

test("ADSB uses the official point endpoint without credentials, normalizes and shares concurrent requests/cache", async () => {
  let clock = start,
    calls = 0;
  const tracker = createAdsbTrackingService(
    {},
    {
      now: () => clock,
      fetchImpl: async (url, options) => {
        calls++;
        assert.equal(
          url,
          "https://api.adsb.lol/v2/point/34.786111/-1.925556/150",
        );
        assert.deepEqual(options.headers, {
          Accept: "application/json",
          "User-Agent": "OujdaSmart/1.0 (+mailto:operator@example.test)",
        });
        assert.equal(options.redirect, "error");
        assert.ok(options.signal instanceof AbortSignal);
        await new Promise((resolve) => setTimeout(resolve, 10));
        return json(body([aircraft()], { now: clock }));
      },
    },
  );
  const results = await Promise.all(
    Array.from({ length: 25 }, () => tracker.getFlights()),
  );
  assert.equal(calls, 1);
  const result = results[0];
  assert.equal(result.provider, "adsb_lol");
  assert.equal(result.scope, "area");
  assert.equal(result.mode, "live");
  assert.equal(result.status, "live");
  assert.equal(result.radiusNm, 150);
  assert.equal(result.flights[0].id, "abc123");
  assert.equal(result.flights[0].callsign, "RAM123");
  assert.equal(result.flights[0].number, null);
  assert.equal(result.flights[0].origin, null);
  assert.equal(result.flights[0].destination, null);
  assert.equal(result.flights[0].estimatedArrival, null);
  assert.equal(result.flights[0].direction, "other");
  assert.equal(result.flights[0].positionAt, "2026-10-08T11:59:49.500Z");
  assert.equal(result.flights[0].altitudeFeet, 22000);
  assert.equal(result.flights[0].speedKnots, 350.5);
  assert.equal(result.flights[0].positionStale, false);
  result.flights[0].callsign = "caller mutation";
  assert.equal((await tracker.getFlights()).flights[0].callsign, "RAM123");
  clock += 59999;
  await tracker.getFlights();
  assert.equal(calls, 1);
  clock++;
  await tracker.getFlights();
  assert.equal(calls, 2);
});

test("ADSB drops unusable, distant and expired positions, keeps the freshest duplicate and handles ground/non-ICAO targets", async () => {
  const result = await serviceFor(
    body([
      aircraft(),
      aircraft({ hex: "abc123", seen_pos: 5 }),
      aircraft({ hex: "~DEF456", alt_baro: "ground", gs: 0 }),
      aircraft({ hex: "aaaaaa", lat: 80 }),
      aircraft({ hex: "bbbbbb", lat: 200 }),
      aircraft({ hex: "cccccc", seen_pos: 301 }),
      aircraft({ hex: "dddddd", seen_pos: undefined }),
      aircraft({ hex: "eeeeee", seen_pos: -1 }),
      aircraft({
        hex: "ffffff",
        lat: undefined,
        lon: undefined,
        lastPosition: { lat: 34.8, lon: -1.9 },
      }),
      aircraft({ hex: "bad-id" }),
      aircraft({ hex: "123456", lat: "34.8" }),
    ]),
  ).getFlights();
  assert.equal(result.status, "live");
  assert.deepEqual(
    result.flights.map((flight) => flight.id),
    ["abc123", "~def456"],
  );
  assert.equal(result.flights[0].positionAt, "2026-10-08T11:59:55.000Z");
  assert.equal(result.flights[1].onGround, true);
  assert.equal(result.flights[1].altitudeFeet, null);
  assert.equal(result.flights[1].speedKnots, 0);
});

test("ADSB validates provider timestamp and explicit errors while allowing legitimate empty responses", async () => {
  assert.equal((await serviceFor(body()).getFlights()).status, "live");
  for (const invalid of [
    {},
    body([], { now: undefined }),
    body([], { now: start / 1000 }),
    body([], { now: start - 120001 }),
    body([], { now: start + 120001 }),
    body([], { now: String(start) }),
    body([], { ac: null }),
    body([], { msg: "Upstream failure private details" }),
    body([], { error: "failure" }),
  ]) {
    const result = await serviceFor(invalid).getFlights();
    assert.equal(result.status, "unavailable");
    assert.equal(result.reason, "provider_error");
    assert.deepEqual(result.flights, []);
    assert.equal(JSON.stringify(result).includes("private details"), false);
  }
  const future = await serviceFor(
    body([aircraft({ seen_pos: 0 })], { now: start + 90000 }),
  ).getFlights();
  assert.equal(future.flights[0].positionStale, true);
  const old = await serviceFor(
    body([aircraft({ seen_pos: 121 })]),
  ).getFlights();
  assert.equal(old.flights[0].positionStale, true);
});

test("ADSB failure backoff retains labelled cache briefly and removes expired positions and snapshots", async () => {
  let clock = start,
    calls = 0;
  const tracker = createAdsbTrackingService(
    {},
    {
      now: () => clock,
      fetchImpl: async () =>
        ++calls === 1
          ? json(body([aircraft()]))
          : json({ msg: "provider internals" }, 429, { "retry-after": "400" }),
    },
  );
  await tracker.getFlights();
  clock += 61000;
  const stale = await tracker.getFlights();
  assert.equal(stale.status, "stale");
  assert.equal(stale.reason, "quota");
  assert.equal(stale.refreshAfterSeconds, 400);
  assert.equal(stale.flights[0].positionStale, true);
  assert.equal(stale.fetchedAt, new Date(start).toISOString());
  assert.equal(JSON.stringify(stale).includes("provider internals"), false);
  clock = start + 295000;
  const agedPositions = await tracker.getFlights();
  assert.equal(agedPositions.status, "stale");
  assert.deepEqual(agedPositions.flights, []);
  clock = start + 300001;
  const expired = await tracker.getFlights();
  assert.equal(expired.status, "unavailable");
  assert.equal(expired.fetchedAt, null);
  assert.equal(calls, 2);
  clock = start + 461001;
  await tracker.getFlights();
  assert.equal(calls, 3);
});

test("ADSB handles numeric/date Retry-After with bounded fallback and never retries during backoff", async () => {
  for (const [retry, expected] of [
    ["120", 300],
    [new Date(start + 450000).toUTCString(), 450],
    ["99999", 3600],
    ["nonsense", 300],
    ["", 300],
  ]) {
    let calls = 0;
    const tracker = createAdsbTrackingService(
      {},
      {
        now: () => start,
        fetchImpl: async () => {
          calls++;
          return json({}, 429, { "retry-after": retry });
        },
      },
    );
    const result = await tracker.getFlights();
    assert.equal(result.refreshAfterSeconds, expected);
    await tracker.getFlights();
    assert.equal(calls, 1);
  }
});

test("ADSB bounds configuration and caps only valid unique flights", async () => {
  for (const [settings, radius, interval] of [
    [{ radiusNm: 2, refreshSeconds: 3 }, 25, 60],
    [{ radiusNm: 999, refreshSeconds: 999 }, 250, 300],
    [{ radiusNm: "72.9", refreshSeconds: "99.9" }, 72, 99],
    [{ radiusNm: "", refreshSeconds: "" }, 150, 60],
  ]) {
    const result = await serviceFor(body(), settings).getFlights();
    assert.equal(result.radiusNm, radius);
    assert.equal(result.refreshAfterSeconds, interval);
  }
  const result = await serviceFor(
    body(
      Array.from({ length: 501 }, (_, index) =>
        aircraft({
          hex: index.toString(16).padStart(6, "0"),
        }),
      ),
    ),
  ).getFlights();
  assert.equal(result.limit, 500);
  assert.equal(result.flights.length, 500);
  assert.equal(result.truncated, true);
  const duplicates = await serviceFor(
    body(Array.from({ length: 501 }, () => aircraft())),
  ).getFlights();
  assert.equal(duplicates.flights.length, 1);
  assert.equal(duplicates.truncated, false);
});

test("ADSB timeout and malformed JSON become safe unavailable responses", async () => {
  const tracker = createAdsbTrackingService(
    { timeoutMs: 10 },
    {
      now: () => start,
      fetchImpl: async (_url, options) => {
        await new Promise((resolve) => setTimeout(resolve, 30));
        options.signal.throwIfAborted();
        return json(body());
      },
    },
  );
  assert.equal((await tracker.getFlights()).reason, "timeout");
  const invalidJson = createAdsbTrackingService(
    {},
    {
      now: () => start,
      fetchImpl: async () => new Response("private upstream response"),
    },
  );
  const result = await invalidJson.getFlights();
  assert.equal(result.status, "unavailable");
  assert.equal(result.reason, "provider_error");
  assert.equal(JSON.stringify(result).includes("private upstream"), false);
});

test("ADSB requires a valid server contact and never publishes it", async () => {
  let calls = 0;
  for (const contact of [
    undefined,
    "",
    "not-email",
    "a@b.test\r\nX: injected",
  ]) {
    const t = createRawAdsbTrackingService(
      { contact },
      {
        fetchImpl: async () => {
          calls++;
          throw new Error("Network forbidden");
        },
      },
    );
    const result = await t.getFlights();
    assert.equal(result.status, "not_configured");
    assert.equal(result.reason, "contact_required");
  }
  assert.equal(calls, 0);
  const t = createAdsbTrackingService(
    {},
    { now: () => start, fetchImpl: async () => json(body()) },
  );
  assert.ok(
    !JSON.stringify(await t.getFlights()).includes("operator@example.test"),
  );
  const denied = createAdsbTrackingService(
    {},
    { now: () => start, fetchImpl: async () => json({}, 403) },
  );
  const r = await denied.getFlights();
  assert.equal(r.reason, "access_denied");
  assert.equal(r.refreshAfterSeconds, 300);
});

```

## backend/tests/integration.test.js

```javascript
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { randomBytes } from "node:crypto";
const dataDir = await fs.mkdtemp(path.join(os.tmpdir(), "oujda-api-test-"));
process.env.DB_MODE = "embedded";
process.env.DATA_DIR = dataDir;
process.env.SEED_DEMO = "true";
process.env.JWT_SECRET = randomBytes(48).toString("hex");
process.env.ADMIN_PASSWORD = randomBytes(20).toString("base64url");
process.env.DEMO_PASSWORD = randomBytes(20).toString("base64url");
process.env.AI_API_KEY = "";
process.env.TRACKING_PROVIDER = "disabled";
process.env.FR24_MODE = "disabled";
process.env.FR24_API_TOKEN = "";
const { default: app } = await import("../src/app.js");
const { initialize, close, query, rows } = await import("../src/config/db.js");
const { seed } = await import("../src/services/seed.js");
await initialize();
await seed({ writeFiles: false });
const server = await new Promise((resolve) => {
  const s = app.listen(0, "127.0.0.1", () => resolve(s));
});
const base = "http://127.0.0.1:" + server.address().port + "/api";
function client() {
  let cookie = "";
  return {
    get cookie() {
      return cookie;
    },
    async req(
      url,
      method = "GET",
      body,
      expected = 200,
      origin = "http://localhost:3102",
    ) {
      const r = await fetch(base + url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Origin: origin,
          Cookie: cookie,
        },
        body: method === "GET" ? undefined : JSON.stringify(body || {}),
      });
      const set = r.headers.getSetCookie();
      if (set.length) {
        const values = Object.fromEntries(
          cookie
            .split("; ")
            .filter(Boolean)
            .map((s) => s.split("=")),
        );
        set.forEach((v) => {
          const [k, val] = v.split(";")[0].split("=");
          values[k] = val;
        });
        cookie = Object.entries(values)
          .map(([k, v]) => k + "=" + v)
          .join("; ");
      }
      const d = await r.json();
      assert.equal(r.status, expected, url + ": " + JSON.stringify(d));
      return d;
    },
  };
}
test(
  "Parcours complets, contrôle des accès et cohérence des données",
  { timeout: 60000 },
  async () => {
    const guest = client(),
      user = client(),
      other = client(),
      admin = client();
    await guest.req("/admin/dashboard", "GET", null, 401);
    const tracking = await guest.req("/tracking/flights");
    assert.equal(tracking.status, "not_configured");
    assert.equal(tracking.flights.length, 0);
    await guest.req("/tracking/flights?direction=invalid", "GET", null, 400);
    await guest.req("/tracking/flights?airport=OTHER", "GET", null, 400);
    const flights = await guest.req("/flights");
    assert.equal(flights.length, 12);
    assert.equal((await guest.req("/services")).length, 10);
    assert.equal((await guest.req("/faq")).length, 10);
    assert.equal((await guest.req("/flights?q=AT700")).length, 1);
    assert.ok(
      (await guest.req("/flights?direction=arrival")).every(
        (f) => f.direction === "arrival",
      ),
    );
    assert.equal(
      (await guest.req("/flights?q=" + encodeURIComponent("' OR 1=1 --")))
        .length,
      0,
    );
    await guest.req(
      "/auth/register",
      "POST",
      { name: "Test", email: "short@example.test", password: "short" },
      400,
    );
    await user.req(
      "/auth/register",
      "POST",
      {
        name: "Passager test",
        email: "test-a@example.test",
        password: "TestPasswordLong!2026",
        role: "ADMIN",
      },
      201,
    );
    assert.equal((await user.req("/auth/me")).role, "USER");
    await other.req(
      "/auth/register",
      "POST",
      {
        name: "Autre test",
        email: "test-b@example.test",
        password: "TestPasswordLong!2026",
      },
      201,
    );
    await user.req("/admin/dashboard", "GET", null, 403);
    await guest.req(
      "/auth/login",
      "POST",
      { email: "test-a@example.test", password: "wrong" },
      401,
    );
    await user.req("/favorites/" + flights[0].id, "POST");
    assert.equal((await user.req("/favorites")).length, 1);
    await user.req("/favorites/" + flights[0].id, "POST");
    assert.equal((await user.req("/favorites")).length, 1);
    assert.equal((await other.req("/favorites")).length, 0);
    await user.req("/favorites/" + flights[0].id, "DELETE");
    assert.equal((await user.req("/favorites")).length, 0);
    const complaint = await user.req(
      "/complaints",
      "POST",
      {
        name: "Test",
        email: "test-a@example.test",
        category: "parking",
        subject: "Test parking",
        message: "Le parking est difficile à trouver dans le prototype.",
        priority: "NORMAL",
      },
      201,
    );
    await guest.req(
      "/complaints/track",
      "POST",
      {
        reference: complaint.reference,
        email: "test-a@example.test",
        accessCode: "incorrect-code",
      },
      404,
    );
    assert.equal(
      (
        await guest.req("/complaints/track", "POST", {
          reference: complaint.reference,
          email: "test-a@example.test",
          accessCode: complaint.accessCode,
        })
      ).status,
      "RECEIVED",
    );
    assert.equal((await other.req("/complaints/mine")).length, 0);
    const chat = await user.req("/chat", "POST", {
      message: "Où se trouve le parking ?",
      language: "fr",
    });
    assert.equal(chat.source, "knowledge_base");
    assert.equal(chat.topic, "parking");
    assert.deepEqual(
      (await user.req("/chat/" + chat.sessionId)).map((m) => m.role),
      ["user", "assistant"],
    );
    await other.req("/chat/" + chat.sessionId, "GET", null, 404);
    const ar = await guest.req("/chat", "POST", {
      message: "أين موقف السيارات؟",
      language: "ar",
    });
    assert.match(ar.text, /[\u0600-\u06ff]/);
    assert.equal(ar.topic, "parking");
    const flightAnswer = await guest.req("/chat", "POST", {
      message: "Mon vol AT700 est-il retardé ?",
      language: "fr",
      sessionId: ar.sessionId,
    });
    assert.equal(flightAnswer.source, "demo_flight");
    assert.match(flightAnswer.text, /fictif/);
    const unknown = await guest.req("/chat", "POST", {
      message: "xyzxyz inconnu",
      language: "fr",
    });
    assert.equal(unknown.source, "fallback");
    await user.req("/complaints", "POST", {}, 403, "https://evil.invalid");
    await admin.req("/auth/login", "POST", {
      email: "admin@oujda-demo.test",
      password: process.env.ADMIN_PASSWORD,
    });
    const stats = await admin.req("/admin/dashboard");
    assert.equal(stats.counts.users, 4);
    assert.ok(stats.counts.complaints >= 6);
    const f = {
      number: "ZZ999",
      airline: "Compagnie Test",
      city: "Ville Test",
      direction: "departure",
      scheduled_at: new Date().toISOString(),
      estimated_at: new Date().toISOString(),
      gate: "9",
      status: "ON_TIME",
      terminal: "Test",
    };
    const created = await admin.req("/admin/flights", "POST", f, 201);
    await admin.req("/admin/flights/" + created.id, "PUT", {
      ...f,
      status: "DELAYED",
    });
    assert.equal((await guest.req("/flights/" + created.id)).status, "DELAYED");
    await admin.req("/admin/flights/" + created.id, "DELETE");
    await guest.req("/flights/" + created.id, "GET", null, 404);
    const c = (await user.req("/complaints/mine"))[0];
    await admin.req(
      "/admin/complaints/" + c.id,
      "PUT",
      { status: "CLOSED", response: "" },
      400,
    );
    await admin.req("/admin/complaints/" + c.id, "PUT", {
      status: "IN_PROGRESS",
      response: "Nous examinons votre demande.",
    });
    assert.equal((await user.req("/complaints/mine"))[0].status, "IN_PROGRESS");
    const tr = {
      fr: "Test de connaissance",
      en: "Knowledge test",
      ar: "اختبار المعرفة",
    };
    const kb = await admin.req(
      "/admin/knowledge",
      "POST",
      {
        topic: "services",
        title: tr,
        content: tr,
        keywords: "uniqueapifaq",
        source: "Test",
      },
      201,
    );
    assert.equal(
      (
        await user.req("/chat", "POST", {
          message: "uniqueapifaq",
          language: "fr",
        })
      ).text,
      tr.fr,
    );
    await admin.req("/admin/knowledge/" + kb.id, "DELETE");
    const cookie = user.cookie;
    await user.req("/auth/logout", "POST");
    await user.req("/auth/me", "GET", null, 401);
    assert.equal(
      (await fetch(base + "/auth/me", { headers: { Cookie: cookie } })).status,
      401,
    );
    assert.ok((await rows("SELECT * FROM audit_log")).length >= 5);
  },
);
test("Adaptateur LLM remplaçable et secours local en cas d’échec", async () => {
  const { createServer } = await import("node:http");
  const { answer } = await import("../src/services/assistant.js");
  let failing = false,
    received;
  const provider = createServer(async (req, res) => {
    let body = "";
    for await (const chunk of req) body += chunk;
    received = {
      authorization: req.headers.authorization,
      data: JSON.parse(body),
    };
    res.writeHead(failing ? 503 : 200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify(
        failing
          ? { error: "Unavailable" }
          : {
              choices: [
                { message: { content: "Réponse du fournisseur de test." } },
              ],
            },
      ),
    );
  });
  await new Promise((resolve) => provider.listen(0, "127.0.0.1", resolve));
  process.env.AI_ENDPOINT =
    "http://127.0.0.1:" + provider.address().port + "/chat";
  process.env.AI_API_KEY = "test-only-key";
  process.env.AI_MODEL = "test-model";
  try {
    const response = await answer("xyzxyz sujet inconnu", "fr");
    assert.equal(response.source, "llm");
    assert.equal(response.text, "Réponse du fournisseur de test.");
    assert.equal(received.authorization, "Bearer test-only-key");
    assert.equal(received.data.model, "test-model");
    failing = true;
    assert.equal(
      (await answer("xyzxyz sujet inconnu", "fr")).source,
      "fallback",
    );
    assert.equal((await answer("parking", "fr")).source, "knowledge_base");
  } finally {
    process.env.AI_API_KEY = "";
    await new Promise((resolve) => provider.close(resolve));
  }
});
test("La limite bcrypt porte sur les octets UTF-8", async () => {
  const c = client();
  await c.req(
    "/auth/register",
    "POST",
    {
      name: "Test unicode",
      email: "unicode@example.test",
      password: "é".repeat(40),
    },
    400,
  );
});

test.after(async () => {
  await new Promise((r) => server.close(r));
  await close();
  const target = path.resolve(dataDir);
  assert.equal(path.dirname(target), path.resolve(os.tmpdir()));
  assert.ok(path.basename(target).startsWith("oujda-api-test-"));
  await fs.rm(target, { recursive: true, force: true });
});

```

## backend/tests/moroccoTime.test.js

```javascript
import test from "node:test";
import assert from "node:assert/strict";
import { PGlite } from "@electric-sql/pglite";
import {
  moroccoTimeZone,
  MOROCCO_SCHEDULED_CLOCK_SQL,
} from "../src/utils/moroccoTime.js";

const clock = (value) =>
  new Date(value).toLocaleTimeString("en-GB", {
    timeZone: moroccoTimeZone(value),
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });

test("Morocco formatting applies the exact 2026 transition and retains historical Ramadan rules", () => {
  assert.equal(clock("2026-09-20T00:59:59Z"), "01:59");
  assert.equal(clock("2026-09-20T01:00:00Z"), "01:00");
  assert.equal(clock("2026-09-29T08:15:00Z"), "08:15");
  assert.equal(clock("2026-01-10T08:15:00Z"), "09:15");
  assert.equal(clock("2026-02-20T08:15:00Z"), "08:15");
});

test("The public after filter excludes AT700 at 08:15 and includes FR713 at 09:25", async () => {
  // No application DB import or data directory: this database exists only in RAM.
  const db = new PGlite();
  try {
    const result = await db.query(
      `WITH flights (number, scheduled_at) AS (VALUES
        ('AT700', TIMESTAMPTZ '2026-09-29T08:15:00Z'),
        ('AT830', TIMESTAMPTZ '2026-09-29T08:30:00Z'),
        ('FR713', TIMESTAMPTZ '2026-09-29T09:25:00Z')
      )
      SELECT number FROM flights
      WHERE ${MOROCCO_SCHEDULED_CLOCK_SQL} >= $1
      ORDER BY scheduled_at`,
      ["08:30"],
    );
    assert.deepEqual(result.rows.map((flight) => flight.number), [
      "AT830",
      "FR713",
    ]);

    const transition = await db.query(
      `WITH flights (scheduled_at) AS (VALUES
        (TIMESTAMPTZ '2026-09-20T00:59:59Z'),
        (TIMESTAMPTZ '2026-09-20T01:00:00Z'),
        (TIMESTAMPTZ '2026-01-10T08:15:00Z'),
        (TIMESTAMPTZ '2026-02-20T08:15:00Z')
      )
      SELECT ${MOROCCO_SCHEDULED_CLOCK_SQL} AS local_time
      FROM flights ORDER BY scheduled_at`,
    );
    assert.deepEqual(transition.rows.map((flight) => flight.local_time), [
      "09:15",
      "08:15",
      "01:59",
      "01:00",
    ]);
  } finally {
    await db.close();
  }
});

```

## backend/tests/openSkyTracking.test.js

```javascript
import test from "node:test";
import assert from "node:assert/strict";
import { createOpenSkyTrackingService } from "../src/services/openSkyTracking.js";
import { createTracker } from "../src/services/trackingProvider.js";
const start = Date.parse("2026-10-08T20:00:00Z");
const row = (changes = {}) =>
  Object.assign(
    [
      "abc123",
      " DEMO12 ",
      "Test",
      start / 1000 - 10,
      start / 1000,
      -1.9,
      34.8,
      3048,
      false,
      100,
      120,
      0,
      null,
      3100,
      "1000",
      false,
      0,
    ],
    changes,
  );
const body = (states = [row()], time = start / 1000) => ({ time, states });
const json = (data, status = 200, headers = {}) =>
  new Response(JSON.stringify(data), { status, headers });
test("OpenSky anonymous fixed request, unit conversion, no invented routes, singleflight and five-minute cache", async () => {
  let clock = start,
    calls = 0;
  const service = createOpenSkyTrackingService(
    { refreshSeconds: 1 },
    {
      now: () => clock,
      fetchImpl: async (url, options) => {
        calls++;
        const parsed = new URL(url);
        assert.equal(parsed.origin, "https://opensky-network.org");
        assert.equal(parsed.pathname, "/api/states/all");
        const q = parsed.searchParams;
        assert.ok(
          (q.get("lamax") - q.get("lamin")) *
            (q.get("lomax") - q.get("lomin")) <=
            25,
        );
        assert.deepEqual(options.headers, { Accept: "application/json" });
        assert.equal(options.redirect, "error");
        assert.ok(options.signal instanceof AbortSignal);
        await new Promise((resolve) => setTimeout(resolve, 10));
        return json(body([row({ 3: clock / 1000 - 10 })], clock / 1000));
      },
    },
  );
  const results = await Promise.all(
    Array.from({ length: 20 }, () => service.getFlights()),
  );
  assert.equal(calls, 1);
  const result = results[0],
    f = result.flights[0];
  assert.equal(result.provider, "opensky");
  assert.equal(result.radiusNm, 120);
  assert.equal(result.scope, "area");
  assert.equal(result.status, "live");
  assert.equal(result.refreshAfterSeconds, 300);
  assert.equal(f.callsign, "DEMO12");
  assert.equal(f.altitudeFeet, 10000);
  assert.ok(Math.abs(f.speedKnots - 194.38444924406) < 0.00001);
  for (const key of [
    "number",
    "registration",
    "aircraft",
    "origin",
    "destination",
    "estimatedArrival",
  ])
    assert.equal(f[key], null);
  assert.equal(f.direction, "other");
  assert.equal(f.positionStale, false);
  f.callsign = "mutated";
  assert.equal((await service.getFlights()).flights[0].callsign, "DEMO12");
  clock += 299000;
  assert.equal((await service.getFlights()).flights.length, 0);
  assert.equal(calls, 1);
  clock += 1000;
  assert.equal((await service.getFlights()).flights.length, 1);
  assert.equal(calls, 2);
});
test("OpenSky filters invalid, old, future and distant positions and keeps freshest duplicates", async () => {
  const records = [
    row(),
    row({ 3: start / 1000 - 5 }),
    row({ 0: "bcd123", 7: null, 8: true, 9: 0 }),
    row({ 0: "ccc123", 5: 0.5, 6: 37 }),
    row({ 0: "ddd123", 3: start / 1000 - 301 }),
    row({ 0: "eee123", 3: start / 1000 + 61 }),
    row({ 0: "fff123", 6: null }),
    row({ 0: "bad", 5: -1.9 }),
    row({ 0: "fff321", 6: "34.8" }),
    row({ 0: "aaaaaa", 3: null }),
  ];
  const service = createOpenSkyTrackingService(
    {},
    { now: () => start, fetchImpl: async () => json(body(records)) },
  );
  const result = await service.getFlights();
  assert.deepEqual(
    result.flights.map((f) => f.id),
    ["abc123", "bcd123"],
  );
  assert.equal(
    result.flights[0].positionAt,
    new Date(start - 5000).toISOString(),
  );
  assert.equal(result.flights[1].altitudeFeet, null);
  assert.equal(result.flights[1].speedKnots, 0);
  assert.equal(result.flights[1].onGround, true);
});
test("OpenSky distinguishes valid empty responses from malformed or expired payloads", async () => {
  for (const data of [body([]), body(null)]) {
    const service = createOpenSkyTrackingService(
      {},
      { now: () => start, fetchImpl: async () => json(data) },
    );
    const result = await service.getFlights();
    assert.equal(result.status, "live");
    assert.equal(result.flights.length, 0);
  }
  for (const data of [
    {},
    { time: start / 1000 },
    body({}, start / 1000),
    body([{}]),
    body([], start / 1000 - 121),
    body([], start / 1000 + 61),
    body([], String(start / 1000)),
  ]) {
    const service = createOpenSkyTrackingService(
      {},
      { now: () => start, fetchImpl: async () => json(data) },
    );
    const result = await service.getFlights();
    assert.equal(result.status, "unavailable");
    assert.equal(result.reason, "provider_error");
  }
});
test("OpenSky honors quota headers and never serves expired positions after a provider failure", async () => {
  let clock = start,
    calls = 0;
  const service = createOpenSkyTrackingService(
    {},
    {
      now: () => clock,
      fetchImpl: async () =>
        ++calls === 1
          ? json(body())
          : json({ error: "provider private details" }, 429, {
              "x-rate-limit-retry-after-seconds": "7200",
            }),
    },
  );
  await service.getFlights();
  clock += 300000;
  const failed = await service.getFlights();
  assert.equal(failed.status, "unavailable");
  assert.equal(failed.reason, "quota");
  assert.equal(failed.refreshAfterSeconds, 7200);
  assert.equal(failed.fetchedAt, null);
  assert.deepEqual(failed.flights, []);
  await service.getFlights();
  assert.equal(calls, 2);
  assert.ok(!JSON.stringify(failed).includes("private details"));
  clock += 7200000;
  await service.getFlights();
  assert.equal(calls, 3);
});
test("OpenSky access rejection, HTTP-date Retry-After, timeout and invalid JSON are safe", async () => {
  let calls = 0;
  const service = createOpenSkyTrackingService(
    {},
    {
      now: () => start,
      fetchImpl: async () => {
        calls++;
        return json({}, 403, {
          "retry-after": new Date(start + 600000).toUTCString(),
        });
      },
    },
  );
  const denied = await service.getFlights();
  assert.equal(denied.reason, "access_denied");
  assert.equal(denied.refreshAfterSeconds, 600);
  await service.getFlights();
  assert.equal(calls, 1);
  const timeout = createOpenSkyTrackingService(
    { timeoutMs: 10 },
    {
      fetchImpl: async (_url, options) => {
        await new Promise((r) => setTimeout(r, 30));
        options.signal.throwIfAborted();
      },
    },
  );
  assert.equal((await timeout.getFlights()).reason, "timeout");
  const invalid = createOpenSkyTrackingService(
    {},
    { now: () => start, fetchImpl: async () => new Response("private error") },
  );
  assert.equal((await invalid.getFlights()).reason, "provider_error");
});
test("Provider selection is explicit and disabled or invalid settings never contact an external service", async () => {
  let calls = 0;
  for (const provider of [
    "disabled",
    "wrong",
    "",
    "flightradar24",
    "adsb_lol",
  ]) {
    const tracker = createTracker(
      { provider },
      {
        fetchImpl: async () => {
          calls++;
          throw new Error("Unexpected network");
        },
      },
    );
    assert.equal((await tracker.getFlights()).status, "not_configured");
  }
  assert.equal(calls, 0);
  const tracker = createTracker(
    {},
    { now: () => start, fetchImpl: async () => json(body([])) },
  );
  assert.equal((await tracker.getFlights()).provider, "opensky");
});

```

## backend/tests/tracking.test.js

```javascript
import test from "node:test";
import assert from "node:assert/strict";
import { createTrackingService } from "../src/services/tracking.js";

const start = Date.parse("2026-10-01T14:00:00Z");
const fixture = (override = {}) => ({
  fr24_id: "abcd1234",
  flight: "TEST101",
  callsign: "DEMO101",
  lat: 35,
  lon: -2,
  track: 165,
  alt: 22000,
  gspeed: 340,
  timestamp: new Date(start - 10000).toISOString(),
  reg: "TEST-ONLY",
  type: "A320",
  orig_iata: "ORY",
  orig_icao: "LFPO",
  dest_iata: "OUD",
  dest_icao: "GMFO",
  eta: new Date(start + 900000).toISOString(),
  ...override,
});
const json = (data, status = 200, headers = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json", ...headers },
  });

test("Tracking disabled or missing credentials never calls the provider", async () => {
  let calls = 0;
  for (const settings of [
    {},
    { mode: "disabled", token: "secret" },
    { mode: "live" },
    { mode: "unknown", token: "secret" },
  ]) {
    const client = createTrackingService(settings, {
      fetchImpl: () => {
        calls++;
        throw new Error("unexpected network");
      },
    });
    const result = await client.getFlights();
    assert.equal(result.status, "not_configured");
    assert.deepEqual(result.flights, []);
    assert.equal(result.fetchedAt, null);
  }
  assert.equal(calls, 0);
});

test("Official request, normalization, airport isolation, duplicate removal and shared cache", async () => {
  let clock = start,
    calls = 0;
  const client = createTrackingService(
    { mode: "live", token: "test-secret" },
    {
      now: () => clock,
      fetchImpl: async (url, options) => {
        calls++;
        const parsed = new URL(url);
        assert.equal(parsed.origin, "https://fr24api.flightradar24.com");
        assert.equal(parsed.pathname, "/api/live/flight-positions/full");
        assert.equal(parsed.searchParams.get("airports"), "both:GMFO");
        assert.equal(parsed.searchParams.get("limit"), "20");
        assert.equal(options.headers.Authorization, "Bearer test-secret");
        assert.equal(options.headers["Accept-Version"], "v1");
        assert.equal(options.redirect, "error");
        assert.ok(options.signal instanceof AbortSignal);
        await new Promise((resolve) => setTimeout(resolve, 10));
        return json({
          data: [
            fixture(),
            fixture(),
            fixture({
              fr24_id: "abcd5678",
              orig_iata: "OUD",
              orig_icao: "GMFO",
              dest_iata: "BRU",
              dest_icao: "EBBR",
            }),
            fixture({ fr24_id: "ffff", dest_iata: "CDG", dest_icao: "LFPG" }),
            fixture({ lat: 120 }),
          ],
        });
      },
    },
  );
  const responses = await Promise.all(
    Array.from({ length: 25 }, () => client.getFlights()),
  );
  assert.equal(calls, 1);
  const result = responses[0];
  assert.equal(result.status, "live");
  assert.equal(result.flights.length, 2);
  assert.deepEqual(
    result.flights.map((flight) => flight.direction),
    ["arrival", "departure"],
  );
  assert.equal(result.flights[0].altitudeFeet, 22000);
  assert.equal(result.flights[0].speedKnots, 340);
  assert.equal(result.flights[0].positionStale, false);
  assert.equal(JSON.stringify(result).includes("test-secret"), false);
  result.flights[0].number = "mutated by caller";
  assert.equal((await client.getFlights()).flights[0].number, "TEST101");
  clock += 59000;
  await client.getFlights();
  assert.equal(calls, 1);
  clock += 1001;
  await client.getFlights();
  assert.equal(calls, 2);
});

test("Failure returns labelled stale data, applies backoff and drops expired snapshots", async () => {
  let clock = start,
    calls = 0;
  const client = createTrackingService(
    { mode: "live", token: "private-key" },
    {
      now: () => clock,
      fetchImpl: async () =>
        ++calls === 1
          ? json({ data: [fixture()] })
          : json({ error: "private-key upstream detail" }, 429, {
              "retry-after": "400",
            }),
    },
  );
  await client.getFlights();
  clock += 61000;
  const stale = await client.getFlights();
  assert.equal(stale.status, "stale");
  assert.equal(stale.reason, "quota");
  assert.equal(stale.refreshAfterSeconds, 400);
  assert.equal(stale.flights[0].positionStale, true);
  assert.equal(stale.fetchedAt, new Date(start).toISOString());
  assert.equal(JSON.stringify(stale).includes("private-key"), false);
  await client.getFlights();
  assert.equal(calls, 2);
  clock = start + 301000;
  const expired = await client.getFlights();
  assert.equal(expired.status, "unavailable");
  assert.deepEqual(expired.flights, []);
  assert.equal(expired.fetchedAt, null);
  assert.equal(calls, 2);
  clock = start + 462000;
  await client.getFlights();
  assert.equal(calls, 3);
});

test("Sandbox remains explicitly static and may contain flights outside Oujda", async () => {
  const client = createTrackingService(
    { mode: "sandbox", token: "sandbox-token" },
    {
      now: () => start,
      fetchImpl: async () =>
        json({
          data: [
            fixture({
              dest_iata: "FUE",
              dest_icao: "GCFV",
              timestamp: "2024-10-10T08:08:12Z",
            }),
          ],
        }),
    },
  );
  const result = await client.getFlights();
  assert.equal(result.status, "sandbox");
  assert.equal(result.mode, "sandbox");
  assert.equal(result.flights[0].direction, "other");
  assert.equal(result.flights[0].positionStale, true);
});

test("Empty, invalid, old, future and truncated provider responses are distinguished", async () => {
  const make = (body, settings = {}) =>
    createTrackingService(
      { mode: "live", token: "test", ...settings },
      { now: () => start, fetchImpl: async () => json(body) },
    );
  const empty = await make({ data: [] }).getFlights();
  assert.equal(empty.status, "live");
  assert.equal(empty.flights.length, 0);
  for (const body of [
    { wrong: [] },
    { data: [{ lat: "bad" }] },
    { data: null },
  ])
    assert.equal((await make(body).getFlights()).status, "unavailable");
  const old = await make({
    data: [fixture({ timestamp: "2026-10-01T13:50:00Z" })],
  }).getFlights();
  assert.equal(old.flights[0].positionStale, true);
  const future = await make({
    data: [fixture({ timestamp: "2026-10-01T15:50:00Z" })],
  }).getFlights();
  assert.equal(future.flights[0].positionStale, true);
  const capped = await make(
    { data: [fixture(), fixture({ fr24_id: "bbbb" })] },
    { limit: 1 },
  ).getFlights();
  assert.equal(capped.flights.length, 1);
  assert.equal(capped.truncated, true);
  assert.equal(capped.limit, 1);
});

test("Timeouts and rejected credentials do not expose provider messages or retry immediately", async () => {
  let calls = 0;
  const credentials = createTrackingService(
    { mode: "live", token: "hidden" },
    {
      now: () => start,
      fetchImpl: async () => {
        calls++;
        return json({ message: "hidden" }, 401);
      },
    },
  );
  assert.equal((await credentials.getFlights()).reason, "credentials");
  await credentials.getFlights();
  assert.equal(calls, 1);
  const timeout = createTrackingService(
    { mode: "live", token: "hidden", timeoutMs: 10 },
    {
      fetchImpl: async (_url, options) => {
        await new Promise((resolve) => setTimeout(resolve, 30));
        options.signal.throwIfAborted();
        throw new Error("Abort signal did not expire");
      },
    },
  );
  const result = await timeout.getFlights();
  assert.equal(result.status, "unavailable");
  assert.equal(result.reason, "timeout");
});

```

## frontend/index.html

```html
<!doctype html><html lang="fr"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/><meta name="theme-color" content="#153c3f"/><meta name="description" content="Prototype académique d’assistant passager pour Oujda-Angads. Vols fictifs, services, FAQ et réclamations."/><title>Oujda Smart — Votre voyage, plus serein</title><link rel="icon" href="/favicon.svg"/></head><body><div id="root"></div><script type="module" src="/src/main.jsx"></script></body></html>

```

## frontend/package.json

```json
{
  "name": "oujda-smart-frontend",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite --host 127.0.0.1 --port 3102",
    "build": "vite build",
    "preview": "vite preview --host 127.0.0.1 --port 3102"
  },
  "dependencies": {
    "axios": "^1.8.4",
    "leaflet": "1.9.4",
    "lucide-react": "^0.468.0",
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "react-router-dom": "^6.30.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.4.1",
    "autoprefixer": "^10.4.21",
    "postcss": "^8.5.3",
    "tailwindcss": "^3.4.19",
    "vite": "^6.1.0"
  }
}

```

## frontend/pnpm-lock.yaml

```text
lockfileVersion: '9.0'

settings:
  autoInstallPeers: true
  excludeLinksFromLockfile: false

importers:

  .:
    dependencies:
      axios:
        specifier: ^1.8.4
        version: 1.20.0(debug@4.4.3)
      leaflet:
        specifier: 1.9.4
        version: 1.9.4
      lucide-react:
        specifier: ^0.468.0
        version: 0.468.0(react@19.3.0)
      react:
        specifier: ^19.1.0
        version: 19.3.0
      react-dom:
        specifier: ^19.1.0
        version: 19.3.0(react@19.3.0)
      react-router-dom:
        specifier: ^6.30.1
        version: 6.30.6(react-dom@19.3.0(react@19.3.0))(react@19.3.0)
    devDependencies:
      '@vitejs/plugin-react':
        specifier: ^4.4.1
        version: 4.7.0(vite@6.4.3(jiti@1.21.7))
      autoprefixer:
        specifier: ^10.4.21
        version: 10.6.1(postcss@8.5.28)
      postcss:
        specifier: ^8.5.3
        version: 8.5.28
      tailwindcss:
        specifier: ^3.4.19
        version: 3.4.19
      vite:
        specifier: ^6.1.0
        version: 6.4.3(jiti@1.21.7)

packages:

  '@alloc/quick-lru@5.3.0':
    resolution: {integrity: sha512-U4+70Pc5ZS9osnCBCE5Jha/ciHM+Yp+CNMNC/7HvYbNRk1Ldd+f7qO65W5qfhu/TCv+/ozljlXXe9Nj8419DMA==}
    engines: {node: '>=10'}

  '@babel/code-frame@7.29.7':
    resolution: {integrity: sha512-Aup7aUOfpbAUg2ROOJN6Iw5f9DMBlzu0mIkm/malLQFN/YQgO48wCj0Kxa3sEHJvPVFg7siR+qRInwXd2qhQKw==}
    engines: {node: '>=6.9.0'}

  '@babel/compat-data@7.29.7':
    resolution: {integrity: sha512-locTkQyKvwIEgBzVrn8693ebc97F2U8ZHjbXwDXJ5Fn2TCpNwTlKcaKLkdHop5c/icOFE7qt7Q9JC5hnKNa6Gg==}
    engines: {node: '>=6.9.0'}

  '@babel/core@7.29.7':
    resolution: {integrity: sha512-RgHBCvtjbOK2gXSNBNIkNoEc9qoVEtau3hj8gEqKQuL3HZAibKarWFEI3Lfm6EYKkLalOh8eSrj9b+ch9H/VBA==}
    engines: {node: '>=6.9.0'}

  '@babel/generator@7.29.8':
    resolution: {integrity: sha512-gZbepsdh3WDtgZKWL+vTPh71LSBrm/Y4/QDZBVCcYfmeTEEuoOYwlSy+G1StfJg+/Zy550u/3TATbm7qDbbMtg==}
    engines: {node: '>=6.9.0'}

  '@babel/helper-compilation-targets@7.29.7':
    resolution: {integrity: sha512-wem6WaBj4NaVYVdNhLPPVacES6ZJ+KBBfSkTMD3YZxbP3rm3Di85tJU5ljaUNhaOynt+Aj0xruhYuzQBt8n71g==}
    engines: {node: '>=6.9.0'}

  '@babel/helper-globals@7.29.7':
    resolution: {integrity: sha512-3nQVUAtvkKH9zahfWgw96Jc/uFOmjACE1kQz82E2lqWmHBgjzbNlsC22nuQTfahmWeQtTq5nQ/4Nnd2A1wj4zA==}
    engines: {node: '>=6.9.0'}

  '@babel/helper-module-imports@7.29.7':
    resolution: {integrity: sha512-ejHwrQQYcm9xnTivShn2IDOlIzInN34AXskvq9QicvCtEzq1Vzclu/tKF8Jq1Cg8JG2GL6/EmjgsCT7lXepE3g==}
    engines: {node: '>=6.9.0'}

  '@babel/helper-module-transforms@7.29.7':
    resolution: {integrity: sha512-UPUVSyXbOh627KiCIGQSgwWzGeBKLkaJ9PJEdrngIwMSzxLR4jS4+f1f1jb7VzBbg8nFLaYotvVPFCTqdrmTAg==}
    engines: {node: '>=6.9.0'}
    peerDependencies:
      '@babel/core': ^7.0.0

  '@babel/helper-plugin-utils@7.29.7':
    resolution: {integrity: sha512-G7sHYigPY17oO5SYWnfD/0MTBwVR781S/JI643e/JhUYgVgWE/61SoW3NH9KWUKyKq5LVh3npif99Wkt6j86Jw==}
    engines: {node: '>=6.9.0'}

  '@babel/helper-string-parser@7.29.7':
    resolution: {integrity: sha512-Pb5ijPrZ89GDH8223L4UP8i6QApWxs04RbPQJTeWDV0/keR2E36MeKnyr6LYmUUvqRRI+Iv87SuF1W6ErINzYw==}
    engines: {node: '>=6.9.0'}

  '@babel/helper-validator-identifier@7.29.7':
    resolution: {integrity: sha512-qehxGkRj55h/ff8EMaJ+cYhyaKlHIxqYDn682wQD7RNp9UujOQsHog2uS0r2vzr4pW+sXf90NeeayjcNaX3fFg==}
    engines: {node: '>=6.9.0'}

  '@babel/helper-validator-option@7.29.7':
    resolution: {integrity: sha512-N9ZErrD+yW5geCDtBqnOoxmR8+tNKiGuxKlDpuJxfsqpa2dFcexaziGAE/qoHLiDDreVNMupxGmSoNlyvsA3gw==}
    engines: {node: '>=6.9.0'}

  '@babel/helpers@7.29.7':
    resolution: {integrity: sha512-1k2lAGRMfHTcwuNYcCNUmaUffmQv8KWMfh2iJUUeRlwlwH4FdNG7mfPI10NPfLHJFThE4Tyr4mv7kTNZOiPuBg==}
    engines: {node: '>=6.9.0'}

  '@babel/parser@7.29.9':
    resolution: {integrity: sha512-CjXrNHTnvqBVqHgdBysY3vk2T8tpJHb5/RMeHJBTyVa9xgugCB0CJTx/3oO8RV2QRQP391RWpB7D6hLjm8V9uA==}
    engines: {node: '>=6.0.0'}
    hasBin: true

  '@babel/plugin-transform-react-jsx-self@7.29.7':
    resolution: {integrity: sha512-TL0hMc9xzy86VD31nUiwzd5otRAcyEPcsegCxolO0PvcXuH1v0kECe/UIznYFihpkvU5wg/jk4v0TTEFfm53fw==}
    engines: {node: '>=6.9.0'}
    peerDependencies:
      '@babel/core': ^7.0.0-0

  '@babel/plugin-transform-react-jsx-source@7.29.7':
    resolution: {integrity: sha512-06IyK09H3wi4cGbhDBwp5gUGo0IKtnYa8tyTiephirPCK6fbobVGiXMMI5zLQ4aKEYP3wZ3ArU44o+8KMrSG/Q==}
    engines: {node: '>=6.9.0'}
    peerDependencies:
      '@babel/core': ^7.0.0-0

  '@babel/template@7.29.7':
    resolution: {integrity: sha512-puq+Gf35oI24FeN11LkoUQFqv9uwNeWpxXZi/Ji3rRIoKAzKnxRaZ+Gkj0vKS9ZCiTESfng1N9LyOyXvo+m+Gg==}
    engines: {node: '>=6.9.0'}

  '@babel/traverse@7.29.8':
    resolution: {integrity: sha512-I5z7H3bf/41ktsNVLtpN0wAa336HkqIHQ5BuPLEhTkt1jVSyZpeNKIzTgEWmlxjdg81R0IgUCcaE+Ok3NvrfZg==}
    engines: {node: '>=6.9.0'}

  '@babel/types@7.29.8':
    resolution: {integrity: sha512-Vj1jF3cPfxg7OAfoI7QnVKLoILlm2JF9pnVHrX8qx7AHMiYWT+NDAA7jChlNgRS4WTLc/fD1lXLmPixluj+3Gg==}
    engines: {node: '>=6.9.0'}

  '@esbuild/aix-ppc64@0.25.12':
    resolution: {integrity: sha512-Hhmwd6CInZ3dwpuGTF8fJG6yoWmsToE+vYgD4nytZVxcu1ulHpUQRAB1UJ8+N1Am3Mz4+xOByoQoSZf4D+CpkA==}
    engines: {node: '>=18'}
    cpu: [ppc64]
    os: [aix]

  '@esbuild/android-arm64@0.25.12':
    resolution: {integrity: sha512-6AAmLG7zwD1Z159jCKPvAxZd4y/VTO0VkprYy+3N2FtJ8+BQWFXU+OxARIwA46c5tdD9SsKGZ/1ocqBS/gAKHg==}
    engines: {node: '>=18'}
    cpu: [arm64]
    os: [android]

  '@esbuild/android-arm@0.25.12':
    resolution: {integrity: sha512-VJ+sKvNA/GE7Ccacc9Cha7bpS8nyzVv0jdVgwNDaR4gDMC/2TTRc33Ip8qrNYUcpkOHUT5OZ0bUcNNVZQ9RLlg==}
    engines: {node: '>=18'}
    cpu: [arm]
    os: [android]

  '@esbuild/android-x64@0.25.12':
    resolution: {integrity: sha512-5jbb+2hhDHx5phYR2By8GTWEzn6I9UqR11Kwf22iKbNpYrsmRB18aX/9ivc5cabcUiAT/wM+YIZ6SG9QO6a8kg==}
    engines: {node: '>=18'}
    cpu: [x64]
    os: [android]

  '@esbuild/darwin-arm64@0.25.12':
    resolution: {integrity: sha512-N3zl+lxHCifgIlcMUP5016ESkeQjLj/959RxxNYIthIg+CQHInujFuXeWbWMgnTo4cp5XVHqFPmpyu9J65C1Yg==}
    engines: {node: '>=18'}
    cpu: [arm64]
    os: [darwin]

  '@esbuild/darwin-x64@0.25.12':
    resolution: {integrity: sha512-HQ9ka4Kx21qHXwtlTUVbKJOAnmG1ipXhdWTmNXiPzPfWKpXqASVcWdnf2bnL73wgjNrFXAa3yYvBSd9pzfEIpA==}
    engines: {node: '>=18'}
    cpu: [x64]
    os: [darwin]

  '@esbuild/freebsd-arm64@0.25.12':
    resolution: {integrity: sha512-gA0Bx759+7Jve03K1S0vkOu5Lg/85dou3EseOGUes8flVOGxbhDDh/iZaoek11Y8mtyKPGF3vP8XhnkDEAmzeg==}
    engines: {node: '>=18'}
    cpu: [arm64]
    os: [freebsd]

  '@esbuild/freebsd-x64@0.25.12':
    resolution: {integrity: sha512-TGbO26Yw2xsHzxtbVFGEXBFH0FRAP7gtcPE7P5yP7wGy7cXK2oO7RyOhL5NLiqTlBh47XhmIUXuGciXEqYFfBQ==}
    engines: {node: '>=18'}
    cpu: [x64]
    os: [freebsd]

  '@esbuild/linux-arm64@0.25.12':
    resolution: {integrity: sha512-8bwX7a8FghIgrupcxb4aUmYDLp8pX06rGh5HqDT7bB+8Rdells6mHvrFHHW2JAOPZUbnjUpKTLg6ECyzvas2AQ==}
    engines: {node: '>=18'}
    cpu: [arm64]
    os: [linux]

  '@esbuild/linux-arm@0.25.12':
    resolution: {integrity: sha512-lPDGyC1JPDou8kGcywY0YILzWlhhnRjdof3UlcoqYmS9El818LLfJJc3PXXgZHrHCAKs/Z2SeZtDJr5MrkxtOw==}
    engines: {node: '>=18'}
    cpu: [arm]
    os: [linux]

  '@esbuild/linux-ia32@0.25.12':
    resolution: {integrity: sha512-0y9KrdVnbMM2/vG8KfU0byhUN+EFCny9+8g202gYqSSVMonbsCfLjUO+rCci7pM0WBEtz+oK/PIwHkzxkyharA==}
    engines: {node: '>=18'}
    cpu: [ia32]
    os: [linux]

  '@esbuild/linux-loong64@0.25.12':
    resolution: {integrity: sha512-h///Lr5a9rib/v1GGqXVGzjL4TMvVTv+s1DPoxQdz7l/AYv6LDSxdIwzxkrPW438oUXiDtwM10o9PmwS/6Z0Ng==}
    engines: {node: '>=18'}
    cpu: [loong64]
    os: [linux]

  '@esbuild/linux-mips64el@0.25.12':
    resolution: {integrity: sha512-iyRrM1Pzy9GFMDLsXn1iHUm18nhKnNMWscjmp4+hpafcZjrr2WbT//d20xaGljXDBYHqRcl8HnxbX6uaA/eGVw==}
    engines: {node: '>=18'}
    cpu: [mips64el]
    os: [linux]

  '@esbuild/linux-ppc64@0.25.12':
    resolution: {integrity: sha512-9meM/lRXxMi5PSUqEXRCtVjEZBGwB7P/D4yT8UG/mwIdze2aV4Vo6U5gD3+RsoHXKkHCfSxZKzmDssVlRj1QQA==}
    engines: {node: '>=18'}
    cpu: [ppc64]
    os: [linux]

  '@esbuild/linux-riscv64@0.25.12':
    resolution: {integrity: sha512-Zr7KR4hgKUpWAwb1f3o5ygT04MzqVrGEGXGLnj15YQDJErYu/BGg+wmFlIDOdJp0PmB0lLvxFIOXZgFRrdjR0w==}
    engines: {node: '>=18'}
    cpu: [riscv64]
    os: [linux]

  '@esbuild/linux-s390x@0.25.12':
    resolution: {integrity: sha512-MsKncOcgTNvdtiISc/jZs/Zf8d0cl/t3gYWX8J9ubBnVOwlk65UIEEvgBORTiljloIWnBzLs4qhzPkJcitIzIg==}
    engines: {node: '>=18'}
    cpu: [s390x]
    os: [linux]

  '@esbuild/linux-x64@0.25.12':
    resolution: {integrity: sha512-uqZMTLr/zR/ed4jIGnwSLkaHmPjOjJvnm6TVVitAa08SLS9Z0VM8wIRx7gWbJB5/J54YuIMInDquWyYvQLZkgw==}
    engines: {node: '>=18'}
    cpu: [x64]
    os: [linux]

  '@esbuild/netbsd-arm64@0.25.12':
    resolution: {integrity: sha512-xXwcTq4GhRM7J9A8Gv5boanHhRa/Q9KLVmcyXHCTaM4wKfIpWkdXiMog/KsnxzJ0A1+nD+zoecuzqPmCRyBGjg==}
    engines: {node: '>=18'}
    cpu: [arm64]
    os: [netbsd]

  '@esbuild/netbsd-x64@0.25.12':
    resolution: {integrity: sha512-Ld5pTlzPy3YwGec4OuHh1aCVCRvOXdH8DgRjfDy/oumVovmuSzWfnSJg+VtakB9Cm0gxNO9BzWkj6mtO1FMXkQ==}
    engines: {node: '>=18'}
    cpu: [x64]
    os: [netbsd]

  '@esbuild/openbsd-arm64@0.25.12':
    resolution: {integrity: sha512-fF96T6KsBo/pkQI950FARU9apGNTSlZGsv1jZBAlcLL1MLjLNIWPBkj5NlSz8aAzYKg+eNqknrUJ24QBybeR5A==}
    engines: {node: '>=18'}
    cpu: [arm64]
    os: [openbsd]

  '@esbuild/openbsd-x64@0.25.12':
    resolution: {integrity: sha512-MZyXUkZHjQxUvzK7rN8DJ3SRmrVrke8ZyRusHlP+kuwqTcfWLyqMOE3sScPPyeIXN/mDJIfGXvcMqCgYKekoQw==}
    engines: {node: '>=18'}
    cpu: [x64]
    os: [openbsd]

  '@esbuild/openharmony-arm64@0.25.12':
    resolution: {integrity: sha512-rm0YWsqUSRrjncSXGA7Zv78Nbnw4XL6/dzr20cyrQf7ZmRcsovpcRBdhD43Nuk3y7XIoW2OxMVvwuRvk9XdASg==}
    engines: {node: '>=18'}
    cpu: [arm64]
    os: [openharmony]

  '@esbuild/sunos-x64@0.25.12':
    resolution: {integrity: sha512-3wGSCDyuTHQUzt0nV7bocDy72r2lI33QL3gkDNGkod22EsYl04sMf0qLb8luNKTOmgF/eDEDP5BFNwoBKH441w==}
    engines: {node: '>=18'}
    cpu: [x64]
    os: [sunos]

  '@esbuild/win32-arm64@0.25.12':
    resolution: {integrity: sha512-rMmLrur64A7+DKlnSuwqUdRKyd3UE7oPJZmnljqEptesKM8wx9J8gx5u0+9Pq0fQQW8vqeKebwNXdfOyP+8Bsg==}
    engines: {node: '>=18'}
    cpu: [arm64]
    os: [win32]

  '@esbuild/win32-ia32@0.25.12':
    resolution: {integrity: sha512-HkqnmmBoCbCwxUKKNPBixiWDGCpQGVsrQfJoVGYLPT41XWF8lHuE5N6WhVia2n4o5QK5M4tYr21827fNhi4byQ==}
    engines: {node: '>=18'}
    cpu: [ia32]
    os: [win32]

  '@esbuild/win32-x64@0.25.12':
    resolution: {integrity: sha512-alJC0uCZpTFrSL0CCDjcgleBXPnCrEAhTBILpeAp7M/OFgoqtAetfBzX0xM00MUsVVPpVjlPuMbREqnZCXaTnA==}
    engines: {node: '>=18'}
    cpu: [x64]
    os: [win32]

  '@jridgewell/gen-mapping@0.3.13':
    resolution: {integrity: sha512-2kkt/7niJ6MgEPxF0bYdQ6etZaA+fQvDcLKckhy1yIQOzaoKjBBjSj63/aLVjYE3qhRt5dvM+uUyfCg6UKCBbA==}

  '@jridgewell/remapping@2.3.5':
    resolution: {integrity: sha512-LI9u/+laYG4Ds1TDKSJW2YPrIlcVYOwi2fUC6xB43lueCjgxV4lffOCZCtYFiH6TNOX+tQKXx97T4IKHbhyHEQ==}

  '@jridgewell/resolve-uri@3.1.2':
    resolution: {integrity: sha512-bRISgCIjP20/tbWSPWMEi54QVPRZExkuD9lJL+UIxUKtwVJA8wW1Trb1jMs1RFXo1CBTNZ/5hpC9QvmKWdopKw==}
    engines: {node: '>=6.0.0'}

  '@jridgewell/sourcemap-codec@1.6.0':
    resolution: {integrity: sha512-T7jf+5zgsZHwNJ4lvQ7/aezbyk0nNX+zJVWpmHA7VYsEx7a7qr5Rg5IbtJFqkgze5Y2sruq1RUY8Q837Od7iFw==}

  '@jridgewell/trace-mapping@0.3.31':
    resolution: {integrity: sha512-zzNR+SdQSDJzc8joaeP8QQoCQr8NuYx2dIIytl1QeBEZHJ9uW6hebsrYgbz8hJwUQao3TWCMtmfV8Nu1twOLAw==}

  '@napi-rs/lzma-linux-x64-gnu@1.5.1':
    resolution: {integrity: sha512-oTXEIha4SsuXdTA4Iyskj0kpdx2yVXdhd75c2v3xGrHFfVMsbhTPZU/nMPL4sWKo4pBHm3aucLaqGlF696dTyQ==}
    engines: {node: ^22.20 || ^24.12 || >=25}
    cpu: [x64]
    os: [linux]
    libc: [glibc]

  '@nodelib/fs.scandir@2.1.5':
    resolution: {integrity: sha512-vq24Bq3ym5HEQm2NKCr3yXDwjc7vTsEThRDnkp2DK9p1uqLR+DHurm/NOTo0KG7HYHU7eppKZj3MyqYuMBf62g==}
    engines: {node: '>= 8'}

  '@nodelib/fs.stat@2.0.5':
    resolution: {integrity: sha512-RkhPPp2zrqDAQA/2jNhnztcPAlv64XdhIp7a7454A5ovI7Bukxgt7MX7udwAu3zg1DcpPU0rz3VV1SeaqvY4+A==}
    engines: {node: '>= 8'}

  '@nodelib/fs.walk@1.2.8':
    resolution: {integrity: sha512-oGB+UxlgWcgQkgwo8GcEGwemoTFt3FIO9ababBmaGwXIoBKZ+GTy0pP185beGg7Llih/NSHSV2XAs1lnznocSg==}
    engines: {node: '>= 8'}

  '@remix-run/router@1.23.4':
    resolution: {integrity: sha512-q7j5geK7xs3UJSdm9/iytUNclBnLmYx1EnSeCFXHPeutdqgIMeFeHtUZgS3EhlKxdBEAu8OwtJCwmLrEzpSs7Q==}
    engines: {node: '>=14.0.0'}

  '@rolldown/pluginutils@1.0.0-beta.27':
    resolution: {integrity: sha512-+d0F4MKMCbeVUJwG96uQ4SgAznZNSq93I3V+9NHA4OpvqG8mRCpGdKmK8l/dl02h2CCDHwW2FqilnTyDcAnqjA==}

  '@rollup/rollup-android-arm-eabi@4.63.5':
    resolution: {integrity: sha512-J25QJU+B78T4FhhBsNpLJyVWOi31mwtpcMwywHmOKH65Q9IWGA81gPj+dnwlhU8wktVriYE+tFAaQgrnJRzAZg==}
    cpu: [arm]
    os: [android]

  '@rollup/rollup-android-arm64@4.63.5':
    resolution: {integrity: sha512-LDopB3zuZM5Ux9TT2luNEBJW/tYbGU2g1d+VpKk6I+gSKDb+/7sYE6M225gRQt4RbMX6MSwMsVR/phdjVUgRLg==}
    cpu: [arm64]
    os: [android]

  '@rollup/rollup-darwin-arm64@4.63.5':
    resolution: {integrity: sha512-wlJEERGfeuHeBavCL2qVnNacOK43NDoZM4sjkeRPymd04OAE9T1zBqDJgmZ+CIsPTYKwdzpUC8vmOw84dwY4Tg==}
    cpu: [arm64]
    os: [darwin]

  '@rollup/rollup-darwin-x64@4.63.5':
    resolution: {integrity: sha512-4nJJGg5jbo2wwPP4JP+LfEBA3bvP8rU9CLuhp7jWvq9sxEyhjQFTFdrqi+/dHEin/pd8jpT0vcehIpnZtmEdcQ==}
    cpu: [x64]
    os: [darwin]

  '@rollup/rollup-freebsd-arm64@4.63.5':
    resolution: {integrity: sha512-DrZbyCDF1hneuO6jRbvZ2D7+PIBM6yIwYnJpg2vIk58T+wuFpiaGZrfUr59lDWw45bg+IrpTGLPiNi/Fk4w3Cg==}
    cpu: [arm64]
    os: [freebsd]

  '@rollup/rollup-freebsd-x64@4.63.5':
    resolution: {integrity: sha512-gqfUVMJMB3mehqywxp6hTBFfgtMQykZY19+cfiaYP0toIJLb/1DZRJHVkQQGP13W4TAwfZDWeg1qBcheTRioXQ==}
    cpu: [x64]
    os: [freebsd]

  '@rollup/rollup-linux-arm-gnueabihf@4.63.5':
    resolution: {integrity: sha512-CFmhpvAwzSaWMlN3VN7UtmoTihlZNzoP0juQib5TQRnYUyDV8dXeWOp29sobWAT6gXl/hQgAClLlEiYozQG3OQ==}
    cpu: [arm]
    os: [linux]
    libc: [glibc]

  '@rollup/rollup-linux-arm-musleabihf@4.63.5':
    resolution: {integrity: sha512-Uc9H8eXCOayV6JLTH5bXKMId6qbhNHa818/BgYjm4jrlq3vZquC9cqyvHBw17xy5Mnj5f+I3gFK5JcEf3hSqrw==}
    cpu: [arm]
    os: [linux]
    libc: [musl]

  '@rollup/rollup-linux-arm64-gnu@4.63.5':
    resolution: {integrity: sha512-VcPr/szv/1BFw112Kt//fxulXt/JPqzzidU84iW68L2DdjnOO8QFUv2zTSYBEPHD6movBD4z+bbr5y60GYM7Jw==}
    cpu: [arm64]
    os: [linux]
    libc: [glibc]

  '@rollup/rollup-linux-arm64-musl@4.63.5':
    resolution: {integrity: sha512-BnxtJ5/91BrIHYIkGrmjz/lbMhqEHt1dPFqIxIFR+jPn0xVc/oUSCtIT089zfp5ufwGDlYz2UC+Fe1SRBpYFbQ==}
    cpu: [arm64]
    os: [linux]
    libc: [musl]

  '@rollup/rollup-linux-loong64-gnu@4.63.5':
    resolution: {integrity: sha512-LrYcHZwF+fAMNKHYTOQ5osWM4AZF7YF6D+XtsjDyEvljtt11twc+zHVXBLNEjxVSUnKYsOhvVz4Z213eW02COQ==}
    cpu: [loong64]
    os: [linux]
    libc: [glibc]

  '@rollup/rollup-linux-loong64-musl@4.63.5':
    resolution: {integrity: sha512-nj7QKQePAAUpCpJHtg0pR0W/b92A9NO17JS3BAQmHDn/yhmkir2p8llrKY9TOhleKIaSzy1JhxS3T9FVld6coA==}
    cpu: [loong64]
    os: [linux]
    libc: [musl]

  '@rollup/rollup-linux-ppc64-gnu@4.63.5':
    resolution: {integrity: sha512-5ylkX6dWMeBKge9nTU+Rxfb+ZfaCIJ9lRqIFaK0eAMcWp7OJbYnLveLgXmm0VrvuLKb8qIK+mHyH0qu88RM+iA==}
    cpu: [ppc64]
    os: [linux]
    libc: [glibc]

  '@rollup/rollup-linux-ppc64-musl@4.63.5':
    resolution: {integrity: sha512-oHK4ZHYFDKjZviK34I+NwgfbGxgI7ztrNxj2hPTSSNFgeq1a/lEd7dHV2fdGAuTH4Iym3RHJg+vAbWaWG4B7Zg==}
    cpu: [ppc64]
    os: [linux]
    libc: [musl]

  '@rollup/rollup-linux-riscv64-gnu@4.63.5':
    resolution: {integrity: sha512-UcetmHZ6XOXuUByiKZyQmb55ZPr0LABr3Ec/HB9wKZn6CEAFWZkE+hsJErJ9hbPBC7nI0dKuELx7CoV6IM7TMg==}
    cpu: [riscv64]
    os: [linux]
    libc: [glibc]

  '@rollup/rollup-linux-riscv64-musl@4.63.5':
    resolution: {integrity: sha512-C5CmDPQBtvjVo8cgQsBs+w6WB0JLkiixhgi6hVLV11hERWdn/p0XcPU2OUcZzac9BPOFq7SbaHFa8r3SWEysCQ==}
    cpu: [riscv64]
    os: [linux]
    libc: [musl]

  '@rollup/rollup-linux-s390x-gnu@4.63.5':
    resolution: {integrity: sha512-lHVQHJFKsuuxLMi3MQO9XVL8Tje3JR82CzB+QDKC5NWBcsIWuwsn9uIM5e3lBhI+fF1/s63qnyYqsg65+8rV/w==}
    cpu: [s390x]
    os: [linux]
    libc: [glibc]

  '@rollup/rollup-linux-x64-gnu@4.63.5':
    resolution: {integrity: sha512-3W9bTFcQNJn71cSJVM9RKIiZOy8DO/XLDii8Uv/Pm6WKqDRj7JV3ZfuXIEfyuy5LXpIzAbB/1M4Ukp9GKNa7nA==}
    cpu: [x64]
    os: [linux]
    libc: [glibc]

  '@rollup/rollup-linux-x64-musl@4.63.5':
    resolution: {integrity: sha512-VDC7rRJlee/scpki96GZ27Omf6yU87s1YXwVTpjE5841faVlDYYT565rgfmoR1U0sqL7z5ivQSDjcsF6VRXyBA==}
    cpu: [x64]
    os: [linux]
    libc: [musl]

  '@rollup/rollup-openbsd-x64@4.63.5':
    resolution: {integrity: sha512-z86Ok2p4pTdv5xqCKZsTooO7yBEiaJR/HzU3Wx8RmWsPoLppnMKROhJusQob8B3IE1ghC343kUW9rC2r+Wf3ig==}
    cpu: [x64]
    os: [openbsd]

  '@rollup/rollup-openharmony-arm64@4.63.5':
    resolution: {integrity: sha512-IzQmj+xXwQFGhMAMKMQVXkMwMZN3TqkJgAE0nSsqvVwWWciP4AIPMmWRqOQ2GfX7TUDZr+xqGFcBS36CRPGw0g==}
    cpu: [arm64]
    os: [openharmony]

  '@rollup/rollup-win32-arm64-msvc@4.63.5':
    resolution: {integrity: sha512-F6qpTaPc9bwBH85kjy0/BLmLSW1uv7AoOXCoRIkg2arlgCYlWYcAbiMkvZuAcaWk9TpCRG//okznLAqLGshkMw==}
    cpu: [arm64]
    os: [win32]

  '@rollup/rollup-win32-ia32-msvc@4.63.5':
    resolution: {integrity: sha512-igoDsTFhhwECBeGbUuLeIk7t8Y1apa+cs6mDWpx2EZ0ch7oEQgzHbFUXN9euoHekCAQzXdXApAGkV6jznS7tWw==}
    cpu: [ia32]
    os: [win32]

  '@rollup/rollup-win32-x64-gnu@4.63.5':
    resolution: {integrity: sha512-U3teMeMbXFmaM5D+OTJpsOXd+wV/qftIeYF9kBKL4v73641qyJmoXFtA28DQLsnmlyayEsTe72xpLHrArq6vHw==}
    cpu: [x64]
    os: [win32]

  '@rollup/rollup-win32-x64-msvc@4.63.5':
    resolution: {integrity: sha512-ypfC34F3RKXvCXBglGqGMsUSMKlgwd1HX9AOAlx9RoZZ6GaI42YHVeKpzg3JG+wpBUJYTG+NNZhqbDWL8tBZkw==}
    cpu: [x64]
    os: [win32]

  '@types/babel__core@7.20.5':
    resolution: {integrity: sha512-qoQprZvz5wQFJwMDqeseRXWv3rqMvhgpbXFfVyWhbx9X47POIA6i/+dXefEmZKoAgOaTdaIgNSMqMIU61yRyzA==}

  '@types/babel__generator@7.27.0':
    resolution: {integrity: sha512-ufFd2Xi92OAVPYsy+P4n7/U7e68fex0+Ee8gSG9KX7eo084CWiQ4sdxktvdl0bOPupXtVJPY19zk6EwWqUQ8lg==}

  '@types/babel__template@7.4.4':
    resolution: {integrity: sha512-h/NUaSyG5EyxBIp8YRxo4RMe2/qQgvyowRwVMzhYhBCONbW8PUsg4lkFMrhgZhUe5z3L3MiLDuvyJ/CaPa2A8A==}

  '@types/babel__traverse@7.28.0':
    resolution: {integrity: sha512-8PvcXf70gTDZBgt9ptxJ8elBeBjcLOAcOtoO/mPJjtji1+CdGbHgm77om1GrsPxsiE+uXIpNSK64UYaIwQXd4Q==}

  '@types/estree@1.0.9':
    resolution: {integrity: sha512-GhdPgy1el4/ImP05X05Uw4cw2/M93BCUmnEvWZNStlCzEKME4Fkk+YpoA5OiHNQmoS7Cafb8Xa3Pya8m1Qrzeg==}

  '@vitejs/plugin-react@4.7.0':
    resolution: {integrity: sha512-gUu9hwfWvvEDBBmgtAowQCojwZmJ5mcLn3aufeCsitijs3+f2NsrPtlAWIR6OPiqljl96GVCUbLe0HyqIpVaoA==}
    engines: {node: ^14.18.0 || >=16.0.0}
    peerDependencies:
      vite: ^4.2.0 || ^5.0.0 || ^6.0.0 || ^7.0.0

  agent-base@6.0.2:
    resolution: {integrity: sha512-RZNwNclF7+MS/8bDg70amg32dyeZGZxiDuQmZxKLAlQjr3jGyLx+4Kkk58UO7D2QdgFIQCovuSuZESne6RG6XQ==}
    engines: {node: '>= 6.0.0'}

  any-promise@1.3.0:
    resolution: {integrity: sha512-7UvmKalWRt1wgjL1RrGxoSJW/0QZFIegpeGvZG9kjp8vrRu55XTHbwnqq2GpXm9uLbcuhxm3IqX9OB4MZR1b2A==}

  anymatch@3.1.3:
    resolution: {integrity: sha512-KMReFUr0B4t+D+OBkjR3KYqvocp2XaSzO55UcB6mgQMd3KbcE+mWTyvVV7D/zsdEbNnV6acZUutkiHQXvTr1Rw==}
    engines: {node: '>= 8'}

  arg@5.0.2:
    resolution: {integrity: sha512-PYjyFOLKQ9y57JvQ6QLo8dAgNqswh8M1RMJYdQduT6xbWSgK36P/Z/v+p888pM69jMMfS8Xd8F6I1kQ/I9HUGg==}

  asynckit@0.4.0:
    resolution: {integrity: sha512-Oei9OH4tRh0YqU3GxhX79dM/mwVgvbZJaSNaRk+bshkj0S5cfHcgYakreBjrHwatXKbz+IoIdYLxrKim2MjW0Q==}

  autoprefixer@10.6.1:
    resolution: {integrity: sha512-cL1Qz6ADZhcEbny/8HPfe99J6HhNoYtpX2LFLIbhgGE7Q1hlQVkYFdetDN7Id3KiQxhDrHwzlHr/YQCnZ8+xSA==}
    engines: {node: ^10 || ^12 || >=14}
    hasBin: true
    peerDependencies:
      postcss: ^8.1.0

  axios@1.20.0:
    resolution: {integrity: sha512-r8aOh8j9cGKpgQAqpzrUHnSIc6a59Y3Xf/cv8sy1DrHCkZHzQGEuoq1tARk6qSyDdtQGSDgpb9kFlruzPvrgwg==}

  baseline-browser-mapping@2.11.26:
    resolution: {integrity: sha512-GLQdD3y6UF8iVuMJl5fHgE4jdn/ua7n+toKfLgNlg3BqQtOZjpy68T8Tup8/wGWZCDlm7KMg7tPb4MPn7oN0TQ==}
    engines: {node: '>=6.0.0'}
    hasBin: true

  binary-extensions@2.3.0:
    resolution: {integrity: sha512-Ceh+7ox5qe7LJuLHoY0feh3pHuUDHAcRUeyL2VYghZwfpkNIy/+8Ocg0a3UuSoYzavmylwuLWQOf3hl0jjMMIw==}
    engines: {node: '>=8'}

  braces@3.0.3:
    resolution: {integrity: sha512-yQbXgO/OSZVD2IsiLlro+7Hf6Q18EJrKSEsdoMzKePKXct3gvD8oLcOQdIzGupr5Fj+EDe8gO/lxc1BzfMpxvA==}
    engines: {node: '>=8'}

  browserslist@4.29.2:
    resolution: {integrity: sha512-/u9r8k8ue4ZhHCw9ovDtltpWdXeXzjhdxCGj6vm1RGLPXb8lu33EMdoCHF5Sx8oYBS+Q/FYYNmAqlHncxR3RmA==}
    engines: {node: ^6 || ^7 || ^8 || ^9 || ^10 || ^11 || ^12 || >=13.7}
    hasBin: true

  call-bind-apply-helpers@1.0.2:
    resolution: {integrity: sha512-Sp1ablJ0ivDkSzjcaJdxEunN5/XvksFJ2sMBFfq6x0ryhQV/2b/KwFe21cMpmHtPOSij8K99/wSfoEuTObmuMQ==}
    engines: {node: '>= 0.4'}

  camelcase-css@2.0.1:
    resolution: {integrity: sha512-QOSvevhslijgYwRx6Rv7zKdMF8lbRmx+uQGx2+vDc+KI/eBnsy9kit5aj23AgGu3pa4t9AgwbnXWqS+iOY+2aA==}
    engines: {node: '>= 6'}

  caniuse-lite@1.0.30001813:
    resolution: {integrity: sha512-zfjJo4rM0+fUomGDBW/xcDjhIwz/210DGvip2MAMDZ8KHcRPnOHmEgHPZP0UHlZoxr8fYKVJOqcORhYQcG4FKQ==}

  chokidar@3.6.0:
    resolution: {integrity: sha512-7VT13fmjotKpGipCW9JEQAusEPE+Ei8nl6/g4FBAmIm0GOOLMua9NDDo/DWp0ZAxCr3cPq5ZpBqmPAQgDda2Pw==}
    engines: {node: '>= 8.10.0'}

  combined-stream@1.0.8:
    resolution: {integrity: sha512-FQN4MRfuJeHf7cBbBMJFXhKSDq+2kAArBlmRBvcvFE5BB1HZKXtSFASDhdlz9zOYwxh8lDdnvmMOe/+5cdoEdg==}
    engines: {node: '>= 0.8'}

  commander@4.1.1:
    resolution: {integrity: sha512-NOKm8xhkzAjzFx8B2v5OAHT+u5pRQc2UCa2Vq9jYL/31o2wi9mxBA7LIFs3sV5VSC49z6pEhfbMULvShKj26WA==}
    engines: {node: '>= 6'}

  convert-source-map@2.0.0:
    resolution: {integrity: sha512-Kvp459HrV2FEJ1CAsi1Ku+MY3kasH19TFykTz2xWmMeq6bk2NU3XXvfJ+Q61m0xktWwt+1HSYf3JZsTms3aRJg==}

  cssesc@3.0.0:
    resolution: {integrity: sha512-/Tb/JcjK111nNScGob5MNtsntNM1aCNUDipB/TkwZFhyDrrE47SOx/18wF2bbjgc3ZzCSKW1T5nt5EbFoAz/Vg==}
    engines: {node: '>=4'}
    hasBin: true

  debug@4.4.3:
    resolution: {integrity: sha512-RGwwWnwQvkVfavKVt22FGLw+xYSdzARwm0ru6DhTVA3umU5hZc28V3kO4stgYryrTlLpuvgI9GiijltAjNbcqA==}
    engines: {node: '>=6.0'}
    peerDependencies:
      supports-color: '*'
    peerDependenciesMeta:
      supports-color:
        optional: true

  delayed-stream@1.0.0:
    resolution: {integrity: sha512-ZySD7Nf91aLB0RxL4KGrKHBXl7Eds1DAmEdcoVawXnLD7SDhpNgtuII2aAkg7a7QS41jxPSZ17p4VdGnMHk3MQ==}
    engines: {node: '>=0.4.0'}

  didyoumean@1.2.2:
    resolution: {integrity: sha512-gxtyfqMg7GKyhQmb056K7M3xszy/myH8w+B4RT+QXBQsvAOdc3XymqDDPHx1BgPgsdAA5SIifona89YtRATDzw==}

  dlv@1.1.3:
    resolution: {integrity: sha512-+HlytyjlPKnIG8XuRG8WvmBP8xs8P71y+SKKS6ZXWoEgLuePxtDoUEiH7WkdePWrQ5JBpE6aoVqfZfJUQkjXwA==}

  dunder-proto@1.0.1:
    resolution: {integrity: sha512-KIN/nDJBQRcXw0MLVhZE9iQHmG68qAVIBg9CqmUYjmQIhgij9U5MFvrqkUL5FbtyyzZuOeOt0zdeRe4UY7ct+A==}
    engines: {node: '>= 0.4'}

  electron-to-chromium@1.5.439:
    resolution: {integrity: sha512-qu6QIPXhsb+CRcAiTMNjR4A1y/7tCYKkKjr5CZXRVih6qkDf79peZ2BpEU3qoDBNCRrcy3Mra3X9nG5oruuA7Q==}

  es-define-property@1.0.1:
    resolution: {integrity: sha512-e3nRfgfUZ4rNGL232gUgX06QNyyez04KdjFrF+LTRoOXmrOgFKDg4BCdsjW8EnT69eqdYGmRpJwiPVYNrCaW3g==}
    engines: {node: '>= 0.4'}

  es-errors@1.3.0:
    resolution: {integrity: sha512-Zf5H2Kxt2xjTvbJvP2ZWLEICxA6j+hAmMzIlypy4xcBg1vKVnx89Wy0GbS+kf5cwCVFFzdCFh2XSCFNULS6csw==}
    engines: {node: '>= 0.4'}

  es-object-atoms@1.1.2:
    resolution: {integrity: sha512-HWcBoN6NileqtSydK2FqHbS/LoDd2pqrnQHLyJzBj4kOp/ky2MWMN694xOfkK8/SnUsW2DH7EfyVlydKCsm1Zw==}
    engines: {node: '>= 0.4'}

  es-set-tostringtag@2.1.0:
    resolution: {integrity: sha512-j6vWzfrGVfyXxge+O0x5sh6cvxAog0a/4Rdd2K36zCMV5eJ+/+tOAngRO8cODMNWbVRdVlmGZQL2YS3yR8bIUA==}
    engines: {node: '>= 0.4'}

  esbuild@0.25.12:
    resolution: {integrity: sha512-bbPBYYrtZbkt6Os6FiTLCTFxvq4tt3JKall1vRwshA3fdVztsLAatFaZobhkBC8/BrPetoa0oksYoKXoG4ryJg==}
    engines: {node: '>=18'}
    hasBin: true

  escalade@3.2.0:
    resolution: {integrity: sha512-WUj2qlxaQtO4g6Pq5c29GTcWGDyd8itL8zTlipgECz3JesAiiOKotd8JU6otB3PACgG6xkJUyVhboMS+bje/jA==}
    engines: {node: '>=6'}

  fast-glob@3.3.3:
    resolution: {integrity: sha512-7MptL8U0cqcFdzIzwOTHoilX9x5BrNqye7Z/LuC7kCMRio1EMSyqRK3BEAUD7sXRq4iT4AzTVuZdhgQ2TCvYLg==}
    engines: {node: '>=8.6.0'}

  fastq@1.20.3:
    resolution: {integrity: sha512-XKv5nnLs6nLF71NgiKJLIZFLkPyIEuOselLG7ujZnGrRfQK8HpvY+WqKhAJUAdLomwVHErVS4LfxFlPq0/FTAw==}

  fdir@6.5.0:
    resolution: {integrity: sha512-tIbYtZbucOs0BRGqPJkshJUYdL+SDH7dVM8gjy+ERp3WAUjLEFJE+02kanyHtwjWOnwrKYBiwAmM0p4kLJAnXg==}
    engines: {node: '>=12.0.0'}
    peerDependencies:
      picomatch: ^3 || ^4
    peerDependenciesMeta:
      picomatch:
        optional: true

  fill-range@7.1.1:
    resolution: {integrity: sha512-YsGpe3WHLK8ZYi4tWDg2Jy3ebRz2rXowDxnld4bkQB00cc/1Zw9AWnC0i9ztDJitivtQvaI9KaLyKrc+hBW0yg==}
    engines: {node: '>=8'}

  follow-redirects@1.16.0:
    resolution: {integrity: sha512-y5rN/uOsadFT/JfYwhxRS5R7Qce+g3zG97+JrtFZlC9klX/W5hD7iiLzScI4nZqUS7DNUdhPgw4xI8W2LuXlUw==}
    engines: {node: '>=4.0'}
    peerDependencies:
      debug: '*'
    peerDependenciesMeta:
      debug:
        optional: true

  form-data@4.0.6:
    resolution: {integrity: sha512-vKatAh4SlVfgbv+YtmhiRjhEMJsYpsG1Y2rMQtR+SVSbytsSD1YGzDIcrAJmdFec88u/+VoGmxnl+80gL1tRCQ==}
    engines: {node: '>= 6'}

  fraction.js@5.3.4:
    resolution: {integrity: sha512-1X1NTtiJphryn/uLQz3whtY6jK3fTqoE3ohKs0tT+Ujr1W59oopxmoEh7Lu5p6vBaPbgoM0bzveAW4Qi5RyWDQ==}

  fsevents@2.3.3:
    resolution: {integrity: sha512-5xoDfX+fL7faATnagmWPpbFtwh/R77WmMMqqHGS65C3vvB0YHrgF+B1YmZ3441tMj5n63k0212XNoJwzlhffQw==}
    engines: {node: ^8.16.0 || ^10.6.0 || >=11.0.0}
    os: [darwin]

  function-bind@1.1.2:
    resolution: {integrity: sha512-7XHNxH7qX9xG5mIwxkhumTox/MIRNcOgDrxWsMt2pAr23WHp6MrRlN7FBSFpCpr+oVO0F744iUgR82nJMfG2SA==}

  gensync@1.0.0-beta.2:
    resolution: {integrity: sha512-3hN7NaskYvMDLQY55gnW3NQ+mesEAepTqlg+VEbj7zzqEMBVNhzcGYYeqFo/TlYz6eQiFcp1HcsCZO+nGgS8zg==}
    engines: {node: '>=6.9.0'}

  get-intrinsic@1.3.0:
    resolution: {integrity: sha512-9fSjSaos/fRIVIp+xSJlE6lfwhES7LNtKaCBIamHsjr2na1BiABJPo0mOjjz8GJDURarmCPGqaiVg5mfjb98CQ==}
    engines: {node: '>= 0.4'}

  get-proto@1.0.1:
    resolution: {integrity: sha512-sTSfBjoXBp89JvIKIefqw7U2CCebsc74kiY6awiGogKtoSGbgjYE/G/+l9sF3MWFPNc9IcoOC4ODfKHfxFmp0g==}
    engines: {node: '>= 0.4'}

  glob-parent@5.1.2:
    resolution: {integrity: sha512-AOIgSQCepiJYwP3ARnGx+5VnTu2HBYdzbGP45eLw1vr3zB3vZLeyed1sC9hnbcOc9/SrMyM5RPQrkGz4aS9Zow==}
    engines: {node: '>= 6'}

  glob-parent@6.0.2:
    resolution: {integrity: sha512-XxwI8EOhVQgWp6iDL+3b0r86f4d6AX6zSU55HfB4ydCEuXLXc5FcYeOu+nnGftS4TEju/11rt4KJPTMgbfmv4A==}
    engines: {node: '>=10.13.0'}

  gopd@1.2.0:
    resolution: {integrity: sha512-ZUKRh6/kUFoAiTAtTYPZJ3hw9wNxx+BIBOijnlG9PnrJsCcSjs1wyyD6vJpaYtgnzDrKYRSqf3OO6Rfa93xsRg==}
    engines: {node: '>= 0.4'}

  has-symbols@1.1.0:
    resolution: {integrity: sha512-1cDNdwJ2Jaohmb3sg4OmKaMBwuC48sYni5HUw2DvsC8LjGTLK9h+eb1X6RyuOHe4hT0ULCW68iomhjUoKUqlPQ==}
    engines: {node: '>= 0.4'}

  has-tostringtag@1.0.2:
    resolution: {integrity: sha512-NqADB8VjPFLM2V0VvHUewwwsw0ZWBaIdgo+ieHtK3hasLz4qeCRjYcqfB6AQrBggRKppKF8L52/VqdVsO47Dlw==}
    engines: {node: '>= 0.4'}

  hasown@2.0.4:
    resolution: {integrity: sha512-T2UbfbBEF32wiepXIsMlTW9+dDYC6wMh/t/vYA4tuOMKqWz/n3vr1NFSxQiyP+zk2mXsoMA/i/7qV6LKut1t1A==}
    engines: {node: '>= 0.4'}

  https-proxy-agent@5.0.1:
    resolution: {integrity: sha512-dFcAjpTQFgoLMzC2VwU+C/CbS7uRL0lWmxDITmqm7C+7F0Odmj6s9l6alZc6AELXhrnggM2CeWSXHGOdX2YtwA==}
    engines: {node: '>= 6'}

  is-binary-path@2.1.0:
    resolution: {integrity: sha512-ZMERYes6pDydyuGidse7OsHxtbI7WVeUEozgR/g7rd0xUimYNlvZRE/K2MgZTjWy725IfelLeVcEM97mmtRGXw==}
    engines: {node: '>=8'}

  is-core-module@2.17.0:
    resolution: {integrity: sha512-J/vG0zBCbIKOQFfufSwyXdMrsohyJIUNkrnmo6WZGzoM7tr/lsbfW5b2BvisL6zsyMzK9UxV9L6c7AoFbyXHOA==}
    engines: {node: '>= 0.4'}

  is-extglob@2.1.1:
    resolution: {integrity: sha512-SbKbANkN603Vi4jEZv49LeVJMn4yGwsbzZworEoyEiutsN3nJYdbO36zfhGJ6QEDpOZIFkDtnq5JRxmvl3jsoQ==}
    engines: {node: '>=0.10.0'}

  is-glob@4.0.3:
    resolution: {integrity: sha512-xelSayHH36ZgE7ZWhli7pW34hNbNl8Ojv5KVmkJD4hBdD3th8Tfk9vYasLM+mXWOZhFkgZfxhLSnrwRr4elSSg==}
    engines: {node: '>=0.10.0'}

  is-number@7.0.0:
    resolution: {integrity: sha512-41Cifkg6e8TylSpdtTpeLVMqvSBEVzTttHvERD741+pnZ8ANv0004MRL43QKPDlK9cGvNp6NZWZUBlbGXYxxng==}
    engines: {node: '>=0.12.0'}

  jiti@1.21.7:
    resolution: {integrity: sha512-/imKNG4EbWNrVjoNC/1H5/9GFy+tqjGBHCaSsN+P2RnPqjsLmv6UD3Ej+Kj8nBWaRAwyk7kK5ZUc+OEatnTR3A==}
    hasBin: true

  js-tokens@4.0.0:
    resolution: {integrity: sha512-RdJUflcE3cUzKiMqQgsCu06FPu9UdIJO0beYbPhHN4k6apgJtifcoCtT9bcxOpYBtpD2kCM6Sbzg4CausW/PKQ==}

  jsesc@3.1.0:
    resolution: {integrity: sha512-/sM3dO2FOzXjKQhJuo0Q173wf2KOo8t4I8vHy6lF9poUp7bKT0/NHE8fPX23PwfhnykfqnC2xRxOnVw5XuGIaA==}
    engines: {node: '>=6'}
    hasBin: true

  json5@2.2.3:
    resolution: {integrity: sha512-XmOWe7eyHYH14cLdVPoyg+GOH3rYX++KpzrylJwSW98t3Nk+U8XOl8FWKOgwtzdb8lXGf6zYwDUzeHMWfxasyg==}
    engines: {node: '>=6'}
    hasBin: true

  leaflet@1.9.4:
    resolution: {integrity: sha512-nxS1ynzJOmOlHp+iL3FyWqK89GtNL8U8rvlMOsQdTTssxZwCXh8N2NB3GDQOL+YR3XnWyZAxwQixURb+FA74PA==}

  lilconfig@3.1.3:
    resolution: {integrity: sha512-/vlFKAoH5Cgt3Ie+JLhRbwOsCQePABiU3tJ1egGvyQ+33R/vcwM2Zl2QR/LzjsBeItPt3oSVXapn+m4nQDvpzw==}
    engines: {node: '>=14'}

  lines-and-columns@1.2.4:
    resolution: {integrity: sha512-7ylylesZQ/PV29jhEDl3Ufjo6ZX7gCqJr5F7PKrqc93v7fzSymt1BpwEU8nAUXs8qzzvqhbjhK5QZg6Mt/HkBg==}

  lru-cache@5.1.1:
    resolution: {integrity: sha512-KpNARQA3Iwv+jTA0utUVVbrh+Jlrr1Fv0e56GGzAFOXN7dk/FviaDW8LHmK52DlcH4WP2n6gI8vN1aesBFgo9w==}

  lucide-react@0.468.0:
    resolution: {integrity: sha512-6koYRhnM2N0GGZIdXzSeiNwguv1gt/FAjZOiPl76roBi3xKEXa4WmfpxgQwTTL4KipXjefrnf3oV4IsYhi4JFA==}
    peerDependencies:
      react: ^16.5.1 || ^17.0.0 || ^18.0.0 || ^19.0.0-rc

  math-intrinsics@1.1.0:
    resolution: {integrity: sha512-/IXtbwEk5HTPyEwyKX6hGkYXxM9nbj64B+ilVJnC/R6B0pH5G4V3b0pVbL7DBj4tkhBAppbQUlf6F6Xl9LHu1g==}
    engines: {node: '>= 0.4'}

  merge2@1.4.1:
    resolution: {integrity: sha512-8q7VEgMJW4J8tcfVPy8g09NcQwZdbwFEqhe/WZkoIzjn/3TGDwtOCYtXGxA3O8tPzpczCCDgv+P2P5y00ZJOOg==}
    engines: {node: '>= 8'}

  micromatch@4.0.8:
    resolution: {integrity: sha512-PXwfBhYu0hBCPw8Dn0E+WDYb7af3dSLVWKi3HGv84IdF4TyFoC0ysxFd0Goxw7nSv4T/PzEJQxsYsEiFCKo2BA==}
    engines: {node: '>=8.6'}

  mime-db@1.52.0:
    resolution: {integrity: sha512-sPU4uV7dYlvtWJxwwxHD0PuihVNiE7TyAbQ5SWxDCB9mUYvOgroQOwYQQOKPJ8CIbE+1ETVlOoK1UC2nU3gYvg==}
    engines: {node: '>= 0.6'}

  mime-types@2.1.35:
    resolution: {integrity: sha512-ZDY+bPm5zTTF+YpCrAU9nK0UgICYPT0QtT1NZWFv4s++TNkcgVaT0g6+4R2uI4MjQjzysHB1zxuWL50hzaeXiw==}
    engines: {node: '>= 0.6'}

  ms@2.1.3:
    resolution: {integrity: sha512-6FlzubTLZG3J2a/NVCAleEhjzq5oxgHyaCU9yYXvcLsvoVaHJq/s5xXI6/XXP6tz7R9xAOtHnSO/tXtF3WRTlA==}

  mz@2.7.0:
    resolution: {integrity: sha512-z81GNO7nnYMEhrGh9LeymoE4+Yr0Wn5McHIZMK5cfQCl+NDX08sCZgUc9/6MHni9IWuFLm1Z3HTCXu2z9fN62Q==}

  nanoid@3.3.19:
    resolution: {integrity: sha512-Y2tUNy4ouw6tq5oDSKeQYGOyhkUBhNOcGV/02KC+6kd9eDGqdZd++mjMiIDilrBYvjEnCYvVtsuHCuP+okSfug==}
    engines: {node: ^10 || ^12 || ^13.7 || ^14 || >=15.0.1}
    hasBin: true

  node-releases@2.0.57:
    resolution: {integrity: sha512-kQK9LGGFiHtrWiNhZtA7Qbw17AQz+dmsEKODRIVTXA9+e5MS/2gZEBhYJt13GrAz5/IOZKddH/0Z3TP/Zgo+yw==}
    engines: {node: '>=18'}

  normalize-path@3.0.0:
    resolution: {integrity: sha512-6eZs5Ls3WtCisHWp9S2GUy8dqkpGi4BVSz3GaqiE6ezub0512ESztXUwUB6C6IKbQkY2Pnb/mD4WYojCRwcwLA==}
    engines: {node: '>=0.10.0'}

  object-assign@4.1.1:
    resolution: {integrity: sha512-rJgTQnkUnH1sFw8yT6VSU3zD3sWmu6sZhIseY8VX+GRu3P6F7Fu+JNDoXfklElbLJSnc3FUQHVe4cU5hj+BcUg==}
    engines: {node: '>=0.10.0'}

  object-hash@3.0.0:
    resolution: {integrity: sha512-RSn9F68PjH9HqtltsSnqYC1XXoWe9Bju5+213R98cNGttag9q9yAOTzdbsqvIa7aNm5WffBZFpWYr2aWrklWAw==}
    engines: {node: '>= 6'}

  path-parse@1.0.7:
    resolution: {integrity: sha512-LDJzPVEEEPR+y48z93A0Ed0yXb8pAByGWo/k5YYdYgpY2/2EsOsksJrq7lOHxryrVOn1ejG6oAp8ahvOIQD8sw==}

  picocolors@1.1.1:
    resolution: {integrity: sha512-xceH2snhtb5M9liqDsmEw56le376mTZkEX/jEb/RxNFyegNul7eNslCXP9FDj/Lcu0X8KEyMceP2ntpaHrDEVA==}

  picomatch@2.3.2:
    resolution: {integrity: sha512-V7+vQEJ06Z+c5tSye8S+nHUfI51xoXIXjHQ99cQtKUkQqqO1kO/KCJUfZXuB47h/YBlDhah2H3hdUGXn8ie0oA==}
    engines: {node: '>=8.6'}

  picomatch@4.0.7:
    resolution: {integrity: sha512-qcJu88Q2IWqJsDD529JKMdwGm/dvInW4HvQnRwiH9JtihJvzGOscDtHE3x1pBKeUOTysQ8kVmLnJ2kJu7yhcGA==}
    engines: {node: '>=12'}

  pirates@4.0.7:
    resolution: {integrity: sha512-TfySrs/5nm8fQJDcBDuUng3VOUKsd7S+zqvbOTiGXHfxX4wK31ard+hoNuvkicM/2YFzlpDgABOevKSsB4G/FA==}
    engines: {node: '>= 6'}

  postcss-import@15.1.0:
    resolution: {integrity: sha512-hpr+J05B2FVYUAXHeK1YyI267J/dDDhMU6B6civm8hSY1jYJnBXxzKDKDswzJmtLHryrjhnDjqqp/49t8FALew==}
    engines: {node: '>=14.0.0'}
    peerDependencies:
      postcss: ^8.0.0

  postcss-js@4.1.0:
    resolution: {integrity: sha512-oIAOTqgIo7q2EOwbhb8UalYePMvYoIeRY2YKntdpFQXNosSu3vLrniGgmH9OKs/qAkfoj5oB3le/7mINW1LCfw==}
    engines: {node: ^12 || ^14 || >= 16}
    peerDependencies:
      postcss: ^8.4.21

  postcss-load-config@6.0.1:
    resolution: {integrity: sha512-oPtTM4oerL+UXmx+93ytZVN82RrlY/wPUV8IeDxFrzIjXOLF1pN+EmKPLbubvKHT2HC20xXsCAH2Z+CKV6Oz/g==}
    engines: {node: '>= 18'}
    peerDependencies:
      jiti: '>=1.21.0'
      postcss: '>=8.0.9'
      tsx: ^4.8.1
      yaml: ^2.4.2
    peerDependenciesMeta:
      jiti:
        optional: true
      postcss:
        optional: true
      tsx:
        optional: true
      yaml:
        optional: true

  postcss-nested@6.2.0:
    resolution: {integrity: sha512-HQbt28KulC5AJzG+cZtj9kvKB93CFCdLvog1WFLf1D+xmMvPGlBstkpTEZfK5+AN9hfJocyBFCNiqyS48bpgzQ==}
    engines: {node: '>=12.0'}
    peerDependencies:
      postcss: ^8.2.14

  postcss-selector-parser@6.1.4:
    resolution: {integrity: sha512-bIoJLOmjCO1S9XdY/DcnR5hJxvrDir1PbGChrzXG3vw0/FOliy/fA3dmdhQ441kah4gKv+TwckGzex6wNS5cnQ==}
    engines: {node: '>=4'}

  postcss-value-parser@4.2.0:
    resolution: {integrity: sha512-1NNCs6uurfkVbeXG4S8JFT9t19m45ICnif8zWLd5oPSZ50QnwMfK+H3jv408d4jw/7Bttv5axS5IiHoLaVNHeQ==}

  postcss@8.5.28:
    resolution: {integrity: sha512-RRuzqDtt5Y9h3quz5hWhK+TPnsmVs6WwSU6LkJMeY4HstUEDuYTG8UJSdawMRzmzAtV+KEoG8N3Qg2qLy5vM/A==}
    engines: {node: ^10 || ^12 || >=14}

  proxy-from-env@2.1.0:
    resolution: {integrity: sha512-cJ+oHTW1VAEa8cJslgmUZrc+sjRKgAKl3Zyse6+PV38hZe/V6Z14TbCuXcan9F9ghlz4QrFr2c92TNF82UkYHA==}
    engines: {node: '>=10'}

  queue-microtask@1.2.3:
    resolution: {integrity: sha512-NuaNSa6flKT5JaSYQzJok04JzTL1CA6aGhv5rfLW3PgqA+M2ChpZQnAC8h8i4ZFkBS8X5RqkDBHA7r4hej3K9A==}

  react-dom@19.3.0:
    resolution: {integrity: sha512-JDk8dgif51OjFoDE70+OT9ICyYr+69HlmihNwp1+Nsfbna3t5sIiCa9ZJktDmQ4/1b/rn26hIAR2uYXDMr5r0Q==}
    peerDependencies:
      react: ^19.3.0

  react-refresh@0.17.0:
    resolution: {integrity: sha512-z6F7K9bV85EfseRCp2bzrpyQ0Gkw1uLoCel9XBVWPg/TjRj94SkJzUTGfOa4bs7iJvBWtQG0Wq7wnI0syw3EBQ==}
    engines: {node: '>=0.10.0'}

  react-router-dom@6.30.6:
    resolution: {integrity: sha512-0RHKZz7wwffvkU+2MFVT2NnjK44ssLEV+m0CAJaS2Ksmorrwj7WxH00jO0SOCW26/tINUnJHToXblDs33I38YQ==}
    engines: {node: '>=14.0.0'}
    peerDependencies:
      react: '>=16.8'
      react-dom: '>=16.8'

  react-router@6.30.6:
    resolution: {integrity: sha512-5HfK7k5im7LTOB0EqCQmfvy4C13G92Ssj1VTmouTK3AJvyjKTnFuCV0vcMAD/JS+JC4DvDIBRrlAeJIFjh5VWg==}
    engines: {node: '>=14.0.0'}
    peerDependencies:
      react: '>=16.8'

  react@19.3.0:
    resolution: {integrity: sha512-E8LUcbtBWt20bbl2YoHfx4ZDBdxVTfOKtCZn9cDSJ4l6/nuoApcpIBcj47t2wZoVX8g2ZHuMHbiShgCR1T5Sog==}
    engines: {node: '>=0.10.0'}

  read-cache@1.0.2:
    resolution: {integrity: sha512-/peqiBB/n07gQGLsWaHho3WfvUyRscw0gYTsEFMhrIe/nWLkYaf5SbKYjGYqtRV3aPwykJgF2VEMo1ac4bnsGA==}

  readdirp@3.6.0:
    resolution: {integrity: sha512-hOS089on8RduqdbhvQ5Z37A0ESjsqz6qnRcffsMU3495FuTdqSm+7bhJ29JvIOsBDEEnan5DPu9t3To9VRlMzA==}
    engines: {node: '>=8.10.0'}

  resolve@1.22.12:
    resolution: {integrity: sha512-TyeJ1zif53BPfHootBGwPRYT1RUt6oGWsaQr8UyZW/eAm9bKoijtvruSDEmZHm92CwS9nj7/fWttqPCgzep8CA==}
    engines: {node: '>= 0.4'}
    hasBin: true

  reusify@1.1.0:
    resolution: {integrity: sha512-g6QUff04oZpHs0eG5p83rFLhHeV00ug/Yf9nZM6fLeUrPguBTkTQOdpAWWspMh55TZfVQDPaN3NQJfbVRAxdIw==}
    engines: {iojs: '>=1.0.0', node: '>=0.10.0'}

  rollup@4.63.5:
    resolution: {integrity: sha512-KRWwmNLlPw5M7HcdYfm15oBv9n9LPtjzpzCIxS/phwqvPyxHSoKX6Y2YU3pxSPfy0CLquVgsx/j/hBi6OvH1Nw==}
    engines: {node: '>=18.0.0', npm: '>=8.0.0'}
    hasBin: true

  run-parallel@1.2.0:
    resolution: {integrity: sha512-5l4VyZR86LZ/lDxZTR6jqL8AFE2S0IFLMP26AbjsLVADxHdhB/c0GUsH+y39UfCi3dzz8OlQuPmnaJOMoDHQBA==}

  scheduler@0.28.0:
    resolution: {integrity: sha512-juorfCmIkIw8tT+p5BXSm6PJjQF/ycEYmKyzURCIt/RaZIhL+PulbQ9Yu2z1HdOJDdqDTlxA1+xKBmHXJsczAw==}

  semver@6.3.1:
    resolution: {integrity: sha512-BR7VvDCVHO+q2xBEWskxS6DJE1qRnb7DxzUrogb71CWoSficBxYsiAGd+Kl0mmq/MprG9yArRkyrQxTO6XjMzA==}
    hasBin: true

  source-map-js@1.2.1:
    resolution: {integrity: sha512-UXWMKhLOwVKb728IUtQPXxfYU+usdybtUrK/8uGE8CQMvrhOpwvzDBwj0QhSL7MQc7vIsISBG8VQ8+IDQxpfQA==}
    engines: {node: '>=0.10.0'}

  sucrase@3.35.1:
    resolution: {integrity: sha512-DhuTmvZWux4H1UOnWMB3sk0sbaCVOoQZjv8u1rDoTV0HTdGem9hkAZtl4JZy8P2z4Bg0nT+YMeOFyVr4zcG5Tw==}
    engines: {node: '>=16 || 14 >=14.17'}
    hasBin: true

  supports-preserve-symlinks-flag@1.0.0:
    resolution: {integrity: sha512-ot0WnXS9fgdkgIcePe6RHNk1WA8+muPa6cSjeR3V8K27q9BB1rTE3R1p7Hv0z1ZyAc8s6Vvv8DIyWf681MAt0w==}
    engines: {node: '>= 0.4'}

  tailwindcss@3.4.19:
    resolution: {integrity: sha512-3ofp+LL8E+pK/JuPLPggVAIaEuhvIz4qNcf3nA1Xn2o/7fb7s/TYpHhwGDv1ZU3PkBluUVaF8PyCHcm48cKLWQ==}
    engines: {node: '>=14.0.0'}
    hasBin: true

  thenify-all@1.6.0:
    resolution: {integrity: sha512-RNxQH/qI8/t3thXJDwcstUO4zeqo64+Uy/+sNVRBx4Xn2OX+OZ9oP+iJnNFqplFra2ZUVeKCSa2oVWi3T4uVmA==}
    engines: {node: '>=0.8'}

  thenify@3.3.1:
    resolution: {integrity: sha512-RVZSIV5IG10Hk3enotrhvz0T9em6cyHBLkH/YAZuKqd8hRkKhSfCGIcP2KUY0EPxndzANBmNllzWPwak+bheSw==}

  tinyglobby@0.2.17:
    resolution: {integrity: sha512-wXR/dYpcqKmfWpEdZjiKJOwCNFndD0DMnrW/cYjVGttEkBfVgcLFHoNrlj47mjOVic9yyNu65alsgF4NQyTa2g==}
    engines: {node: '>=12.0.0'}

  to-regex-range@5.0.1:
    resolution: {integrity: sha512-65P7iz6X5yEr1cwcgvQxbbIw7Uk3gOy5dIdtZ4rDveLqhrdJP+Li/Hx6tyK0NEb+2GCyneCMJiGqrADCSNk8sQ==}
    engines: {node: '>=8.0'}

  ts-interface-checker@0.1.13:
    resolution: {integrity: sha512-Y/arvbn+rrz3JCKl9C4kVNfTfSm2/mEp5FSz5EsZSANGPSlQrpRI5M4PKF+mJnE52jOO90PnPSc3Ur3bTQw0gA==}

  update-browserslist-db@1.3.3:
    resolution: {integrity: sha512-pJ2sYawQS0R/WI928Gj5GlPhTGzbMelq0+4INtSYNDV9ErKJcX6xjGWkoG/VnB3dpUm00zALaqkrUD77pO5TDQ==}
    hasBin: true
    peerDependencies:
      browserslist: '>= 4.21.0'

  util-deprecate@1.0.2:
    resolution: {integrity: sha512-EPD5q1uXyFxJpCrLnCc1nHnq3gOa6DZBocAIiI2TaSCA7VCJ1UJDMagCzIkXNsUYfD1daK//LTEQ8xiIbrHtcw==}

  vite@6.4.3:
    resolution: {integrity: sha512-NTKlcQjlAK7MlQoyb6LgaqHc8sso/pVyUJYWMws3jg21uTJw/LddqIFPcPqP6PzpgbIcZyKI85sFE4HBrQDA8A==}
    engines: {node: ^18.0.0 || ^20.0.0 || >=22.0.0}
    hasBin: true
    peerDependencies:
      '@types/node': ^18.0.0 || ^20.0.0 || >=22.0.0
      jiti: '>=1.21.0'
      less: '*'
      lightningcss: ^1.21.0
      sass: '*'
      sass-embedded: '*'
      stylus: '*'
      sugarss: '*'
      terser: ^5.16.0
      tsx: ^4.8.1
      yaml: ^2.4.2
    peerDependenciesMeta:
      '@types/node':
        optional: true
      jiti:
        optional: true
      less:
        optional: true
      lightningcss:
        optional: true
      sass:
        optional: true
      sass-embedded:
        optional: true
      stylus:
        optional: true
      sugarss:
        optional: true
      terser:
        optional: true
      tsx:
        optional: true
      yaml:
        optional: true

  yallist@3.1.1:
    resolution: {integrity: sha512-a4UGQaWPH59mOXUYnAG2ewncQS4i4F43Tv3JoAM+s2VDAmS9NsK8GpDMLrCHPksFT7h3K6TOoUNn2pb7RoXx4g==}

snapshots:

  '@alloc/quick-lru@5.3.0': {}

  '@babel/code-frame@7.29.7':
    dependencies:
      '@babel/helper-validator-identifier': 7.29.7
      js-tokens: 4.0.0
      picocolors: 1.1.1

  '@babel/compat-data@7.29.7': {}

  '@babel/core@7.29.7':
    dependencies:
      '@babel/code-frame': 7.29.7
      '@babel/generator': 7.29.8
      '@babel/helper-compilation-targets': 7.29.7
      '@babel/helper-module-transforms': 7.29.7(@babel/core@7.29.7)
      '@babel/helpers': 7.29.7
      '@babel/parser': 7.29.9
      '@babel/template': 7.29.7
      '@babel/traverse': 7.29.8
      '@babel/types': 7.29.8
      '@jridgewell/remapping': 2.3.5
      convert-source-map: 2.0.0
      debug: 4.4.3
      gensync: 1.0.0-beta.2
      json5: 2.2.3
      semver: 6.3.1
    transitivePeerDependencies:
      - supports-color

  '@babel/generator@7.29.8':
    dependencies:
      '@babel/parser': 7.29.9
      '@babel/types': 7.29.8
      '@jridgewell/gen-mapping': 0.3.13
      '@jridgewell/trace-mapping': 0.3.31
      jsesc: 3.1.0

  '@babel/helper-compilation-targets@7.29.7':
    dependencies:
      '@babel/compat-data': 7.29.7
      '@babel/helper-validator-option': 7.29.7
      browserslist: 4.29.2
      lru-cache: 5.1.1
      semver: 6.3.1

  '@babel/helper-globals@7.29.7': {}

  '@babel/helper-module-imports@7.29.7':
    dependencies:
      '@babel/traverse': 7.29.8
      '@babel/types': 7.29.8
    transitivePeerDependencies:
      - supports-color

  '@babel/helper-module-transforms@7.29.7(@babel/core@7.29.7)':
    dependencies:
      '@babel/core': 7.29.7
      '@babel/helper-module-imports': 7.29.7
      '@babel/helper-validator-identifier': 7.29.7
      '@babel/traverse': 7.29.8
    transitivePeerDependencies:
      - supports-color

  '@babel/helper-plugin-utils@7.29.7': {}

  '@babel/helper-string-parser@7.29.7': {}

  '@babel/helper-validator-identifier@7.29.7': {}

  '@babel/helper-validator-option@7.29.7': {}

  '@babel/helpers@7.29.7':
    dependencies:
      '@babel/template': 7.29.7
      '@babel/types': 7.29.8

  '@babel/parser@7.29.9':
    dependencies:
      '@babel/types': 7.29.8

  '@babel/plugin-transform-react-jsx-self@7.29.7(@babel/core@7.29.7)':
    dependencies:
      '@babel/core': 7.29.7
      '@babel/helper-plugin-utils': 7.29.7

  '@babel/plugin-transform-react-jsx-source@7.29.7(@babel/core@7.29.7)':
    dependencies:
      '@babel/core': 7.29.7
      '@babel/helper-plugin-utils': 7.29.7

  '@babel/template@7.29.7':
    dependencies:
      '@babel/code-frame': 7.29.7
      '@babel/parser': 7.29.9
      '@babel/types': 7.29.8

  '@babel/traverse@7.29.8':
    dependencies:
      '@babel/code-frame': 7.29.7
      '@babel/generator': 7.29.8
      '@babel/helper-globals': 7.29.7
      '@babel/parser': 7.29.9
      '@babel/template': 7.29.7
      '@babel/types': 7.29.8
      debug: 4.4.3
    transitivePeerDependencies:
      - supports-color

  '@babel/types@7.29.8':
    dependencies:
      '@babel/helper-string-parser': 7.29.7
      '@babel/helper-validator-identifier': 7.29.7

  '@esbuild/aix-ppc64@0.25.12':
    optional: true

  '@esbuild/android-arm64@0.25.12':
    optional: true

  '@esbuild/android-arm@0.25.12':
    optional: true

  '@esbuild/android-x64@0.25.12':
    optional: true

  '@esbuild/darwin-arm64@0.25.12':
    optional: true

  '@esbuild/darwin-x64@0.25.12':
    optional: true

  '@esbuild/freebsd-arm64@0.25.12':
    optional: true

  '@esbuild/freebsd-x64@0.25.12':
    optional: true

  '@esbuild/linux-arm64@0.25.12':
    optional: true

  '@esbuild/linux-arm@0.25.12':
    optional: true

  '@esbuild/linux-ia32@0.25.12':
    optional: true

  '@esbuild/linux-loong64@0.25.12':
    optional: true

  '@esbuild/linux-mips64el@0.25.12':
    optional: true

  '@esbuild/linux-ppc64@0.25.12':
    optional: true

  '@esbuild/linux-riscv64@0.25.12':
    optional: true

  '@esbuild/linux-s390x@0.25.12':
    optional: true

  '@esbuild/linux-x64@0.25.12':
    optional: true

  '@esbuild/netbsd-arm64@0.25.12':
    optional: true

  '@esbuild/netbsd-x64@0.25.12':
    optional: true

  '@esbuild/openbsd-arm64@0.25.12':
    optional: true

  '@esbuild/openbsd-x64@0.25.12':
    optional: true

  '@esbuild/openharmony-arm64@0.25.12':
    optional: true

  '@esbuild/sunos-x64@0.25.12':
    optional: true

  '@esbuild/win32-arm64@0.25.12':
    optional: true

  '@esbuild/win32-ia32@0.25.12':
    optional: true

  '@esbuild/win32-x64@0.25.12':
    optional: true

  '@jridgewell/gen-mapping@0.3.13':
    dependencies:
      '@jridgewell/sourcemap-codec': 1.6.0
      '@jridgewell/trace-mapping': 0.3.31

  '@jridgewell/remapping@2.3.5':
    dependencies:
      '@jridgewell/gen-mapping': 0.3.13
      '@jridgewell/trace-mapping': 0.3.31

  '@jridgewell/resolve-uri@3.1.2': {}

  '@jridgewell/sourcemap-codec@1.6.0': {}

  '@jridgewell/trace-mapping@0.3.31':
    dependencies:
      '@jridgewell/resolve-uri': 3.1.2
      '@jridgewell/sourcemap-codec': 1.6.0

  '@napi-rs/lzma-linux-x64-gnu@1.5.1':
    optional: true

  '@nodelib/fs.scandir@2.1.5':
    dependencies:
      '@nodelib/fs.stat': 2.0.5
      run-parallel: 1.2.0

  '@nodelib/fs.stat@2.0.5': {}

  '@nodelib/fs.walk@1.2.8':
    dependencies:
      '@nodelib/fs.scandir': 2.1.5
      fastq: 1.20.3

  '@remix-run/router@1.23.4': {}

  '@rolldown/pluginutils@1.0.0-beta.27': {}

  '@rollup/rollup-android-arm-eabi@4.63.5':
    optional: true

  '@rollup/rollup-android-arm64@4.63.5':
    optional: true

  '@rollup/rollup-darwin-arm64@4.63.5':
    optional: true

  '@rollup/rollup-darwin-x64@4.63.5':
    optional: true

  '@rollup/rollup-freebsd-arm64@4.63.5':
    optional: true

  '@rollup/rollup-freebsd-x64@4.63.5':
    optional: true

  '@rollup/rollup-linux-arm-gnueabihf@4.63.5':
    optional: true

  '@rollup/rollup-linux-arm-musleabihf@4.63.5':
    optional: true

  '@rollup/rollup-linux-arm64-gnu@4.63.5':
    optional: true

  '@rollup/rollup-linux-arm64-musl@4.63.5':
    optional: true

  '@rollup/rollup-linux-loong64-gnu@4.63.5':
    optional: true

  '@rollup/rollup-linux-loong64-musl@4.63.5':
    optional: true

  '@rollup/rollup-linux-ppc64-gnu@4.63.5':
    optional: true

  '@rollup/rollup-linux-ppc64-musl@4.63.5':
    optional: true

  '@rollup/rollup-linux-riscv64-gnu@4.63.5':
    optional: true

  '@rollup/rollup-linux-riscv64-musl@4.63.5':
    optional: true

  '@rollup/rollup-linux-s390x-gnu@4.63.5':
    optional: true

  '@rollup/rollup-linux-x64-gnu@4.63.5':
    optional: true

  '@rollup/rollup-linux-x64-musl@4.63.5':
    optional: true

  '@rollup/rollup-openbsd-x64@4.63.5':
    optional: true

  '@rollup/rollup-openharmony-arm64@4.63.5':
    optional: true

  '@rollup/rollup-win32-arm64-msvc@4.63.5':
    optional: true

  '@rollup/rollup-win32-ia32-msvc@4.63.5':
    optional: true

  '@rollup/rollup-win32-x64-gnu@4.63.5':
    optional: true

  '@rollup/rollup-win32-x64-msvc@4.63.5':
    optional: true

  '@types/babel__core@7.20.5':
    dependencies:
      '@babel/parser': 7.29.9
      '@babel/types': 7.29.8
      '@types/babel__generator': 7.27.0
      '@types/babel__template': 7.4.4
      '@types/babel__traverse': 7.28.0

  '@types/babel__generator@7.27.0':
    dependencies:
      '@babel/types': 7.29.8

  '@types/babel__template@7.4.4':
    dependencies:
      '@babel/parser': 7.29.9
      '@babel/types': 7.29.8

  '@types/babel__traverse@7.28.0':
    dependencies:
      '@babel/types': 7.29.8

  '@types/estree@1.0.9': {}

  '@vitejs/plugin-react@4.7.0(vite@6.4.3(jiti@1.21.7))':
    dependencies:
      '@babel/core': 7.29.7
      '@babel/plugin-transform-react-jsx-self': 7.29.7(@babel/core@7.29.7)
      '@babel/plugin-transform-react-jsx-source': 7.29.7(@babel/core@7.29.7)
      '@rolldown/pluginutils': 1.0.0-beta.27
      '@types/babel__core': 7.20.5
      react-refresh: 0.17.0
      vite: 6.4.3(jiti@1.21.7)
    transitivePeerDependencies:
      - supports-color

  agent-base@6.0.2:
    dependencies:
      debug: 4.4.3
    transitivePeerDependencies:
      - supports-color

  any-promise@1.3.0: {}

  anymatch@3.1.3:
    dependencies:
      normalize-path: 3.0.0
      picomatch: 2.3.2

  arg@5.0.2: {}

  asynckit@0.4.0: {}

  autoprefixer@10.6.1(postcss@8.5.28):
    dependencies:
      browserslist: 4.29.2
      caniuse-lite: 1.0.30001813
      fraction.js: 5.3.4
      picocolors: 1.1.1
      postcss: 8.5.28
      postcss-value-parser: 4.2.0

  axios@1.20.0(debug@4.4.3):
    dependencies:
      follow-redirects: 1.16.0(debug@4.4.3)
      form-data: 4.0.6
      https-proxy-agent: 5.0.1
      proxy-from-env: 2.1.0
    transitivePeerDependencies:
      - debug
      - supports-color

  baseline-browser-mapping@2.11.26: {}

  binary-extensions@2.3.0: {}

  braces@3.0.3:
    dependencies:
      fill-range: 7.1.1

  browserslist@4.29.2:
    dependencies:
      baseline-browser-mapping: 2.11.26
      caniuse-lite: 1.0.30001813
      electron-to-chromium: 1.5.439
      node-releases: 2.0.57
      update-browserslist-db: 1.3.3(browserslist@4.29.2)

  call-bind-apply-helpers@1.0.2:
    dependencies:
      es-errors: 1.3.0
      function-bind: 1.1.2

  camelcase-css@2.0.1: {}

  caniuse-lite@1.0.30001813: {}

  chokidar@3.6.0:
    dependencies:
      anymatch: 3.1.3
      braces: 3.0.3
      glob-parent: 5.1.2
      is-binary-path: 2.1.0
      is-glob: 4.0.3
      normalize-path: 3.0.0
      readdirp: 3.6.0
    optionalDependencies:
      fsevents: 2.3.3

  combined-stream@1.0.8:
    dependencies:
      delayed-stream: 1.0.0

  commander@4.1.1: {}

  convert-source-map@2.0.0: {}

  cssesc@3.0.0: {}

  debug@4.4.3:
    dependencies:
      ms: 2.1.3

  delayed-stream@1.0.0: {}

  didyoumean@1.2.2: {}

  dlv@1.1.3: {}

  dunder-proto@1.0.1:
    dependencies:
      call-bind-apply-helpers: 1.0.2
      es-errors: 1.3.0
      gopd: 1.2.0

  electron-to-chromium@1.5.439: {}

  es-define-property@1.0.1: {}

  es-errors@1.3.0: {}

  es-object-atoms@1.1.2:
    dependencies:
      es-errors: 1.3.0

  es-set-tostringtag@2.1.0:
    dependencies:
      es-errors: 1.3.0
      get-intrinsic: 1.3.0
      has-tostringtag: 1.0.2
      hasown: 2.0.4

  esbuild@0.25.12:
    optionalDependencies:
      '@esbuild/aix-ppc64': 0.25.12
      '@esbuild/android-arm': 0.25.12
      '@esbuild/android-arm64': 0.25.12
      '@esbuild/android-x64': 0.25.12
      '@esbuild/darwin-arm64': 0.25.12
      '@esbuild/darwin-x64': 0.25.12
      '@esbuild/freebsd-arm64': 0.25.12
      '@esbuild/freebsd-x64': 0.25.12
      '@esbuild/linux-arm': 0.25.12
      '@esbuild/linux-arm64': 0.25.12
      '@esbuild/linux-ia32': 0.25.12
      '@esbuild/linux-loong64': 0.25.12
      '@esbuild/linux-mips64el': 0.25.12
      '@esbuild/linux-ppc64': 0.25.12
      '@esbuild/linux-riscv64': 0.25.12
      '@esbuild/linux-s390x': 0.25.12
      '@esbuild/linux-x64': 0.25.12
      '@esbuild/netbsd-arm64': 0.25.12
      '@esbuild/netbsd-x64': 0.25.12
      '@esbuild/openbsd-arm64': 0.25.12
      '@esbuild/openbsd-x64': 0.25.12
      '@esbuild/openharmony-arm64': 0.25.12
      '@esbuild/sunos-x64': 0.25.12
      '@esbuild/win32-arm64': 0.25.12
      '@esbuild/win32-ia32': 0.25.12
      '@esbuild/win32-x64': 0.25.12

  escalade@3.2.0: {}

  fast-glob@3.3.3:
    dependencies:
      '@nodelib/fs.stat': 2.0.5
      '@nodelib/fs.walk': 1.2.8
      glob-parent: 5.1.2
      merge2: 1.4.1
      micromatch: 4.0.8

  fastq@1.20.3:
    dependencies:
      reusify: 1.1.0

  fdir@6.5.0(picomatch@4.0.7):
    optionalDependencies:
      picomatch: 4.0.7

  fill-range@7.1.1:
    dependencies:
      to-regex-range: 5.0.1

  follow-redirects@1.16.0(debug@4.4.3):
    optionalDependencies:
      debug: 4.4.3

  form-data@4.0.6:
    dependencies:
      asynckit: 0.4.0
      combined-stream: 1.0.8
      es-set-tostringtag: 2.1.0
      hasown: 2.0.4
      mime-types: 2.1.35

  fraction.js@5.3.4: {}

  fsevents@2.3.3:
    optional: true

  function-bind@1.1.2: {}

  gensync@1.0.0-beta.2: {}

  get-intrinsic@1.3.0:
    dependencies:
      call-bind-apply-helpers: 1.0.2
      es-define-property: 1.0.1
      es-errors: 1.3.0
      es-object-atoms: 1.1.2
      function-bind: 1.1.2
      get-proto: 1.0.1
      gopd: 1.2.0
      has-symbols: 1.1.0
      hasown: 2.0.4
      math-intrinsics: 1.1.0

  get-proto@1.0.1:
    dependencies:
      dunder-proto: 1.0.1
      es-object-atoms: 1.1.2

  glob-parent@5.1.2:
    dependencies:
      is-glob: 4.0.3

  glob-parent@6.0.2:
    dependencies:
      is-glob: 4.0.3

  gopd@1.2.0: {}

  has-symbols@1.1.0: {}

  has-tostringtag@1.0.2:
    dependencies:
      has-symbols: 1.1.0

  hasown@2.0.4:
    dependencies:
      function-bind: 1.1.2

  https-proxy-agent@5.0.1:
    dependencies:
      agent-base: 6.0.2
      debug: 4.4.3
    transitivePeerDependencies:
      - supports-color

  is-binary-path@2.1.0:
    dependencies:
      binary-extensions: 2.3.0

  is-core-module@2.17.0:
    dependencies:
      hasown: 2.0.4

  is-extglob@2.1.1: {}

  is-glob@4.0.3:
    dependencies:
      is-extglob: 2.1.1

  is-number@7.0.0: {}

  jiti@1.21.7: {}

  js-tokens@4.0.0: {}

  jsesc@3.1.0: {}

  json5@2.2.3: {}

  leaflet@1.9.4: {}

  lilconfig@3.1.3: {}

  lines-and-columns@1.2.4: {}

  lru-cache@5.1.1:
    dependencies:
      yallist: 3.1.1

  lucide-react@0.468.0(react@19.3.0):
    dependencies:
      react: 19.3.0

  math-intrinsics@1.1.0: {}

  merge2@1.4.1: {}

  micromatch@4.0.8:
    dependencies:
      braces: 3.0.3
      picomatch: 2.3.2

  mime-db@1.52.0: {}

  mime-types@2.1.35:
    dependencies:
      mime-db: 1.52.0

  ms@2.1.3: {}

  mz@2.7.0:
    dependencies:
      any-promise: 1.3.0
      object-assign: 4.1.1
      thenify-all: 1.6.0

  nanoid@3.3.19: {}

  node-releases@2.0.57: {}

  normalize-path@3.0.0: {}

  object-assign@4.1.1: {}

  object-hash@3.0.0: {}

  path-parse@1.0.7: {}

  picocolors@1.1.1: {}

  picomatch@2.3.2: {}

  picomatch@4.0.7: {}

  pirates@4.0.7: {}

  postcss-import@15.1.0(postcss@8.5.28):
    dependencies:
      postcss: 8.5.28
      postcss-value-parser: 4.2.0
      read-cache: 1.0.2
      resolve: 1.22.12

  postcss-js@4.1.0(postcss@8.5.28):
    dependencies:
      camelcase-css: 2.0.1
      postcss: 8.5.28

  postcss-load-config@6.0.1(jiti@1.21.7)(postcss@8.5.28):
    dependencies:
      lilconfig: 3.1.3
    optionalDependencies:
      jiti: 1.21.7
      postcss: 8.5.28

  postcss-nested@6.2.0(postcss@8.5.28):
    dependencies:
      postcss: 8.5.28
      postcss-selector-parser: 6.1.4

  postcss-selector-parser@6.1.4:
    dependencies:
      cssesc: 3.0.0
      util-deprecate: 1.0.2

  postcss-value-parser@4.2.0: {}

  postcss@8.5.28:
    dependencies:
      nanoid: 3.3.19
      picocolors: 1.1.1
      source-map-js: 1.2.1

  proxy-from-env@2.1.0: {}

  queue-microtask@1.2.3: {}

  react-dom@19.3.0(react@19.3.0):
    dependencies:
      react: 19.3.0
      scheduler: 0.28.0

  react-refresh@0.17.0: {}

  react-router-dom@6.30.6(react-dom@19.3.0(react@19.3.0))(react@19.3.0):
    dependencies:
      '@remix-run/router': 1.23.4
      react: 19.3.0
      react-dom: 19.3.0(react@19.3.0)
      react-router: 6.30.6(react@19.3.0)

  react-router@6.30.6(react@19.3.0):
    dependencies:
      '@remix-run/router': 1.23.4
      react: 19.3.0

  react@19.3.0: {}

  read-cache@1.0.2: {}

  readdirp@3.6.0:
    dependencies:
      picomatch: 2.3.2

  resolve@1.22.12:
    dependencies:
      es-errors: 1.3.0
      is-core-module: 2.17.0
      path-parse: 1.0.7
      supports-preserve-symlinks-flag: 1.0.0

  reusify@1.1.0: {}

  rollup@4.63.5:
    dependencies:
      '@types/estree': 1.0.9
    optionalDependencies:
      '@napi-rs/lzma-linux-x64-gnu': 1.5.1
      '@rollup/rollup-android-arm-eabi': 4.63.5
      '@rollup/rollup-android-arm64': 4.63.5
      '@rollup/rollup-darwin-arm64': 4.63.5
      '@rollup/rollup-darwin-x64': 4.63.5
      '@rollup/rollup-freebsd-arm64': 4.63.5
      '@rollup/rollup-freebsd-x64': 4.63.5
      '@rollup/rollup-linux-arm-gnueabihf': 4.63.5
      '@rollup/rollup-linux-arm-musleabihf': 4.63.5
      '@rollup/rollup-linux-arm64-gnu': 4.63.5
      '@rollup/rollup-linux-arm64-musl': 4.63.5
      '@rollup/rollup-linux-loong64-gnu': 4.63.5
      '@rollup/rollup-linux-loong64-musl': 4.63.5
      '@rollup/rollup-linux-ppc64-gnu': 4.63.5
      '@rollup/rollup-linux-ppc64-musl': 4.63.5
      '@rollup/rollup-linux-riscv64-gnu': 4.63.5
      '@rollup/rollup-linux-riscv64-musl': 4.63.5
      '@rollup/rollup-linux-s390x-gnu': 4.63.5
      '@rollup/rollup-linux-x64-gnu': 4.63.5
      '@rollup/rollup-linux-x64-musl': 4.63.5
      '@rollup/rollup-openbsd-x64': 4.63.5
      '@rollup/rollup-openharmony-arm64': 4.63.5
      '@rollup/rollup-win32-arm64-msvc': 4.63.5
      '@rollup/rollup-win32-ia32-msvc': 4.63.5
      '@rollup/rollup-win32-x64-gnu': 4.63.5
      '@rollup/rollup-win32-x64-msvc': 4.63.5
      fsevents: 2.3.3

  run-parallel@1.2.0:
    dependencies:
      queue-microtask: 1.2.3

  scheduler@0.28.0: {}

  semver@6.3.1: {}

  source-map-js@1.2.1: {}

  sucrase@3.35.1:
    dependencies:
      '@jridgewell/gen-mapping': 0.3.13
      commander: 4.1.1
      lines-and-columns: 1.2.4
      mz: 2.7.0
      pirates: 4.0.7
      tinyglobby: 0.2.17
      ts-interface-checker: 0.1.13

  supports-preserve-symlinks-flag@1.0.0: {}

  tailwindcss@3.4.19:
    dependencies:
      '@alloc/quick-lru': 5.3.0
      arg: 5.0.2
      chokidar: 3.6.0
      didyoumean: 1.2.2
      dlv: 1.1.3
      fast-glob: 3.3.3
      glob-parent: 6.0.2
      is-glob: 4.0.3
      jiti: 1.21.7
      lilconfig: 3.1.3
      micromatch: 4.0.8
      normalize-path: 3.0.0
      object-hash: 3.0.0
      picocolors: 1.1.1
      postcss: 8.5.28
      postcss-import: 15.1.0(postcss@8.5.28)
      postcss-js: 4.1.0(postcss@8.5.28)
      postcss-load-config: 6.0.1(jiti@1.21.7)(postcss@8.5.28)
      postcss-nested: 6.2.0(postcss@8.5.28)
      postcss-selector-parser: 6.1.4
      resolve: 1.22.12
      sucrase: 3.35.1
    transitivePeerDependencies:
      - tsx
      - yaml

  thenify-all@1.6.0:
    dependencies:
      thenify: 3.3.1

  thenify@3.3.1:
    dependencies:
      any-promise: 1.3.0

  tinyglobby@0.2.17:
    dependencies:
      fdir: 6.5.0(picomatch@4.0.7)
      picomatch: 4.0.7

  to-regex-range@5.0.1:
    dependencies:
      is-number: 7.0.0

  ts-interface-checker@0.1.13: {}

  update-browserslist-db@1.3.3(browserslist@4.29.2):
    dependencies:
      browserslist: 4.29.2
      escalade: 3.2.0
      picocolors: 1.1.1

  util-deprecate@1.0.2: {}

  vite@6.4.3(jiti@1.21.7):
    dependencies:
      esbuild: 0.25.12
      fdir: 6.5.0(picomatch@4.0.7)
      picomatch: 4.0.7
      postcss: 8.5.28
      rollup: 4.63.5
      tinyglobby: 0.2.17
    optionalDependencies:
      fsevents: 2.3.3
      jiti: 1.21.7

  yallist@3.1.1: {}

```

## frontend/pnpm-workspace.yaml

```text
allowBuilds:
  esbuild: true

```

## frontend/postcss.config.js

```javascript
export default { plugins: { tailwindcss: {}, autoprefixer: {} } };

```

## frontend/public/favicon.svg

```text
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="18" fill="#176b62"/><path d="m13 35 18-5 6-17 6-2-3 19 12 8-1 5-15-5-7 13-4-1 2-15-14 4z" fill="white"/></svg>

```

## frontend/src/airport-board.css

```css
.airport-board {
  --airport-board-gold: #dcc182;
  --airport-board-charcoal: #242c2e;
  --airport-board-line: #d9dfdc;
  border: 1px solid #d2dad5;
  border-radius: 15px;
  overflow: hidden;
  background: #e9edeb;
  color: #263d37;
  box-shadow: 0 12px 35px #263d3707;
}
.airport-board .airport-board-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 28px;
  padding: 28px 30px;
  background: var(--airport-board-charcoal);
  color: #f2f4ee;
}
.airport-board .airport-board-identity {
  min-width: 0;
}
.airport-board .airport-board-brand {
  display: flex;
  align-items: center;
  gap: 9px;
  font-size: 9px;
  letter-spacing: 1.8px;
  color: #c1cbc2;
  font-weight: 650;
}
.airport-board .airport-board-brand svg {
  color: var(--airport-board-gold);
  flex-shrink: 0;
}
.airport-board .airport-board-header h2 {
  margin: 12px 0 10px;
  font-size: clamp(24px, 3vw, 36px);
  font-weight: 550;
  line-height: 1.25;
  color: #f3f3ec;
  letter-spacing: -0.035em;
}
.airport-board .airport-board-location {
  display: flex;
  gap: 7px;
  align-items: center;
  color: var(--airport-board-gold);
  font-size: 13px;
  font-weight: 650;
  letter-spacing: 2.2px;
}
.airport-board .airport-board-location bdi > span {
  opacity: 0.5;
  margin-inline: 5px;
}
.airport-board .airport-board-clock {
  text-align: end;
  flex-shrink: 0;
  border-inline-start: 1px solid #526059;
  padding-inline-start: 28px;
}
.airport-board .airport-board-clock > span {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;
  font-size: 10px;
  color: #b9c7bc;
}
.airport-board .airport-board-clock time {
  display: block;
}
.airport-board .airport-board-clock strong {
  display: block;
  font-size: 29px;
  line-height: 1.5;
  color: var(--airport-board-gold);
  font-weight: 550;
  font-variant-numeric: tabular-nums;
  letter-spacing: 1px;
}
.airport-board .airport-board-clock small {
  font-size: 10px;
  color: #c6d0c6;
}
.airport-board .airport-board-demo {
  display: flex;
  gap: 18px;
  align-items: center;
  border-bottom: 1px solid #daceac;
  padding: 14px 25px;
  background: #f5eedb;
  color: #785d27;
}
.airport-board .airport-board-demo strong {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  line-height: 1.5;
  flex-shrink: 0;
}
.airport-board .airport-board-demo strong svg {
  flex-shrink: 0;
}
.airport-board .airport-board-demo p {
  font-size: 11px;
  line-height: 1.7;
  margin: 0;
}
.airport-board .airport-board-body {
  min-height: 190px;
}
.airport-board .airport-board-date {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 17px 24px 13px;
  background: #dfe5e1;
  border-top: 1px solid #d4ddd6;
}
.airport-board .airport-board-date h3 {
  margin: 0;
  font-size: 13px;
  color: #425c4e;
  font-weight: 650;
  letter-spacing: 0;
  line-height: 1.65;
}
.airport-board .airport-board-date > span {
  flex-shrink: 0;
  color: #566952;
  font-size: 10px;
  white-space: nowrap;
}
.airport-board .airport-board-columns {
  display: grid;
  grid-template-columns: 185px minmax(0, 1fr) 165px 28px;
  gap: 16px;
  padding: 10px 25px;
  background: #e9edeb;
  font-size: 9px;
  color: #566952;
  text-transform: uppercase;
  letter-spacing: 0.8px;
}
.airport-board .airport-board-flight-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.airport-board .airport-board-flight {
  border-top: 1px solid var(--airport-board-line);
  background: #f5f7f5;
}
.airport-board .airport-board-flight:nth-child(even) {
  background: #ecefed;
}
.airport-board .airport-board-row {
  display: grid;
  grid-template-columns: 185px minmax(0, 1fr) 165px 28px;
  align-items: center;
  gap: 16px;
  padding: 18px 25px;
  width: 100%;
  text-align: start;
  border: 0;
  border-radius: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
  font-family: inherit;
  min-height: 91px;
  transition: background-color 0.15s;
}
.airport-board .airport-board-row:hover {
  background: #e4ebe5;
}
.airport-board .airport-board-row:focus-visible {
  outline: 2px solid #39795c;
  outline-offset: -3px;
}
.airport-board .airport-board-times {
  display: flex;
  gap: 22px;
  align-items: start;
  font-variant-numeric: tabular-nums;
}
.airport-board .airport-board-time {
  min-width: 0;
}
.airport-board .airport-board-time small {
  display: block;
  font-size: 9px;
  color: #566952;
  margin-bottom: 4px;
  font-weight: 400;
}
.airport-board .airport-board-time strong {
  display: block;
  font-size: 23px;
  line-height: 1.25;
  font-weight: 550;
  color: #2c4838;
  white-space: nowrap;
  letter-spacing: -0.5px;
}
.airport-board .airport-board-estimated strong {
  color: #566952;
  font-size: 20px;
  line-height: 1.45;
}
.airport-board .airport-board-route {
  display: block;
  min-width: 0;
}
.airport-board .airport-board-city {
  display: flex;
  gap: 8px;
  align-items: baseline;
  flex-wrap: wrap;
  font-size: 19px;
  line-height: 1.45;
  font-weight: 550;
  color: #304e3a;
  overflow-wrap: anywhere;
}
.airport-board .airport-board-city > bdi {
  font-size: 10px;
  color: #566952;
  padding: 2px 5px;
  background: #dfe8df;
  border-radius: 3px;
  font-weight: 600;
  letter-spacing: 0.4px;
}
.airport-board .airport-board-flight-meta {
  display: flex;
  gap: 7px;
  align-items: center;
  flex-wrap: wrap;
  font-size: 11px;
  color: #566952;
  margin-top: 5px;
  line-height: 1.5;
}
.airport-board .airport-board-flight-meta > bdi {
  color: #4c6950;
  font-weight: 650;
}
.airport-board .airport-board-meta-dot {
  display: block;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: #a4b19c;
  flex-shrink: 0;
}
.airport-board .airport-board-status-slot {
  min-width: 0;
}
.airport-board .airport-board-status {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 7px 10px;
  border-radius: 5px;
  background: #e5eae5;
  color: #55684f;
  font-size: 10px;
  font-weight: 650;
  line-height: 1.5;
}
.airport-board .airport-board-status i {
  display: block;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: currentColor;
  flex-shrink: 0;
}
.airport-board .airport-board-status-ON_TIME,
.airport-board .airport-board-status-ARRIVED {
  color: #34754f;
  background: #e1eddf;
}
.airport-board .airport-board-status-BOARDING {
  color: #346a81;
  background: #e2ecef;
}
.airport-board .airport-board-status-DELAYED {
  color: #805a20;
  background: #f4e7c9;
}
.airport-board .airport-board-status-CANCELLED {
  color: #96463d;
  background: #f5dfd9;
}
.airport-board .airport-board-expand {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #60755d;
  min-width: 24px;
}
.airport-board .airport-board-expand svg {
  transition: transform 0.15s;
}
.airport-board .is-expanded .airport-board-expand svg {
  transform: rotate(180deg);
}
.airport-board .is-expanded > .airport-board-row {
  background: #e2eae2;
}
.airport-board .airport-board-detail {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  border-top: 1px solid #d2dfd0;
  padding: 18px 25px;
  background: #f6f9f3;
}
.airport-board .airport-board-detail[hidden] {
  display: none;
}
.airport-board .airport-board-detail dl {
  display: flex;
  flex-wrap: wrap;
  gap: 25px;
  margin: 0;
  min-width: 0;
}
.airport-board .airport-board-detail dl > div {
  min-width: 80px;
}
.airport-board .airport-board-detail dt {
  color: #566952;
  font-size: 10px;
  margin-bottom: 5px;
}
.airport-board .airport-board-detail dd {
  margin: 0;
  color: #496143;
  font-size: 13px;
  font-weight: 600;
  overflow-wrap: anywhere;
}
.airport-board .airport-board-detail-link {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  color: #176b62;
  font-size: 11px;
  min-height: 40px;
  font-weight: 600;
  flex-shrink: 0;
}
.airport-board .airport-board-tabs {
  display: grid;
  grid-template-columns: 1fr 1fr 1.2fr;
  border-top: 1px solid #38413d;
  background: var(--airport-board-charcoal);
  padding: 0 14px;
}
.airport-board .airport-board-tabs > button,
.airport-board .airport-board-tabs > a {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 7px;
  min-height: 82px;
  padding: 14px 12px 12px;
  color: #a8b7aa;
  font-family: inherit;
  font-size: 11px;
  line-height: 1.5;
  text-align: center;
  font-weight: 550;
  border: 0;
  border-radius: 0;
  border-top: 3px solid transparent;
  background: transparent;
  cursor: pointer;
}
.airport-board .airport-board-tabs > button[aria-pressed="true"] {
  color: var(--airport-board-gold);
  border-top-color: var(--airport-board-gold);
  background: #5b573b19;
}
.airport-board .airport-board-tabs > button:hover,
.airport-board .airport-board-tabs > a:hover {
  color: #f0f0de;
  background: #ffffff08;
}
.airport-board .airport-board-tabs > button:focus-visible,
.airport-board .airport-board-tabs > a:focus-visible {
  outline: 2px solid var(--airport-board-gold);
  outline-offset: -5px;
}
.airport-board .airport-board-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 12px;
  min-height: 210px;
  padding: 28px;
  text-align: center;
  color: #566952;
}
.airport-board .airport-board-empty h3 {
  font-size: 18px;
  margin: 0;
  color: #4a6844;
}
.airport-board .airport-board-empty p {
  font-size: 12px;
  line-height: 1.7;
  margin: 0;
}
.airport-board .airport-board-loader {
  animation: airport-board-spin 1.2s linear infinite;
}
.airport-board .airport-board-sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
.airport-board[dir="rtl"] .airport-board-header h2,
.airport-board[dir="rtl"] .airport-board-brand {
  letter-spacing: 0;
}
.airport-board[dir="rtl"] .airport-board-header h2 {
  line-height: 1.55;
}
@keyframes airport-board-spin {
  to {
    transform: rotate(360deg);
  }
}
@media (max-width: 1000px) {
  .airport-board .airport-board-columns,
  .airport-board .airport-board-row {
    grid-template-columns: 150px minmax(0, 1fr) 140px 24px;
    gap: 12px;
    padding-inline: 20px;
  }
  .airport-board .airport-board-times {
    gap: 15px;
  }
  .airport-board .airport-board-time strong {
    font-size: 21px;
  }
  .airport-board .airport-board-estimated strong {
    font-size: 19px;
  }
  .airport-board .airport-board-demo {
    gap: 10px;
    flex-wrap: wrap;
  }
}
@media (max-width: 760px) {
  .airport-board .airport-board-header {
    padding: 23px 21px;
    flex-wrap: wrap;
    gap: 18px;
  }
  .airport-board .airport-board-header h2 {
    font-size: 27px;
  }
  .airport-board .airport-board-clock {
    width: 100%;
    text-align: start;
    border-inline-start: 0;
    border-top: 1px solid #526059;
    padding-inline-start: 0;
    padding-top: 13px;
  }
  .airport-board .airport-board-clock > span {
    justify-content: flex-start;
    font-size: 9px;
  }
  .airport-board .airport-board-clock time {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }
  .airport-board .airport-board-clock strong {
    font-size: 25px;
  }
  .airport-board .airport-board-clock small {
    font-size: 9px;
    text-align: end;
  }
  .airport-board .airport-board-demo {
    padding: 13px 20px;
    gap: 5px;
  }
  .airport-board .airport-board-demo strong {
    font-size: 12px;
  }
  .airport-board .airport-board-demo p {
    font-size: 10px;
  }
  .airport-board .airport-board-date {
    padding: 13px 17px;
    gap: 12px;
  }
  .airport-board .airport-board-date h3 {
    font-size: 11px;
  }
  .airport-board .airport-board-date > span {
    font-size: 9px;
  }
  .airport-board .airport-board-columns {
    display: none;
  }
  .airport-board .airport-board-row {
    grid-template-columns: 93px minmax(0, 1fr) 24px;
    gap: 6px 12px;
    padding: 17px;
    min-height: 112px;
  }
  .airport-board .airport-board-times {
    grid-column: 1;
    grid-row: 1/3;
    flex-direction: column;
    gap: 10px;
  }
  .airport-board .airport-board-time small {
    font-size: 9px;
    margin-bottom: 1px;
  }
  .airport-board .airport-board-time strong {
    font-size: 23px;
  }
  .airport-board .airport-board-estimated strong {
    font-size: 20px;
  }
  .airport-board .airport-board-route {
    grid-column: 2;
    grid-row: 1;
    align-self: end;
  }
  .airport-board .airport-board-city {
    font-size: 18px;
    gap: 5px;
  }
  .airport-board .airport-board-flight-meta {
    gap: 5px;
    font-size: 10px;
    margin-top: 4px;
  }
  .airport-board .airport-board-status-slot {
    grid-column: 2;
    grid-row: 2;
    align-self: start;
  }
  .airport-board .airport-board-status {
    font-size: 9px;
    padding: 5px 7px;
    gap: 5px;
  }
  .airport-board .airport-board-expand {
    grid-column: 3;
    grid-row: 1/3;
  }
  .airport-board .airport-board-detail {
    padding: 17px;
    flex-wrap: wrap;
    gap: 10px;
  }
  .airport-board .airport-board-detail dl {
    gap: 15px;
    flex: 1;
  }
  .airport-board .airport-board-detail-link {
    min-height: 40px;
    font-size: 11px;
  }
  .airport-board .airport-board-tabs {
    padding-inline: 5px;
    grid-template-columns: 1fr 1fr 1.25fr;
  }
  .airport-board .airport-board-tabs > button,
  .airport-board .airport-board-tabs > a {
    min-height: 83px;
    padding: 12px 5px 10px;
    gap: 6px;
    font-size: 10px;
  }
  .airport-board .airport-board-tabs svg {
    width: 19px;
    height: 19px;
  }
}
@media (max-width: 380px) {
  .airport-board {
    border-radius: 11px;
  }
  .airport-board .airport-board-header {
    padding: 20px 16px;
  }
  .airport-board .airport-board-header h2 {
    font-size: 24px;
  }
  .airport-board .airport-board-brand {
    font-size: 8px;
    letter-spacing: 1.2px;
  }
  .airport-board .airport-board-row {
    grid-template-columns: 73px minmax(0, 1fr) 20px;
    padding: 15px 12px;
    gap: 7px;
  }
  .airport-board .airport-board-city {
    font-size: 16px;
  }
  .airport-board .airport-board-times {
    gap: 9px;
  }
  .airport-board .airport-board-time strong {
    font-size: 22px;
  }
  .airport-board .airport-board-estimated strong {
    font-size: 19px;
  }
  .airport-board .airport-board-flight-meta {
    font-size: 9px;
  }
  .airport-board .airport-board-demo {
    padding-inline: 15px;
  }
  .airport-board .airport-board-date {
    padding-inline: 12px;
  }
  .airport-board .airport-board-clock time {
    flex-wrap: wrap;
    gap: 3px;
  }
  .airport-board .airport-board-tabs > button,
  .airport-board .airport-board-tabs > a {
    font-size: 9px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .airport-board .airport-board-loader {
    animation: none;
  }
  .airport-board .airport-board-row,
  .airport-board .airport-board-expand svg {
    transition: none;
  }
}

```

## frontend/src/airport-identity.css

```css
/* Oujda-Angads identity; passenger pages only. */
.public-shell {
  --ink: #132d46;
  --brand: #194a72;
  --brand-dark: #102e4c;
  --paper: #f5f7fa;
  --muted: #5d6d7e;
  --line: #dde4ec;
  background: var(--paper);
  color: var(--ink);
}
.public-shell .utility-bar {
  background: #102b44;
  color: #e4eaf2;
}
.public-shell .site-header {
  background: #fffffff5;
  border-bottom-color: #e1e7ee;
}
.public-shell .brand-icon {
  background: #173c5e;
  border-radius: 50%;
}
.public-shell .brand {
  color: #122f4c;
}
.public-shell .brand-blue {
  color: #b17a30;
}
.public-shell .brand small {
  color: #586c81;
}
.public-shell .site-header nav a {
  color: #526478;
}
.public-shell .site-header nav a.active {
  color: #173c5e;
}
.public-shell .site-header nav a.active:after {
  background: #cda35d;
  height: 3px;
}
.public-shell .language-picker {
  color: #526478;
}
.public-shell .account-btn {
  border-color: #cad5e1;
  color: #173c5e;
  border-radius: 24px;
}
.public-shell .btn.primary {
  background: #194a72;
  border-color: #194a72;
}
.public-shell .btn.primary:hover {
  background: #102e4c;
  border-color: #102e4c;
}
.public-shell .text-link {
  color: #194a72;
}
.public-shell .eyebrow {
  color: #715322;
}
.public-shell .site-footer {
  background: #102b44;
}
.public-shell .site-footer .brand {
  color: #fff;
}
.public-shell .site-footer .brand small {
  color: #c5d5e3;
}
.public-shell .floating-chat {
  background: #194a72;
}
.public-shell .footer-bottom {
  border-color: #ffffff26;
}

.public-shell .airport-hero {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  background: #112d48;
  color: #fff;
  border-radius: 22px;
  min-height: 530px;
  padding: 52px 48px 80px;
  margin-bottom: 26px;
}
.airport-hero-photo {
  position: absolute;
  inset-block: 0;
  inset-inline-end: 0;
  width: 69%;
  height: 100%;
  z-index: -2;
  object-fit: cover;
  object-position: 50% 40%;
}
.airport-hero-shade {
  position: absolute;
  inset: 0;
  z-index: -1;
  background:
    linear-gradient(
      90deg,
      #112d48 0%,
      #112d48 31%,
      #112d48e8 43%,
      #112d4840 63%,
      #112d4800 100%
    ),
    linear-gradient(0deg, #0c2239c9, transparent 38%);
}
.airport-hero-content {
  position: relative;
  max-width: 54%;
}
.airport-hero-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 11px;
  font-weight: 650;
  letter-spacing: 2.2px;
  color: #f4d49c;
}
.airport-hero-eyebrow > span {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #e8bf79;
  box-shadow: 0 0 0 5px #e8bf7917;
  flex-shrink: 0;
}
.public-shell .airport-hero h1 {
  margin: 24px 0 22px;
  color: #fff;
  font-size: clamp(38px, 4.6vw, 62px);
  line-height: 1.12;
  letter-spacing: -2.6px;
  font-weight: 600;
}
.airport-hero h1 em {
  color: #f1cb88;
  font-style: normal;
  font-weight: 400;
}
.airport-hero-content > p {
  max-width: 435px;
  color: #e0e8ef;
  font-size: 14px;
  line-height: 1.85;
}
.airport-hero-actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 28px;
}
.airport-hero-actions a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  min-height: 47px;
  font-size: 12px;
  font-weight: 650;
}
.airport-hero-actions .airport-hero-primary {
  color: #172c40;
  background: #efcb8d;
  border: 1px solid #efcb8d;
  padding: 12px 17px;
  border-radius: 8px;
}
.airport-hero-actions .airport-hero-primary:hover {
  background: #ffdfa6;
}
.airport-hero-actions .airport-hero-secondary {
  color: #fff;
}
.airport-hero-actions a:focus-visible,
.airport-photo-credit a:focus-visible {
  outline: 3px solid #efcb8d;
  outline-offset: 4px;
}
.airport-hero-languages {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #d1dde8;
  font-size: 11px;
  margin-top: 25px;
}
.airport-hero-stamp {
  position: absolute;
  inset-inline-end: 26px;
  top: 25px;
  text-align: end;
  display: flex;
  flex-direction: column;
  color: white;
  background: #102d48c9;
  border: 1px solid #ffffff3d;
  padding: 12px 16px;
  border-radius: 10px;
}
.airport-hero-stamp span {
  font-size: 8px;
  letter-spacing: 1.4px;
}
.airport-hero-stamp strong {
  font-size: 46px;
  line-height: 1.15;
  font-weight: 300;
  letter-spacing: 1px;
}
.airport-hero-footer {
  position: absolute;
  inset-inline: 28px;
  bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 12px;
  color: #fff;
}
.airport-hero-location {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
}
.airport-photo-credit {
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 5px;
  background: #102a43e8;
  border-radius: 5px;
  padding: 5px 8px;
  font-size: 9px;
  line-height: 1.6;
}
.airport-photo-credit a {
  color: #fff;
  text-decoration: underline;
  text-underline-offset: 2px;
}
.public-shell .airport-hero-flights,
.public-shell .airport-hero-tracking {
  min-height: 335px;
  padding-block: 38px 75px;
}
.public-shell .airport-hero-flights h1,
.public-shell .airport-hero-tracking h1 {
  font-size: clamp(30px, 3.6vw, 45px);
  margin-block: 18px 14px;
  letter-spacing: -1.8px;
}
.airport-hero-flights .airport-hero-actions {
  margin-top: 20px;
}
.airport-hero-actions .airport-page-official {
  background: #ffffff12;
  border-color: #ffffff66;
  color: #fff;
  min-height: 40px;
}
.public-shell .airport-page,
.public-shell .tracking-page {
  padding-top: 26px;
}
.public-shell .tracking-source-strip {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
  margin-block: -12px 20px;
  font-size: 12px;
  color: #5d6d7e;
}
.tracking-source-strip strong {
  color: #183c5c;
}

.public-shell .welcome-section {
  background: #f5f7fa;
  padding: 26px 0 0;
}
.public-shell .welcome-section .airport-hero {
  margin-bottom: 0;
  min-height: 560px;
  padding-bottom: 105px;
}
.public-shell .welcome-section .airport-hero-footer {
  bottom: 43px;
}
.public-shell .flight-finder {
  margin: -26px 28px 0;
  border-radius: 14px;
  box-shadow: 0 10px 30px #1538570c;
  border-color: #e2e7ee;
}
.public-shell .finder-plane {
  color: #194a72;
  background: #edf3f9;
  border-radius: 50%;
}
.public-shell .finder-directions button.selected {
  color: #173c5e;
  border-color: #be8e43;
}
.public-shell .finder-demo {
  color: #596b7b;
}
.public-shell .finder-form input::placeholder {
  color: #687a8a;
}
.public-shell .finder-form label {
  color: #526b7d;
}
.public-shell .essential-shortcuts {
  padding: 35px 0 32px;
  border: 0;
}
.public-shell .essential-shortcuts > p {
  color: #596b7b;
  font-size: 10px;
  margin-bottom: 18px;
}
.public-shell .essential-shortcuts > div {
  gap: 12px;
}
.public-shell .essential-shortcuts a {
  border: 1px solid #e1e7ed;
  border-radius: 12px;
  min-height: 76px;
  background: white;
  color: #27445d;
  gap: 9px;
  box-shadow: 0 4px 15px #15385703;
}
.public-shell .essential-shortcuts a:hover {
  background: #edf3f9;
  border-color: #b4c5d7;
}
.public-shell .essential-shortcuts a > svg:first-child {
  color: #946924;
}
.public-shell .tracking-entry {
  background: #eaf0f6;
  border-color: #d6e1ed;
  color: #224b70;
}
.public-shell .travel-checklist {
  background: #eaf0f7;
  border-color: #d7e2ee;
}
.public-shell .travel-checklist h3 {
  color: #173b5b;
}
.public-shell .checklist-check {
  border-color: #abbdd0;
}
.public-shell .is-done .checklist-check {
  background: #194a72;
  border-color: #194a72;
}
.public-shell .service-card {
  border-color: #e0e6ee;
  border-radius: 16px;
  background: white;
}
.public-shell .service-card:hover {
  border-color: #b0c3d7;
  box-shadow: 0 10px 30px #1338550b;
  transform: translateY(-3px);
}
.public-shell .service-icon {
  background: #eef3f8;
  color: #244e73;
}
.public-shell .intelligent-assistant {
  background: #122f4b;
  border-radius: 22px;
}
.public-shell .assistant-spotlight-copy .eyebrow {
  color: #efd19b;
}
.public-shell .assistant-spotlight-copy h2 {
  color: #fff;
}
.public-shell .assistant-spotlight-copy > p {
  color: #d1dfec;
}
.public-shell .feedback-strip {
  border-color: #dce4ed;
}
.public-shell .feedback-icon {
  background: #ecf1f7;
  color: #194a72;
}

.public-shell .airport-view-nav {
  background: #e9eef4;
  border-color: #dce4ee;
  border-radius: 10px;
}
.public-shell .airport-view-nav a {
  color: #50667e;
}
.public-shell .airport-view-nav a.active {
  background: #194a72;
  color: #fff;
}
.public-shell .airport-page-filters {
  border-color: #dce4ee;
  border-radius: 10px;
}
.public-shell .airport-page-filters summary {
  color: #254865;
}
.public-shell .airport-board {
  --airport-board-charcoal: #132e48;
  --airport-board-gold: #edc988;
  --airport-board-line: #e0e6ed;
  border-color: #dce4ee;
  border-radius: 16px;
  background: #f0f4f8;
}
.public-shell .airport-board .airport-board-header {
  padding: 24px 30px;
}
.public-shell .airport-board .airport-board-header h2 {
  font-size: 27px;
}
.public-shell .airport-board .airport-board-date {
  background: #e8eef5;
  border-color: #dce4ee;
}
.public-shell .airport-board .airport-board-date h3 {
  color: #294a67;
}
.public-shell .airport-board .airport-board-columns {
  background: #f0f4f8;
  color: #526479;
}
.public-shell .airport-board .airport-board-flight {
  background: #fff;
}
.public-shell .airport-board .airport-board-flight:nth-child(even) {
  background: #f5f7fa;
}
.public-shell .airport-board .airport-board-row:hover,
.public-shell .airport-board .is-expanded > .airport-board-row {
  background: #eaf1f8;
}
.public-shell .airport-board .airport-board-city,
.public-shell .airport-board .airport-board-time strong {
  color: #173c5e;
}
.public-shell .airport-board .airport-board-estimated strong {
  color: #5d6d7e;
}
.public-shell .airport-board .airport-board-flight-meta,
.public-shell .airport-board .airport-board-time small {
  color: #576b7f;
}
.public-shell .airport-board .airport-board-flight-meta > bdi {
  color: #294c6c;
}
.public-shell .airport-board .airport-board-expand {
  color: #526b83;
}
.public-shell .airport-board .airport-board-detail {
  background: #edf3f9;
  border-color: #dae3ed;
}
.public-shell .airport-board .airport-board-detail-link {
  color: #194a72;
}
.public-shell .airport-board .airport-board-tabs {
  border-color: #2d455b;
}
.public-shell .mobile-bottom-nav {
  border-top-color: #dbe3ec;
}
.public-shell .mobile-bottom-nav a {
  color: #586f83;
}
.public-shell .mobile-bottom-nav a.active {
  background: #edf2f8;
  color: #194a72;
}

[dir="rtl"] .airport-hero-shade {
  background:
    linear-gradient(
      270deg,
      #112d48 0%,
      #112d48 31%,
      #112d48e8 43%,
      #112d4840 63%,
      #112d4800 100%
    ),
    linear-gradient(0deg, #0c2239c9, transparent 38%);
}
.public-shell[dir="rtl"] .airport-hero h1,
[dir="rtl"] .public-shell .airport-hero h1 {
  letter-spacing: 0;
  line-height: 1.5;
}
[dir="rtl"] .airport-hero-eyebrow,
[dir="rtl"] .airport-hero-stamp span {
  letter-spacing: 0;
}
@media (max-width: 1100px) {
  .public-shell .airport-hero {
    padding-inline: 32px;
  }
  .public-shell .airport-hero h1 {
    font-size: 46px;
  }
  .public-shell .essential-shortcuts a {
    flex-direction: column;
    padding: 14px 5px;
    font-size: 11px;
  }
  .public-shell .essential-shortcuts a > svg:last-child {
    display: none;
  }
  .airport-hero-actions {
    gap: 10px;
  }
}
@media (max-width: 760px) {
  .public-shell .welcome-section,
  .public-shell .airport-page,
  .public-shell .tracking-page {
    padding-top: 18px;
  }
  .public-shell .airport-hero,
  .public-shell .welcome-section .airport-hero {
    padding: 0;
    min-height: 0;
    border-radius: 16px;
    display: flex;
    flex-direction: column;
  }
  .airport-hero-photo {
    position: relative;
    inset: auto;
    width: 100%;
    height: 235px;
    z-index: 0;
    object-position: 50% 40%;
  }
  .airport-hero-shade {
    display: none;
  }
  .airport-hero-content {
    max-width: 100%;
    padding: 27px 24px 23px;
  }
  .public-shell .airport-hero h1 {
    font-size: clamp(31px, 6vw, 42px);
    margin: 18px 0;
    letter-spacing: -1.5px;
  }
  .airport-hero-content > p {
    font-size: 13px;
    line-height: 1.8;
  }
  .airport-hero-eyebrow {
    font-size: 9px;
    letter-spacing: 1.6px;
  }
  .airport-hero-stamp {
    top: 15px;
    inset-inline-end: 15px;
    padding: 9px 12px;
  }
  .airport-hero-stamp strong {
    font-size: 32px;
  }
  .airport-hero-stamp span {
    font-size: 7px;
  }
  .airport-hero-actions {
    gap: 14px;
    margin-top: 22px;
  }
  .airport-hero-actions a {
    font-size: 11px;
  }
  .airport-hero-languages {
    font-size: 10px;
    margin-top: 20px;
  }
  .airport-hero-footer {
    position: relative;
    inset: auto;
    padding: 0 24px 22px;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  .public-shell .welcome-section .airport-hero-footer {
    bottom: auto;
  }
  .airport-hero-location {
    font-size: 10px;
  }
  .airport-photo-credit {
    justify-content: flex-start;
    font-size: 9px;
    background: #0b2239;
  }
  .public-shell .airport-hero-flights,
  .public-shell .airport-hero-tracking {
    min-height: 0;
    padding: 0;
  }
  .public-shell .airport-hero-flights h1,
  .public-shell .airport-hero-tracking h1 {
    font-size: 32px;
  }
  .public-shell .flight-finder {
    margin: 16px 0 0;
  }
  .public-shell .essential-shortcuts > div {
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }
  .public-shell .essential-shortcuts {
    padding: 28px 0;
  }
  .public-shell .essential-shortcuts a {
    border: 1px solid #e1e7ed;
    min-height: 85px;
  }
  .public-shell .airport-board .airport-board-header {
    padding: 23px 21px;
  }
  .public-shell .airport-board .airport-board-header h2 {
    font-size: 24px;
  }
}
@media (max-width: 380px) {
  .airport-hero-content {
    padding-inline: 20px;
  }
  .public-shell .airport-hero h1 {
    font-size: 30px;
  }
  .airport-hero-photo {
    height: 205px;
  }
  .airport-hero-actions {
    flex-direction: column;
    align-items: flex-start;
    gap: 7px;
  }
  .airport-hero-actions .airport-hero-primary {
    padding-inline: 14px;
  }
  .airport-hero-languages {
    margin-top: 15px;
  }
  .airport-hero-footer {
    padding-inline: 20px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .public-shell .service-card:hover {
    transform: none;
  }
}

```

## frontend/src/airport-navigation.css

```css
.airport-view-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  width: fit-content;
  max-width: 100%;
  padding: 5px;
  margin: 0 0 24px;
  border: 1px solid #dfe6df;
  border-radius: 12px;
  background: #eef2ec;
}
.airport-view-nav a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 11px 18px;
  border-radius: 8px;
  color: #52675f;
  font-size: 13px;
  font-weight: 650;
  text-decoration: none;
}
.airport-view-nav a.active {
  color: #fff;
  background: #1b514b;
  box-shadow: 0 2px 5px #173d4020;
}
.airport-view-nav a:focus-visible {
  outline: 3px solid #ba9350;
  outline-offset: 2px;
}
.airport-page-filters {
  margin-bottom: 20px;
  border: 1px solid #dfe6df;
  border-radius: 12px;
  background: #fff;
}
.airport-page-filters summary {
  padding: 15px 18px;
  cursor: pointer;
  color: #254d47;
  font-size: 13px;
  font-weight: 650;
}
.airport-page-filters .flight-filters {
  border-top: 1px solid #edf0eb;
  margin: 0;
  padding: 16px;
}
.airport-page-official {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 10px 14px;
  border: 1px solid #dbe4da;
  border-radius: 8px;
  font-size: 12px;
  text-decoration: none;
  color: #1b514b;
  background: #fff;
}
@media (max-width: 600px) {
  .airport-view-nav {
    width: 100%;
    flex-wrap: nowrap;
  }
  .airport-view-nav a {
    flex: 1;
    padding: 11px 7px;
    gap: 6px;
    font-size: 12px;
  }
  .airport-view-nav a svg {
    flex-shrink: 0;
    width: 16px;
  }
}

```

## frontend/src/components/AirportBoard.jsx

```jsx
import { useEffect, useId, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  ChevronDown,
  Clock3,
  FlaskConical,
  Loader2,
  Map as MapIcon,
  MapPin,
  Plane,
  PlaneLanding,
  PlaneTakeoff,
} from "lucide-react";
import { useApp } from "../contexts/AppContext";
import { airportBoardCopy } from "../contexts/airportBoardCopy";
import "../airport-board.css";

const timeZone = "Africa/Casablanca";
const knownStatuses = new Set([
  "ON_TIME",
  "DELAYED",
  "BOARDING",
  "DEPARTED",
  "ARRIVED",
  "CANCELLED",
]);
const dateKeyFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});
function parsedDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}
function dayKey(date) {
  if (!date) return "unknown";
  const parts = Object.fromEntries(
    dateKeyFormatter.formatToParts(date).map((part) => [part.type, part.value]),
  );
  return `${parts.year}-${parts.month}-${parts.day}`;
}
function groupFlights(flights) {
  const groups = new Map();
  for (const flight of flights) {
    const scheduled = parsedDate(flight.scheduled_at);
    const key = dayKey(scheduled);
    if (!groups.has(key))
      groups.set(key, { key, date: scheduled, flights: [] });
    groups.get(key).flights.push(flight);
  }
  return [...groups.values()]
    .sort((a, b) =>
      a.key === "unknown"
        ? 1
        : b.key === "unknown"
          ? -1
          : a.key.localeCompare(b.key),
    )
    .map((group) => ({
      ...group,
      flights: group.flights.sort(
        (a, b) =>
          (parsedDate(a.scheduled_at)?.getTime() ?? Infinity) -
          (parsedDate(b.scheduled_at)?.getTime() ?? Infinity),
      ),
    }));
}
function AirportClock({ lang, copy }) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const update = () => {
      if (!document.hidden) setNow(new Date());
    };
    const timer = setInterval(update, 1000);
    document.addEventListener("visibilitychange", update);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", update);
    };
  }, []);
  const clock = new Intl.DateTimeFormat(lang, {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).format(now);
  const date = new Intl.DateTimeFormat(lang, {
    timeZone,
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(now);
  return (
    <div className="airport-board-clock">
      <span>
        <Clock3 size={13} aria-hidden="true" />
        {copy.localTime}
      </span>
      <time dateTime={now.toISOString()} aria-live="off">
        <strong>{clock}</strong>
        <small>{date}</small>
      </time>
    </div>
  );
}
export function AirportBoard({
  flights = [],
  direction = "departure",
  onDirectionChange,
  loading = false,
  error = "",
  onRetry,
}) {
  const { lang, t } = useApp();
  const copy = airportBoardCopy[lang] || airportBoardCopy.fr;
  const boardId = useId().replaceAll(":", "");
  const [expanded, setExpanded] = useState(null);
  const groups = useMemo(
    () => groupFlights(Array.isArray(flights) ? flights : []),
    [flights],
  );
  const formatTime = useMemo(
    () =>
      new Intl.DateTimeFormat(lang, {
        timeZone,
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
      }),
    [lang],
  );
  const formatDay = useMemo(
    () =>
      new Intl.DateTimeFormat(lang, {
        timeZone,
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    [lang],
  );
  const formatCount = useMemo(() => new Intl.NumberFormat(lang), [lang]);
  const renderTime = (value) => {
    const date = parsedDate(value);
    return date ? (
      <time dateTime={date.toISOString()}>{formatTime.format(date)}</time>
    ) : (
      <span aria-label={copy.notProvided}>—</span>
    );
  };
  return (
    <section
      className="airport-board"
      aria-label={copy.boardTitle}
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      <header className="airport-board-header">
        <div className="airport-board-identity">
          <span className="airport-board-brand">
            <Plane size={15} aria-hidden="true" />
            {copy.brand}
          </span>
          <h2>{t("airport")}</h2>
          <div className="airport-board-location">
            <MapPin size={13} aria-hidden="true" />
            <bdi dir="ltr">
              OUD <span aria-hidden="true">/</span> GMFO
            </bdi>
          </div>
        </div>
        <AirportClock lang={lang} copy={copy} />
      </header>
      <div className="airport-board-demo">
        <strong>
          <FlaskConical size={17} aria-hidden="true" />
          {copy.demo}
        </strong>
        <p>{copy.demoText}</p>
      </div>
      <div
        className="airport-board-body"
        id={`${boardId}-body`}
        aria-busy={loading}
      >
        {loading ? (
          <div className="airport-board-empty" role="status">
            <Loader2
              className="airport-board-loader"
              size={26}
              aria-hidden="true"
            />
            <p>{copy.loading}</p>
          </div>
        ) : error ? (
          <div className="airport-board-empty" role="alert">
            <p>{error}</p>
            <button type="button" className="btn" onClick={onRetry}>
              {t("retry")}
            </button>
          </div>
        ) : !groups.length ? (
          <div className="airport-board-empty">
            <Plane size={30} aria-hidden="true" />
            <h3>{copy.emptyTitle}</h3>
            <p>{copy.emptyText}</p>
          </div>
        ) : (
          groups.map((group, groupIndex) => (
            <section
              className="airport-board-day"
              key={group.key}
              aria-labelledby={`${boardId}-date-${groupIndex}`}
            >
              <div className="airport-board-date">
                <h3 id={`${boardId}-date-${groupIndex}`}>
                  {group.date ? formatDay.format(group.date) : copy.dateUnknown}
                </h3>
                <span>
                  {formatCount.format(group.flights.length)} {copy.flightCount}
                </span>
              </div>
              <div className="airport-board-columns" aria-hidden="true">
                <span>{copy.times}</span>
                <span>{copy.route}</span>
                <span>{copy.status}</span>
                <span />
              </div>
              <ul className="airport-board-flight-list">
                {group.flights.map((flight, index) => {
                  const open = expanded === flight.id;
                  const status = knownStatuses.has(flight.status)
                    ? flight.status
                    : "UNKNOWN";
                  const statusText =
                    status === "UNKNOWN" ? copy.unknownStatus : t(status);
                  const panelId = `${boardId}-detail-${groupIndex}-${index}`;
                  return (
                    <li
                      className={`airport-board-flight${open ? " is-expanded" : ""}`}
                      key={flight.id || `${group.key}-${index}`}
                    >
                      <button
                        type="button"
                        className="airport-board-row"
                        aria-expanded={open}
                        aria-controls={panelId}
                        onClick={() => setExpanded(open ? null : flight.id)}
                      >
                        <span className="airport-board-times">
                          <span className="airport-board-time">
                            <small>{copy.scheduled}</small>
                            <strong>{renderTime(flight.scheduled_at)}</strong>
                          </span>
                          <span className="airport-board-time airport-board-estimated">
                            <small>{copy.estimated}</small>
                            <strong>{renderTime(flight.estimated_at)}</strong>
                          </span>
                        </span>
                        <span className="airport-board-route">
                          <span className="airport-board-city">
                            {flight.city || copy.notProvided}
                            {flight.airport_code && (
                              <bdi dir="ltr">{flight.airport_code}</bdi>
                            )}
                          </span>
                          <span className="airport-board-flight-meta">
                            <bdi dir="ltr">{flight.number || "—"}</bdi>
                            {flight.airline && (
                              <>
                                <span
                                  className="airport-board-meta-dot"
                                  aria-hidden="true"
                                />{" "}
                                <span>{flight.airline}</span>
                              </>
                            )}
                          </span>
                        </span>
                        <span className="airport-board-status-slot">
                          <span
                            className={`airport-board-status airport-board-status-${status}`}
                          >
                            <i aria-hidden="true" />
                            {statusText}
                          </span>
                        </span>
                        <span className="airport-board-expand">
                          <ChevronDown size={18} aria-hidden="true" />
                          <span className="airport-board-sr-only">
                            {open ? copy.hideDetails : copy.showDetails}
                          </span>
                        </span>
                      </button>
                      <div
                        className="airport-board-detail"
                        id={panelId}
                        hidden={!open}
                      >
                        <dl>
                          <div>
                            <dt>{copy.gate}</dt>
                            <dd>
                              <bdi>{flight.gate || copy.notProvided}</bdi>
                            </dd>
                          </div>
                          <div>
                            <dt>{copy.terminal}</dt>
                            <dd>
                              <bdi>{flight.terminal || copy.notProvided}</bdi>
                            </dd>
                          </div>
                          {flight.aircraft && (
                            <div>
                              <dt>{copy.aircraft}</dt>
                              <dd>
                                <bdi>{flight.aircraft}</bdi>
                              </dd>
                            </div>
                          )}
                        </dl>
                        <Link
                          to={`/flights/${encodeURIComponent(flight.id)}`}
                          className="airport-board-detail-link"
                        >
                          {copy.viewFlight}
                          <ArrowUpRight size={15} aria-hidden="true" />
                        </Link>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))
        )}
      </div>
      <nav className="airport-board-tabs" aria-label={copy.navigation}>
        <button
          type="button"
          onClick={() => onDirectionChange?.("arrival")}
          aria-pressed={direction === "arrival"}
          aria-controls={`${boardId}-body`}
        >
          <PlaneLanding size={20} aria-hidden="true" />
          <span>{copy.arrivals}</span>
        </button>
        <button
          type="button"
          onClick={() => onDirectionChange?.("departure")}
          aria-pressed={direction === "departure"}
          aria-controls={`${boardId}-body`}
        >
          <PlaneTakeoff size={20} aria-hidden="true" />
          <span>{copy.departures}</span>
        </button>
        <Link to="/tracking">
          <MapIcon size={20} aria-hidden="true" />
          <span>{copy.tracking}</span>
        </Link>
      </nav>
    </section>
  );
}
export default AirportBoard;

```

## frontend/src/components/AirportHero.jsx

```jsx
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Globe2,
  MapPin,
  PlaneTakeoff,
  Sparkles,
} from "lucide-react";
import { useApp } from "../contexts/AppContext";
import { airportIdentityCopy } from "../contexts/airportIdentityCopy";

export default function AirportHero({
  variant = "home",
  title,
  description,
  children,
}) {
  const { lang } = useApp();
  const copy = airportIdentityCopy[lang] || airportIdentityCopy.fr;
  const home = variant === "home";
  return (
    <section className={`airport-hero airport-hero-${variant}`}>
      <img
        className="airport-hero-photo"
        src="/oujda-angads.jpg"
        alt={copy.photoAlt}
        width="2661"
        height="2033"
        fetchPriority="high"
      />
      <div className="airport-hero-shade" aria-hidden="true" />
      <div className="airport-hero-content">
        <span className="airport-hero-eyebrow">
          <span />
          {copy.eyebrow}
        </span>
        <h1>
          {home ? (
            <>
              {copy.title}
              <br />
              <em>{copy.accent}</em>
            </>
          ) : (
            title
          )}
        </h1>
        <p>{description || (home ? copy.intro : copy.flightsIntro)}</p>
        {home ? (
          <div className="airport-hero-actions">
            <Link className="airport-hero-primary" to="/flights">
              <PlaneTakeoff size={18} />
              {copy.explore}
              <ArrowUpRight size={18} />
            </Link>
            <Link className="airport-hero-secondary" to="/assistant">
              <Sparkles size={17} />
              {copy.assistant}
            </Link>
          </div>
        ) : (
          children && <div className="airport-hero-actions">{children}</div>
        )}
        {home && (
          <div className="airport-hero-languages">
            <Globe2 size={15} />
            <span>{copy.languages}</span>
          </div>
        )}
      </div>
      <div className="airport-hero-stamp" aria-hidden="true">
        <span>{copy.airport}</span>
        <strong>OUD</strong>
        <span>GMFO · MOROCCO</span>
      </div>
      <div className="airport-hero-footer">
        <span className="airport-hero-location">
          <MapPin size={14} />
          {copy.location}
        </span>
        <span className="airport-photo-credit">
          <a
            href="https://commons.wikimedia.org/wiki/File:Aeroport_Oujda_Angads_2024.jpg"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${copy.credit} — ${copy.photo}`}
          >
            {copy.photo}
          </a>
          <span aria-hidden="true">·</span>
          <a
            href="https://creativecommons.org/licenses/by-sa/4.0/"
            target="_blank"
            rel="noopener noreferrer"
          >
            CC BY-SA 4.0
          </a>
        </span>
      </div>
    </section>
  );
}

```

## frontend/src/components/FlightViews.jsx

```jsx
import { NavLink } from "react-router-dom";
import { ListFilter, Radar } from "lucide-react";
import { useApp } from "../contexts/AppContext";
import "../airport-navigation.css";

export default function FlightViews() {
  const { t } = useApp();
  return (
    <nav className="airport-view-nav" aria-label={t("flights")}>
      <NavLink to="/flights" end>
        <ListFilter size={17} />
        {t("airportBoardView")}
      </NavLink>
      <NavLink to="/tracking" end>
        <Radar size={17} />
        {t("aircraftMapView")}
      </NavLink>
    </nav>
  );
}

```

## frontend/src/components/RouteMetadata.jsx

```jsx
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { dictionary } from "../contexts/translations";

const publicRoutes = {
  "/": ["metaHomeTitle", "metaHomeDescription"],
  "/flights": ["flights", "metaFlightsDescription"],
  "/tracking": ["tracking", "metaTrackingDescription"],
  "/services": ["services", "metaServicesDescription"],
  "/faq": ["faq", "metaFaqDescription"],
  "/assistant": ["assistant", "metaAssistantDescription"],
  "/complaints": ["complaints", "metaComplaintsDescription"],
  "/login": ["login", "metaLoginDescription"],
  "/register": ["register", "metaRegisterDescription"],
  "/account": ["account", "metaAccountDescription"],
};
const adminRoutes = {
  "/admin": "dashboard",
  "/admin/flights": "flights",
  "/admin/services": "services",
  "/admin/faq": "faq",
  "/admin/knowledge": "knowledge",
  "/admin/complaints": "complaints",
  "/admin/conversations": "conversations",
  "/admin/analytics": "analytics",
};

function setMeta(attribute, name, content) {
  let element = document.head.querySelector(`meta[${attribute}="${name}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, name);
    document.head.append(element);
  }
  element.setAttribute("content", content);
}

export default function RouteMetadata({ lang }) {
  const { pathname } = useLocation();
  const previousPath = useRef(pathname);
  const route = pathname.replace(/\/+$/, "") || "/";
  const translate = (key) =>
    dictionary[key]?.[lang] || dictionary[key]?.fr || key;
  const adminTitle = adminRoutes[route];
  const [titleKey, descriptionKey] =
    publicRoutes[route] ||
    (/^\/flights\/[^/]+$/.test(route)
      ? ["metaFlightTitle", "metaFlightsDescription"]
      : adminTitle
        ? [adminTitle, "metaAdminDescription"]
        : ["metaNotFoundTitle", "metaNotFoundDescription"]);
  const title = `${adminTitle ? `${translate("admin")} · ` : ""}${translate(titleKey)} | Oujda Smart`;
  const description = translate(descriptionKey);
  const isPrivate =
    route.startsWith("/admin") ||
    ["/account", "/login", "/register", "/assistant", "/complaints"].includes(
      route,
    ) ||
    titleKey === "metaNotFoundTitle";

  useEffect(() => {
    document.title = title;
    setMeta("name", "description", description);
    setMeta(
      "name",
      "robots",
      isPrivate ? "noindex, nofollow" : "index, follow",
    );
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:site_name", "Oujda Smart");
    setMeta("property", "og:type", "website");
    setMeta(
      "property",
      "og:locale",
      { fr: "fr_MA", en: "en_GB", ar: "ar_MA" }[lang],
    );
  }, [title, description, lang, isPrivate]);

  useEffect(() => {
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;
    let heading;
    let previousTabIndex;
    const frame = requestAnimationFrame(() => {
      heading =
        document.querySelector("main h1") || document.querySelector("main");
      if (!heading) return;
      previousTabIndex = heading.getAttribute("tabindex");
      heading.setAttribute("tabindex", "-1");
      heading.focus({ preventScroll: true });
    });
    return () => {
      cancelAnimationFrame(frame);
      if (!heading) return;
      if (previousTabIndex === null) heading.removeAttribute("tabindex");
      else heading.setAttribute("tabindex", previousTabIndex);
    };
  }, [pathname]);

  return (
    <div
      className="sr-only"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      {translate("pageLoaded")}: {title}
    </div>
  );
}

```

## frontend/src/components/TrackingMap.jsx

```jsx
import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { Info } from "lucide-react";
import "leaflet/dist/leaflet.css";

const airportFallback = [34.786111, -1.925556];
const safeCoordinates = (lat, lon) =>
  Number.isFinite(lat) &&
  Number.isFinite(lon) &&
  Math.abs(lat) <= 90 &&
  Math.abs(lon) <= 180;
function airportCoordinates(airport) {
  return safeCoordinates(airport?.lat, airport?.lon)
    ? [airport.lat, airport.lon]
    : airportFallback;
}
function positionIsOld(flight, now) {
  const at = Date.parse(flight.positionAt);
  return flight.positionStale || !Number.isFinite(at) || now - at > 120_000;
}
function positionTime(flight, lang, copy) {
  const date = new Date(flight.positionAt);
  return !flight.positionAt || Number.isNaN(date.getTime())
    ? copy.positionUnknown
    : new Intl.DateTimeFormat(lang, {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZone: "Africa/Casablanca",
      }).format(date);
}
function popupContent(flight, copy, lang, now) {
  const popup = document.createElement("div");
  popup.className = "tracking-map-popup";
  popup.dir = lang === "ar" ? "rtl" : "ltr";
  const heading = document.createElement("strong");
  heading.textContent =
    flight.number || flight.callsign || flight.registration || "—";
  heading.dir = "ltr";
  const route = document.createElement("p");
  const hasRoute = flight.origin && flight.destination;
  route.textContent = hasRoute
    ? `${flight.origin} → ${flight.destination}`
    : copy.routeUnknown;
  route.dir = hasRoute || lang !== "ar" ? "ltr" : "rtl";
  const timestamp = document.createElement("small");
  timestamp.textContent = `${copy.position}: ${positionTime(flight, lang, copy)}`;
  const status = document.createElement("small");
  status.className = positionIsOld(flight, now) ? "old" : "";
  status.textContent = positionIsOld(flight, now)
    ? copy.oldPosition
    : copy.currentPosition;
  popup.append(heading, route, timestamp, status);
  return popup;
}
function planeIcon(flight, selected, now) {
  const element = document.createElement("span");
  element.className = "tracking-plane-symbol";
  const heading = Number.isFinite(flight.heading) ? flight.heading : 0;
  element.style.transform = `rotate(${heading}deg)`;
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("aria-hidden", "true");
  const shape = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "polygon",
  );
  shape.setAttribute(
    "points",
    "12,1 14,10 22,15 22,18 14,15 14,20 17,22 17,23 7,23 7,22 10,20 10,15 2,18 2,15 10,10",
  );
  svg.append(shape);
  element.append(svg);
  return L.divIcon({
    html: element,
    className: `tracking-plane-marker${selected ? " selected" : ""}${positionIsOld(flight, now) ? " old" : ""}`,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -19],
  });
}
export default function TrackingMap({
  airport,
  flights,
  selectedId,
  selectionVersion,
  centerVersion,
  onSelect,
  copy,
  lang,
  now,
  scope,
  radiusNm,
}) {
  const container = useRef(null);
  const map = useRef(null);
  const airportMarker = useRef(null);
  const areaCircle = useRef(null);
  const areaFitted = useRef(false);
  const markers = useRef(new Map());
  const activeCopy = useRef(copy);
  const selectCallback = useRef(onSelect);
  const lastSelection = useRef(null);
  const initialCenterVersion = useRef(centerVersion);
  const [tileError, setTileError] = useState(false);
  activeCopy.current = copy;
  selectCallback.current = onSelect;
  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const instance = L.map(container.current, {
      center: airportCoordinates(airport),
      zoom: 7,
      minZoom: 2,
      maxZoom: 18,
      zoomControl: false,
      scrollWheelZoom: false,
      zoomAnimation: !reduceMotion,
      fadeAnimation: !reduceMotion,
      markerZoomAnimation: !reduceMotion,
      attributionControl: true,
    });
    map.current = instance;
    L.control
      .zoom({
        position: "topright",
        zoomInTitle: activeCopy.current.zoomIn,
        zoomOutTitle: activeCopy.current.zoomOut,
      })
      .addTo(instance);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
      referrerPolicy: "strict-origin-when-cross-origin",
      updateWhenIdle: true,
      updateWhenZooming: false,
      keepBuffer: 0,
    })
      .on("tileerror", () => setTileError(true))
      .addTo(instance);
    airportMarker.current = L.circleMarker(airportCoordinates(airport), {
      radius: 7,
      color: "#fff",
      weight: 3,
      fillColor: "#174e47",
      fillOpacity: 1,
    }).addTo(instance);
    const observer = new ResizeObserver(() =>
      instance.invalidateSize({ pan: false }),
    );
    observer.observe(container.current);
    return () => {
      observer.disconnect();
      markers.current.clear();
      instance.remove();
      map.current = null;
      airportMarker.current = null;
      areaCircle.current = null;
    };
  }, []);
  useEffect(() => {
    const instance = map.current;
    if (!instance) return;
    if (scope !== "area") {
      areaCircle.current?.remove();
      areaCircle.current = null;
      areaFitted.current = false;
      return;
    }
    const meters = radiusNm * 1852;
    if (!areaCircle.current) {
      areaCircle.current = L.circle(airportCoordinates(airport), {
        radius: meters,
        color: "#447969",
        weight: 1.5,
        dashArray: "6 5",
        fillColor: "#81aa92",
        fillOpacity: 0.07,
        interactive: false,
        className: "tracking-area-circle",
      }).addTo(instance);
    } else
      areaCircle.current
        .setLatLng(airportCoordinates(airport))
        .setRadius(meters);
    if (!areaFitted.current) {
      instance.fitBounds(areaCircle.current.getBounds(), {
        padding: [18, 18],
        maxZoom: 7,
        animate: false,
      });
      areaFitted.current = true;
    }
  }, [scope, radiusNm, airport?.lat, airport?.lon]);
  useEffect(() => {
    if (!map.current) return;
    const label = document.createElement("span");
    label.textContent = `${airport?.iata || "OUD"} · ${copy.airport}`;
    airportMarker.current
      ?.setLatLng(airportCoordinates(airport))
      .bindTooltip(label, { direction: "bottom", offset: [0, 7] });
    const zoomIn = container.current.querySelector(".leaflet-control-zoom-in");
    const zoomOut = container.current.querySelector(
      ".leaflet-control-zoom-out",
    );
    if (zoomIn) {
      zoomIn.title = copy.zoomIn;
      zoomIn.setAttribute("aria-label", copy.zoomIn);
    }
    if (zoomOut) {
      zoomOut.title = copy.zoomOut;
      zoomOut.setAttribute("aria-label", copy.zoomOut);
    }
  }, [airport, copy]);
  useEffect(() => {
    const instance = map.current;
    if (!instance) return;
    const present = new Set();
    for (const flight of flights) {
      if (!safeCoordinates(flight.latitude, flight.longitude)) continue;
      present.add(flight.id);
      let marker = markers.current.get(flight.id);
      const title = `${copy.select} ${flight.number || flight.callsign || flight.registration || flight.id}`;
      if (!marker) {
        marker = L.marker([flight.latitude, flight.longitude], {
          icon: planeIcon(flight, flight.id === selectedId, now),
          title,
          alt: title,
          keyboard: true,
          riseOnHover: true,
        }).addTo(instance);
        marker.on("click", () => selectCallback.current(flight.id));
        marker.on("popupopen", () => {
          const close = marker
            .getPopup()
            ?.getElement()
            ?.querySelector(".leaflet-popup-close-button");
          if (close) {
            close.setAttribute("aria-label", activeCopy.current.close);
            close.title = activeCopy.current.close;
          }
        });
        markers.current.set(flight.id, marker);
      } else
        marker
          .setLatLng([flight.latitude, flight.longitude])
          .setIcon(planeIcon(flight, flight.id === selectedId, now));
      marker.getElement()?.setAttribute("aria-label", title);
      marker.getElement()?.setAttribute("title", title);
      const content = popupContent(flight, copy, lang, now);
      if (marker.getPopup()) marker.setPopupContent(content);
      else
        marker.bindPopup(content, {
          autoPan: false,
          maxWidth: 265,
          minWidth: 180,
        });
      const closeButton = marker
        .getPopup()
        ?.getElement()
        ?.querySelector(".leaflet-popup-close-button");
      if (closeButton) {
        closeButton.setAttribute("aria-label", copy.close);
        closeButton.title = copy.close;
      }
    }
    for (const [id, marker] of markers.current)
      if (!present.has(id)) {
        marker.remove();
        markers.current.delete(id);
      }
  }, [flights, selectedId, copy, lang, now]);
  useEffect(() => {
    const instance = map.current;
    if (!instance) return;
    if (!selectedId) {
      instance.closePopup();
      lastSelection.current = null;
      return;
    }
    const marker = markers.current.get(selectedId);
    if (
      marker &&
      lastSelection.current !== `${selectedId}:${selectionVersion}`
    ) {
      lastSelection.current = `${selectedId}:${selectionVersion}`;
      instance.setView(marker.getLatLng(), Math.max(instance.getZoom(), 7), {
        animate: false,
      });
      marker.openPopup();
    }
  }, [selectedId, selectionVersion]);
  useEffect(() => {
    if (initialCenterVersion.current === centerVersion) return;
    initialCenterVersion.current = centerVersion;
    if (scope === "area" && areaCircle.current)
      map.current?.fitBounds(areaCircle.current.getBounds(), {
        padding: [18, 18],
        maxZoom: 7,
        animate: false,
      });
    else
      map.current?.setView(airportCoordinates(airport), 7, { animate: false });
  }, [centerVersion, airport, scope]);
  return (
    <div className="tracking-map-wrap">
      <div
        ref={container}
        className="tracking-map"
        role="region"
        aria-label={copy.map}
        aria-describedby="tracking-map-help"
        dir="ltr"
      />
      <p id="tracking-map-help" className="sr-only">
        {copy.mapHelp}
      </p>
      {tileError && (
        <div className="tracking-tile-warning" role="status">
          <Info size={14} />
          <span>{copy.mapUnavailable}</span>
        </div>
      )}
    </div>
  );
}

```

## frontend/src/components/UI.jsx

```jsx
import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import {
  Plane,
  PlaneTakeoff,
  PlaneLanding,
  Car,
  ParkingCircle,
  Luggage,
  Accessibility,
  Coffee,
  ShoppingBag,
  Wifi,
  Info,
  Search,
  KeyRound,
  ArrowRight,
  Loader2,
  X,
  TriangleAlert,
  MessageCircle,
  HelpCircle,
} from "lucide-react";
import { useApp } from "../contexts/AppContext";
export const icons = {
  Plane,
  PlaneTakeoff,
  PlaneLanding,
  Car,
  Parking: ParkingCircle,
  Luggage,
  Accessibility,
  Coffee,
  ShoppingBag,
  Wifi,
  Info,
  Search,
  KeyRound,
};
export const categories = [
  "flights",
  "checkin",
  "boarding",
  "baggage",
  "security",
  "parking",
  "transport",
  "assistance",
  "services",
  "complaints",
];
export function Brand() {
  return (
    <Link className="brand" to="/" aria-label="Oujda Smart" dir="ltr">
      <span className="brand-icon">
        <Plane size={23} />
      </span>
      <span>
        oujda<span className="brand-blue">smart.</span>
        <small>AIRPORT ASSISTANT</small>
      </span>
    </Link>
  );
}
export function Status({ value }) {
  const { t } = useApp();
  return (
    <span className={"badge status-" + value}>
      <i />
      {t(value)}
    </span>
  );
}
export function PageHeader({ title, description, children }) {
  const { t } = useApp();
  return (
    <div className="page-title">
      <div>
        <span className="eyebrow">{t("airport")}</span>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {children}
    </div>
  );
}
export function Load({ state, children }) {
  const { t } = useApp();
  if (state.loading)
    return (
      <div className="skeletons" role="status" aria-label={t("loading")}>
        <span className="sr-only">{t("loading")}</span>
        <div />
        <div />
        <div />
      </div>
    );
  if (state.error)
    return (
      <div className="error-box" role="alert">
        <TriangleAlert size={22} />
        <p>{state.error}</p>
        <button className="btn" onClick={state.refresh}>
          {t("retry")}
        </button>
      </div>
    );
  return children;
}
export function Empty() {
  const { t } = useApp();
  return (
    <div className="empty">
      <Search size={28} />
      <p>{t("noResults")}</p>
    </div>
  );
}
export function Notice({ children }) {
  return (
    <div className="notice">
      <Info size={16} />
      <span>{children}</span>
    </div>
  );
}
export function Modal({ open, onClose, title, children }) {
  const ref = useRef();
  const { t } = useApp();
  useEffect(() => {
    if (open) ref.current?.showModal();
    else ref.current?.close();
  }, [open]);
  return (
    <dialog
      ref={ref}
      className="modal"
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
    >
      <div className="modal-head">
        <h2>{title}</h2>
        <button className="icon-btn" onClick={onClose} aria-label={t("cancel")}>
          <X size={20} />
        </button>
      </div>
      {children}
    </dialog>
  );
}
export function BusyButton({ busy, children, ...props }) {
  return (
    <button disabled={busy} {...props}>
      {busy ? <Loader2 size={17} className="spin" /> : null}
      {children}
    </button>
  );
}
export function time(d, lang = "fr") {
  if (!d || Number.isNaN(new Date(d).getTime())) return "—";
  return new Date(d).toLocaleTimeString(
    lang === "ar" ? "ar-MA" : lang === "en" ? "en-GB" : "fr-FR",
    {
      timeZone: "Africa/Casablanca",
      hour: "2-digit",
      minute: "2-digit",
    },
  );
}
export function shortDate(d, lang = "fr") {
  if (!d || Number.isNaN(new Date(d).getTime())) return "—";
  return new Date(d).toLocaleDateString(
    lang === "ar" ? "ar-MA" : lang === "en" ? "en-GB" : "fr-FR",
    { timeZone: "Africa/Casablanca", day: "numeric", month: "short" },
  );
}
export function Airline({ name }) {
  return (
    <span className="airline">
      <span
        className={
          "airline-logo " +
          (name.includes("Ryanair")
            ? "ryan"
            : name.includes("Royal")
              ? "royal"
              : name.includes("Transavia")
                ? "trans"
                : "tui")
        }
      >
        <Plane size={15} />
      </span>
      {name}
    </span>
  );
}
export function FlightTable({ flights, compact = false }) {
  const { t, lang } = useApp();
  if (!flights.length) return <Empty />;
  return (
    <div className="responsive-flights">
      <div className="flight-mobile-list">
        {flights.map((flight) => (
          <Link
            className="mobile-flight-card"
            to={"/flights/" + flight.id}
            key={flight.id}
          >
            <div className="mobile-flight-heading">
              <strong dir="ltr">{flight.number}</strong>
              <Airline name={flight.airline} />
              <small>{shortDate(flight.scheduled_at, lang)}</small>
            </div>
            <div className="mobile-flight-route">
              <div>
                <small>
                  {t(
                    flight.direction === "departure"
                      ? "departures"
                      : "arrivals",
                  )}
                </small>
                <strong>{flight.city}</strong>
              </div>
              <div>
                <small>{t("scheduled")}</small>
                <strong>{time(flight.scheduled_at, lang)}</strong>
              </div>
              <ArrowRight size={18} aria-hidden="true" />
            </div>
            <div className="mobile-flight-footer">
              <Status value={flight.status} />
              <span>
                {t("gate")} <b>{flight.gate}</b>
              </span>
              {!compact && (
                <span>
                  {t("estimated")} <b>{time(flight.estimated_at, lang)}</b>
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
      <div className="table-scroll">
        <table className="flight-table">
          <thead>
            <tr>
              <th>{t("flight")}</th>
              <th>{t("destination")}</th>
              <th>{t("scheduled")}</th>
              {!compact && <th>{t("estimated")}</th>}
              <th>{t("gate")}</th>
              <th>{t("status")}</th>
              <th>
                <span className="sr-only">{t("details")}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {flights.map((f) => (
              <tr key={f.id}>
                <td>
                  <strong>{f.number}</strong>
                  <Airline name={f.airline} />
                </td>
                <td>
                  <Link to={"/flights/" + f.id} className="city-link">
                    {f.city}
                  </Link>
                  <small>
                    {t(f.direction === "departure" ? "departures" : "arrivals")}
                  </small>
                </td>
                <td className="time-cell">
                  {time(f.scheduled_at, lang)}
                  <small>{shortDate(f.scheduled_at, lang)}</small>
                </td>
                {!compact && (
                  <td className="time-cell">{time(f.estimated_at, lang)}</td>
                )}
                <td>
                  <span className="gate">{f.gate}</span>
                </td>
                <td>
                  <Status value={f.status} />
                </td>
                <td>
                  <Link
                    className="icon-btn"
                    to={"/flights/" + f.id}
                    aria-label={t("details") + " " + f.number}
                  >
                    <ArrowRight size={17} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export function AssistantCTA() {
  const { t } = useApp();
  return (
    <section className="assistant-cta">
      <span className="cta-icon">
        <MessageCircle size={31} />
      </span>
      <div>
        <h2>{t("alwaysHere")}</h2>
        <p>{t("ctaText")}</p>
      </div>
      <Link className="btn primary" to="/assistant">
        {t("ask")}
        <ArrowRight size={17} />
      </Link>
    </section>
  );
}

```

## frontend/src/contexts/airportBoardCopy.js

```javascript
export const airportBoardCopy = {
  fr: {
    boardTitle: "Le tableau de l’aéroport",
    brand: "OUJDA SMART · HORAIRES",
    demo: "Horaires de démonstration",
    demoText:
      "Ces horaires sont fictifs. Pour votre voyage, vérifiez les informations auprès de votre compagnie et de l’aéroport.",
    localTime: "Heure locale du Maroc",
    scheduled: "Programmée",
    estimated: "Estimée",
    times: "Horaires",
    route: "Ville · vol · compagnie",
    status: "Statut",
    flightCount: "vols",
    dateUnknown: "Date non renseignée",
    details: "Détails du vol",
    showDetails: "Afficher les détails",
    hideDetails: "Masquer les détails",
    gate: "Porte",
    terminal: "Terminal",
    aircraft: "Appareil",
    notProvided: "Non renseigné",
    viewFlight: "Ouvrir la fiche du vol",
    arrivals: "Arrivées",
    departures: "Départs",
    tracking: "Carte des positions réelles",
    navigation: "Vues de l’aéroport",
    emptyTitle: "Aucun horaire à afficher",
    emptyText:
      "Aucun vol de démonstration ne correspond aux filtres sélectionnés.",
    loading: "Chargement des horaires…",
    unknownStatus: "Statut non renseigné",
  },
  en: {
    boardTitle: "The airport flight board",
    brand: "OUJDA SMART · FLIGHT TIMES",
    demo: "Demonstration schedules",
    demoText:
      "These schedules are fictional. For your journey, confirm information with your airline and the airport.",
    localTime: "Local Morocco time",
    scheduled: "Scheduled",
    estimated: "Estimated",
    times: "Flight times",
    route: "City · flight · airline",
    status: "Status",
    flightCount: "flights",
    dateUnknown: "Date not provided",
    details: "Flight details",
    showDetails: "Show details",
    hideDetails: "Hide details",
    gate: "Gate",
    terminal: "Terminal",
    aircraft: "Aircraft",
    notProvided: "Not provided",
    viewFlight: "Open flight details",
    arrivals: "Arrivals",
    departures: "Departures",
    tracking: "Actual aircraft position map",
    navigation: "Airport views",
    emptyTitle: "No schedules to display",
    emptyText: "No demonstration flights match the selected filters.",
    loading: "Loading flight times…",
    unknownStatus: "Status not provided",
  },
  ar: {
    boardTitle: "لوحة رحلات المطار",
    brand: "وجدة سمارت · مواعيد الرحلات",
    demo: "مواعيد رحلات تجريبية",
    demoText:
      "هذه المواعيد افتراضية. لسفرك الفعلي، تأكد من المعلومات لدى شركة الطيران والمطار.",
    localTime: "التوقيت المحلي للمغرب",
    scheduled: "المقررة",
    estimated: "المتوقعة",
    times: "المواعيد",
    route: "المدينة · الرحلة · الشركة",
    status: "الحالة",
    flightCount: "رحلات",
    dateUnknown: "التاريخ غير متوفر",
    details: "تفاصيل الرحلة",
    showDetails: "عرض التفاصيل",
    hideDetails: "إخفاء التفاصيل",
    gate: "البوابة",
    terminal: "المحطة",
    aircraft: "الطائرة",
    notProvided: "غير متوفر",
    viewFlight: "فتح صفحة الرحلة",
    arrivals: "الوصول",
    departures: "المغادرة",
    tracking: "خريطة مواقع الطائرات الفعلية",
    navigation: "عرض معلومات المطار",
    emptyTitle: "لا توجد مواعيد للعرض",
    emptyText: "لا توجد رحلات تجريبية تطابق المرشحات المحددة.",
    loading: "جارٍ تحميل المواعيد…",
    unknownStatus: "الحالة غير متوفرة",
  },
};

```

## frontend/src/contexts/airportIdentityCopy.js

```javascript
export const airportIdentityCopy = {
  fr: {
    eyebrow: "OUJDA-ANGADS · MAROC",
    title: "D’Oujda,",
    accent: "le monde vous attend.",
    intro:
      "Votre passage à l’aéroport, en toute simplicité. Retrouvez vos vols, préparez votre trajet et posez vos questions à notre assistant.",
    flightsIntro:
      "Arrivées, départs et informations pratiques : vos repères à l’aéroport Oujda-Angads.",
    explore: "Consulter les vols",
    assistant: "Parler à l’assistant",
    location: "L’Oriental, ouvert sur le monde",
    photoAlt:
      "Façade du terminal de l’aéroport Oujda-Angads, photographiée en 2024",
    photo: "Photo : Jakub Pietrasiak · 2024",
    credit: "Crédit photo",
    languages: "Français · English · العربية",
    airport: "AÉROPORT INTERNATIONAL",
  },
  en: {
    eyebrow: "OUJDA-ANGADS · MOROCCO",
    title: "From Oujda,",
    accent: "the world awaits.",
    intro:
      "An easier airport experience. Find your flights, plan your journey and ask our assistant for help.",
    flightsIntro:
      "Arrivals, departures and useful information for your time at Oujda-Angads Airport.",
    explore: "Explore flights",
    assistant: "Ask the assistant",
    location: "Eastern Morocco, open to the world",
    photoAlt: "Oujda-Angads Airport terminal façade, photographed in 2024",
    photo: "Photo: Jakub Pietrasiak · 2024",
    credit: "Photo credit",
    languages: "Français · English · العربية",
    airport: "INTERNATIONAL AIRPORT",
  },
  ar: {
    eyebrow: "وجدة أنجاد · المغرب",
    title: "من وجدة،",
    accent: "العالم في انتظارك.",
    intro:
      "تجربة سفر أكثر سهولة. تابع معلومات رحلتك، خطط لطريقك إلى المطار، واطرح أسئلتك على مساعدنا.",
    flightsIntro:
      "الوصول والمغادرة والمعلومات المفيدة لتجربتك في مطار وجدة أنجاد.",
    explore: "استعرض الرحلات",
    assistant: "تحدث مع المساعد",
    location: "جهة الشرق، منفتحة على العالم",
    photoAlt: "واجهة مبنى مطار وجدة أنجاد في صورة التقطت سنة 2024",
    photo: "الصورة: Jakub Pietrasiak · 2024",
    credit: "مصدر الصورة",
    languages: "العربية · Français · English",
    airport: "المطار الدولي",
  },
};

```

## frontend/src/contexts/AppContext.jsx

```jsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { api } from "../services/api";
import { dictionary } from "./translations";
import RouteMetadata from "../components/RouteMetadata";
const Context = createContext(null);
const supportedLanguages = ["fr", "en", "ar"];
const languageStorageKey = "oas-lang";

function browserLanguage() {
  const preferences = navigator.languages?.length
    ? navigator.languages
    : [navigator.language];
  return (
    preferences
      .map((language) => language?.toLowerCase().split(/[-_]/)[0])
      .find((language) => supportedLanguages.includes(language)) || "fr"
  );
}

function initialLanguage() {
  try {
    const saved = localStorage.getItem(languageStorageKey);
    if (supportedLanguages.includes(saved)) return saved;
  } catch {
    // Browser language remains available when local storage is disabled.
  }
  return browserLanguage();
}

export function Provider({ children }) {
  const [lang, updateLang] = useState(initialLanguage),
    [user, setUser] = useState(null),
    [ready, setReady] = useState(false),
    [toast, setToast] = useState("");
  const timer = useRef(null);
  const setLang = useCallback((language) => {
    if (!supportedLanguages.includes(language)) return;
    updateLang(language);
    try {
      localStorage.setItem(languageStorageKey, language);
    } catch {
      // The selection still works for this visit in private browser modes.
    }
  }, []);
  useEffect(() => {
    const syncLanguage = (event) => {
      if (event.key !== languageStorageKey && event.key !== null) return;
      updateLang(initialLanguage());
    };
    window.addEventListener("storage", syncLanguage);
    return () => {
      window.removeEventListener("storage", syncLanguage);
      clearTimeout(timer.current);
    };
  }, []);
  useEffect(() => {
    api
      .get("/auth/me")
      .then(setUser)
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);
  const t = (k) => dictionary[k]?.[lang] || dictionary[k]?.fr || k;
  const tr = (o) => o?.[lang] || o?.fr || "";
  const notify = (msg) => {
    setToast(msg);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(""), 4500);
  };
  return (
    <Context.Provider
      value={{ lang, setLang, t, tr, user, setUser, ready, notify }}
    >
      <RouteMetadata lang={lang} />
      {children}
      {toast && (
        <div
          className="toast"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {toast}
        </div>
      )}
    </Context.Provider>
  );
}
export const useApp = () => useContext(Context);

```

## frontend/src/contexts/trackingCopy.js

```javascript
export const trackingCopy = {
  fr: {
    cadenceMinutes:
      "Actualisation automatique : toutes les {minutes} minutes au minimum, lorsque cet onglet est visible.",
    researchUse:
      "Données utilisées dans le cadre de ce prototype académique non commercial.",
    genericInactive:
      "Le service de suivi n’est pas activé. Aucune position réelle n’est reçue pour le moment.",
    nearbyTitle: "Avions autour d’Oujda",
    nearbyNotConfiguredText:
      "La connexion au suivi régional {provider} n’est pas encore activée. Aucune position d’avion n’est reçue pour le moment.",
    nearbyEmptyNotConfiguredText:
      "Le suivi régional {provider} attend son activation. Vous pouvez explorer la carte et consulter les vols de démonstration sur une page distincte.",
    reasonContactRequired:
      "L’activation de la connexion au service de suivi doit être terminée.",
    reasonAccessDenied:
      "L’accès à la source de suivi est momentanément indisponible.",
    nearbyIntro:
      "Explorez les positions {provider} dans un rayon de {radiusNm} NM (environ {radiusKm} km) autour d’Oujda-Angads. Cette zone peut inclure des avions qui la survolent.",
    nearbyNotice:
      "Zone observée : {radiusNm} NM (environ {radiusKm} km). Les avions peuvent simplement survoler la région : ces positions ne permettent pas de les classer en arrivées ou départs d’Oujda. La couverture peut être incomplète.",
    nearbyListTitle: "Avions détectés",
    nearbyCount: "avions dans la zone",
    nearbySearch: "Rechercher un avion",
    nearbySearchHint: "Indicatif, immatriculation, type…",
    nearbyNoFlightsText:
      "Aucune position n’a été reçue dans le rayon de {radiusNm} NM autour d’Oujda. Cela ne signifie pas qu’aucun avion ne se trouve dans la zone.",
    nearbyNoResults:
      "Aucun avion reçu ne correspond à votre recherche. Modifiez ou effacez la recherche.",
    nearbySelect: "Afficher cet avion sur la carte",
    nearbySelected: "Avion sélectionné",
    nearbyDetails: "Détails de l’avion",
    nearbyNoSelection: "Sélectionnez un avion",
    nearbyNoSelectionText:
      "Choisissez une position sur la carte ou un avion dans la liste pour consulter ses détails.",
    inArea: "Dans la zone",
    onGround: "Au sol",
    routeUnknown: "Trajet non fourni",
    genericIntro:
      "Explorez les positions aériennes reçues depuis la source de suivi disponible.",
    sourcePending: "En attente de données",
    sourceUnknown: "Source indisponible",
    dataLicense: "Licence des données",
    eyebrow: "OUJDA · EXPLORER LE CIEL",
    title: "Le voyage, vu du ciel.",
    intro:
      "Consultez les positions transmises par Flightradar24 pour les vols à destination ou au départ d’Oujda-Angads.",
    live: "Données reçues",
    sandbox: "Environnement de test",
    stale: "Dernières données connues",
    unavailable: "Suivi indisponible",
    not_configured: "Suivi non activé",
    paused: "Actualisation en pause",
    loading: "Connexion au suivi…",
    liveText:
      "Les positions peuvent être différées ou incomplètes. Vérifiez les horaires auprès de votre compagnie.",
    sandboxText:
      "Données statiques de test Flightradar24. Elles peuvent concerner d’autres aéroports et ne représentent pas le trafic actuel d’Oujda.",
    staleText:
      "La mise à jour n’est pas disponible. Les dernières positions connues restent visibles, avec leur date.",
    unavailableText:
      "Le service de suivi est momentanément inaccessible. Vous pouvez réessayer plus tard.",
    not_configuredText:
      "La connexion à Flightradar24 n’est pas activée. Aucune position réelle n’est reçue sur cette page.",
    pausedText:
      "Les mises à jour sont suspendues. Les positions affichées correspondent à la dernière réception.",
    map: "Carte des positions aériennes",
    mapHelp:
      "Déplacez la carte ou utilisez les boutons de zoom. La liste des vols fournit les mêmes informations.",
    mapUnavailable:
      "Le fond de carte est temporairement indisponible. La liste reste accessible.",
    center: "Recentrer sur Oujda",
    zoomIn: "Agrandir la carte",
    zoomOut: "Réduire la carte",
    airport: "Aéroport d’Oujda-Angads",
    refresh: "Actualiser",
    pause: "Mettre en pause",
    resume: "Reprendre",
    updated: "Reçu à",
    never: "Aucune réception",
    source: "Source des positions",
    sourceValue: "Flightradar24",
    cadence:
      "Actualisation automatique : au moins 60 secondes, lorsque cet onglet est visible.",
    listTitle: "Les vols à explorer",
    all: "Tous les vols",
    arrival: "Arrivées",
    departure: "Départs",
    other: "Autre trajet",
    search: "Rechercher un vol",
    searchHint: "Numéro, aéroport, immatriculation…",
    count: "vols affichés",
    noFlights: "Aucune position reçue",
    noFlightsText:
      "Aucune position n’a été reçue pour les vols à destination ou au départ d’Oujda-Angads. Cela ne signifie pas qu’aucun vol n’est prévu.",
    emptyNotConfiguredTitle: "Suivi non activé",
    emptyNotConfiguredText:
      "La connexion à Flightradar24 n’est pas activée : aucune position réelle n’a été reçue. Les vols de démonstration sont disponibles sur une page distincte.",
    emptyUnavailableTitle: "Positions indisponibles",
    emptyUnavailableText:
      "Le service de suivi est inaccessible pour le moment. Réessayez plus tard pour recevoir les positions des vols.",
    emptySandboxTitle: "Aucune position de test",
    emptySandboxText:
      "Flightradar24 n’a renvoyé aucune position dans cet environnement de test. Les données de test ne représentent pas le trafic réel d’Oujda.",
    emptyNoResultsTitle: "Aucun résultat pour ces filtres",
    noResults:
      "Aucun des vols reçus ne correspond à votre recherche. Modifiez ou effacez les filtres.",
    reset: "Effacer les filtres",
    limited:
      "Le fournisseur a limité cette sélection. Tous les vols ne sont pas nécessairement affichés.",
    select: "Afficher ce vol sur la carte",
    selected: "Vol sélectionné",
    number: "Vol",
    callsign: "Indicatif",
    registration: "Immatriculation",
    aircraft: "Appareil",
    altitude: "Altitude",
    speed: "Vitesse",
    heading: "Cap",
    position: "Position reçue",
    eta: "Arrivée estimée",
    feet: "ft",
    knots: "kt",
    oldPosition: "Position ancienne",
    currentPosition: "Position transmise",
    positionUnknown: "Date indisponible",
    unknownAirport: "Non renseigné",
    close: "Fermer les détails",
    details: "Détails du vol",
    noSelection: "Sélectionnez un vol",
    noSelectionText:
      "Choisissez une position sur la carte ou un vol dans la liste pour voir ses détails.",
    demoLink: "Consulter les vols de démonstration",
    distinction:
      "Ce suivi utilise une source externe distincte du catalogue de vols fictifs du prototype.",
    timeZone: "Heure du Maroc",
    reasonCredentials: "La connexion au service doit être rétablie.",
    reasonQuota:
      "Le service a atteint sa limite de consultation. Réessayez plus tard.",
    reasonTimeout: "Le fournisseur met plus de temps à répondre.",
    reasonConfiguration: "Le service de suivi est temporairement indisponible.",
    reasonProvider: "La source de positions est temporairement inaccessible.",
  },
  en: {
    cadenceMinutes:
      "Automatic updates: at least {minutes} minutes apart, while this tab is visible.",
    researchUse: "Data used for this non-commercial academic prototype.",
    genericInactive:
      "Tracking has not been activated. No real aircraft positions are being received yet.",
    nearbyTitle: "Aircraft around Oujda",
    nearbyNotConfiguredText:
      "The regional {provider} tracking connection has not been activated yet. No aircraft positions are being received at the moment.",
    nearbyEmptyNotConfiguredText:
      "Regional {provider} tracking is awaiting activation. You can explore the map and view demonstration flights on a separate page.",
    reasonContactRequired:
      "The tracking service connection still needs to be activated.",
    reasonAccessDenied:
      "Access to the tracking source is temporarily unavailable.",
    nearbyIntro:
      "Explore {provider} positions within {radiusNm} NM (approximately {radiusKm} km) of Oujda-Angads. This area may include aircraft flying over the region.",
    nearbyNotice:
      "Observed area: {radiusNm} NM (approximately {radiusKm} km). Aircraft may simply be flying overhead: these positions do not classify Oujda arrivals or departures. Coverage may be incomplete.",
    nearbyListTitle: "Detected aircraft",
    nearbyCount: "aircraft in the area",
    nearbySearch: "Search aircraft",
    nearbySearchHint: "Callsign, registration, type…",
    nearbyNoFlightsText:
      "No positions have been received within {radiusNm} NM of Oujda. This does not mean there are no aircraft in the area.",
    nearbyNoResults:
      "None of the received aircraft match your search. Change or clear the search.",
    nearbySelect: "Show this aircraft on the map",
    nearbySelected: "Selected aircraft",
    nearbyDetails: "Aircraft details",
    nearbyNoSelection: "Select an aircraft",
    nearbyNoSelectionText:
      "Choose a position on the map or an aircraft in the list to explore its details.",
    inArea: "In the area",
    onGround: "On the ground",
    routeUnknown: "Route not provided",
    genericIntro:
      "Explore aircraft positions received from the available tracking source.",
    sourcePending: "Awaiting data",
    sourceUnknown: "Source unavailable",
    dataLicense: "Data licence",
    eyebrow: "OUJDA · EXPLORE THE SKY",
    title: "Your journey, from above.",
    intro:
      "Explore positions supplied by Flightradar24 for flights arriving at or departing from Oujda-Angads.",
    live: "Positions received",
    sandbox: "Test environment",
    stale: "Last known positions",
    unavailable: "Tracking unavailable",
    not_configured: "Tracking not activated",
    paused: "Updates paused",
    loading: "Connecting to flight tracking…",
    liveText:
      "Positions may be delayed or incomplete. Confirm travel times with your airline.",
    sandboxText:
      "Static Flightradar24 test data. Flights may relate to other airports and do not represent current traffic at Oujda.",
    staleText:
      "Updates are unavailable. Last known positions remain visible with their timestamps.",
    unavailableText:
      "The tracking service is temporarily unreachable. Please try again later.",
    not_configuredText:
      "The Flightradar24 connection has not been activated. No real aircraft positions are being received on this page.",
    pausedText:
      "Updates are suspended. Displayed positions come from the last received snapshot.",
    map: "Aircraft position map",
    mapHelp:
      "Move the map or use the zoom buttons. The flight list provides the same information.",
    mapUnavailable:
      "The base map is temporarily unavailable. You can still use the flight list.",
    center: "Centre on Oujda",
    zoomIn: "Zoom in",
    zoomOut: "Zoom out",
    airport: "Oujda-Angads Airport",
    refresh: "Refresh",
    pause: "Pause updates",
    resume: "Resume",
    updated: "Received at",
    never: "No data received",
    source: "Position source",
    sourceValue: "Flightradar24",
    cadence:
      "Automatic updates: at least 60 seconds apart, while this tab is visible.",
    listTitle: "Explore the flights",
    all: "All flights",
    arrival: "Arrivals",
    departure: "Departures",
    other: "Other route",
    search: "Search flights",
    searchHint: "Number, airport, registration…",
    count: "flights shown",
    noFlights: "No positions received",
    noFlightsText:
      "No positions have been received for flights arriving at or departing from Oujda-Angads. This does not mean that no flights are scheduled.",
    emptyNotConfiguredTitle: "Tracking not activated",
    emptyNotConfiguredText:
      "The Flightradar24 connection has not been activated, so no real aircraft positions have been received. Demonstration flights are available on a separate page.",
    emptyUnavailableTitle: "Positions unavailable",
    emptyUnavailableText:
      "The tracking service is currently unreachable. Try again later to receive flight positions.",
    emptySandboxTitle: "No test positions",
    emptySandboxText:
      "Flightradar24 returned no positions in this test environment. Test data does not represent actual traffic at Oujda.",
    emptyNoResultsTitle: "No results for these filters",
    noResults:
      "None of the received flights match your search. Change or clear the filters.",
    reset: "Clear filters",
    limited:
      "The provider limited this selection. It may not include every flight.",
    select: "Show this flight on the map",
    selected: "Selected flight",
    number: "Flight",
    callsign: "Callsign",
    registration: "Registration",
    aircraft: "Aircraft",
    altitude: "Altitude",
    speed: "Speed",
    heading: "Heading",
    position: "Position received",
    eta: "Estimated arrival",
    feet: "ft",
    knots: "kt",
    oldPosition: "Old position",
    currentPosition: "Reported position",
    positionUnknown: "Timestamp unavailable",
    unknownAirport: "Not provided",
    close: "Close details",
    details: "Flight details",
    noSelection: "Select a flight",
    noSelectionText:
      "Choose an aircraft on the map or a flight in the list to explore its details.",
    demoLink: "Browse demonstration flights",
    distinction:
      "This tracking view uses an external source, separate from the prototype’s fictional flight catalogue.",
    timeZone: "Morocco time",
    reasonCredentials: "The service connection needs to be restored.",
    reasonQuota:
      "The service has reached its request limit. Please try again later.",
    reasonTimeout: "The provider is taking longer to respond.",
    reasonConfiguration: "The tracking service is temporarily unavailable.",
    reasonProvider: "The position source is temporarily unreachable.",
  },
  ar: {
    cadenceMinutes:
      "تحديث تلقائي بفاصل لا يقل عن {minutes} دقائق عندما تكون علامة التبويب ظاهرة.",
    researchUse: "تُستخدم البيانات في هذا النموذج الأكاديمي غير التجاري.",
    genericInactive:
      "خدمة التتبع غير مفعّلة. لم تُستلم مواقع فعلية للطائرات بعد.",
    nearbyTitle: "الطائرات حول وجدة",
    nearbyNotConfiguredText:
      "لم يتم تفعيل الاتصال بالتتبع الإقليمي {provider} بعد. لا تُستلم مواقع الطائرات حالياً.",
    nearbyEmptyNotConfiguredText:
      "ينتظر التتبع الإقليمي {provider} التفعيل. يمكنك استكشاف الخريطة وعرض الرحلات التجريبية على صفحة منفصلة.",
    reasonContactRequired: "يجب إكمال تفعيل الاتصال بخدمة التتبع.",
    reasonAccessDenied: "الوصول إلى مصدر التتبع غير متاح مؤقتاً.",
    nearbyIntro:
      "استعرض مواقع {provider} ضمن نصف قطر {radiusNm} ميل بحري (نحو {radiusKm} كم) حول مطار وجدة أنجاد. قد تشمل المنطقة طائرات تعبر أجواءها.",
    nearbyNotice:
      "المنطقة المرصودة: نصف قطر {radiusNm} ميل بحري (نحو {radiusKm} كم). قد تكون الطائرات عابرة للأجواء فقط؛ هذه المواقع لا تصنّف الرحلات بوصفها وصولاً إلى وجدة أو مغادرة منها. قد تكون التغطية غير مكتملة.",
    nearbyListTitle: "الطائرات المرصودة",
    nearbyCount: "طائرة في المنطقة",
    nearbySearch: "البحث عن طائرة",
    nearbySearchHint: "النداء، تسجيل الطائرة، النوع…",
    nearbyNoFlightsText:
      "لم تُستلم مواقع ضمن نصف قطر {radiusNm} ميل بحري حول وجدة. هذا لا يعني عدم وجود طائرات في المنطقة.",
    nearbyNoResults: "لا تطابق أي طائرة مستلمة بحثك. غيّر البحث أو امسحه.",
    nearbySelect: "عرض هذه الطائرة على الخريطة",
    nearbySelected: "الطائرة المحددة",
    nearbyDetails: "تفاصيل الطائرة",
    nearbyNoSelection: "اختر طائرة",
    nearbyNoSelectionText:
      "اختر موقعاً على الخريطة أو طائرة من القائمة للاطلاع على تفاصيلها.",
    inArea: "في المنطقة",
    onGround: "على الأرض",
    routeUnknown: "المسار غير متوفر",
    genericIntro: "استعرض مواقع الطائرات المستلمة من مصدر التتبع المتاح.",
    sourcePending: "في انتظار البيانات",
    sourceUnknown: "المصدر غير متاح",
    dataLicense: "ترخيص البيانات",
    eyebrow: "وجدة · استكشف السماء",
    title: "رحلتك، من السماء.",
    intro:
      "استعرض المواقع التي يرسلها Flightradar24 للرحلات المتجهة إلى مطار وجدة أنجاد أو المغادرة منه.",
    live: "مواقع مستلمة",
    sandbox: "بيئة اختبار",
    stale: "آخر مواقع معروفة",
    unavailable: "التتبع غير متاح",
    not_configured: "التتبع غير مفعّل",
    paused: "التحديث متوقف مؤقتاً",
    loading: "جارٍ الاتصال بخدمة التتبع…",
    liveText:
      "قد تكون المواقع متأخرة أو غير مكتملة. تأكد من المواعيد لدى شركة الطيران.",
    sandboxText:
      "بيانات اختبار ثابتة من Flightradar24. قد تخص مطارات أخرى ولا تمثل حركة الطيران الحالية في وجدة.",
    staleText:
      "التحديث غير متاح. تبقى آخر المواقع المعروفة ظاهرة مع وقت استلامها.",
    unavailableText:
      "يتعذر الاتصال بخدمة التتبع مؤقتاً. يمكنك المحاولة لاحقاً.",
    not_configuredText:
      "لم يتم تفعيل الاتصال بخدمة Flightradar24. لا تُستلم مواقع فعلية للطائرات على هذه الصفحة.",
    pausedText:
      "تم تعليق التحديثات. المواقع المعروضة تعود إلى آخر بيانات مستلمة.",
    map: "خريطة مواقع الطائرات",
    mapHelp:
      "حرّك الخريطة أو استخدم أزرار التكبير. تتوفر المعلومات نفسها في قائمة الرحلات.",
    mapUnavailable:
      "خلفية الخريطة غير متاحة مؤقتاً. يمكنك استخدام قائمة الرحلات.",
    center: "العودة إلى وجدة",
    zoomIn: "تكبير الخريطة",
    zoomOut: "تصغير الخريطة",
    airport: "مطار وجدة أنجاد",
    refresh: "تحديث",
    pause: "إيقاف التحديث مؤقتاً",
    resume: "استئناف",
    updated: "وقت الاستلام",
    never: "لم تُستلم بيانات",
    source: "مصدر المواقع",
    sourceValue: "Flightradar24",
    cadence:
      "تحديث تلقائي بفاصل لا يقل عن 60 ثانية، عندما تكون علامة التبويب ظاهرة.",
    listTitle: "استكشف الرحلات",
    all: "جميع الرحلات",
    arrival: "الوصول",
    departure: "المغادرة",
    other: "مسار آخر",
    search: "البحث عن رحلة",
    searchHint: "الرقم، المطار، تسجيل الطائرة…",
    count: "رحلة معروضة",
    noFlights: "لم تُستلم مواقع",
    noFlightsText:
      "لم تُستلم مواقع للرحلات المتجهة إلى مطار وجدة أنجاد أو المغادرة منه. هذا لا يعني عدم وجود رحلات مجدولة.",
    emptyNotConfiguredTitle: "التتبع غير مفعّل",
    emptyNotConfiguredText:
      "لم يتم تفعيل الاتصال بخدمة Flightradar24، لذلك لم تُستلم مواقع فعلية للطائرات. تتوفر الرحلات التجريبية على صفحة منفصلة.",
    emptyUnavailableTitle: "مواقع الطائرات غير متاحة",
    emptyUnavailableText:
      "يتعذر الاتصال بخدمة التتبع حالياً. حاول لاحقاً لاستلام مواقع الرحلات.",
    emptySandboxTitle: "لا توجد مواقع اختبار",
    emptySandboxText:
      "لم تُرجع بيئة اختبار Flightradar24 أي مواقع. بيانات الاختبار لا تمثل حركة الطيران الفعلية في وجدة.",
    emptyNoResultsTitle: "لا توجد نتائج لهذه المرشحات",
    noResults:
      "لا تطابق أي رحلة من الرحلات المستلمة بحثك. غيّر المرشحات أو امسحها.",
    reset: "مسح المرشحات",
    limited: "حدّد المزود عدد النتائج. قد لا تتضمن القائمة جميع الرحلات.",
    select: "عرض هذه الرحلة على الخريطة",
    selected: "الرحلة المحددة",
    number: "الرحلة",
    callsign: "نداء الطائرة",
    registration: "تسجيل الطائرة",
    aircraft: "الطائرة",
    altitude: "الارتفاع",
    speed: "السرعة",
    heading: "الاتجاه",
    position: "وقت الموقع المستلم",
    eta: "الوصول المتوقع",
    feet: "قدم",
    knots: "عقدة",
    oldPosition: "موقع قديم",
    currentPosition: "موقع مرسل",
    positionUnknown: "الوقت غير متاح",
    unknownAirport: "غير متوفر",
    close: "إغلاق التفاصيل",
    details: "تفاصيل الرحلة",
    noSelection: "اختر رحلة",
    noSelectionText:
      "اختر طائرة على الخريطة أو رحلة من القائمة للاطلاع على التفاصيل.",
    demoLink: "عرض الرحلات التجريبية",
    distinction:
      "يعتمد هذا التتبع على مصدر خارجي مستقل عن قائمة الرحلات الافتراضية في النموذج.",
    timeZone: "بتوقيت المغرب",
    reasonCredentials: "يجب استعادة الاتصال بالخدمة.",
    reasonQuota: "بلغت الخدمة الحد المتاح للاستعلامات. حاول لاحقاً.",
    reasonTimeout: "يستغرق المزود وقتاً أطول للرد.",
    reasonConfiguration: "خدمة التتبع غير متاحة مؤقتاً.",
    reasonProvider: "يتعذر الاتصال بمصدر المواقع مؤقتاً.",
  },
};

```

## frontend/src/contexts/translations.js

```javascript
const entries = {
  airportBoardView: ["Tableau aéroport", "Airport board", "لوحة المطار"],
  aircraftMapView: ["Carte des avions", "Aircraft map", "خريطة الطائرات"],
  airportOfficial: [
    "Site officiel ONDA",
    "Official ONDA website",
    "موقع ONDA الرسمي",
  ],
  airportFilters: [
    "Rechercher et filtrer",
    "Search and filters",
    "البحث والتصفية",
  ],
  tracking: ["Suivi des vols", "Flight tracking", "تتبّع الرحلات"],
  trackingTeaser: [
    "Explorez les positions d’avions autour d’Oujda",
    "Explore aircraft positions around Oujda",
    "استعرض مواقع الطائرات حول وجدة",
  ],
  metaTrackingDescription: [
    "Suivi des positions d’avions via les sources de suivi disponibles, selon configuration et disponibilité. Aucun horaire futur programmé.",
    "Aircraft positions from available tracking sources, subject to configuration and availability. No future flight schedules.",
    "تتبّع مواقع الطائرات عبر مصادر التتبع المتاحة حسب إعداد الخدمة وتوفر البيانات، دون جدول المواعيد المستقبلية.",
  ],
  pageLoaded: ["Page chargée", "Page loaded", "تم تحميل الصفحة"],
  metaHomeTitle: [
    "Votre voyage commence ici",
    "Your journey starts here",
    "رحلتك تبدأ هنا",
  ],
  metaHomeDescription: [
    "Préparez votre passage à Oujda-Angads en français, anglais ou arabe : services, assistant et vols de démonstration. Projet académique indépendant.",
    "Plan your journey through Oujda-Angads in French, English or Arabic: services, assistant and demonstration flights. An independent academic project.",
    "استعد لرحلتك عبر وجدة أنجاد بالعربية أو الفرنسية أو الإنجليزية: خدمات ومساعد ورحلات تجريبية. مشروع أكاديمي مستقل.",
  ],
  metaFlightTitle: ["Détails du vol", "Flight details", "تفاصيل الرحلة"],
  metaFlightsDescription: [
    "Explorez les départs et les arrivées fictifs du prototype Oujda Smart. Horaires, filtres et favoris, sans suivi en temps réel.",
    "Explore fictional departures and arrivals in the Oujda Smart prototype. Schedules, filters and favourites, with no live flight tracking.",
    "استعرض رحلات المغادرة والوصول الافتراضية في نموذج وجدة سمارت. مواعيد وتصفية ومفضلة دون تتبع مباشر للرحلات.",
  ],
  metaServicesDescription: [
    "Découvrez les services présentés dans le prototype Oujda Smart : bagages, transport, stationnement et assistance aux voyageurs.",
    "Explore services presented in the Oujda Smart prototype: baggage, transport, parking and passenger assistance.",
    "اكتشف الخدمات المعروضة في نموذج وجدة سمارت: الأمتعة والنقل ومواقف السيارات ومساعدة المسافرين.",
  ],
  metaFaqDescription: [
    "Retrouvez les réponses aux questions de voyage dans la FAQ trilingue du prototype académique Oujda Smart.",
    "Find travel information in the trilingual FAQ of the Oujda Smart academic prototype.",
    "اعثر على معلومات السفر في قسم الأسئلة الشائعة بثلاث لغات ضمن نموذج وجدة سمارت الأكاديمي.",
  ],
  metaAssistantDescription: [
    "Posez vos questions à l’assistant Oujda Smart en français, anglais ou arabe. Informations issues de la base de connaissances du prototype.",
    "Ask the Oujda Smart assistant in French, English or Arabic. Answers draw on the prototype’s knowledge base.",
    "اطرح أسئلتك على مساعد وجدة سمارت بالعربية أو الفرنسية أو الإنجليزية. تعتمد الإجابات على قاعدة معرفة النموذج.",
  ],
  metaComplaintsDescription: [
    "Envoyez et suivez une demande dans l’espace de démonstration Oujda Smart grâce à votre référence et votre code privé.",
    "Submit and track a request in the Oujda Smart demonstration platform using your reference and private access code.",
    "أرسل طلبك وتابع حالته في منصة وجدة سمارت التجريبية باستخدام المرجع ورمز الوصول الخاص بك.",
  ],
  metaLoginDescription: [
    "Connectez-vous à votre espace Oujda Smart pour retrouver vos favoris, vos demandes et vos conversations.",
    "Sign in to Oujda Smart to find your favourites, requests and conversations.",
    "سجّل الدخول إلى وجدة سمارت للاطلاع على مفضلتك وطلباتك ومحادثاتك.",
  ],
  metaRegisterDescription: [
    "Créez votre compte passager sur le prototype académique Oujda Smart.",
    "Create your passenger account on the Oujda Smart academic prototype.",
    "أنشئ حساب المسافر الخاص بك على نموذج وجدة سمارت الأكاديمي.",
  ],
  metaAccountDescription: [
    "Votre espace personnel Oujda Smart : vols favoris, suivi de vos demandes et historique des conversations.",
    "Your personal Oujda Smart space: favourite flights, request tracking and conversation history.",
    "مساحتك الشخصية في وجدة سمارت: الرحلات المفضلة وتتبع الطلبات وسجل المحادثات.",
  ],
  metaAdminDescription: [
    "Espace d’administration du prototype Oujda Smart. Gestion des données de démonstration et des demandes.",
    "Oujda Smart prototype administration. Manage demonstration data and requests.",
    "فضاء إدارة نموذج وجدة سمارت. إدارة البيانات التجريبية والطلبات.",
  ],
  metaNotFoundTitle: [
    "Page introuvable",
    "Page not found",
    "الصفحة غير موجودة",
  ],
  metaNotFoundDescription: [
    "Cette page n’existe pas. Retrouvez les informations voyageurs sur l’accueil Oujda Smart.",
    "This page could not be found. Explore passenger information on the Oujda Smart homepage.",
    "تعذر العثور على هذه الصفحة. استكشف معلومات المسافرين على الصفحة الرئيسية لوجدة سمارت.",
  ],
  home: ["Accueil", "Home", "الرئيسية"],
  flights: ["Vols", "Flights", "الرحلات"],
  services: ["Services", "Services", "الخدمات"],
  faq: ["FAQ", "FAQ", "الأسئلة الشائعة"],
  assistant: ["Assistant IA", "AI assistant", "المساعد الذكي"],
  complaints: ["Réclamations", "Feedback", "الشكايات"],
  account: ["Mon espace", "My account", "حسابي"],
  login: ["Connexion", "Sign in", "تسجيل الدخول"],
  register: ["Créer un compte", "Create an account", "إنشاء حساب"],
  logout: ["Déconnexion", "Sign out", "تسجيل الخروج"],
  admin: ["Administration", "Administration", "الإدارة"],
  airport: ["Aéroport Oujda-Angads", "Oujda-Angads Airport", "مطار وجدة أنجاد"],
  academic: ["Prototype académique", "Academic prototype", "نموذج أكاديمي"],
  demo: ["Données de démonstration", "Demonstration data", "بيانات تجريبية"],
  footer: [
    "Prototype académique réalisé dans le cadre d’un mémoire de Master – Non affilié officiellement à l’ONDA.",
    "Academic prototype developed for a Master’s thesis – Not officially affiliated with ONDA.",
    "نموذج أكاديمي أنجز في إطار رسالة ماستر – غير تابع رسميا للمكتب الوطني للمطارات.",
  ],
  heroKicker: [
    "VOTRE COMPAGNON DE VOYAGE À OUJDA",
    "YOUR TRAVEL COMPANION IN OUJDA",
    "رفيق سفرك في وجدة",
  ],
  heroTitle: [
    "Votre voyage,\nen toute sérénité.",
    "Your journey,\nwith peace of mind.",
    "رحلتك،\nبكل اطمئنان.",
  ],
  heroText: [
    "Les informations utiles, les services et un assistant à votre écoute. Tout pour préparer votre passage à Oujda-Angads.",
    "Useful information, airport services and an assistant ready to help. Prepare your journey through Oujda-Angads.",
    "معلومات مفيدة وخدمات ومساعد يستمع إليك. استعد لرحلتك عبر وجدة أنجاد.",
  ],
  viewFlights: ["Consulter les vols", "Explore flights", "عرض الرحلات"],
  ask: ["Demander à l’assistant", "Ask the assistant", "اسأل المساعد"],
  help: [
    "Comment pouvons-nous vous aider ?",
    "How can we help you?",
    "كيف يمكننا مساعدتك؟",
  ],
  helpSub: [
    "L’essentiel de votre voyage, à portée de main.",
    "Your travel essentials, all in one place.",
    "أساسيات رحلتك في متناول يدك.",
  ],
  departures: ["Départs", "Departures", "المغادرة"],
  arrivals: ["Arrivées", "Arrivals", "الوصول"],
  baggage: ["Bagages", "Baggage", "الأمتعة"],
  parking: ["Parking", "Parking", "الموقف"],
  transport: ["Transport", "Transport", "النقل"],
  assistance: ["Assistance", "Assistance", "المساعدة"],
  checkin: ["Enregistrement", "Check-in", "تسجيل الوصول"],
  boarding: ["Embarquement", "Boarding", "الصعود"],
  security: ["Sécurité", "Security", "الأمن"],
  other: ["Autre", "Other", "أخرى"],
  flightBoard: ["Le tableau des vols", "Flight board", "لوحة الرحلات"],
  flightIntro: [
    "Préparez votre prochain départ ou l’arrivée de vos proches.",
    "Plan your next departure or a loved one’s arrival.",
    "استعد لمغادرتك أو لاستقبال أحبائك.",
  ],
  flightDemo: [
    "Vols fictifs. Pour un voyage réel, consultez votre compagnie et les écrans de l’aéroport.",
    "Fictional flights. For real travel, check with your airline and airport screens.",
    "رحلات افتراضية. للسفر الفعلي راجع شركة الطيران وشاشات المطار.",
  ],
  allFlights: ["Voir tous les vols", "View all flights", "عرض كل الرحلات"],
  flight: ["Vol", "Flight", "الرحلة"],
  airline: ["Compagnie", "Airline", "الشركة"],
  destination: [
    "Destination / provenance",
    "Destination / origin",
    "الوجهة / المصدر",
  ],
  scheduled: ["Prévue", "Scheduled", "المقررة"],
  estimated: ["Estimée", "Estimated", "المتوقعة"],
  gate: ["Porte", "Gate", "البوابة"],
  status: ["Statut", "Status", "الحالة"],
  search: ["Rechercher", "Search", "بحث"],
  flightSearch: [
    "Numéro de vol, ville, compagnie…",
    "Flight number, city, airline…",
    "رقم الرحلة، المدينة، الشركة…",
  ],
  all: ["Tous", "All", "الكل"],
  allAirlines: ["Toutes les compagnies", "All airlines", "جميع الشركات"],
  allStatuses: ["Tous les statuts", "All statuses", "جميع الحالات"],
  after: ["À partir de", "From", "ابتداء من"],
  ON_TIME: ["À l’heure", "On time", "في الموعد"],
  DELAYED: ["Retardé", "Delayed", "متأخرة"],
  BOARDING: ["Embarquement", "Boarding", "صعود الركاب"],
  DEPARTED: ["Décollé", "Departed", "أقلعت"],
  ARRIVED: ["Arrivé", "Arrived", "وصلت"],
  CANCELLED: ["Annulé", "Cancelled", "ملغاة"],
  RECEIVED: ["Reçue", "Received", "مستلمة"],
  IN_PROGRESS: ["En cours", "In progress", "قيد المعالجة"],
  RESOLVED: ["Traitée", "Resolved", "معالجة"],
  CLOSED: ["Clôturée", "Closed", "مغلقة"],
  moroccoTime: [
    "Heure locale du Maroc",
    "Local Morocco time",
    "التوقيت المحلي للمغرب",
  ],
  updated: ["Données du prototype", "Prototype data", "بيانات النموذج"],
  noResults: ["Aucun résultat trouvé.", "No results found.", "لا توجد نتائج."],
  reset: ["Réinitialiser", "Reset", "إعادة ضبط"],
  retry: ["Réessayer", "Retry", "إعادة المحاولة"],
  loading: ["Chargement…", "Loading…", "جار التحميل…"],
  favorite: ["Ajouter aux favoris", "Save flight", "حفظ الرحلة"],
  saved: ["Vol enregistré", "Flight saved", "تم حفظ الرحلة"],
  removed: ["Favori supprimé", "Favorite removed", "تم حذف المفضلة"],
  terminal: ["Terminal", "Terminal", "المحطة"],
  back: ["Retour", "Back", "رجوع"],
  servicesTitle: [
    "Des services pour chaque étape",
    "Services for every step",
    "خدمات لكل مرحلة",
  ],
  servicesIntro: [
    "Les informations pratiques pour faciliter votre passage.",
    "Practical information for a smoother journey.",
    "معلومات عملية لتسهيل رحلتك.",
  ],
  learnMore: ["En savoir plus", "Learn more", "معرفة المزيد"],
  location: ["Emplacement", "Location", "الموقع"],
  hours: ["Horaires", "Hours", "المواعيد"],
  servicesDisclaimer: [
    "Les emplacements et horaires sont indicatifs et restent à confirmer sur place.",
    "Locations and hours are illustrative and must be confirmed on site.",
    "المواقع والمواعيد توضيحية وتحتاج إلى تأكيد في المطار.",
  ],
  seeServices: ["Découvrir les services", "Explore services", "اكتشف الخدمات"],
  faqTitle: [
    "Les réponses à vos questions",
    "Answers to your questions",
    "إجابات عن أسئلتك",
  ],
  faqIntro: [
    "Un peu de préparation, beaucoup de tranquillité.",
    "A little preparation, a smoother journey.",
    "قليل من الاستعداد، ومزيد من الاطمئنان.",
  ],
  faqSearch: [
    "Posez une question ou cherchez un sujet…",
    "Ask a question or search a topic…",
    "اطرح سؤالا أو ابحث عن موضوع…",
  ],
  notFoundAnswer: [
    "Vous ne trouvez pas votre réponse ?",
    "Still looking for an answer?",
    "لم تجد إجابتك؟",
  ],
  assistantTitle: [
    "Un assistant, à votre écoute.",
    "An assistant, here for you.",
    "مساعد يستمع إليك.",
  ],
  assistantIntro: [
    "Posez vos questions et préparez votre voyage simplement.",
    "Ask questions and prepare for your journey.",
    "اطرح أسئلتك واستعد لرحلتك بسهولة.",
  ],
  localKnowledge: [
    "Base de connaissances locale",
    "Local knowledge base",
    "قاعدة المعرفة المحلية",
  ],
  newChat: ["Nouvelle conversation", "New conversation", "محادثة جديدة"],
  history: ["Historique", "History", "السجل"],
  chatWelcome: [
    "Bonjour ! Je suis votre assistant de voyage. Comment puis-je vous aider aujourd’hui ?",
    "Hello! I’m your travel assistant. How can I help you today?",
    "مرحبا! أنا مساعد سفرك. كيف يمكنني مساعدتك اليوم؟",
  ],
  chatPlaceholder: [
    "Écrivez votre question…",
    "Type your question…",
    "اكتب سؤالك…",
  ],
  send: ["Envoyer", "Send", "إرسال"],
  typing: ["L’assistant écrit…", "The assistant is typing…", "المساعد يكتب…"],
  chatDisclaimer: [
    "Assistant de prototype. Confirmez les informations auprès du personnel ou de votre compagnie.",
    "Prototype assistant. Confirm information with staff or your airline.",
    "مساعد تجريبي. أكد المعلومات لدى الموظفين أو شركة الطيران.",
  ],
  knowledge_base: ["Base locale", "Local knowledge", "القاعدة المحلية"],
  demo_flight: ["Vol de démonstration", "Demonstration flight", "رحلة تجريبية"],
  llm: [
    "Réponse IA à vérifier",
    "AI answer, please verify",
    "إجابة ذكاء اصطناعي للتحقق",
  ],
  fallback: [
    "Information non vérifiée",
    "Unverified information",
    "معلومة غير مؤكدة",
  ],
  local: [
    "Information du prototype",
    "Prototype information",
    "معلومات النموذج",
  ],
  parkingQ: [
    "Où se trouve le parking ?",
    "Where is the parking?",
    "أين موقف السيارات؟",
  ],
  baggageQ: [
    "Comment récupérer mes bagages ?",
    "How do I collect my baggage?",
    "كيف أستلم أمتعتي؟",
  ],
  taxiQ: [
    "Où trouver un taxi ?",
    "Where can I find a taxi?",
    "أين أجد سيارة أجرة؟",
  ],
  checkinQ: [
    "Quand commence l’enregistrement ?",
    "When does check-in open?",
    "متى يبدأ تسجيل الوصول؟",
  ],
  complaintTitle: [
    "Votre expérience compte.",
    "Your experience matters.",
    "تجربتك تهمنا.",
  ],
  complaintIntro: [
    "Une remarque, une difficulté ou une suggestion ? Nous sommes à votre écoute.",
    "A comment, an issue or a suggestion? We are listening.",
    "ملاحظة أو صعوبة أو اقتراح؟ نحن نستمع إليك.",
  ],
  notOfficial: [
    "Les demandes restent dans le prototype et ne sont pas transmises à l’aéroport ou à l’ONDA.",
    "Requests remain in the prototype and are not sent to the airport or ONDA.",
    "تبقى الطلبات داخل النموذج ولا ترسل إلى المطار أو المكتب الوطني للمطارات.",
  ],
  name: ["Nom complet", "Full name", "الاسم الكامل"],
  email: ["Email", "Email", "البريد الإلكتروني"],
  phone: ["Téléphone (facultatif)", "Phone (optional)", "الهاتف (اختياري)"],
  category: ["Catégorie", "Category", "الفئة"],
  subject: ["Sujet", "Subject", "الموضوع"],
  message: ["Message", "Message", "الرسالة"],
  priority: ["Priorité", "Priority", "الأولوية"],
  LOW: ["Faible", "Low", "منخفضة"],
  NORMAL: ["Normale", "Normal", "عادية"],
  HIGH: ["Élevée", "High", "عالية"],
  optionalFlight: [
    "Numéro de vol (facultatif)",
    "Flight number (optional)",
    "رقم الرحلة (اختياري)",
  ],
  submitComplaint: ["Envoyer ma demande", "Submit my request", "إرسال طلبي"],
  received: [
    "Votre demande a été enregistrée.",
    "Your request has been saved.",
    "تم تسجيل طلبك.",
  ],
  reference: ["Numéro de suivi", "Tracking reference", "مرجع التتبع"],
  accessCode: [
    "Code de suivi privé",
    "Private tracking code",
    "رمز التتبع الخاص",
  ],
  keepCode: [
    "Conservez ce code pour suivre votre demande sans compte. Aucun email n’est envoyé.",
    "Keep this code to track your request without an account. No email is sent.",
    "احتفظ بهذا الرمز لتتبع طلبك دون حساب. لا يتم إرسال بريد إلكتروني.",
  ],
  track: ["Suivre une demande", "Track a request", "تتبع طلب"],
  response: [
    "Réponse de l’administration",
    "Administration reply",
    "رد الإدارة",
  ],
  password: ["Mot de passe", "Password", "كلمة المرور"],
  passwordHint: [
    "12 caractères minimum",
    "At least 12 characters",
    "12 حرفا على الأقل",
  ],
  welcomeBack: ["Heureux de vous retrouver.", "Welcome back.", "مرحبا بعودتك."],
  loginIntro: [
    "Retrouvez vos vols favoris, vos demandes et vos conversations.",
    "Access your saved flights, requests and conversations.",
    "اعثر على رحلاتك المحفوظة وطلباتك ومحادثاتك.",
  ],
  noAccount: ["Pas encore de compte ?", "No account yet?", "ليس لديك حساب؟"],
  hasAccount: ["Déjà un compte ?", "Already have an account?", "لديك حساب؟"],
  myFlights: ["Mes vols favoris", "My saved flights", "رحلاتي المحفوظة"],
  myComplaints: ["Mes demandes", "My requests", "طلباتي"],
  myChats: ["Mes conversations", "My conversations", "محادثاتي"],
  hello: ["Bonjour", "Hello", "مرحبا"],
  empty: [
    "Rien à afficher pour le moment.",
    "Nothing to show yet.",
    "لا يوجد شيء للعرض حاليا.",
  ],
  dashboard: ["Vue d’ensemble", "Overview", "نظرة عامة"],
  analytics: ["Analyses", "Analytics", "التحليلات"],
  knowledge: ["Connaissances", "Knowledge base", "قاعدة المعرفة"],
  conversations: ["Conversations", "Conversations", "المحادثات"],
  passengerView: ["Espace passager", "Passenger view", "فضاء المسافر"],
  users: ["Utilisateurs", "Users", "المستخدمون"],
  openComplaints: [
    "Réclamations ouvertes",
    "Open requests",
    "الشكايات المفتوحة",
  ],
  popularTopics: [
    "Sujets les plus demandés",
    "Most requested topics",
    "المواضيع الأكثر طلبا",
  ],
  popularServices: [
    "Services les plus consultés",
    "Most viewed services",
    "الخدمات الأكثر مشاهدة",
  ],
  requestTrend: ["Évolution des demandes", "Request trends", "تطور الطلبات"],
  sentiment: [
    "Sentiment des réclamations",
    "Feedback sentiment",
    "مشاعر الشكايات",
  ],
  positive: ["Positif", "Positive", "إيجابي"],
  neutral: ["Neutre", "Neutral", "محايد"],
  negative: ["Négatif", "Negative", "سلبي"],
  analysisNote: [
    "Analyse indicative par mots-clés, sans modèle IA de sentiment. Les statistiques incluent les données fictives.",
    "Indicative keyword analysis, not an AI sentiment model. Statistics include fictional data.",
    "تحليل تقريبي بالكلمات المفتاحية، دون نموذج ذكاء اصطناعي للمشاعر. الإحصاءات تتضمن بيانات افتراضية.",
  ],
  recommendations: [
    "Recommandations IA · mode règles",
    "AI recommendations · rule-based mode",
    "توصيات ذكية · وضع القواعد",
  ],
  recommendText: [
    "Rendre plus visibles les informations sur :",
    "Improve visibility of information about:",
    "تحسين ظهور المعلومات حول:",
  ],
  frequentQuestions: [
    "Questions des voyageurs",
    "Passenger questions",
    "أسئلة المسافرين",
  ],
  daily: ["Par jour", "Daily", "يوميا"],
  monthly: ["Par mois", "Monthly", "شهريا"],
  add: ["Ajouter", "Add", "إضافة"],
  edit: ["Modifier", "Edit", "تعديل"],
  delete: ["Supprimer", "Delete", "حذف"],
  save: ["Enregistrer", "Save", "حفظ"],
  cancel: ["Annuler", "Cancel", "إلغاء"],
  deleteConfirm: [
    "Supprimer cet élément ?",
    "Delete this item?",
    "حذف هذا العنصر؟",
  ],
  savedOk: [
    "Modifications enregistrées.",
    "Changes saved.",
    "تم حفظ التغييرات.",
  ],
  actions: ["Actions", "Actions", "الإجراءات"],
  title: ["Titre", "Title", "العنوان"],
  description: ["Description", "Description", "الوصف"],
  question: ["Question", "Question", "السؤال"],
  answer: ["Réponse", "Answer", "الإجابة"],
  keywords: ["Mots-clés", "Keywords", "كلمات مفتاحية"],
  source: ["Source", "Source", "المصدر"],
  topic: ["Sujet", "Topic", "الموضوع"],
  direction: ["Sens", "Direction", "الاتجاه"],
  city: ["Ville", "City", "المدينة"],
  slug: ["Identifiant URL", "URL identifier", "معرف الرابط"],
  icon: ["Icône", "Icon", "الأيقونة"],
  manageIntro: [
    "Gestion des données de démonstration du prototype.",
    "Manage demonstration data for the prototype.",
    "إدارة بيانات النموذج التجريبية.",
  ],
  noPage: [
    "Cette page ne fait pas partie du voyage.",
    "This page is not on the itinerary.",
    "هذه الصفحة ليست في مسار الرحلة.",
  ],
  returnHome: ["Retour à l’accueil", "Back to home", "العودة للرئيسية"],
  explore: ["Explorer", "Explore", "استكشاف"],
  practical: [
    "INFORMATIONS PRATIQUES",
    "PRACTICAL INFORMATION",
    "معلومات عملية",
  ],
  alwaysHere: [
    "Une question avant le départ ?",
    "A question before you fly?",
    "سؤال قبل الإقلاع؟",
  ],
  ctaText: [
    "Bagages, transport ou enregistrement : notre assistant vous aide à trouver une réponse.",
    "Baggage, transport or check-in: our assistant helps you find an answer.",
    "الأمتعة أو النقل أو تسجيل الوصول: المساعد يساعدك في العثور على إجابة.",
  ],
  quickAccess: ["Accès rapide", "Quick access", "وصول سريع"],
  noLive: [
    "Horaires de démonstration",
    "Demonstration schedules",
    "مواعيد رحلات تجريبية",
  ],
  privacy: [
    "N’envoyez pas de données sensibles dans vos messages.",
    "Do not send sensitive data in messages.",
    "لا ترسل بيانات حساسة في الرسائل.",
  ],
  date: ["Date", "Date", "التاريخ"],
  details: ["Détails", "Details", "التفاصيل"],
  filter: ["Filtrer", "Filter", "تصفية"],
};
export const dictionary = Object.fromEntries(
  Object.entries(entries).map(([key, [fr, en, ar]]) => [key, { fr, en, ar }]),
);

```

## frontend/src/contexts/travelCopy.js

```javascript
// Editorial copy for the international passenger experience.
export const travelCopy = {
  fr: {
    eyebrow: "VOTRE VOYAGE COMMENCE ICI",
    title: "L'esprit tranquille.",
    titleAccent: "Le monde devant vous.",
    intro:
      "Un vol à suivre, un trajet à préparer, une question ? Retrouvez l'essentiel de votre passage à Oujda, au même endroit.",
    discover: "Explorer les services",
    assistant: "Parler à l'assistant",
    languages: "À vos côtés, en 3 langues",
    destination: "PORTE D'ENTRÉE DE L'ORIENTAL",
    morocco: "Oujda-Angads · Maroc",
    noteTitle: "Un voyage plus simple",
    noteText: "Votre assistant, du départ à l'arrivée.",
    searchTitle: "Trouvez votre vol",
    searchHint: "Numéro de vol, ville ou compagnie",
    searchLabel: "Votre vol ou destination",
    searchButton: "Rechercher un vol",
    shortcuts: "L'aéroport, à portée de main",
    boardEyebrow: "DÉPARTS & ARRIVÉES",
    boardTitle: "Chaque étape, en un coup d'œil.",
    boardText: "Consultez les horaires et retrouvez les détails de votre vol.",
    preview: "Aperçu des vols de démonstration",
    checklistEyebrow: "PRÊT À PARTIR ?",
    checklistTitle: "Votre pense-bête voyage",
    checklistText: "Les petits détails qui font la différence.",
    checklistItems: [
      "Vérifier mes documents de voyage",
      "Confirmer les règles de bagages",
      "Préparer mon trajet vers l'aéroport",
    ],
    checklistProgress: "étapes préparées",
    checklistSaved: "Enregistré sur cet appareil",
    reset: "Réinitialiser la liste",
    servicesEyebrow: "PENSEZ AU VOYAGE, ON VOUS GUIDE",
    servicesTitle: "Vos essentiels à l'aéroport.",
    servicesText: "Les informations utiles pour préparer un passage serein.",
    assistantEyebrow: "OUJDA SMART ASSISTANT",
    assistantTitle: "Une question ?\nLe voyage continue.",
    assistantText:
      "Parking, bagages, enregistrement… posez votre question dans votre langue et consultez les informations de notre base locale.",
    assistantHint: "Choisissez une question pour commencer",
    local: "Base de connaissances locale · Prototype académique",
    feedbackTitle: "Votre expérience compte.",
    feedbackText:
      "Une remarque ou une difficulté ? Déposez une demande et suivez sa réponse.",
    feedbackAction: "Contacter l'équipe",
    skip: "Aller au contenu",
    navigation: "Navigation principale",
    mobileNavigation: "Navigation mobile",
    menu: "Ouvrir le menu",
    closeMenu: "Fermer le menu",
    photo: "Aéroport Oujda-Angads · Jakub Pietrasiak / Wikimedia Commons",
    footerLine: "Votre voyage. Vos repères. Votre langue.",
  },
  en: {
    eyebrow: "YOUR JOURNEY STARTS HERE",
    title: "Peace of mind.",
    titleAccent: "A world ahead.",
    intro:
      "A flight to follow, a journey to plan, a question to ask. Find everything you need for your time at Oujda, in one place.",
    discover: "Explore airport services",
    assistant: "Ask the assistant",
    languages: "Here for you, in 3 languages",
    destination: "GATEWAY TO EASTERN MOROCCO",
    morocco: "Oujda-Angads · Morocco",
    noteTitle: "A smoother journey",
    noteText: "Your assistant, from departure to arrival.",
    searchTitle: "Find your flight",
    searchHint: "Flight number, city or airline",
    searchLabel: "Your flight or destination",
    searchButton: "Search flights",
    shortcuts: "The airport, at your fingertips",
    boardEyebrow: "DEPARTURES & ARRIVALS",
    boardTitle: "Every step, at a glance.",
    boardText: "Check the schedule and explore your flight details.",
    preview: "Preview of demonstration flights",
    checklistEyebrow: "READY FOR TAKEOFF?",
    checklistTitle: "Your travel checklist",
    checklistText: "Little details for a smoother start.",
    checklistItems: [
      "Check my travel documents",
      "Confirm the baggage rules",
      "Plan my journey to the airport",
    ],
    checklistProgress: "steps ready",
    checklistSaved: "Saved on this device",
    reset: "Reset the checklist",
    servicesEyebrow: "YOUR JOURNEY, MADE SIMPLER",
    servicesTitle: "Your airport essentials.",
    servicesText: "Useful information to help you prepare for your visit.",
    assistantEyebrow: "OUJDA SMART ASSISTANT",
    assistantTitle: "A question?\nKeep moving forward.",
    assistantText:
      "Parking, baggage, check-in… ask in your language and explore information from our local knowledge base.",
    assistantHint: "Choose a question to get started",
    local: "Local knowledge base · Academic prototype",
    feedbackTitle: "Your experience matters.",
    feedbackText:
      "A suggestion or a difficulty? Submit a request and follow the response.",
    feedbackAction: "Contact the team",
    skip: "Skip to content",
    navigation: "Main navigation",
    mobileNavigation: "Mobile navigation",
    menu: "Open menu",
    closeMenu: "Close menu",
    photo: "Oujda-Angads Airport · Jakub Pietrasiak / Wikimedia Commons",
    footerLine: "Your journey. Your guide. Your language.",
  },
  ar: {
    eyebrow: "رحلتك تبدأ من هنا",
    title: "راحة البال.",
    titleAccent: "والعالم أمامك.",
    intro:
      "رحلة تتابعها، سفر تستعد له، أو سؤال يشغل بالك. كل ما تحتاجه لعبور مطار وجدة، في مكان واحد.",
    discover: "اكتشف خدمات المطار",
    assistant: "تحدث مع المساعد",
    languages: "إلى جانبك بثلاث لغات",
    destination: "بوابتك إلى شرق المغرب",
    morocco: "وجدة أنكاد · المغرب",
    noteTitle: "سفر أكثر سهولة",
    noteText: "مساعدك، من المغادرة إلى الوصول.",
    searchTitle: "ابحث عن رحلتك",
    searchHint: "رقم الرحلة، المدينة أو شركة الطيران",
    searchLabel: "رحلتك أو وجهتك",
    searchButton: "البحث عن رحلة",
    shortcuts: "المطار في متناول يدك",
    boardEyebrow: "المغادرة والوصول",
    boardTitle: "كل خطوة، بنظرة واحدة.",
    boardText: "اطّلع على المواعيد وتفاصيل رحلتك بسهولة.",
    preview: "عرض لرحلات تجريبية",
    checklistEyebrow: "هل أنت مستعد للسفر؟",
    checklistTitle: "قائمة استعدادك للرحلة",
    checklistText: "تفاصيل صغيرة تمنحك بداية مريحة.",
    checklistItems: [
      "التحقق من وثائق السفر",
      "التأكد من قواعد الأمتعة",
      "التخطيط للوصول إلى المطار",
    ],
    checklistProgress: "خطوات جاهزة",
    checklistSaved: "محفوظة على هذا الجهاز",
    reset: "إعادة ضبط القائمة",
    servicesEyebrow: "فكّر في رحلتك، ونحن نرشدك",
    servicesTitle: "كل ما يهمك في المطار.",
    servicesText: "معلومات مفيدة تساعدك على الاستعداد لمرور مريح.",
    assistantEyebrow: "مساعد وجدة الذكي",
    assistantTitle: "لديك سؤال؟\nرحلتك تستمر.",
    assistantText:
      "موقف السيارات، الأمتعة، تسجيل الوصول… اطرح سؤالك بلغتك واستفد من معلومات قاعدة المعرفة المحلية.",
    assistantHint: "اختر سؤالاً لتبدأ",
    local: "قاعدة معرفة محلية · نموذج أكاديمي",
    feedbackTitle: "تجربتك تهمنا.",
    feedbackText: "لديك ملاحظة أو واجهت صعوبة؟ أرسل طلبك وتابع الرد عليه.",
    feedbackAction: "تواصل مع الفريق",
    skip: "انتقل إلى المحتوى",
    navigation: "التنقل الرئيسي",
    mobileNavigation: "التنقل على الهاتف",
    menu: "فتح القائمة",
    closeMenu: "إغلاق القائمة",
    photo: "مطار وجدة أنجاد · Jakub Pietrasiak / Wikimedia Commons",
    footerLine: "رحلتك. دليلك. لغتك.",
  },
};

```

## frontend/src/hooks/useData.js

```javascript
import { useEffect, useState, useCallback } from "react";
import { api } from "../services/api";
export function useData(url) {
  const [data, setData] = useState(null),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(true),
    [version, setVersion] = useState(0);
  const refresh = useCallback(() => setVersion((v) => v + 1), []);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    api
      .get(url)
      .then((d) => {
        if (active) setData(d);
      })
      .catch((e) => {
        if (active) setError(e.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [url, version]);
  return { data, error, loading, refresh, setData };
}

```

## frontend/src/international.css

```css
/* International passenger experience. Shared tokens also refine existing pages. */
.flight-mobile-list {
  display: none;
}
:root {
  --ink: #153c3f;
  --brand: #176b62;
  --brand-dark: #0e514a;
  --paper: #fafbf9;
  --muted: #617575;
  --line: #dde6e2;
  color: var(--ink);
  background: var(--paper);
  font-family: "Segoe UI", Inter, Arial, sans-serif;
}
.container {
  max-width: 1328px;
}
::selection {
  background: #cbe6db;
  color: #123e38;
}
h1,
h2,
h3 {
  letter-spacing: -0.045em;
}
.btn {
  min-height: 46px;
  border-radius: 9px;
  border-color: var(--line);
}
.btn.primary {
  background: var(--brand);
  border-color: var(--brand);
  box-shadow: none;
}
.btn.primary:hover {
  background: var(--brand-dark);
  border-color: var(--brand-dark);
}
.btn:hover {
  background: #f0f5f1;
}
.text-link {
  color: var(--brand);
}
.muted,
.section-title p {
  color: var(--muted);
}
.eyebrow {
  color: var(--brand);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.65px;
}
.utility-bar {
  background: #143c3c;
  color: #e4eeea;
  height: 33px;
  font-size: 10px;
}
.site-header {
  background: #ffffffee;
  backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--line);
  box-shadow: none;
}
.header-inner {
  height: 84px;
  gap: 28px;
}
.brand-icon {
  background: var(--brand);
  border-radius: 12px;
  transform: none;
  width: 42px;
  height: 42px;
}
.brand-blue {
  color: var(--brand);
}
.brand small {
  color: #617775;
  letter-spacing: 2.4px;
}
.site-header nav {
  gap: 24px;
}
.site-header nav a {
  font-size: 12px;
  color: #5d7070;
}
.site-header nav a.active {
  color: var(--brand);
}
.site-header nav a.active:after {
  background: var(--brand);
  height: 2px;
}
.ai-dot {
  background: #a07832;
}
.header-actions {
  gap: 18px;
}
.language-picker {
  color: #526b69;
}
.language-picker select {
  min-height: 40px;
}
.account-btn {
  border-color: #c9d8d1;
  color: var(--brand);
}
.skip-link {
  position: fixed;
  inset-block-start: 12px;
  inset-inline-start: 16px;
  transform: translateY(-180%);
  background: white;
  color: var(--ink);
  padding: 14px 20px;
  border-radius: 8px;
  z-index: 100;
  box-shadow: 0 4px 24px #10363230;
}
.skip-link:focus {
  transform: translateY(0);
}
#main-content:focus {
  outline: none;
}
.mobile-bottom-nav {
  display: none;
}

/* Editorial hero with an integrated, real flight finder. */
.welcome-section {
  background: #f2f4ee;
  padding: 42px 0 0;
  position: relative;
}
.welcome-grid {
  display: grid;
  grid-template-columns: 1.05fr 1fr;
  gap: 42px;
  align-items: center;
  padding-bottom: 51px;
}
.welcome-copy {
  padding-block: 22px;
}
.welcome-eyebrow {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 2px;
  color: #58776e;
}
.welcome-eyebrow > span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #a88647;
  box-shadow: 0 0 0 5px #aa884711;
}
.welcome-copy h1 {
  font-size: clamp(40px, 4.5vw, 62px);
  line-height: 1.13;
  font-weight: 550;
  margin-block: 25px 21px;
  letter-spacing: -0.055em;
}
.welcome-copy h1 em {
  font-style: normal;
  color: #327b66;
}
.welcome-copy > p {
  max-width: 465px;
  font-size: 14px;
  line-height: 1.9;
  color: #61736c;
}
.welcome-actions {
  display: flex;
  align-items: center;
  gap: 23px;
  flex-wrap: wrap;
  margin-top: 28px;
}
.welcome-actions .btn {
  min-height: 48px;
}
.welcome-actions .text-link {
  font-size: 12px;
}
.welcome-languages {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 34px;
  font-size: 11px;
  color: #5c716b;
}
.language-coins {
  display: flex;
  margin-inline-start: 5px;
  padding-inline-start: 7px;
}
.language-coins b {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 29px;
  height: 29px;
  border-radius: 50%;
  background: #e6ece3;
  border: 2px solid #f2f4ee;
  font-size: 9px;
  margin-inline-start: -5px;
}
.language-coins b:nth-child(2) {
  background: #f1e9d8;
}
.language-coins b:nth-child(3) {
  background: #dce7e3;
  font-size: 13px;
}
.destination-visual {
  position: relative;
  margin: 0;
  min-width: 0;
  height: 395px;
  border-radius: 18px;
  background: #456567;
}
.destination-visual > img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 63% 48%;
  border-radius: inherit;
  filter: saturate(0.68);
}
.destination-shade {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(180deg, #113c3d4d, transparent 35%, #103a3acc);
}
.destination-tag {
  position: absolute;
  inset-block-start: 18px;
  inset-inline: 18px;
  display: flex;
  align-items: center;
  gap: 7px;
  color: white;
  font-size: 11px;
}
.airport-code {
  margin-inline-start: auto;
  border: 1px solid #ffffff80;
  border-radius: 5px;
  padding: 5px 9px;
  font-weight: 600;
  letter-spacing: 2px;
  font-size: 11px;
}
.destination-wordmark {
  position: absolute;
  inset-inline-start: 30px;
  bottom: 51px;
  color: white;
}
.destination-wordmark small {
  font-size: 9px;
  letter-spacing: 2.3px;
  color: #e7eae2;
}
.destination-wordmark > span {
  display: block;
  font-size: 74px;
  font-weight: 300;
  line-height: 1.2;
  letter-spacing: 5px;
}
.destination-visual figcaption {
  position: absolute;
  bottom: 12px;
  inset-inline-start: 18px;
  font-size: 8px;
  color: #e3eae7;
  max-width: 85%;
}
.travel-assistant-note {
  position: absolute;
  inset-inline-end: 20px;
  bottom: -22px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 17px 20px;
  background: #fff;
  box-shadow: 0 12px 32px #153b3b12;
  border: 1px solid #e6ede7;
  border-radius: 11px;
  max-width: calc(100% - 40px);
}
.travel-assistant-note > span {
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #edf3e8;
  color: var(--brand);
  border-radius: 10px;
  flex-shrink: 0;
}
.travel-assistant-note strong {
  font-size: 12px;
  font-weight: 650;
}
.travel-assistant-note p {
  font-size: 10px;
  color: #6a7c73;
  margin-top: 2px;
}
.travel-assistant-note > svg {
  margin-inline-start: 5px;
  color: #718079;
  flex-shrink: 0;
}
.flight-finder {
  position: relative;
  background: white;
  border: 1px solid var(--line);
  border-radius: 14px;
  box-shadow: 0 8px 28px #163b2a06;
  margin-bottom: -45px;
  z-index: 1;
}
.finder-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #edf0eb;
  padding-inline: 24px;
}
.finder-directions {
  display: flex;
  gap: 26px;
}
.finder-directions button {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 18px 1px 15px;
  border-bottom: 2px solid transparent;
  color: #6b7c75;
  font-weight: 600;
  font-size: 12px;
}
.finder-directions button.selected {
  color: var(--brand);
  border-color: var(--brand);
}
.finder-demo {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #758176;
  font-size: 10px;
}
.finder-form {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 22px 24px;
}
.finder-plane {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  background: #f3f6f1;
  border-radius: 9px;
  flex-shrink: 0;
  color: #668578;
}
.finder-form label {
  flex: 1;
  min-width: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 11px;
  color: #48645c;
}
.finder-form input {
  background: none;
  border: none;
  box-shadow: none;
  border-radius: 3px;
  padding: 3px 0;
  min-height: 26px;
  font-size: 15px;
  width: 100%;
  color: var(--ink);
}
.finder-form input::placeholder {
  color: #929d95;
}
.finder-form .btn {
  min-height: 50px;
  padding-inline: 24px;
}
.essential-shortcuts {
  padding: 81px 0 33px;
  border-bottom: 1px solid var(--line);
}
.essential-shortcuts > p {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 1.6px;
  color: #7b887d;
  text-align: center;
  font-weight: 600;
  margin-bottom: 23px;
}
.essential-shortcuts > div {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
}
.essential-shortcuts a {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  min-height: 48px;
  border-inline-end: 1px solid var(--line);
  color: #3e6057;
  font-size: 12px;
}
.essential-shortcuts a:last-child {
  border: 0;
}
.essential-shortcuts a > svg:first-child {
  color: #698977;
}
.essential-shortcuts a > svg:last-child {
  color: #84968a;
}
.essential-shortcuts a:hover {
  color: var(--brand);
  background: #eff4ed;
  border-radius: 6px;
}

/* Flight board, personal preparation, and airport services. */
.flight-overview,
.airport-essentials {
  margin-top: 55px;
}
.section-title {
  margin-bottom: 25px;
  align-items: end;
}
.section-title h2 {
  font-size: 30px;
  font-weight: 550;
}
.section-title p {
  font-size: 12px;
  margin-top: 9px;
}
.board-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 292px;
  gap: 22px;
  align-items: stretch;
}
.flight-panel,
.panel {
  border-color: var(--line);
  border-radius: 12px;
}
.board-toolbar {
  min-height: 63px;
  padding-inline: 24px;
  border-color: var(--line);
}
.board-toolbar h3 {
  display: flex;
  align-items: center;
  gap: 9px;
  font-size: 14px;
  letter-spacing: -0.02em;
}
.board-dot {
  height: 6px;
  width: 6px;
  background: #64977b;
  border-radius: 50%;
}
.table-meta {
  color: #617970;
  font-size: 10px;
}
.flight-table th {
  background: #f7f9f6;
  color: #607368;
  font-size: 9px;
  padding: 14px 20px;
}
.flight-table td {
  padding: 16px 20px;
  border-color: #edf0e9;
}
.flight-table td small,
.airline {
  color: #64766c;
}
.flight-table td > strong {
  font-size: 12px;
  letter-spacing: 0.4px;
}
.flight-table .city-link {
  font-size: 14px;
  font-weight: 600;
}
.flight-table .time-cell {
  font-size: 18px;
}
.flight-table .gate {
  background: #f2f5ef;
  border: 0;
  color: #526f61;
  border-radius: 5px;
  min-width: 29px;
  width: auto;
  padding-inline: 4px;
}
.flight-table tbody tr:hover {
  background: #fbfcf8;
}
.badge {
  border-radius: 5px;
  padding: 7px 9px;
  font-size: 10px;
}
.status-ON_TIME,
.status-ARRIVED,
.status-RESOLVED {
  background: #eaf3ea;
  color: #2c6a45;
}
.status-BOARDING,
.status-IN_PROGRESS {
  background: #e8f0f7;
  color: #336781;
}
.status-DELAYED,
.status-RECEIVED {
  background: #fcf0d8;
  color: #8b641e;
}
.status-DEPARTED,
.status-CLOSED {
  color: #526775;
}
.board-foot {
  padding: 15px 22px;
  color: #6c7c70;
  font-size: 10px;
  gap: 10px;
}
.board-foot a {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: var(--brand);
  white-space: nowrap;
}
.travel-checklist {
  background: #eaf0e3;
  border: 1px solid #dbe5d4;
  padding: 20px 23px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
}
.checklist-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
}
.checklist-heading .eyebrow {
  margin: 0;
  font-size: 9px;
  letter-spacing: 1.4px;
  color: #617755;
}
.checklist-heading .icon-btn {
  color: #6a815b;
  width: 30px;
  height: 30px;
}
.travel-checklist h3 {
  font-size: 24px;
  line-height: 1.2;
  margin-top: 15px;
  color: #334e36;
  font-weight: 550;
}
.travel-checklist > p {
  font-size: 11px;
  color: #617459;
  margin-top: 10px;
}
.checklist-items {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-block: 25px;
}
.checklist-items label {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  line-height: 1.6;
  color: #445d3f;
  cursor: pointer;
  margin: 0;
  min-height: 30px;
}
.checklist-items input {
  position: absolute;
  opacity: 0;
  width: 20px;
  height: 20px;
  inset-inline-start: 0;
  margin: 0;
}
.checklist-check {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 19px;
  height: 19px;
  border: 1px solid #aab9a0;
  background: #f5f7ef;
  border-radius: 5px;
  flex-shrink: 0;
}
.checklist-items input:checked + .checklist-check {
  background: #527947;
  border-color: #527947;
  color: white;
}
.checklist-items input:focus-visible + .checklist-check {
  outline: 2px solid var(--brand);
  outline-offset: 3px;
}
.checklist-items .is-done > span:last-child {
  text-decoration: line-through;
  color: #6d8064;
}
.checklist-progress {
  margin-top: auto;
  color: #56704a;
  font-size: 10px;
}
.checklist-progress progress {
  display: block;
  width: 100%;
  height: 4px;
  border: 0;
  border-radius: 4px;
  overflow: hidden;
  margin-top: 9px;
  accent-color: #62824d;
  background: #d3dfc8;
}
.checklist-progress progress::-webkit-progress-bar {
  background: #d3dfc8;
}
.checklist-progress progress::-webkit-progress-value {
  background: #62824d;
  border-radius: 4px;
}
.travel-checklist > small {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #687d5e;
  font-size: 9px;
  margin-top: 15px;
}
.service-grid {
  gap: 20px;
}
.service-card {
  border-color: var(--line);
  border-radius: 12px;
  padding: 25px;
}
.service-card:hover {
  border-color: #b1c9b6;
  box-shadow: 0 10px 24px #173b2910;
}
.service-card h3 {
  font-size: 18px;
  font-weight: 600;
}
.service-card p {
  font-size: 12px;
  color: #65786c;
  line-height: 1.9;
}
.service-card .text-link {
  font-size: 12px;
  padding-top: 9px;
}
.service-icon {
  background: #eef2e8;
  color: #5b7a4a;
  border-radius: 10px;
}
.service-card-top {
  display: flex;
  align-items: start;
  justify-content: space-between;
  width: 100%;
}
.service-card-top > span:last-child {
  font-size: 10px;
  font-variant-numeric: tabular-nums;
  color: #7f9282;
  padding-top: 8px;
}
.service-1 .service-icon {
  background: #f5efe2;
  color: #987c42;
}
.service-2 .service-icon {
  background: #e7eff0;
  color: #527f83;
}
.service-3 .service-icon {
  background: #efeaf2;
  color: #8d769c;
}
.service-card.highlighted {
  border-color: #5b9381;
  box-shadow: 0 0 0 3px #176b6210;
}

/* Multilingual assistant invitation, with real editable question links. */
.intelligent-assistant {
  position: relative;
  overflow: hidden;
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 85px;
  align-items: center;
  background: #153f3e;
  color: #fff;
  border-radius: 16px;
  padding: 48px 54px;
  margin-top: 58px;
}
.intelligent-assistant:before {
  content: "";
  position: absolute;
  width: 650px;
  height: 650px;
  border: 1px solid #8bab8120;
  border-radius: 50%;
  top: -275px;
  right: -80px;
  box-shadow:
    0 0 0 55px #8bab8108,
    0 0 0 110px #8bab8108;
  pointer-events: none;
}
.assistant-spotlight-copy,
.assistant-preview {
  position: relative;
}
.assistant-spotlight-copy .eyebrow {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #c4d4b5;
  font-size: 9px;
}
.assistant-spotlight-copy h2 {
  font-size: 37px;
  font-weight: 450;
  line-height: 1.2;
  white-space: pre-line;
  margin-top: 20px;
}
.assistant-spotlight-copy > p {
  color: #b7cfbf;
  font-size: 12px;
  margin: 18px 0 24px;
  max-width: 420px;
  line-height: 1.9;
}
.assistant-spotlight-copy .btn {
  background: #e2eacb;
  border-color: #e2eacb;
  color: #234c3e;
}
.assistant-spotlight-copy .btn:hover {
  background: #f0f4e5;
}
.assistant-preview {
  border: 1px solid #47635a;
  background: #ffffff08;
  padding: 23px;
  border-radius: 13px;
}
.assistant-preview-top {
  display: flex;
  align-items: center;
  gap: 11px;
}
.assistant-preview-top > span {
  background: #d9e6bc;
  width: 43px;
  height: 43px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3e6237;
}
.assistant-preview-top strong {
  font-size: 14px;
  font-weight: 550;
}
.assistant-preview-top small {
  display: block;
  font-size: 10px;
  color: #bad0ba;
  margin-top: 3px;
}
.assistant-preview-top > svg {
  margin-inline-start: auto;
  color: #b4c5a6;
}
.assistant-preview > p {
  font-size: 11px;
  color: #c6d8ca;
  margin: 19px 0 11px;
}
.assistant-preview > a {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  background: #ffffff08;
  border: 1px solid #6e887d66;
  font-size: 11px;
  border-radius: 6px;
  padding: 12px;
  margin-top: 8px;
}
.assistant-preview > a:hover {
  background: #ffffff16;
  border-color: #a5b798;
}
.assistant-preview > a svg {
  flex-shrink: 0;
  color: #b5c5a4;
}
.assistant-preview > small {
  display: flex;
  gap: 6px;
  align-items: center;
  font-size: 8px;
  color: #b6cbbd;
  margin-top: 18px;
}
.feedback-strip {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 35px 0;
  margin-block: 8px 14px;
}
.feedback-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #edf2e8;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  color: #567a54;
  flex-shrink: 0;
}
.feedback-strip h3 {
  font-size: 17px;
}
.feedback-strip p {
  color: #6b7c70;
  font-size: 12px;
  margin-top: 4px;
}
.feedback-strip > .text-link {
  margin-inline-start: auto;
  flex-shrink: 0;
}
.site-footer {
  background: #153635;
  color: #d6e1d4;
  border-top: 0;
}
.site-footer .brand,
.site-footer h4 {
  color: #f4f6ee;
}
.site-footer .brand-blue {
  color: #c3d6a7;
}
.site-footer .brand-icon {
  background: #386052;
  color: #e5eed5;
}
.site-footer .brand small {
  color: #aec1aa;
}
.site-footer p,
.site-footer a,
.footer-bottom,
.footer-academic p {
  color: #b3c7b8;
}
.footer-main {
  padding-top: 45px;
  padding-bottom: 34px;
}
.footer-academic {
  background: #ffffff06;
  border-color: #65827250;
}
.footer-academic > svg {
  color: #bfd0a2;
}
.footer-academic strong {
  color: #e2ebd6;
}
.footer-bottom {
  border-color: #476359;
  font-size: 10px;
}
.floating-chat {
  background: var(--brand);
  box-shadow: 0 6px 20px #183f3930;
}

/* Consistent surfaces across sign-in, assistance and administration. */
.page-title {
  padding-bottom: 8px;
}
.page-title h1 {
  font-weight: 550;
}
.page-title p {
  color: var(--muted);
}
.tabs button.selected {
  color: var(--brand);
  border-color: var(--brand);
}
.notice {
  background: #f0f4ee;
  color: #576f5d;
  border-color: #dbe5d6;
}
.assistant-cta {
  background: #ebf2e7;
  border-color: #dce7d4;
}
.assistant-cta .cta-icon {
  background: #dfead5;
  color: #4e7540;
}
.assistant-cta p {
  color: #59735a;
}
.faq-categories button.active,
.chat-history > button.active {
  background: #eaf2e7;
  color: var(--brand);
}
.auth-visual {
  background: linear-gradient(145deg, #153c3c, #36765c);
}
.chat-message.user > div {
  background: var(--brand);
}
.assistant-avatar,
.large-ai,
.message-avatar {
  color: var(--brand);
  background: #eaf1e4;
}
.chat-top {
  background: #f9fbf6;
}
.suggestions button:hover {
  border-color: #91b094;
  background: #f2f7ed;
}
.admin-sidebar nav a.active {
  background: #eaf2e6;
  color: var(--brand);
}
.admin-sidebar,
.admin-header {
  border-color: var(--line);
}
.admin-stats article,
.chart-panel,
.form-panel {
  border-color: var(--line);
  border-radius: 12px;
}
.admin-stats article strong {
  color: var(--ink);
}
.toast {
  background: #173e35;
  color: white;
}
input:focus,
select:focus,
textarea:focus {
  border-color: #498f7a;
  box-shadow: 0 0 0 3px #176b6210;
}
button:focus-visible,
a:focus-visible,
input:focus-visible,
select:focus-visible,
textarea:focus-visible {
  outline: 2px solid #318978;
  outline-offset: 3px;
}

/* Logical direction, generous targets, and reduced-motion support. */
[dir="rtl"] {
  font-family: "Segoe UI", Tahoma, Arial, sans-serif;
}
[dir="rtl"] h1,
[dir="rtl"] h2,
[dir="rtl"] h3,
[dir="rtl"] .eyebrow,
[dir="rtl"] .welcome-eyebrow {
  letter-spacing: 0;
}
[dir="rtl"] .welcome-copy h1 {
  font-weight: 600;
  line-height: 1.4;
}
[dir="rtl"] .welcome-copy > p {
  font-size: 15px;
}
[dir="rtl"] .welcome-eyebrow {
  font-size: 12px;
}
[dir="rtl"] .lucide-arrow-right,
[dir="rtl"] .lucide-arrow-up-right {
  transform: scaleX(-1);
}
[dir="rtl"] .brand {
  flex-direction: row;
}
[dir="rtl"] .intelligent-assistant h2 {
  line-height: 1.5;
}
@media (max-width: 1150px) {
  .header-inner {
    gap: 15px;
  }
  .site-header nav {
    gap: 16px;
  }
  .header-actions {
    gap: 10px;
  }
  .welcome-grid {
    gap: 30px;
  }
  .welcome-copy h1 {
    font-size: 48px;
  }
  .welcome-actions {
    gap: 16px;
  }
  .board-layout {
    grid-template-columns: minmax(0, 1fr) 255px;
    gap: 18px;
  }
  .flight-table th,
  .flight-table td {
    padding-inline: 14px;
  }
  .travel-checklist {
    padding-inline: 18px;
  }
  .intelligent-assistant {
    gap: 45px;
    padding-inline: 35px;
  }
}
@media (max-width: 950px) {
  .header-inner {
    height: 74px;
  }
  .site-header nav {
    height: auto;
    background: white;
    padding: 20px 28px;
  }
  .site-header nav a {
    min-height: 44px;
  }
  .mobile-menu {
    display: inline-flex;
    width: 44px;
    height: 44px;
  }
  .welcome-grid {
    gap: 25px;
  }
  .welcome-copy h1 {
    font-size: 40px;
  }
  .welcome-copy > p {
    font-size: 13px;
  }
  .welcome-actions {
    align-items: start;
    flex-direction: column;
  }
  .destination-visual {
    height: 385px;
  }
  .travel-assistant-note {
    padding: 14px;
    inset-inline-end: 10px;
    max-width: calc(100% - 20px);
  }
  .travel-assistant-note > svg {
    display: none;
  }
  .essential-shortcuts a {
    gap: 7px;
    font-size: 10px;
  }
  .essential-shortcuts a > svg:last-child {
    display: none;
  }
  .board-layout {
    grid-template-columns: minmax(0, 1fr);
  }
  .travel-checklist {
    padding: 22px;
  }
  .travel-checklist h3 {
    font-size: 24px;
    margin-top: 3px;
  }
  .checklist-items {
    flex-direction: row;
    margin-block: 20px;
  }
  .checklist-items label {
    flex: 1;
  }
  .checklist-progress {
    width: 100%;
  }
  .home-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .intelligent-assistant {
    gap: 30px;
    padding: 30px;
  }
  .assistant-spotlight-copy h2 {
    font-size: 31px;
  }
  .assistant-preview {
    padding: 18px;
  }
}
@media (max-width: 640px) {
  .container {
    padding-inline: 20px;
  }
  .public-shell {
    padding-bottom: calc(69px + env(safe-area-inset-bottom));
  }
  .utility-bar {
    height: 29px;
    font-size: 9px;
  }
  .utility-bar .container > span:last-child {
    display: none;
  }
  .header-inner {
    height: 70px;
    gap: 10px;
  }
  .brand-icon {
    height: 34px;
    width: 34px;
    border-radius: 10px;
  }
  .brand > span:last-child {
    font-size: 21px;
  }
  .brand small {
    font-size: 6px;
    letter-spacing: 2px;
  }
  .header-actions {
    gap: 5px;
  }
  .language-picker {
    gap: 3px;
  }
  .language-picker select {
    font-size: 12px;
    min-width: 39px;
  }
  .header-actions .account-btn {
    display: none;
  }
  .site-header nav {
    padding: 15px 20px;
  }
  .site-header nav a {
    font-size: 14px;
  }
  .welcome-section {
    padding-top: 26px;
  }
  .welcome-grid {
    grid-template-columns: minmax(0, 1fr);
    gap: 25px;
    padding-bottom: 44px;
  }
  .welcome-copy {
    padding-block: 6px 0;
  }
  .welcome-eyebrow {
    font-size: 8px;
    letter-spacing: 1.65px;
  }
  .welcome-copy h1 {
    font-size: clamp(35px, 9vw, 46px);
    margin-block: 19px 16px;
    line-height: 1.16;
  }
  .welcome-copy > p {
    font-size: 13px;
    line-height: 1.85;
  }
  .welcome-actions {
    gap: 17px;
    margin-top: 22px;
    flex-direction: row;
    align-items: center;
  }
  .welcome-actions .btn {
    font-size: 12px;
    min-height: 47px;
    padding-inline: 13px;
  }
  .welcome-actions .text-link {
    font-size: 11px;
  }
  .welcome-languages {
    margin-top: 23px;
    font-size: 10px;
  }
  .destination-visual {
    height: 250px;
    border-radius: 12px;
  }
  .destination-wordmark {
    bottom: 47px;
    inset-inline-start: 22px;
  }
  .destination-wordmark > span {
    font-size: 58px;
  }
  .destination-wordmark small {
    font-size: 8px;
  }
  .destination-tag {
    inset-block-start: 14px;
    inset-inline: 14px;
    font-size: 10px;
  }
  .travel-assistant-note {
    bottom: -19px;
    padding: 11px 14px;
  }
  .travel-assistant-note strong {
    font-size: 11px;
  }
  .travel-assistant-note p {
    font-size: 9px;
  }
  .destination-visual figcaption {
    font-size: 7px;
    inset-inline-start: 13px;
    bottom: 13px;
  }
  .flight-finder {
    border-radius: 11px;
    margin-bottom: -38px;
  }
  .finder-top {
    padding-inline: 16px;
  }
  .finder-directions {
    gap: 20px;
  }
  .finder-directions button {
    padding-block: 16px 13px;
    font-size: 12px;
    gap: 6px;
  }
  .finder-demo {
    font-size: 8px;
    gap: 4px;
    max-width: 90px;
  }
  .finder-demo svg {
    flex-shrink: 0;
    width: 12px;
  }
  .finder-form {
    padding: 18px 16px;
    gap: 12px;
    flex-wrap: wrap;
  }
  .finder-plane {
    width: 39px;
    height: 42px;
  }
  .finder-form label {
    font-size: 10px;
  }
  .finder-form input {
    font-size: 16px;
    letter-spacing: -0.5px;
  }
  .finder-form .btn {
    width: 100%;
    min-height: 46px;
    margin-top: 3px;
  }
  .finder-form .btn > svg:last-child {
    margin-inline-start: auto;
  }
  .essential-shortcuts {
    padding-top: 65px;
    padding-bottom: 25px;
  }
  .essential-shortcuts > p {
    font-size: 9px;
    margin-bottom: 16px;
  }
  .essential-shortcuts > div {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    row-gap: 18px;
  }
  .essential-shortcuts a {
    flex-direction: column;
    gap: 7px;
    font-size: 11px;
    padding: 5px;
  }
  .essential-shortcuts a:nth-child(3n) {
    border: 0;
  }
  .flight-overview,
  .airport-essentials {
    margin-top: 35px;
  }
  .section-title {
    flex-wrap: wrap;
    align-items: start;
    gap: 12px;
    margin-bottom: 18px;
  }
  .section-title h2 {
    font-size: 25px;
    line-height: 1.25;
  }
  .section-title .eyebrow {
    font-size: 8px;
    letter-spacing: 1.2px;
  }
  .section-title p {
    font-size: 11px;
  }
  .section-title > .text-link {
    font-size: 11px;
    min-height: 28px;
  }
  .board-toolbar {
    padding-inline: 15px;
    min-height: 56px;
  }
  .board-toolbar h3 {
    font-size: 13px;
  }
  .board-toolbar .table-meta {
    display: inline-flex;
    font-size: 8px;
  }
  .flight-table {
    min-width: 600px;
  }
  .flight-table th,
  .flight-table td {
    padding-inline: 16px;
  }
  .board-foot {
    font-size: 8px;
    padding: 12px 14px;
  }
  .board-foot a {
    font-size: 9px;
  }
  .travel-checklist {
    padding: 18px 20px;
  }
  .travel-checklist h3 {
    font-size: 25px;
    margin-top: 9px;
  }
  .travel-checklist > p {
    font-size: 12px;
  }
  .checklist-items {
    flex-direction: column;
    gap: 9px;
    margin-block: 15px 20px;
  }
  .checklist-items label {
    min-height: 40px;
    font-size: 13px;
  }
  .checklist-heading .icon-btn {
    min-width: 40px;
    min-height: 40px;
  }
  .home-grid {
    gap: 12px;
  }
  .service-card {
    padding: 18px;
  }
  .service-card h3 {
    font-size: 16px;
  }
  .service-card p {
    font-size: 11px;
    line-height: 1.75;
  }
  .service-card .text-link {
    font-size: 11px;
    min-height: 35px;
  }
  .service-icon {
    width: 41px;
    height: 41px;
    margin-bottom: 16px;
  }
  .service-icon svg {
    width: 23px;
  }
  .intelligent-assistant {
    grid-template-columns: minmax(0, 1fr);
    padding: 27px 22px;
    margin-top: 35px;
    gap: 27px;
  }
  .assistant-spotlight-copy h2 {
    font-size: 33px;
  }
  .assistant-spotlight-copy .eyebrow {
    font-size: 8px;
  }
  .assistant-spotlight-copy > p {
    font-size: 12px;
  }
  .assistant-preview {
    padding: 17px;
  }
  .assistant-preview > a {
    min-height: 44px;
    font-size: 11px;
  }
  .assistant-preview > small {
    font-size: 8px;
    line-height: 1.7;
  }
  .feedback-strip {
    flex-wrap: wrap;
    gap: 13px;
    padding-block: 27px;
    margin: 0;
  }
  .feedback-strip > div {
    flex: 1;
    min-width: 180px;
  }
  .feedback-strip h3 {
    font-size: 16px;
  }
  .feedback-strip p {
    font-size: 11px;
  }
  .feedback-strip > .text-link {
    margin-inline-start: 63px;
    min-height: 35px;
    font-size: 12px;
  }
  .footer-main {
    padding-block: 30px;
    gap: 25px;
  }
  .footer-bottom {
    font-size: 9px;
  }
  .floating-chat {
    display: none;
  }
  .mobile-bottom-nav {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    position: fixed;
    bottom: 0;
    inset-inline: 0;
    z-index: 25;
    background: #fffffffa;
    border-top: 1px solid var(--line);
    padding: 7px 8px calc(7px + env(safe-area-inset-bottom));
    box-shadow: 0 -5px 20px #123c3005;
    backdrop-filter: blur(16px);
  }
  .mobile-bottom-nav a {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 5px;
    min-height: 52px;
    color: #6f8178;
    font-size: 9px;
    border-radius: 9px;
  }
  .mobile-bottom-nav a.active {
    background: #edf3e8;
    color: var(--brand);
  }
  .mobile-bottom-nav a:nth-child(3) svg {
    color: var(--brand);
  }
  .toast {
    bottom: calc(86px + env(safe-area-inset-bottom));
  }
  .public-shell input,
  .public-shell select,
  .public-shell textarea {
    font-size: 16px;
  }
  .public-shell .language-picker select {
    font-size: 12px;
  }
  .public-shell .icon-btn {
    min-width: 40px;
    min-height: 40px;
  }
  [dir="rtl"] .welcome-copy h1 {
    font-size: 43px;
    line-height: 1.35;
  }
  [dir="rtl"] .welcome-copy > p {
    font-size: 14px;
  }
  [dir="rtl"] .welcome-eyebrow {
    font-size: 11px;
  }
}
@media (max-width: 370px) {
  .container {
    padding-inline: 16px;
  }
  .home-grid {
    grid-template-columns: minmax(0, 1fr);
  }
  .welcome-actions {
    flex-direction: column;
    align-items: start;
  }
  .welcome-copy h1 {
    font-size: 34px;
  }
  .brand > span:last-child {
    font-size: 19px;
  }
  .brand-icon {
    width: 30px;
    height: 32px;
  }
}

@media (max-width: 640px) {
  .responsive-flights > .table-scroll {
    display: none;
  }
  .flight-mobile-list {
    display: block;
  }
  .mobile-flight-card {
    display: block;
    padding: 17px 16px;
    border-bottom: 1px solid var(--line);
  }
  .mobile-flight-card:last-child {
    border-bottom: 0;
  }
  .mobile-flight-card:hover {
    background: #f8fbf4;
  }
  .mobile-flight-heading {
    display: flex;
    align-items: center;
    gap: 9px;
  }
  .mobile-flight-heading > strong {
    font-size: 11px;
    letter-spacing: 0.4px;
  }
  .mobile-flight-heading .airline {
    margin: 0;
    font-size: 9px;
  }
  .mobile-flight-heading > small {
    margin-inline-start: auto;
    font-size: 9px;
    color: #68786e;
  }
  .mobile-flight-route {
    display: flex;
    align-items: center;
    gap: 17px;
    margin-block: 13px;
  }
  .mobile-flight-route > div:first-child {
    flex: 1;
  }
  .mobile-flight-route > div small {
    display: block;
    font-size: 9px;
    color: #637b6d;
    margin-bottom: 3px;
  }
  .mobile-flight-route > div strong {
    display: block;
    font-size: 20px;
    font-weight: 550;
    letter-spacing: -0.5px;
  }
  .mobile-flight-route > div:nth-child(2) strong {
    font-size: 22px;
    font-variant-numeric: tabular-nums;
  }
  .mobile-flight-route > svg {
    color: #6d8977;
  }
  .mobile-flight-footer {
    display: flex;
    align-items: center;
    gap: 13px;
    flex-wrap: wrap;
  }
  .mobile-flight-footer > span:not(.badge) {
    display: flex;
    align-items: center;
    gap: 5px;
    color: #697b6c;
    font-size: 9px;
  }
  .mobile-flight-footer b {
    color: #395c48;
    font-weight: 600;
  }
  .site-header nav {
    top: 70px;
  }
}

.tracking-entry {
  display: flex;
  align-items: center;
  gap: 12px;
  border: 1px solid #d8e5dd;
  border-radius: 9px;
  padding: 14px 18px;
  margin-bottom: 18px;
  background: #eff5ee;
  color: #2d6855;
  font-size: 12px;
}
.tracking-entry > svg {
  flex-shrink: 0;
}
.tracking-entry > svg:last-child {
  margin-inline-start: auto;
}
.tracking-entry:hover {
  background: #e7f0e1;
}
@media (max-width: 640px) {
  .tracking-entry {
    font-size: 11px;
    padding: 14px;
  }
}

```

## frontend/src/layouts/AdminLayout.jsx

```jsx
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Plane,
  MessageCircle,
  HelpCircle,
  ChartColumn,
  BookOpen,
  Layers,
  MessagesSquare,
  ArrowUpRight,
  LogOut,
  Globe,
} from "lucide-react";
import { useApp } from "../contexts/AppContext";
import { api } from "../services/api";
import { Brand } from "../components/UI";
export default function AdminLayout() {
  const { t, lang, setLang, user, setUser } = useApp(),
    navigate = useNavigate();
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Brand />
        <span className="admin-label">{t("admin")}</span>
        <nav>
          {[
            ["", "dashboard", LayoutDashboard],
            ["flights", "flights", Plane],
            ["services", "services", Layers],
            ["faq", "faq", HelpCircle],
            ["knowledge", "knowledge", BookOpen],
            ["complaints", "complaints", MessageCircle],
            ["conversations", "conversations", MessagesSquare],
            ["analytics", "analytics", ChartColumn],
          ].map(([path, k, Icon]) => (
            <NavLink end to={"/admin" + (path ? "/" + path : "")} key={k}>
              <Icon size={19} />
              {t(k)}
            </NavLink>
          ))}
        </nav>
        <div className="admin-sidebar-bottom">
          <Link to="/">
            {t("passengerView")}
            <ArrowUpRight size={16} />
          </Link>
          <button
            onClick={async () => {
              await api.post("/auth/logout", {});
              setUser(null);
              navigate("/");
            }}
          >
            <LogOut size={17} />
            {t("logout")}
          </button>
        </div>
      </aside>
      <div className="admin-main">
        <header className="admin-header">
          <span>
            {t("airport")} <span className="demo-pill">{t("academic")}</span>
          </span>
          <div>
            <label className="language-picker">
              <Globe size={16} />
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                aria-label="Language"
              >
                <option value="fr">FR</option>
                <option value="en">EN</option>
                <option value="ar">AR</option>
              </select>
            </label>
            <span className="user-avatar">{user.name[0]}</span>
            <strong>{user.name}</strong>
          </div>
        </header>
        <div className="admin-content">
          <Outlet />
        </div>
        <footer className="admin-footer">{t("footer")}</footer>
      </div>
    </div>
  );
}

```

## frontend/src/layouts/PublicLayout.jsx

```jsx
import { useState, useEffect } from "react";
import {
  NavLink,
  Link,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  Globe,
  UserRound,
  Menu,
  X,
  ArrowUpRight,
  MapPin,
  ShieldCheck,
  Plane,
  MessageCircle,
  LogOut,
  House,
  PlaneTakeoff,
  Radar,
  Sparkles,
} from "lucide-react";
import { Brand } from "../components/UI";
import { useApp } from "../contexts/AppContext";
import { api } from "../services/api";
import { travelCopy } from "../contexts/travelCopy";
export default function PublicLayout() {
  const { t, lang, setLang, user, setUser } = useApp();
  const copy = travelCopy[lang] || travelCopy.fr;
  const [menu, setMenu] = useState(false),
    location = useLocation(),
    navigate = useNavigate();
  useEffect(() => {
    setMenu(false);
  }, [location.pathname, location.search]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  useEffect(() => {
    if (!menu) return;
    document
      .querySelector("#primary-navigation a")
      ?.focus({ preventScroll: true });
    const close = (event) => {
      if (event.key === "Escape") {
        setMenu(false);
        document.getElementById("mobile-menu-toggle")?.focus();
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [menu]);
  return (
    <div className="public-shell">
      <a className="skip-link" href="#main-content">
        {copy.skip}
      </a>
      <div className="utility-bar">
        <div className="container">
          <span>
            <MapPin size={13} />
            {t("airport")}
          </span>
          <span>
            <ShieldCheck size={13} />
            {t("academic")}
            <i />
            {location.pathname === "/tracking" ? t("tracking") : t("noLive")}
          </span>
        </div>
      </div>
      <header className="site-header">
        <div className="container header-inner">
          <Brand />
          <nav
            id="primary-navigation"
            aria-label={copy.navigation}
            className={menu ? "open" : ""}
          >
            {[
              ["/", "home"],
              ["/flights", "flights"],
              ["/services", "services"],
              ["/assistant", "assistant"],
              ["/tracking", "tracking"],
              ["/complaints", "complaints"],
            ].map(([url, k]) => (
              <NavLink end={url === "/"} key={url} to={url}>
                {t(k)}
                {k === "assistant" && <span className="ai-dot" />}
              </NavLink>
            ))}
          </nav>
          <div className="header-actions">
            <label className="language-picker">
              <Globe size={17} />
              <select
                aria-label="Language / Langue / اللغة"
                value={lang}
                onChange={(e) => setLang(e.target.value)}
              >
                <option value="fr">FR</option>
                <option value="en">EN</option>
                <option value="ar">AR</option>
              </select>
            </label>
            <Link className="btn account-btn" to={user ? "/account" : "/login"}>
              <UserRound size={16} />
              <span>{t(user ? "account" : "login")}</span>
            </Link>
            <button
              className="icon-btn mobile-menu"
              id="mobile-menu-toggle"
              onClick={() => setMenu(!menu)}
              aria-label={menu ? copy.closeMenu : copy.menu}
              aria-expanded={menu}
              aria-controls="primary-navigation"
            >
              {menu ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>
      <div id="main-content" tabIndex={-1}>
        <Outlet />
      </div>
      <footer className="site-footer">
        <div className="container footer-main">
          <div>
            <Brand />
            <p>
              {t("airport")}
              <br />
              {copy.footerLine}
            </p>
          </div>
          <div>
            <h4>{t("quickAccess")}</h4>
            <Link to="/flights">{t("flights")}</Link>
            <Link to="/tracking">{t("tracking")}</Link>
            <Link to="/services">{t("services")}</Link>
            <Link to="/faq">{t("faq")}</Link>
          </div>
          <div>
            <h4>{t("assistance")}</h4>
            <Link to="/assistant">{t("assistant")}</Link>
            <Link to="/complaints">{t("complaints")}</Link>
            <Link to={user?.role === "ADMIN" ? "/admin" : "/login"}>
              {t("admin")}
              <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="footer-academic">
            <ShieldCheck size={22} />
            <strong>{t("academic")}</strong>
            <p>{t("footer")}</p>
          </div>
        </div>
        <div className="container footer-bottom">
          <span>
            © {new Date().getFullYear()} Oujda Smart ·{" "}
            {t(location.pathname === "/tracking" ? "tracking" : "demo")}
          </span>
          <span>FR · العربية · EN</span>
        </div>
      </footer>
      <nav className="mobile-bottom-nav" aria-label={copy.mobileNavigation}>
        {[
          ["/", "home", House],
          ["/flights", "flights", PlaneTakeoff],
          ["/assistant", "assistant", Sparkles],
          ["/tracking", "tracking", Radar],
          [user ? "/account" : "/login", "account", UserRound],
        ].map(([url, label, Icon]) => (
          <NavLink end={url === "/"} to={url} key={label}>
            <Icon size={20} />
            <span>{t(label)}</span>
          </NavLink>
        ))}
      </nav>
      {location.pathname !== "/assistant" && (
        <Link
          className="floating-chat"
          to="/assistant"
          aria-label={t("assistant")}
        >
          <MessageCircle size={24} />
        </Link>
      )}
    </div>
  );
}

```

## frontend/src/main.jsx

```jsx
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { Provider, useApp } from "./contexts/AppContext";
import PublicLayout from "./layouts/PublicLayout";
import AdminLayout from "./layouts/AdminLayout";
import { Flights, FlightDetails, Services, FAQ } from "./pages/Travel";
import { Home } from "./pages/Home";
import { Assistant, Complaint, Auth, UserDashboard } from "./pages/Passenger";
import {
  AdminDashboard,
  AdminResource,
  AdminComplaints,
  AdminConversations,
} from "./pages/Admin";
import "./styles.css";
import "./international.css";
import "./airport-identity.css";
const Tracking = React.lazy(() => import("./pages/Tracking"));
function TrackingScreen() {
  const { t } = useApp();
  return (
    <React.Suspense
      fallback={
        <div className="container page" role="status">
          {t("loading")}
        </div>
      }
    >
      <Tracking />
    </React.Suspense>
  );
}
function Protected({ children, admin = false }) {
  const { user, ready, t } = useApp();
  if (!ready) return <div className="empty">{t("loading")}</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (admin && user.role !== "ADMIN") return <Navigate to="/account" replace />;
  return children;
}
function NotFound() {
  const { t } = useApp();
  return (
    <main className="container page empty">
      <h1>404</h1>
      <h2>{t("noPage")}</h2>
      <Link className="btn primary" to="/">
        {t("returnHome")}
      </Link>
    </main>
  );
}
class ErrorBoundary extends React.Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed)
      return (
        <main className="container page">
          <h1>Une erreur est survenue.</h1>
          <p>Rechargez la page pour retrouver le prototype.</p>
          <button
            className="btn primary"
            onClick={() => window.location.reload()}
          >
            Recharger
          </button>
        </main>
      );
    return this.props.children;
  }
}
createRoot(document.getElementById("root")).render(
  <ErrorBoundary>
    <BrowserRouter>
      <Provider>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="flights" element={<Flights />} />
            <Route path="tracking" element={<TrackingScreen />} />
            <Route path="flights/:id" element={<FlightDetails />} />
            <Route path="services" element={<Services />} />
            <Route path="faq" element={<FAQ />} />
            <Route path="assistant" element={<Assistant />} />
            <Route path="complaints" element={<Complaint />} />
            <Route path="login" element={<Auth />} />
            <Route path="register" element={<Auth register />} />
            <Route
              path="account"
              element={
                <Protected>
                  <UserDashboard />
                </Protected>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route
            path="admin"
            element={
              <Protected admin>
                <AdminLayout />
              </Protected>
            }
          >
            <Route index element={<AdminDashboard />} />
            {["flights", "services", "faq", "knowledge"].map((resource) => (
              <Route
                key={resource}
                path={resource}
                element={<AdminResource key={resource} resource={resource} />}
              />
            ))}
            <Route path="complaints" element={<AdminComplaints />} />
            <Route path="conversations" element={<AdminConversations />} />
            <Route path="analytics" element={<AdminDashboard full />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Provider>
    </BrowserRouter>
  </ErrorBoundary>,
);

```

## frontend/src/pages/Admin.jsx

```jsx
import { useState } from "react";
import {
  Users,
  MessagesSquare,
  MessageCircle,
  Clock,
  Plus,
  PenLine,
  Trash2,
  Sparkles,
  ArrowUpRight,
  Search,
  Check,
  ChartColumn,
} from "lucide-react";
import { useApp } from "../contexts/AppContext";
import { useData } from "../hooks/useData";
import { api } from "../services/api";
import {
  PageHeader,
  Load,
  Status,
  Empty,
  Modal,
  Notice,
  BusyButton,
  categories,
  shortDate,
} from "../components/UI";
export function AdminDashboard({ full = false }) {
  const { t, tr, lang } = useApp(),
    state = useData("/analytics"),
    [period, setPeriod] = useState("daily"),
    d = state.data;
  return (
    <>
      <PageHeader
        title={t(full ? "analytics" : "dashboard")}
        description={t("manageIntro")}
      />
      <Load state={state}>
        {d && (
          <>
            <div className="admin-stats">
              {[
                ["users", Users, d.counts.users],
                ["conversations", MessagesSquare, d.counts.conversations],
                ["complaints", MessageCircle, d.counts.complaints],
                ["openComplaints", Clock, d.counts.open],
              ].map(([k, Icon, value], i) => (
                <article key={k}>
                  <span className={"stat-icon stat-" + i}>
                    <Icon size={22} />
                  </span>
                  <span>{t(k)}</span>
                  <strong>{value}</strong>
                  <small>{t("demo")}</small>
                </article>
              ))}
            </div>
            <div className="analytics-grid">
              <section className="panel chart-panel">
                <div className="section-title">
                  <h3>{t("requestTrend")}</h3>
                  <select
                    aria-label={t("requestTrend")}
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                  >
                    <option value="daily">{t("daily")}</option>
                    <option value="monthly">{t("monthly")}</option>
                  </select>
                </div>
                <div
                  className="bar-chart"
                  role="img"
                  aria-label={t("requestTrend")}
                >
                  {d[period].map((r, i) => {
                    const max = Math.max(1, ...d[period].map((v) => v.count));
                    return (
                      <div key={i}>
                        <span>{r.count}</span>
                        <i
                          style={{ height: Math.max(4, (r.count / max) * 150) }}
                        />
                        <small>
                          {period === "daily"
                            ? (r.day || "").slice(5)
                            : r.month}
                        </small>
                      </div>
                    );
                  })}
                </div>
              </section>
              <section className="panel chart-panel">
                <h3>{t("popularTopics")}</h3>
                <div className="horizontal-chart">
                  {d.topics.slice(0, 6).map((r) => (
                    <div key={r.topic}>
                      <span>{t(r.topic)}</span>
                      <div>
                        <i
                          style={{
                            width:
                              (r.count /
                                Math.max(...d.topics.map((t) => t.count), 1)) *
                                100 +
                              "%",
                          }}
                        />
                      </div>
                      <strong>{r.count}</strong>
                    </div>
                  ))}
                </div>
              </section>
              <section className="panel chart-panel">
                <h3>{t("sentiment")}</h3>
                <div className="sentiments">
                  {["positive", "neutral", "negative"].map((s) => (
                    <div className={s} key={s}>
                      <span>
                        {s === "positive" ? "☺" : s === "neutral" ? "◉" : "☹"}
                      </span>
                      <strong>
                        {d.sentiments.find((v) => v.sentiment === s)?.count ||
                          0}
                      </strong>
                      <small>{t(s)}</small>
                    </div>
                  ))}
                </div>
                <p className="tiny muted">{t("analysisNote")}</p>
              </section>
              <section className="panel chart-panel">
                <h3>{t("popularServices")}</h3>
                <div className="service-ranks">
                  {d.services.map((s, i) => (
                    <div key={i}>
                      <span>{String(i + 1).padStart(2, "0")}</span>
                      <strong>{tr(s.title)}</strong>
                      <small>{s.views}</small>
                    </div>
                  ))}
                </div>
              </section>
            </div>
            <section className="recommendation-panel">
              <div>
                <span className="stat-icon">
                  <Sparkles size={23} />
                </span>
                <h3>{t("recommendations")}</h3>
              </div>
              <div>
                {d.recommendations.map((r, i) => (
                  <p key={r.topic}>
                    <span>{i + 1}</span>
                    {t("recommendText")} <strong>{t(r.topic)}</strong>
                    <small>{r.count}</small>
                  </p>
                ))}
              </div>
            </section>
            {full && (
              <section className="panel chart-panel">
                <h3>{t("frequentQuestions")}</h3>
                {d.questions.length ? (
                  d.questions.map((q, i) => (
                    <div className="question-row" key={i}>
                      <p>{q.content}</p>
                      <span>{q.count}</span>
                    </div>
                  ))
                ) : (
                  <Empty />
                )}
              </section>
            )}
            <Notice>{t("analysisNote")}</Notice>
          </>
        )}
      </Load>
    </>
  );
}
const resourceConfig = {
  flights: {
    title: "flights",
    fields: [
      ["number", "flight"],
      ["airline", "airline"],
      ["city", "city"],
      ["direction", "direction", "direction"],
      ["scheduled_at", "scheduled", "datetime-local"],
      ["estimated_at", "estimated", "datetime-local"],
      ["gate", "gate"],
      ["status", "status", "status"],
      ["terminal", "terminal"],
    ],
  },
  services: {
    title: "services",
    fields: [
      ["slug", "slug"],
      ["icon", "icon"],
      ["title", "title", "translated"],
      ["description", "description", "translated"],
      ["location", "location", "translated"],
      ["hours", "hours", "translated"],
    ],
  },
  faq: {
    title: "faq",
    fields: [
      ["category", "category", "category"],
      ["question", "question", "translated"],
      ["answer", "answer", "translated"],
      ["keywords", "keywords"],
    ],
  },
  knowledge: {
    title: "knowledge",
    fields: [
      ["topic", "topic", "category"],
      ["title", "title", "translated"],
      ["content", "answer", "translated"],
      ["keywords", "keywords"],
      ["source", "source"],
    ],
  },
};
function localDate(v) {
  if (!v) return "";
  const d = new Date(v);
  return new Date(d - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}
export function AdminResource({ resource }) {
  const { t, tr, notify } = useApp(),
    state = useData("/admin/" + resource),
    cfg = resourceConfig[resource];
  const [edit, setEdit] = useState(null),
    [remove, setRemove] = useState(null),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [q, setQ] = useState(""),
    [editLang, setEditLang] = useState("fr");
  function open(item) {
    const record = item
      ? structuredClone(item)
      : Object.fromEntries(
          cfg.fields.map(([k, label, type]) => [
            k,
            type === "translated"
              ? { fr: "", ar: "", en: "" }
              : type === "category"
                ? "services"
                : type === "direction"
                  ? "departure"
                  : type === "status"
                    ? "ON_TIME"
                    : "",
          ]),
        );
    if (!item && resource === "flights") record.terminal = "Terminal démo";
    if (!item && resource === "knowledge")
      record.source = "Prototype académique";
    setEdit(record);
    setEditLang("fr");
    setError("");
  }
  async function save(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const d = Object.fromEntries(
        cfg.fields.map(([k, l, type]) => [
          k,
          type === "datetime-local" ? new Date(edit[k]).toISOString() : edit[k],
        ]),
      );
      for (const [key, label, type] of cfg.fields) {
        if (
          type === "translated" &&
          ["fr", "en", "ar"].some((l) => !d[key][l]?.trim())
        )
          throw new Error(t(label) + " : FR, EN et AR sont requis.");
      }
      await api[edit.id ? "put" : "post"](
        "/admin/" + resource + (edit.id ? "/" + edit.id : ""),
        d,
      );
      setEdit(null);
      state.refresh();
      notify(t("savedOk"));
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  const list = (state.data || []).filter((r) =>
    JSON.stringify(r).toLowerCase().includes(q.toLowerCase()),
  );
  return (
    <>
      <PageHeader title={t(cfg.title)} description={t("manageIntro")}>
        <button className="btn primary" onClick={() => open()}>
          <Plus size={17} />
          {t("add")}
        </button>
      </PageHeader>
      <section className="panel">
        <div className="resource-toolbar search-input">
          <Search size={18} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("search")}
          />
        </div>
        <Load state={state}>
          {!list.length ? (
            <Empty />
          ) : (
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>
                      {t(
                        resource === "flights"
                          ? "flight"
                          : resource === "faq"
                            ? "question"
                            : "title",
                      )}
                    </th>
                    <th>
                      {t(resource === "flights" ? "destination" : "category")}
                    </th>
                    <th>{t(resource === "flights" ? "status" : "source")}</th>
                    <th>{t("actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((r) => (
                    <tr key={r.id}>
                      <td>
                        <strong>{r.number || tr(r.question || r.title)}</strong>
                        {r.airline && <small>{r.airline}</small>}
                      </td>
                      <td>{r.city || t(r.category || r.topic) || r.slug}</td>
                      <td>
                        {r.status ? (
                          <Status value={r.status} />
                        ) : (
                          r.source || t("academic")
                        )}
                      </td>
                      <td>
                        <div className="table-actions">
                          <button
                            className="icon-btn"
                            aria-label={t("edit")}
                            onClick={() => open(r)}
                          >
                            <PenLine size={17} />
                          </button>
                          <button
                            className="icon-btn danger-text"
                            aria-label={t("delete")}
                            onClick={() => {
                              setRemove(r);
                              setError("");
                            }}
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Load>
      </section>
      <Modal
        open={!!edit}
        title={t(edit?.id ? "edit" : "add") + " · " + t(cfg.title)}
        onClose={() => setEdit(null)}
      >
        {edit && (
          <form onSubmit={save}>
            {resource !== "flights" && (
              <div className="tabs language-tabs">
                {["fr", "en", "ar"].map((l) => (
                  <button
                    type="button"
                    key={l}
                    className={editLang === l ? "selected" : ""}
                    onClick={() => setEditLang(l)}
                  >
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>
            )}
            {cfg.fields.map(([key, label, type]) => (
              <label key={key}>
                {t(label)}
                {type === "translated" ? " · " + editLang.toUpperCase() : ""}
                {type === "translated" ? (
                  <textarea
                    dir={editLang === "ar" ? "rtl" : "ltr"}
                    rows={key === "content" || key === "answer" ? 4 : 2}
                    value={edit[key]?.[editLang] || ""}
                    maxLength={4000}
                    onChange={(e) =>
                      setEdit({
                        ...edit,
                        [key]: { ...edit[key], [editLang]: e.target.value },
                      })
                    }
                  />
                ) : ["category", "status", "direction"].includes(type) ? (
                  <select
                    value={edit[key]}
                    onChange={(e) =>
                      setEdit({ ...edit, [key]: e.target.value })
                    }
                  >
                    {(type === "category"
                      ? categories
                      : type === "status"
                        ? [
                            "ON_TIME",
                            "DELAYED",
                            "BOARDING",
                            "DEPARTED",
                            "ARRIVED",
                            "CANCELLED",
                          ]
                        : ["departure", "arrival"]
                    ).map((v) => (
                      <option value={v} key={v}>
                        {t(
                          v === "departure"
                            ? "departures"
                            : v === "arrival"
                              ? "arrivals"
                              : v,
                        )}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    required={key !== "keywords"}
                    type={type === "datetime-local" ? type : "text"}
                    value={
                      type === "datetime-local"
                        ? localDate(edit[key])
                        : edit[key] || ""
                    }
                    maxLength={key === "keywords" ? 1000 : 300}
                    onChange={(e) =>
                      setEdit({ ...edit, [key]: e.target.value })
                    }
                  />
                )}
              </label>
            ))}
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            <BusyButton className="btn primary full" busy={busy}>
              <Check size={16} />
              {t("save")}
            </BusyButton>
          </form>
        )}
      </Modal>
      <Modal
        open={!!remove}
        onClose={() => setRemove(null)}
        title={t("deleteConfirm")}
      >
        <p>{remove?.number || tr(remove?.title || remove?.question)}</p>
        {error && <p className="form-error">{error}</p>}
        <BusyButton
          className="btn danger"
          busy={busy}
          onClick={async () => {
            setBusy(true);
            try {
              await api.delete("/admin/" + resource + "/" + remove.id);
              setRemove(null);
              state.refresh();
              notify(t("savedOk"));
            } catch (e) {
              setError(e.message);
            } finally {
              setBusy(false);
            }
          }}
        >
          {t("delete")}
        </BusyButton>
      </Modal>
    </>
  );
}
export function AdminComplaints() {
  const { t, lang, notify } = useApp(),
    state = useData("/admin/complaints"),
    [selected, setSelected] = useState(null),
    [filter, setFilter] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const transitions = {
    RECEIVED: ["RECEIVED", "IN_PROGRESS"],
    IN_PROGRESS: ["IN_PROGRESS", "RESOLVED"],
    RESOLVED: ["RESOLVED", "CLOSED", "IN_PROGRESS"],
    CLOSED: ["CLOSED", "IN_PROGRESS"],
  };
  return (
    <>
      <PageHeader title={t("complaints")} description={t("notOfficial")} />
      <section className="panel">
        <div className="resource-toolbar">
          <select
            value={filter}
            aria-label={t("filter")}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="">{t("allStatuses")}</option>
            {Object.keys(transitions).map((s) => (
              <option value={s} key={s}>
                {t(s)}
              </option>
            ))}
          </select>
        </div>
        <Load state={state}>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>{t("reference")}</th>
                  <th>{t("subject")}</th>
                  <th>{t("category")}</th>
                  <th>{t("priority")}</th>
                  <th>{t("status")}</th>
                  <th>{t("actions")}</th>
                </tr>
              </thead>
              <tbody>
                {(state.data || [])
                  .filter((c) => !filter || c.status === filter)
                  .map((c) => (
                    <tr key={c.id}>
                      <td>
                        {c.reference}
                        <small>{shortDate(c.created_at, lang)}</small>
                      </td>
                      <td>
                        <strong>{c.subject}</strong>
                        <small>{c.name}</small>
                      </td>
                      <td>{t(c.category)}</td>
                      <td>{t(c.priority)}</td>
                      <td>
                        <Status value={c.status} />
                      </td>
                      <td>
                        <button
                          className="icon-btn"
                          aria-label={t("edit")}
                          onClick={() => {
                            setSelected({ ...c, original: c.status });
                            setError("");
                          }}
                        >
                          <PenLine size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </Load>
      </section>
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.reference}
      >
        {selected && (
          <>
            <h3>{selected.subject}</h3>
            <p>{selected.message}</p>
            <p className="muted">
              {selected.name} · {selected.email}
            </p>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setBusy(true);
                setError("");
                try {
                  await api.put("/admin/complaints/" + selected.id, {
                    status: selected.status,
                    response: selected.response,
                  });
                  setSelected(null);
                  state.refresh();
                  notify(t("savedOk"));
                } catch (e) {
                  setError(e.message);
                } finally {
                  setBusy(false);
                }
              }}
            >
              <label>
                {t("status")}
                <select
                  value={selected.status}
                  onChange={(e) =>
                    setSelected({ ...selected, status: e.target.value })
                  }
                >
                  {transitions[selected.original].map((s) => (
                    <option key={s} value={s}>
                      {t(s)}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                {t("response")}
                <textarea
                  rows={5}
                  maxLength={4000}
                  value={selected.response}
                  onChange={(e) =>
                    setSelected({ ...selected, response: e.target.value })
                  }
                />
              </label>
              {error && <p className="form-error">{error}</p>}
              <BusyButton className="btn primary full" busy={busy}>
                {t("save")}
              </BusyButton>
            </form>
          </>
        )}
      </Modal>
    </>
  );
}
export function AdminConversations() {
  const { t, lang, notify } = useApp(),
    state = useData("/admin/conversations"),
    [selected, setSelected] = useState(null);
  return (
    <>
      <PageHeader title={t("conversations")} description={t("manageIntro")} />
      <Load state={state}>
        <section className="panel request-list">
          {!(state.data || []).length ? (
            <Empty />
          ) : (
            state.data.map((c) => (
              <article key={c.id}>
                <button
                  className="conversation-row"
                  onClick={async () => {
                    try {
                      setSelected(
                        await api.get("/admin/conversations/" + c.id),
                      );
                    } catch (e) {
                      notify(e.message);
                    }
                  }}
                >
                  <MessagesSquare size={23} />
                  <span>
                    <strong>{c.name || t("account")}</strong>
                    <small>
                      {shortDate(c.created_at, lang)} ·{" "}
                      {c.language.toUpperCase()} · {c.messages}
                    </small>
                  </span>
                  <ArrowUpRight size={18} />
                </button>
              </article>
            ))
          )}
        </section>
      </Load>
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={t("conversations")}
      >
        {selected?.map((m, i) => (
          <div className={"admin-chat " + m.role} key={i}>
            <strong>
              {m.role === "assistant" ? t("assistant") : t("account")}
            </strong>
            <p>{m.content}</p>
            {m.source && <small>{t(m.source)}</small>}
          </div>
        ))}
      </Modal>
    </>
  );
}

```

## frontend/src/pages/Home.jsx

```jsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Accessibility,
  ArrowRight,
  ArrowUpRight,
  Car,
  Check,
  Clock,
  Globe2,
  HelpCircle,
  Info,
  Luggage,
  MapPin,
  MessageCircle,
  ParkingCircle,
  Plane,
  PlaneLanding,
  PlaneTakeoff,
  RotateCcw,
  Radar,
  Search,
  ShieldCheck,
  Sparkles,
  Wifi,
} from "lucide-react";
import { useApp } from "../contexts/AppContext";
import { travelCopy } from "../contexts/travelCopy";
import { useData } from "../hooks/useData";
import { FlightTable, Load, icons } from "../components/UI";
import AirportHero from "../components/AirportHero";

const shortcuts = [
  ["baggage", Luggage, "/services?topic=baggage"],
  ["parking", ParkingCircle, "/services?topic=parking"],
  ["transport", Car, "/services?topic=taxi"],
  ["assistance", Accessibility, "/services?topic=assistance"],
  ["Wi-Fi", Wifi, "/services?topic=wifi"],
  ["faq", HelpCircle, "/faq"],
];

function TravelChecklist({ copy }) {
  const [checked, setChecked] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("oas-checklist-v1"));
      return Array.isArray(saved) && saved.length === 3
        ? saved.map((value) => value === true)
        : [false, false, false];
    } catch {
      return [false, false, false];
    }
  });
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    try {
      localStorage.setItem("oas-checklist-v1", JSON.stringify(checked));
      setSaved(true);
    } catch {
      setSaved(false);
    }
  }, [checked]);
  const count = checked.filter(Boolean).length;
  return (
    <aside className="travel-checklist">
      <div className="checklist-heading">
        <span className="eyebrow">{copy.checklistEyebrow}</span>
        <button
          type="button"
          className="icon-btn"
          onClick={() => setChecked([false, false, false])}
          aria-label={copy.reset}
        >
          <RotateCcw size={16} />
        </button>
      </div>
      <h3>{copy.checklistTitle}</h3>
      <p>{copy.checklistText}</p>
      <div className="checklist-items">
        {copy.checklistItems.map((item, index) => (
          <label key={index} className={checked[index] ? "is-done" : ""}>
            <input
              type="checkbox"
              checked={checked[index]}
              onChange={(event) =>
                setChecked((current) =>
                  current.map((value, i) =>
                    i === index ? event.target.checked : value,
                  ),
                )
              }
            />
            <span className="checklist-check" aria-hidden="true">
              {checked[index] && <Check size={14} />}
            </span>
            <span>{item}</span>
          </label>
        ))}
      </div>
      <div className="checklist-progress">
        <span aria-live="polite">
          {count} / 3 {copy.checklistProgress}
        </span>
        <progress value={count} max={3} aria-label={copy.checklistTitle} />
      </div>
      {saved && (
        <small>
          <ShieldCheck size={13} />
          {copy.checklistSaved}
        </small>
      )}
    </aside>
  );
}

export function Home() {
  const { t, lang, tr } = useApp();
  const copy = travelCopy[lang] || travelCopy.fr;
  const navigate = useNavigate();
  const [direction, setDirection] = useState("departure");
  const [query, setQuery] = useState("");
  const flights = useData("/flights?direction=" + direction);
  const services = useData("/services");
  function findFlight(event) {
    event.preventDefault();
    navigate("/flights?" + new URLSearchParams({ direction, q: query.trim() }));
  }
  return (
    <main className="international-home">
      <section className="welcome-section">
        <div className="container">
          <AirportHero />
          <section className="flight-finder" aria-label={copy.searchTitle}>
            <div className="finder-top">
              <div className="finder-directions">
                {[
                  ["departure", PlaneTakeoff, "departures"],
                  ["arrival", PlaneLanding, "arrivals"],
                ].map(([value, Icon, label]) => (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={direction === value}
                    className={direction === value ? "selected" : ""}
                    onClick={() => setDirection(value)}
                  >
                    <Icon size={18} />
                    {t(label)}
                  </button>
                ))}
              </div>
              <span className="finder-demo">
                <Info size={14} />
                {t("demo")}
              </span>
            </div>
            <form className="finder-form" onSubmit={findFlight}>
              <span className="finder-plane" aria-hidden="true">
                <Plane size={24} />
              </span>
              <label htmlFor="home-flight-search">
                <span>{copy.searchLabel}</span>
                <input
                  id="home-flight-search"
                  type="search"
                  maxLength={80}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={copy.searchHint}
                />
              </label>
              <button className="btn primary" type="submit">
                <Search size={18} />
                {copy.searchButton}
                <ArrowRight size={17} />
              </button>
            </form>
          </section>
        </div>
      </section>
      <div className="container">
        <section className="essential-shortcuts" aria-label={copy.shortcuts}>
          <p>{copy.shortcuts}</p>
          <div>
            {shortcuts.map(([key, Icon, url]) => (
              <Link to={url} key={key}>
                <Icon size={21} />
                <span>{key === "Wi-Fi" ? key : t(key)}</span>
                <ArrowUpRight size={13} />
              </Link>
            ))}
          </div>
        </section>
        <section className="flight-overview">
          <div className="section-title">
            <div>
              <span className="eyebrow">{copy.boardEyebrow}</span>
              <h2>{copy.boardTitle}</h2>
              <p>{copy.boardText}</p>
            </div>
            <Link className="text-link" to="/flights">
              {t("allFlights")}
              <ArrowRight size={17} />
            </Link>
          </div>
          <Link className="tracking-entry" to="/tracking">
            <Radar size={20} />
            <span>{t("trackingTeaser")}</span>
            <ArrowRight size={17} />
          </Link>
          <div className="board-layout">
            <div className="flight-panel">
              <div className="board-toolbar">
                <h3>
                  <span className="board-dot" />
                  {t(direction === "departure" ? "departures" : "arrivals")}
                </h3>
                <span className="table-meta">
                  <Clock size={14} />
                  {t("moroccoTime")}
                </span>
              </div>
              <Load state={flights}>
                <FlightTable
                  flights={(flights.data || []).slice(0, 4)}
                  compact
                />
              </Load>
              <div className="board-foot">
                <span>
                  <Info size={13} />
                  {copy.preview}
                </span>
                <Link to={"/flights?direction=" + direction}>
                  {t("allFlights")}
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
            <TravelChecklist copy={copy} />
          </div>
        </section>
        <section className="airport-essentials">
          <div className="section-title">
            <div>
              <span className="eyebrow">{copy.servicesEyebrow}</span>
              <h2>{copy.servicesTitle}</h2>
              <p>{copy.servicesText}</p>
            </div>
            <Link className="text-link" to="/services">
              {t("seeServices")}
              <ArrowRight size={17} />
            </Link>
          </div>
          <Load state={services}>
            <div className="service-grid home-grid">
              {(services.data || [])
                .filter((service) =>
                  ["parking", "dining", "assistance", "wifi"].includes(
                    service.slug,
                  ),
                )
                .map((service, index) => {
                  const Icon = icons[service.icon] || Info;
                  return (
                    <Link
                      className={"service-card service-" + index}
                      to={"/services?topic=" + service.slug}
                      key={service.id}
                    >
                      <div className="service-card-top">
                        <span className="service-icon">
                          <Icon size={26} />
                        </span>
                        <span>0{index + 1}</span>
                      </div>
                      <h3>{tr(service.title)}</h3>
                      <p>{tr(service.description)}</p>
                      <span className="text-link">
                        {t("learnMore")}
                        <ArrowRight size={16} />
                      </span>
                    </Link>
                  );
                })}
            </div>
          </Load>
        </section>
        <section className="intelligent-assistant">
          <div className="assistant-spotlight-copy">
            <span className="eyebrow">
              <Sparkles size={16} />
              {copy.assistantEyebrow}
            </span>
            <h2>{copy.assistantTitle}</h2>
            <p>{copy.assistantText}</p>
            <Link className="btn" to="/assistant">
              {copy.assistant}
              <ArrowRight size={18} />
            </Link>
          </div>
          <div className="assistant-preview">
            <div className="assistant-preview-top">
              <span>
                <Sparkles size={22} />
              </span>
              <div>
                <strong>Oujda Smart</strong>
                <small>Français · English · العربية</small>
              </div>
              <Globe2 size={22} />
            </div>
            <p>{copy.assistantHint}</p>
            {["parkingQ", "baggageQ", "checkinQ"].map((key) => (
              <Link
                key={key}
                to={"/assistant?" + new URLSearchParams({ question: t(key) })}
              >
                {t(key)}
                <ArrowUpRight size={16} />
              </Link>
            ))}
            <small>
              <ShieldCheck size={13} />
              {copy.local}
            </small>
          </div>
        </section>
        <section className="feedback-strip">
          <span className="feedback-icon">
            <MessageCircle size={25} />
          </span>
          <div>
            <h3>{copy.feedbackTitle}</h3>
            <p>{copy.feedbackText}</p>
          </div>
          <Link className="text-link" to="/complaints">
            {copy.feedbackAction}
            <ArrowRight size={17} />
          </Link>
        </section>
      </div>
    </main>
  );
}

```

## frontend/src/pages/Passenger.jsx

```jsx
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useSearchParams, Navigate } from "react-router-dom";
import {
  MessageCircle,
  Send,
  Plus,
  Sparkles,
  History,
  ArrowRight,
  ShieldCheck,
  UserRound,
  Plane,
  Heart,
  CheckCircle2,
  LogOut,
  Loader2,
} from "lucide-react";
import { useApp } from "../contexts/AppContext";
import { useData } from "../hooks/useData";
import { api } from "../services/api";
import {
  PageHeader,
  Notice,
  Load,
  Empty,
  Status,
  BusyButton,
  FlightTable,
  shortDate,
} from "../components/UI";
export function Assistant() {
  const { t, lang, user, notify } = useApp(),
    [params] = useSearchParams(),
    [sessionId, setSessionId] = useState(params.get("session") || null),
    [messages, setMessages] = useState([]),
    [input, setInput] = useState((params.get("question") || "").slice(0, 1500)),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const history = useData("/chat"),
    bottom = useRef();
  useEffect(() => {
    if (sessionId)
      api
        .get("/chat/" + sessionId)
        .then(setMessages)
        .catch((e) => {
          setError(e.message);
          setSessionId(null);
        });
    else setMessages([]);
  }, [sessionId, user?.id]);
  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages, busy]);
  async function send(value) {
    const message = (value || input).trim();
    if (busy || message.length < 2) return;
    setBusy(true);
    setError("");
    try {
      const r = await api.post("/chat", {
        message,
        language: lang,
        ...(sessionId ? { sessionId } : {}),
      });
      setMessages((m) => [
        ...m,
        { role: "user", content: message },
        { role: "assistant", content: r.text, source: r.source },
      ]);
      setInput("");
      if (!sessionId) setSessionId(r.sessionId);
      history.refresh();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="container page">
      <PageHeader
        title={t("assistantTitle")}
        description={t("assistantIntro")}
      />
      <div className="chat-layout">
        <aside className="chat-history">
          <button
            className="btn primary full"
            disabled={busy}
            onClick={() => {
              setSessionId(null);
              setMessages([]);
              setError("");
            }}
          >
            <Plus size={17} />
            {t("newChat")}
          </button>
          <h4>
            <History size={15} />
            {t("history")}
          </h4>
          <Load state={history}>
            {(history.data || []).map((h) => (
              <button
                disabled={busy}
                className={sessionId === h.id ? "active" : ""}
                key={h.id}
                onClick={() => setSessionId(h.id)}
              >
                <MessageCircle size={16} />
                <span>
                  {h.title || t("newChat")}
                  <small>{shortDate(h.created_at, lang)}</small>
                </span>
              </button>
            ))}
            {!history.data?.length && (
              <p className="muted tiny">{t("empty")}</p>
            )}
          </Load>
          <div className="chat-history-note">
            <ShieldCheck size={24} />
            <p>{t("privacy")}</p>
          </div>
        </aside>
        <section className="chat-main">
          <div className="chat-top">
            <span className="assistant-avatar">
              <Sparkles size={23} />
            </span>
            <div>
              <strong>Oujda Smart Assistant</strong>
              <small>
                <i />
                {t("localKnowledge")}
              </small>
            </div>
            <span className="lang-badge">{lang.toUpperCase()}</span>
          </div>
          <div className="chat-messages">
            {!messages.length && (
              <div className="chat-intro">
                <span className="large-ai">
                  <Sparkles size={35} />
                </span>
                <h2>{t("chatWelcome")}</h2>
                <div className="suggestions">
                  {["parkingQ", "baggageQ", "taxiQ", "checkinQ"].map((q) => (
                    <button key={q} disabled={busy} onClick={() => send(t(q))}>
                      {t(q)}
                      <ArrowRight size={14} />
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((m, i) => (
              <div className={"chat-message " + m.role} key={i}>
                {m.role === "assistant" && (
                  <span className="message-avatar">
                    <Sparkles size={16} />
                  </span>
                )}
                <div>
                  <p>{m.content}</p>
                  {m.source && <small>{t(m.source)}</small>}
                </div>
              </div>
            ))}
            {busy && (
              <div className="typing">
                <span />
                <span />
                <span />
                {t("typing")}
              </div>
            )}
            <div ref={bottom} />
          </div>
          <form
            className="chat-compose"
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
          >
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            <div>
              <input
                required
                minLength={2}
                maxLength={1500}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t("chatPlaceholder")}
                aria-label={t("message")}
                disabled={busy}
              />
              <button
                className="btn primary"
                disabled={busy || input.trim().length < 2}
                aria-label={t("send")}
              >
                <Send size={19} />
              </button>
            </div>
            <small>{t("chatDisclaimer")}</small>
          </form>
        </section>
      </div>
    </main>
  );
}
export function Complaint() {
  const { t, user, lang } = useApp(),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [result, setResult] = useState(null),
    [tracked, setTracked] = useState(null),
    [mode, setMode] = useState("new");
  async function submit(e) {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.currentTarget));
    setBusy(true);
    setError("");
    try {
      if (mode === "new") setResult(await api.post("/complaints", d));
      else setTracked(await api.post("/complaints/track", d));
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="container page">
      <PageHeader
        title={t("complaintTitle")}
        description={t("complaintIntro")}
      />
      <Notice>{t("notOfficial")}</Notice>
      <div className="form-layout">
        <section className="form-panel">
          <div className="tabs form-tabs">
            <button
              className={mode === "new" ? "selected" : ""}
              onClick={() => {
                setMode("new");
                setError("");
              }}
            >
              {t("complaints")}
            </button>
            <button
              className={mode === "track" ? "selected" : ""}
              onClick={() => {
                setMode("track");
                setError("");
              }}
            >
              {t("track")}
            </button>
          </div>
          {result && mode === "new" ? (
            <div className="success">
              <CheckCircle2 size={44} />
              <h2>{t("received")}</h2>
              <label>
                {t("reference")}
                <code>{result.reference}</code>
              </label>
              <label>
                {t("accessCode")}
                <code>{result.accessCode}</code>
              </label>
              <p>{t("keepCode")}</p>
              <button className="btn" onClick={() => setMode("track")}>
                {t("track")}
              </button>
            </div>
          ) : (
            <form onSubmit={submit}>
              {mode === "new" ? (
                <>
                  <div className="form-row">
                    <label>
                      {t("name")}
                      <input
                        required
                        name="name"
                        defaultValue={user?.name}
                        maxLength={100}
                        autoComplete="name"
                      />
                    </label>
                    <label>
                      {t("email")}
                      <input
                        required
                        type="email"
                        name="email"
                        defaultValue={user?.email}
                        maxLength={180}
                        autoComplete="email"
                      />
                    </label>
                  </div>
                  <div className="form-row">
                    <label>
                      {t("phone")}
                      <input name="phone" type="tel" maxLength={30} />
                    </label>
                    <label>
                      {t("category")}
                      <select name="category">
                        {[
                          "flights",
                          "baggage",
                          "parking",
                          "transport",
                          "assistance",
                          "services",
                          "other",
                        ].map((c) => (
                          <option value={c} key={c}>
                            {t(c)}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <label>
                    {t("subject")}
                    <input required name="subject" maxLength={180} />
                  </label>
                  <label>
                    {t("message")}
                    <textarea
                      required
                      name="message"
                      minLength={10}
                      maxLength={4000}
                      rows={5}
                    />
                  </label>
                  <div className="form-row">
                    <label>
                      {t("priority")}
                      <select name="priority" defaultValue="NORMAL">
                        {["LOW", "NORMAL", "HIGH"].map((p) => (
                          <option value={p} key={p}>
                            {t(p)}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      {t("optionalFlight")}
                      <input name="flight_number" maxLength={12} />
                    </label>
                  </div>
                </>
              ) : (
                <>
                  <label>
                    {t("reference")}
                    <input
                      required
                      name="reference"
                      maxLength={30}
                      defaultValue={result?.reference}
                    />
                  </label>
                  <label>
                    {t("email")}
                    <input
                      required
                      name="email"
                      type="email"
                      defaultValue={user?.email}
                    />
                  </label>
                  <label>
                    {t("accessCode")}
                    <input
                      required
                      name="accessCode"
                      minLength={10}
                      maxLength={100}
                      defaultValue={result?.accessCode}
                    />
                  </label>
                </>
              )}
              {error && (
                <p className="form-error" role="alert">
                  {error}
                </p>
              )}
              <BusyButton className="btn primary" busy={busy}>
                {t(mode === "new" ? "submitComplaint" : "track")}
                <ArrowRight size={16} />
              </BusyButton>
            </form>
          )}
          {mode === "track" && tracked && (
            <div className="tracked">
              <h3>{tracked.subject}</h3>
              <Status value={tracked.status} />
              <p>{shortDate(tracked.updated_at, lang)}</p>
              {tracked.response && (
                <>
                  <h4>{t("response")}</h4>
                  <p>{tracked.response}</p>
                </>
              )}
            </div>
          )}
        </section>
        <aside className="form-aside">
          <span className="service-icon">
            <MessageCircle size={30} />
          </span>
          <h2>{t("notFoundAnswer")}</h2>
          <p>{t("ctaText")}</p>
          <Link className="btn" to="/assistant">
            {t("ask")}
            <ArrowRight size={16} />
          </Link>
          <hr />
          <ShieldCheck size={24} />
          <p className="tiny">{t("privacy")}</p>
          <p className="tiny">{t("notOfficial")}</p>
        </aside>
      </div>
    </main>
  );
}
export function Auth({ register = false }) {
  const { t, setUser, user } = useApp(),
    navigate = useNavigate(),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  if (user)
    return (
      <Navigate to={user.role === "ADMIN" ? "/admin" : "/account"} replace />
    );
  return (
    <main className="container page auth-page">
      <div className="auth-visual">
        <Plane size={50} />
        <span className="eyebrow">OUJDA SMART</span>
        <h2>{t("heroTitle")}</h2>
        <p>{t("loginIntro")}</p>
        <span className="auth-route">
          OUD <span>················</span> <Plane size={24} />
        </span>
        <small>{t("academic")}</small>
      </div>
      <section className="auth-form">
        <span className="eyebrow">{t("account")}</span>
        <h1>{t(register ? "register" : "welcomeBack")}</h1>
        <p className="muted">{t("loginIntro")}</p>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const d = Object.fromEntries(new FormData(e.currentTarget));
            setBusy(true);
            setError("");
            try {
              const u = await api.post(
                "/auth/" + (register ? "register" : "login"),
                d,
              );
              setUser(u);
              navigate(u.role === "ADMIN" ? "/admin" : "/account");
            } catch (e) {
              setError(e.message);
            } finally {
              setBusy(false);
            }
          }}
        >
          {register && (
            <label>
              {t("name")}
              <input required name="name" maxLength={100} autoComplete="name" />
            </label>
          )}
          <label>
            {t("email")}
            <input
              required
              type="email"
              name="email"
              autoComplete="email"
              maxLength={180}
            />
          </label>
          <label>
            {t("password")}
            <input
              required
              type="password"
              name="password"
              autoComplete={register ? "new-password" : "current-password"}
              minLength={register ? 12 : 1}
              maxLength={72}
            />
            {register && <small>{t("passwordHint")}</small>}
          </label>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <BusyButton className="btn primary full" busy={busy}>
            {t(register ? "register" : "login")}
            <ArrowRight size={17} />
          </BusyButton>
        </form>
        <p>
          {t(register ? "hasAccount" : "noAccount")}{" "}
          <Link className="text-link" to={register ? "/login" : "/register"}>
            {t(register ? "login" : "register")}
          </Link>
        </p>
      </section>
    </main>
  );
}
export function UserDashboard() {
  const { t, user, setUser, lang } = useApp(),
    [tab, setTab] = useState("favorites"),
    navigate = useNavigate();
  const state = useData(
    tab === "favorites"
      ? "/favorites"
      : tab === "complaints"
        ? "/complaints/mine"
        : "/chat",
  );
  return (
    <main className="container page">
      <PageHeader
        title={t("hello") + ", " + user.name}
        description={t("loginIntro")}
      >
        <button
          className="btn"
          onClick={async () => {
            await api.post("/auth/logout", {});
            setUser(null);
            navigate("/");
          }}
        >
          <LogOut size={17} />
          {t("logout")}
        </button>
      </PageHeader>
      <div className="panel">
        <div className="tabs account-tabs">
          {[
            ["favorites", "myFlights", Heart],
            ["complaints", "myComplaints", MessageCircle],
            ["chats", "myChats", History],
          ].map(([k, label, Icon]) => (
            <button
              className={tab === k ? "selected" : ""}
              key={k}
              onClick={() => setTab(k)}
            >
              <Icon size={17} />
              {t(label)}
            </button>
          ))}
        </div>
        <Load state={state}>
          {tab === "favorites" ? (
            <FlightTable flights={state.data || []} />
          ) : !state.data?.length ? (
            <Empty />
          ) : (
            <div className="request-list">
              {state.data.map((r) => (
                <article key={r.id}>
                  {tab === "complaints" ? (
                    <>
                      <div className="flex-between">
                        <h3>{r.subject}</h3>
                        <Status value={r.status} />
                      </div>
                      <small>
                        {r.reference} · {shortDate(r.created_at, lang)}
                      </small>
                      <p>{r.message}</p>
                      {r.response && (
                        <div className="admin-response">
                          <strong>{t("response")}</strong>
                          <p>{r.response}</p>
                        </div>
                      )}
                    </>
                  ) : (
                    <Link to={"/assistant?session=" + r.id}>
                      <MessageCircle size={20} />
                      <span>
                        <strong>{r.title || t("newChat")}</strong>
                        <small>{shortDate(r.created_at, lang)}</small>
                      </span>
                      <ArrowRight size={16} />
                    </Link>
                  )}
                </article>
              ))}
            </div>
          )}
        </Load>
      </div>
    </main>
  );
}

```

## frontend/src/pages/Tracking.jsx

```jsx
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Clock3,
  Info,
  LocateFixed,
  MapPinned,
  Pause,
  Plane,
  PlaneLanding,
  PlaneTakeoff,
  Play,
  Radio,
  RefreshCw,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";
import { useApp } from "../contexts/AppContext";
import { trackingCopy } from "../contexts/trackingCopy";
import { api } from "../services/api";
import TrackingMap from "../components/TrackingMap";
import FlightViews from "../components/FlightViews";
import AirportHero from "../components/AirportHero";
import "../tracking.css";

const defaultAirport = {
  iata: "OUD",
  icao: "GMFO",
  name: "Oujda-Angads",
  lat: 34.786111,
  lon: -1.925556,
};
const acceptedStatuses = new Set([
  "not_configured",
  "live",
  "sandbox",
  "stale",
  "unavailable",
]);
const minimumInterval = 60_000;
const staleRetention = 5 * 60_000;
function expireStaleSnapshot(data, now = Date.now()) {
  if (data?.status !== "stale") return data;
  const fetchedAt = Date.parse(data.fetchedAt);
  if (Number.isFinite(fetchedAt) && now - fetchedAt < staleRetention)
    return data;
  return { ...data, status: "unavailable", flights: [], fetchedAt: null };
}
function refreshInterval(data) {
  const seconds = Number(data?.refreshAfterSeconds);
  return Number.isFinite(seconds)
    ? Math.max(minimumInterval, seconds * 1000)
    : minimumInterval;
}
function useTracking() {
  const [data, setData] = useState(null);
  const [busy, setBusy] = useState(false);
  const [paused, setPaused] = useState(false);
  const [version, setVersion] = useState(0);
  const snapshot = useRef(null);
  const nextRequestAt = useRef(0);
  const manual = useRef(false);
  const refresh = useCallback(() => {
    manual.current = true;
    setVersion((v) => v + 1);
  }, []);
  useEffect(() => {
    let disposed = false;
    let timer;
    let controller;
    const schedule = () => {
      clearTimeout(timer);
      if (disposed || paused || document.hidden) return;
      timer = setTimeout(load, Math.max(0, nextRequestAt.current - Date.now()));
    };
    async function load() {
      if (disposed || paused || document.hidden) return;
      clearTimeout(timer);
      controller = new AbortController();
      const request = controller;
      const startedAt = Date.now();
      nextRequestAt.current = startedAt + refreshInterval(snapshot.current);
      setBusy(true);
      try {
        const response = await api.get("/tracking/flights", {
          signal: request.signal,
        });
        if (disposed || request.signal.aborted) return;
        if (
          !acceptedStatuses.has(response?.status) ||
          !Array.isArray(response.flights)
        )
          throw new Error("Invalid tracking response");
        const next = expireStaleSnapshot({
          ...response,
          flights: response.flights
            .filter((flight) => flight && flight.id)
            .map((flight) =>
              response.status === "stale"
                ? { ...flight, positionStale: true }
                : flight,
            ),
        });
        snapshot.current = next;
        nextRequestAt.current = Date.now() + refreshInterval(next);
        setData(next);
      } catch {
        if (disposed || request.signal.aborted) return;
        const previous = snapshot.current;
        const failed = previous?.flights?.length
          ? expireStaleSnapshot({
              ...previous,
              status: "stale",
              reason: "provider_error",
              flights: previous.flights.map((flight) => ({
                ...flight,
                positionStale: true,
              })),
            })
          : {
              ...previous,
              provider: previous?.provider || "unknown",
              status: "unavailable",
              reason: "provider_error",
              mode: previous?.mode || "disabled",
              airport: previous?.airport || defaultAirport,
              flights: [],
              fetchedAt: null,
              refreshAfterSeconds: previous?.refreshAfterSeconds || 300,
            };
        snapshot.current = failed;
        nextRequestAt.current = Date.now() + refreshInterval(failed);
        setData(failed);
      } finally {
        if (!disposed && !request.signal.aborted) {
          setBusy(false);
          schedule();
        }
      }
    }
    function visibilityChanged() {
      if (document.hidden) {
        clearTimeout(timer);
        controller?.abort();
        setBusy(false);
      } else schedule();
    }
    setBusy(false);
    document.addEventListener("visibilitychange", visibilityChanged);
    if (manual.current && !paused && !document.hidden) {
      manual.current = false;
      load();
    } else schedule();
    return () => {
      disposed = true;
      clearTimeout(timer);
      controller?.abort();
      document.removeEventListener("visibilitychange", visibilityChanged);
    };
  }, [paused, version]);
  useEffect(() => {
    if (data?.status !== "stale") return;
    const expire = () => {
      if (snapshot.current !== data) return;
      const next = expireStaleSnapshot(data);
      if (next !== data) {
        snapshot.current = next;
        setData(next);
      }
    };
    const remaining = Date.parse(data.fetchedAt) + staleRetention - Date.now();
    const timer = setTimeout(
      expire,
      Math.max(0, Number.isFinite(remaining) ? remaining : 0),
    );
    document.addEventListener("visibilitychange", expire);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", expire);
    };
  }, [data]);
  return { data, busy, paused, setPaused, refresh };
}
export function trackingTime(value, lang, fallback = "—") {
  const date = new Date(value);
  if (!value || Number.isNaN(date.getTime())) return fallback;
  return new Intl.DateTimeFormat(lang, {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "Africa/Casablanca",
  }).format(date);
}
export function oldPosition(flight, now) {
  const date = Date.parse(flight.positionAt);
  return flight.positionStale || !Number.isFinite(date) || now - date > 120_000;
}
function number(value, lang, suffix = "") {
  return typeof value === "number" && Number.isFinite(value)
    ? `${new Intl.NumberFormat(lang, { maximumFractionDigits: 0 }).format(value)}${suffix ? ` ${suffix}` : ""}`
    : "—";
}
function FlightDetails({ flight, copy, lang, now, onClose, nearby }) {
  return (
    <section className="tracking-details" aria-label={copy.details}>
      <div className="tracking-detail-heading">
        <div>
          <span className="eyebrow">{copy.selected}</span>
          <h2>
            <bdi dir="ltr">
              {flight.number || flight.callsign || flight.registration || "—"}
            </bdi>
          </h2>
        </div>
        <button
          className="icon-btn"
          type="button"
          onClick={onClose}
          aria-label={copy.close}
        >
          <X size={19} />
        </button>
      </div>
      {flight.origin && flight.destination ? (
        <div className="tracking-route">
          <bdi dir="ltr">{flight.origin || "—"}</bdi>
          <Plane size={20} aria-hidden="true" />
          <bdi dir="ltr">{flight.destination || "—"}</bdi>
        </div>
      ) : (
        <p className="tracking-route tracking-route-unknown">
          {copy.routeUnknown}
        </p>
      )}
      <span
        className={
          "tracking-position-label " + (oldPosition(flight, now) ? "old" : "")
        }
      >
        <Clock3 size={13} />
        {oldPosition(flight, now) ? copy.oldPosition : copy.currentPosition}
      </span>
      <dl className="tracking-metrics">
        {[
          [copy.callsign, flight.callsign],
          [copy.registration, flight.registration],
          [copy.aircraft, flight.aircraft],
          [copy.altitude, number(flight.altitudeFeet, lang, copy.feet)],
          [copy.speed, number(flight.speedKnots, lang, copy.knots)],
          [copy.heading, number(flight.heading, lang, "°")],
        ].map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>
              <bdi>{value || "—"}</bdi>
            </dd>
          </div>
        ))}
      </dl>
      <div className="tracking-detail-time">
        <span>{copy.position}</span>
        <strong>
          {trackingTime(flight.positionAt, lang, copy.positionUnknown)}
        </strong>
        {!nearby && (
          <>
            <span>{copy.eta}</span>
            <strong>{trackingTime(flight.estimatedArrival, lang)}</strong>
          </>
        )}
        <small>{copy.timeZone}</small>
      </div>
    </section>
  );
}
export function Tracking() {
  const { lang } = useApp();
  const baseCopy = trackingCopy[lang] || trackingCopy.fr;
  const { data, busy, paused, setPaused, refresh } = useTracking();
  const isOpenSky = data?.provider === "opensky";
  const isAdsb = data?.provider === "adsb_lol";
  const nearby = isOpenSky || isAdsb;
  const isFr24 = data?.provider === "flightradar24";
  const radiusNm =
    Number.isFinite(data?.radiusNm) &&
    data.radiusNm >= 25 &&
    data.radiusNm <= 250
      ? data.radiusNm
      : 150;
  const withRadius = (text) =>
    text
      .replaceAll("{provider}", isOpenSky ? "OpenSky Network" : "ADSB.lol")
      .replaceAll("{radiusNm}", number(radiusNm, lang))
      .replaceAll("{radiusKm}", number(Math.round(radiusNm * 1.852), lang));
  const copy = nearby
    ? {
        ...baseCopy,
        title: baseCopy.nearbyTitle,
        intro: withRadius(baseCopy.nearbyIntro),
        listTitle: baseCopy.nearbyListTitle,
        count: baseCopy.nearbyCount,
        not_configuredText: withRadius(baseCopy.nearbyNotConfiguredText),
        emptyNotConfiguredText: withRadius(
          baseCopy.nearbyEmptyNotConfiguredText,
        ),
        search: baseCopy.nearbySearch,
        searchHint: baseCopy.nearbySearchHint,
        noFlightsText: withRadius(baseCopy.nearbyNoFlightsText),
        noResults: baseCopy.nearbyNoResults,
        select: baseCopy.nearbySelect,
        selected: baseCopy.nearbySelected,
        details: baseCopy.nearbyDetails,
        noSelection: baseCopy.nearbyNoSelection,
        noSelectionText: baseCopy.nearbyNoSelectionText,
      }
    : {
        ...baseCopy,
        intro: isFr24 ? baseCopy.intro : baseCopy.genericIntro,
        ...(!isFr24
          ? {
              not_configuredText: baseCopy.genericInactive,
              emptyNotConfiguredText: baseCopy.genericInactive,
            }
          : {}),
      };
  const sourceName = isOpenSky
    ? "OpenSky Network"
    : isAdsb
      ? "ADSB.lol"
      : isFr24
        ? "Flightradar24"
        : data
          ? copy.sourceUnknown
          : copy.sourcePending;
  const sourceUrl = isOpenSky
    ? "https://opensky-network.org"
    : isAdsb
      ? "https://www.adsb.lol"
      : isFr24
        ? "https://www.flightradar24.com/"
        : null;
  const [direction, setDirection] = useState("all");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [selectionVersion, setSelectionVersion] = useState(0);
  const [centerVersion, setCenterVersion] = useState(0);
  const [now, setNow] = useState(Date.now);
  useEffect(() => {
    const updateTime = () => {
      if (!document.hidden) setNow(Date.now());
    };
    const timer = setInterval(updateTime, 30_000);
    document.addEventListener("visibilitychange", updateTime);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", updateTime);
    };
  }, []);
  const flights = useMemo(
    () =>
      (data?.flights || []).filter(
        (flight) => !nearby || now - Date.parse(flight.positionAt) <= 300000,
      ),
    [data?.flights, nearby, now],
  );
  const visibleFlights = useMemo(() => {
    const search = query.trim().toLocaleLowerCase();
    return flights.filter(
      (flight) =>
        (nearby || direction === "all" || flight.direction === direction) &&
        (!search ||
          [
            flight.number,
            flight.callsign,
            flight.registration,
            flight.aircraft,
            flight.origin,
            flight.destination,
          ].some((value) =>
            String(value || "")
              .toLocaleLowerCase()
              .includes(search),
          )),
    );
  }, [flights, direction, query, nearby]);
  const selected = visibleFlights.find((flight) => flight.id === selectedId);
  const selectFlight = useCallback((id) => {
    setSelectedId(id);
    setSelectionVersion((value) => value + 1);
  }, []);
  const receivedAt = Date.parse(data?.fetchedAt);
  const expired =
    data?.status === "live" &&
    (!Number.isFinite(receivedAt) ||
      now - receivedAt > Math.max(120_000, refreshInterval(data) * 2));
  const status = ["not_configured", "unavailable"].includes(data?.status)
    ? data.status
    : paused
      ? "paused"
      : expired
        ? "stale"
        : data?.status || "loading";
  const notice = copy[status + "Text"];
  const reason = {
    credentials: copy.reasonCredentials,
    quota: copy.reasonQuota,
    timeout: copy.reasonTimeout,
    configuration: copy.reasonConfiguration,
    provider_error: copy.reasonProvider,
    contact_required: copy.reasonContactRequired,
    access_denied: copy.reasonAccessDenied,
  }[data?.reason];
  const airport = data?.airport || defaultAirport;
  const emptyState = flights.length
    ? { title: copy.emptyNoResultsTitle, text: copy.noResults }
    : data?.status === "not_configured"
      ? {
          title: copy.emptyNotConfiguredTitle,
          text: copy.emptyNotConfiguredText,
        }
      : data?.status === "unavailable"
        ? {
            title: copy.emptyUnavailableTitle,
            text: copy.emptyUnavailableText,
          }
        : data?.status === "sandbox"
          ? {
              title: copy.emptySandboxTitle,
              text: copy.emptySandboxText,
            }
          : { title: copy.noFlights, text: copy.noFlightsText };
  return (
    <main className="container page tracking-page">
      <AirportHero
        variant="tracking"
        title={copy.title}
        description={copy.intro}
      />
      <FlightViews />
      <div className="tracking-source-strip">
        <span>{copy.source}</span>
        <strong>{sourceName}</strong>
      </div>
      <section
        className={"tracking-status tracking-status-" + status}
        aria-live="polite"
        aria-atomic="true"
      >
        <div className="tracking-status-icon">
          {["unavailable", "not_configured", "stale", "sandbox"].includes(
            status,
          ) ? (
            <Info size={21} />
          ) : paused ? (
            <Pause size={21} />
          ) : (
            <Radio size={21} />
          )}
        </div>
        <div>
          <strong>{copy[status]}</strong>
          {notice && <p>{notice}</p>}
          {nearby && (
            <p className="tracking-area-notice">
              {withRadius(copy.nearbyNotice)}
            </p>
          )}
          {reason &&
            ["stale", "unavailable", "not_configured"].includes(status) && (
              <small>{reason}</small>
            )}
          {data?.mode === "sandbox" && status !== "sandbox" && (
            <small>{copy.sandboxText}</small>
          )}
        </div>
      </section>
      <div className="tracking-workspace">
        <div className="tracking-map-column">
          <div className="tracking-map-toolbar">
            <div>
              <MapPinned size={16} />
              <strong>{copy.map}</strong>
            </div>
            <button
              type="button"
              className="text-link"
              onClick={() => setCenterVersion((v) => v + 1)}
            >
              <LocateFixed size={15} />
              {copy.center}
            </button>
          </div>
          <TrackingMap
            airport={airport}
            flights={visibleFlights}
            selectedId={selected?.id || null}
            selectionVersion={selectionVersion}
            centerVersion={centerVersion}
            onSelect={selectFlight}
            copy={copy}
            lang={lang}
            now={now}
            scope={nearby ? "area" : "routes"}
            radiusNm={radiusNm}
          />
          <div className="tracking-update-bar">
            <span>
              <Clock3 size={14} />
              {data?.fetchedAt ? (
                <>
                  {copy.updated}{" "}
                  <time dateTime={data.fetchedAt}>
                    {trackingTime(data.fetchedAt, lang)}
                  </time>
                </>
              ) : (
                copy.never
              )}
            </span>
            <div>
              <button
                type="button"
                className="btn"
                onClick={() => setPaused((value) => !value)}
                aria-pressed={paused}
              >
                {paused ? <Play size={15} /> : <Pause size={15} />}
                <span>{paused ? copy.resume : copy.pause}</span>
              </button>
              <button
                type="button"
                className="btn primary"
                onClick={refresh}
                disabled={busy || paused}
              >
                <RefreshCw
                  size={15}
                  className={busy ? "tracking-spinning" : ""}
                />
                {copy.refresh}
              </button>
            </div>
          </div>
          <p className="tracking-cadence">
            {copy.cadenceMinutes.replace(
              "{minutes}",
              number(Math.ceil(refreshInterval(data) / 60000), lang),
            )}
          </p>
          <p className="tracking-provider-credit">
            {copy.source} :{" "}
            {sourceUrl ? (
              <a href={sourceUrl} target="_blank" rel="noopener noreferrer">
                {sourceName}
              </a>
            ) : (
              <span>{sourceName}</span>
            )}
            {isAdsb && (
              <span className="tracking-license">
                {copy.dataLicense} :{" "}
                <a
                  href="https://opendatacommons.org/licenses/odbl/1-0/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ODbL 1.0
                </a>
              </span>
            )}
          </p>
          {isOpenSky && (
            <p className="tracking-research-credit">
              <a
                href="https://openskynetwork.github.io/opensky-api/#citation-and-terms-of-use"
                target="_blank"
                rel="noopener noreferrer"
              >
                OpenSky Network — Schäfer, Strohmeier, Lenders, Martinovic &
                Wilhelm (2014), Bringing Up OpenSky: A Large-scale ADS-B Sensor
                Network for Research, IPSN, pp. 83–94.
              </a>
              <span>{copy.researchUse}</span>
            </p>
          )}
        </div>
        <aside className="tracking-sidebar">
          <div className="tracking-list-heading">
            <span className="eyebrow">OUD / GMFO</span>
            <h2>{copy.listTitle}</h2>
            <p>
              {!data
                ? copy.loading
                : ["not_configured", "unavailable"].includes(data.status)
                  ? copy[data.status]
                  : `${visibleFlights.length} ${copy.count}`}
            </p>
          </div>
          {!nearby && (
            <div className="tracking-filter-tabs">
              {[
                ["all", copy.all],
                ["arrival", copy.arrival],
                ["departure", copy.departure],
              ].map(([value, label]) => (
                <button
                  type="button"
                  key={value}
                  className={direction === value ? "selected" : ""}
                  aria-pressed={direction === value}
                  onClick={() => setDirection(value)}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
          <label className="tracking-search">
            <Search size={16} />
            <span className="sr-only">{copy.search}</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={copy.searchHint}
            />
          </label>
          <div className="tracking-flight-list" aria-busy={busy && !data}>
            {!data ? (
              <div className="tracking-empty">
                <RefreshCw className="tracking-spinning" size={25} />
                <p>{copy.loading}</p>
              </div>
            ) : !visibleFlights.length ? (
              <div className="tracking-empty">
                {["not_configured", "unavailable"].includes(data.status) ? (
                  <Info size={32} />
                ) : (
                  <Plane size={32} />
                )}
                <h3>{emptyState.title}</h3>
                <p>{emptyState.text}</p>
                {!flights.length && (
                  <Link to="/flights" className="text-link">
                    {copy.demoLink}
                    <ArrowRight size={15} />
                  </Link>
                )}
                {(query || (!nearby && direction !== "all")) && (
                  <button
                    type="button"
                    className="text-link"
                    onClick={() => {
                      setQuery("");
                      setDirection("all");
                    }}
                  >
                    {copy.reset}
                  </button>
                )}
              </div>
            ) : (
              visibleFlights.map((flight) => (
                <button
                  type="button"
                  key={flight.id}
                  className={
                    "tracking-flight-card " +
                    (flight.id === selectedId ? "selected" : "")
                  }
                  onClick={() => selectFlight(flight.id)}
                  aria-pressed={flight.id === selectedId}
                  aria-label={`${copy.select} ${flight.number || flight.callsign || flight.id}`}
                >
                  <span className="tracking-card-top">
                    <strong>
                      <bdi dir="ltr">
                        {flight.number ||
                          flight.callsign ||
                          flight.registration ||
                          "—"}
                      </bdi>
                    </strong>
                    <span>
                      {!nearby && flight.direction === "arrival" ? (
                        <PlaneLanding size={15} />
                      ) : !nearby && flight.direction === "departure" ? (
                        <PlaneTakeoff size={15} />
                      ) : (
                        <Plane size={15} />
                      )}{" "}
                      {nearby
                        ? flight.onGround
                          ? copy.onGround
                          : copy.inArea
                        : copy[flight.direction] || copy.other}
                    </span>
                  </span>
                  {flight.origin && flight.destination ? (
                    <span className="tracking-card-route">
                      <bdi dir="ltr">{flight.origin || "—"}</bdi>
                      <ArrowRight size={15} />
                      <bdi dir="ltr">{flight.destination || "—"}</bdi>
                    </span>
                  ) : (
                    <span className="tracking-card-route tracking-route-unknown">
                      {copy.routeUnknown}
                    </span>
                  )}
                  <span className="tracking-card-bottom">
                    <span>{number(flight.altitudeFeet, lang, copy.feet)}</span>
                    <span className={oldPosition(flight, now) ? "old" : ""}>
                      <Clock3 size={12} />
                      {oldPosition(flight, now)
                        ? copy.oldPosition
                        : trackingTime(
                            flight.positionAt,
                            lang,
                            copy.positionUnknown,
                          )}
                    </span>
                  </span>
                </button>
              ))
            )}
          </div>
          {data?.truncated && (
            <p className="tracking-limit">
              <Info size={13} />
              {copy.limited}
            </p>
          )}
        </aside>
      </div>
      {selected ? (
        <FlightDetails
          flight={selected}
          copy={copy}
          lang={lang}
          now={now}
          onClose={() => setSelectedId(null)}
          nearby={nearby}
        />
      ) : visibleFlights.length > 0 ? (
        <div className="tracking-selection-hint">
          <LocateFixed size={19} />
          <p>
            <strong>{copy.noSelection}</strong>
            <span>{copy.noSelectionText}</span>
          </p>
        </div>
      ) : null}
      <footer className="tracking-explanation">
        <ShieldCheck size={20} />
        <p>{copy.distinction}</p>
        <Link to="/flights">
          {copy.demoLink}
          <ArrowRight size={15} />
        </Link>
      </footer>
    </main>
  );
}
export default Tracking;

```

## frontend/src/pages/Travel.jsx

```jsx
import { useState, useEffect } from "react";
import {
  Link,
  useSearchParams,
  useParams,
  useNavigate,
} from "react-router-dom";
import {
  Luggage,
  ParkingCircle,
  Car,
  Accessibility,
  HelpCircle,
  ArrowRight,
  ArrowUpRight,
  MessageCircle,
  Clock,
  Search,
  SlidersHorizontal,
  Heart,
  MapPin,
  ShieldCheck,
  Info,
  ChevronDown,
  Plane,
} from "lucide-react";
import { useApp } from "../contexts/AppContext";
import AirportBoard from "../components/AirportBoard";
import AirportHero from "../components/AirportHero";
import FlightViews from "../components/FlightViews";
import { useData } from "../hooks/useData";
import { api } from "../services/api";
import {
  PageHeader,
  Load,
  Notice,
  Empty,
  Status,
  Airline,
  AssistantCTA,
  icons,
  categories,
  time,
  shortDate,
  Modal,
} from "../components/UI";
export function Flights() {
  const { t } = useApp(),
    [params, setParams] = useSearchParams();
  const direction =
      params.get("direction") === "arrival" ? "arrival" : "departure",
    q = params.get("q") || "",
    airline = params.get("airline") || "",
    status = params.get("status") || "",
    after = params.get("after") || "",
    city = params.get("city") || "";
  const [debouncedQuery, setDebouncedQuery] = useState(q);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(q), 200);
    return () => clearTimeout(timer);
  }, [q]);
  function updateFilter(key, value, replace = true) {
    setParams(
      (current) => {
        const next = new URLSearchParams(current);
        next.set("direction", direction);
        if (value) next.set(key, value);
        else next.delete(key);
        return next;
      },
      { replace },
    );
  }
  const filters = new URLSearchParams({
    direction,
    q: debouncedQuery,
    airline,
    status,
    after,
    city,
  });
  const state = useData("/flights?" + filters),
    all = useData("/flights");
  return (
    <main className="container page airport-page">
      <AirportHero variant="flights" title={t("flightBoard")}>
        <a
          className="airport-page-official"
          href="https://www.onda.ma/fr/Nos-A%C3%A9roports/A%C3%A9roport-Oujda-Angads"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t("airportOfficial")} <ArrowUpRight size={16} aria-hidden="true" />
        </a>
      </AirportHero>
      <FlightViews />
      <details
        className="airport-page-filters"
        open={Boolean(q || airline || status || after || city)}
      >
        <summary>{t("airportFilters")}</summary>
        <div className="flight-filters">
          <div className="search-input">
            <Search size={18} />
            <input
              value={q}
              onChange={(e) => updateFilter("q", e.target.value)}
              placeholder={t("flightSearch")}
              aria-label={t("search")}
            />
          </div>
          <select
            aria-label={t("airline")}
            value={airline}
            onChange={(e) => updateFilter("airline", e.target.value, false)}
          >
            <option value="">{t("allAirlines")}</option>
            {[...new Set((all.data || []).map((f) => f.airline))].map((a) => (
              <option key={a}>{a}</option>
            ))}
          </select>
          <select
            value={status}
            aria-label={t("status")}
            onChange={(e) => updateFilter("status", e.target.value, false)}
          >
            <option value="">{t("allStatuses")}</option>
            {[
              "ON_TIME",
              "DELAYED",
              "BOARDING",
              "DEPARTED",
              "ARRIVED",
              "CANCELLED",
            ].map((s) => (
              <option value={s} key={s}>
                {t(s)}
              </option>
            ))}
          </select>
          <input
            aria-label={t("destination")}
            value={city}
            placeholder={t("city")}
            onChange={(e) => updateFilter("city", e.target.value)}
          />
          <label className="time-filter">
            {t("after")}
            <input
              type="time"
              value={after}
              onChange={(e) => updateFilter("after", e.target.value)}
            />
          </label>
          <button
            className="text-link"
            onClick={() => setParams({ direction })}
          >
            {t("reset")}
          </button>
        </div>
      </details>
      <AirportBoard
        flights={state.data || []}
        direction={direction}
        loading={state.loading}
        error={state.error}
        onRetry={state.refresh}
        onDirectionChange={(value) => updateFilter("direction", value, false)}
      />
    </main>
  );
}
export function FlightDetails() {
  const { id } = useParams(),
    state = useData("/flights/" + id),
    { t, lang, user, notify } = useApp(),
    navigate = useNavigate();
  const [favorite, setFavorite] = useState(false),
    [busy, setBusy] = useState(false);
  useEffect(() => {
    if (user)
      api
        .get("/favorites")
        .then((list) => setFavorite(list.some((f) => f.id === id)))
        .catch(() => {});
  }, [user, id]);
  async function save() {
    if (!user) return navigate("/login");
    setBusy(true);
    try {
      await api[favorite ? "delete" : "post"]("/favorites/" + id, {});
      setFavorite(!favorite);
      notify(t(favorite ? "removed" : "saved"));
    } catch (e) {
      notify(e.message);
    } finally {
      setBusy(false);
    }
  }
  const f = state.data;
  return (
    <main className="container page">
      <Link className="text-link" to="/flights">
        ← {t("back")}
      </Link>
      <Load state={state}>
        {f && (
          <>
            <PageHeader
              title={f.number + " · " + f.city}
              description={f.airline}
            />
            <Notice>{t("flightDemo")}</Notice>
            <section className="flight-detail">
              <div className="flight-route">
                <div>
                  <span>
                    {t(f.direction === "departure" ? "departures" : "arrivals")}
                  </span>
                  <h2>{f.direction === "departure" ? "OUD" : f.city}</h2>
                  <p>
                    {f.direction === "departure" ? t("airport") : f.airline}
                  </p>
                </div>
                <div className="route-plane">
                  <span />
                  <Plane size={30} />
                  <span />
                </div>
                <div>
                  <span>{t("destination")}</span>
                  <h2>{f.direction === "departure" ? f.city : "OUD"}</h2>
                  <p>{shortDate(f.scheduled_at, lang)}</p>
                </div>
              </div>
              <div className="detail-metrics">
                {[
                  ["scheduled", time(f.scheduled_at, lang)],
                  ["estimated", time(f.estimated_at, lang)],
                  ["gate", f.gate],
                  ["status", <Status value={f.status} />],
                ].map(([k, v]) => (
                  <div key={k}>
                    <small>{t(k)}</small>
                    <strong>{v}</strong>
                  </div>
                ))}
              </div>
              <div className="flex-between">
                <span className="muted">{t("moroccoTime")}</span>
                <button
                  disabled={busy}
                  className={"btn " + (favorite ? "" : "primary")}
                  onClick={save}
                >
                  <Heart size={17} fill={favorite ? "currentColor" : "none"} />
                  {t(favorite ? "saved" : "favorite")}
                </button>
              </div>
            </section>
          </>
        )}
      </Load>
      <AssistantCTA />
    </main>
  );
}
export function Services() {
  const { t, tr } = useApp(),
    state = useData("/services"),
    [params] = useSearchParams(),
    [selected, setSelected] = useState(null);
  const topic = params.get("topic");
  function view(s) {
    setSelected(s);
    api.post("/services/" + s.id + "/view", {}).catch(() => {});
  }
  return (
    <main className="container page">
      <PageHeader title={t("servicesTitle")} description={t("servicesIntro")} />
      <Notice>{t("servicesDisclaimer")}</Notice>
      <Load state={state}>
        <div className="service-grid">
          {(state.data || []).map((s, i) => {
            const Icon = icons[s.icon] || Info;
            return (
              <article
                className={
                  "service-card service-" +
                  (i % 4) +
                  (topic === s.slug ? " highlighted" : "")
                }
                key={s.id}
              >
                <span className="service-icon">
                  <Icon size={29} />
                </span>
                <h3>{tr(s.title)}</h3>
                <p>{tr(s.description)}</p>
                <span className="service-location">
                  <MapPin size={14} />
                  {tr(s.location)}
                </span>
                <button className="text-link" onClick={() => view(s)}>
                  {t("learnMore")}
                  <ArrowRight size={15} />
                </button>
              </article>
            );
          })}
        </div>
      </Load>
      <AssistantCTA />
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={tr(selected?.title)}
      >
        {selected && (
          <>
            <p>{tr(selected.description)}</p>
            <h4>{t("location")}</h4>
            <p>{tr(selected.location)}</p>
            <h4>{t("hours")}</h4>
            <p>{tr(selected.hours)}</p>
            <Notice>{t("servicesDisclaimer")}</Notice>
            <Link className="btn primary" to="/assistant">
              {t("ask")}
            </Link>
          </>
        )}
      </Modal>
    </main>
  );
}
export function FAQ() {
  const { t, tr } = useApp(),
    [q, setQ] = useState(""),
    [cat, setCat] = useState(""),
    state = useData("/faq?" + new URLSearchParams({ q, category: cat }));
  return (
    <main className="container page">
      <PageHeader title={t("faqTitle")} description={t("faqIntro")} />
      <div className="faq-search search-input">
        <Search size={20} />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t("faqSearch")}
          aria-label={t("search")}
        />
      </div>
      <div className="faq-layout">
        <aside className="faq-categories">
          {["", ...categories].map((c) => (
            <button
              className={cat === c ? "active" : ""}
              key={c}
              onClick={() => setCat(c)}
            >
              {t(c || "all")}
              <ArrowRight size={14} />
            </button>
          ))}
        </aside>
        <section className="faq-list">
          <Load state={state}>
            {!(state.data || []).length ? (
              <Empty />
            ) : (
              state.data.map((f) => (
                <details key={f.id}>
                  <summary>
                    {tr(f.question)}
                    <ChevronDown size={18} />
                  </summary>
                  <p>{tr(f.answer)}</p>
                  <small>
                    {t(f.category)} · {t("academic")}
                  </small>
                </details>
              ))
            )}
          </Load>
        </section>
      </div>
      <AssistantCTA />
    </main>
  );
}

```

## frontend/src/services/api.js

```javascript
import axios from "axios";
export const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
});
api.interceptors.request.use((request) => {
  // The API requires JSON for every mutation, including bodyless deletions.
  if (request.method === "delete" && request.data === undefined)
    request.data = {};
  return request;
});
api.interceptors.response.use(
  (r) => r.data,
  (e) =>
    Promise.reject(
      Object.assign(
        new Error(
          e.response?.data?.error || "Connexion au serveur impossible.",
        ),
        { status: e.response?.status },
      ),
    ),
);

```

## frontend/src/styles.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
:root {
  font-family: Inter, "Segoe UI", Arial, sans-serif;
  color: #18314f;
  background: #f8fafc;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  font-size: 14px;
}
* {
  box-sizing: border-box;
}
body {
  margin: 0;
}
a {
  text-decoration: none;
  color: inherit;
}
button,
input,
select,
textarea {
  font: inherit;
}
button,
a,
input,
select,
textarea {
  -webkit-tap-highlight-color: transparent;
}
button {
  cursor: pointer;
}
button:disabled {
  cursor: wait;
  opacity: 0.6;
}
button {
  border: 0;
  background: none;
  color: inherit;
}
h1,
h2,
h3,
h4,
p {
  margin: 0;
}
h1,
h2,
h3,
h4 {
  font-weight: 650;
  letter-spacing: -0.035em;
}
p {
  line-height: 1.7;
}
h1 {
  font-size: 38px;
  line-height: 1.15;
}
h2 {
  font-size: 27px;
  line-height: 1.3;
}
h3 {
  font-size: 18px;
}
h4 {
  font-size: 15px;
}
.container {
  max-width: 1240px;
  margin-inline: auto;
  padding-inline: 32px;
}
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 43px;
  padding: 11px 18px;
  border: 1px solid #dce4ec;
  border-radius: 7px;
  background: white;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  transition:
    background 0.2s,
    transform 0.2s;
}
.btn:hover {
  background: #f0f5fc;
}
.btn.primary {
  background: #2466df;
  border-color: #2466df;
  color: white;
  box-shadow: 0 4px 10px #245ccc17;
}
.btn.primary:hover {
  background: #1855c5;
}
.btn.glass {
  background: #ffffff0c;
  border: 1px solid #ffffff70;
  color: white;
}
.btn.glass:hover {
  background: #ffffff20;
}
.btn.danger {
  background: #b6323e;
  color: white;
  border-color: #b6323e;
}
.full {
  width: 100%;
}
.icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 6px;
  flex-shrink: 0;
}
.icon-btn:hover {
  background: #edf3fa;
}
.text-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #2466df;
  font-size: 13px;
  font-weight: 600;
}
.text-link:hover {
  text-decoration: underline;
}
.muted {
  color: #7b8796;
}
.tiny {
  font-size: 12px;
}
.eyebrow {
  display: block;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.8px;
  color: #75869d;
  text-transform: uppercase;
  margin-bottom: 10px;
}
.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}
.utility-bar {
  height: 31px;
  background: #102943;
  color: #d5dfed;
  font-size: 10px;
}
.utility-bar .container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}
.utility-bar span {
  display: flex;
  align-items: center;
  gap: 8px;
}
.utility-bar i {
  height: 3px;
  width: 3px;
  border-radius: 50%;
  background: #6b839f;
  margin-inline: 5px;
}
.site-header {
  background: white;
  position: sticky;
  top: 0;
  z-index: 20;
  box-shadow: 0 1px 0 #18314f0a;
}
.header-inner {
  height: 83px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}
.brand {
  display: flex;
  align-items: center;
  gap: 9px;
  flex-shrink: 0;
}
.brand-icon {
  height: 39px;
  width: 39px;
  border-radius: 10px;
  background: #2466df;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: rotate(-5deg);
}
.brand-icon svg {
  transform: rotate(-18deg);
}
.brand > span:last-child {
  font-size: 24px;
  font-weight: 750;
  letter-spacing: -1px;
  line-height: 1.1;
}
.brand-blue {
  color: #276ad9;
}
.brand small {
  font-size: 7px;
  font-weight: 600;
  letter-spacing: 2.6px;
  display: block;
  margin-top: 6px;
  color: #8b99a9;
}
.site-header nav {
  display: flex;
  align-items: center;
  gap: 25px;
  height: 100%;
}
.site-header nav a {
  font-size: 12px;
  font-weight: 500;
  color: #748094;
  height: 100%;
  display: flex;
  align-items: center;
  gap: 5px;
  position: relative;
  white-space: nowrap;
}
.site-header nav a.active {
  color: #2466df;
  font-weight: 650;
}
.site-header nav a.active:after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: #2466df;
  border-radius: 3px 3px 0 0;
}
.ai-dot {
  height: 4px;
  width: 4px;
  border-radius: 50%;
  background: #437ced;
}
.header-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}
.language-picker {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: #697b91;
  margin: 0;
}
.language-picker select {
  background: transparent;
  border: 0;
  padding: 0;
  width: auto;
  color: inherit;
  font-size: 12px;
}
.account-btn {
  font-size: 12px;
  padding: 9px 13px;
  min-height: 37px;
}
.mobile-menu {
  display: none;
}
.hero {
  height: 432px;
  background: #193751;
  position: relative;
  overflow: hidden;
  color: white;
}
.hero-image {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 65% 52%;
}
.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    #102d48f7 0%,
    #133653e8 28%,
    #16364d96 52%,
    #132c4120 100%
  );
}
.hero-content {
  position: relative;
  padding-top: 52px;
}
.hero-kicker {
  display: flex;
  align-items: center;
  gap: 9px;
  font-size: 9px;
  letter-spacing: 2px;
  font-weight: 600;
  color: #c1d8f3;
}
.hero-kicker > span {
  background: #62b1fd;
  box-shadow: 0 0 0 4px #489fec19;
  width: 5px;
  height: 5px;
  border-radius: 50%;
}
.hero h1 {
  font-size: 53px;
  font-weight: 650;
  line-height: 1.14;
  letter-spacing: -2px;
  white-space: pre-line;
  margin: 18px 0 19px;
}
.hero p {
  max-width: 480px;
  color: #d2dfec;
  font-size: 13px;
  line-height: 1.8;
}
.hero-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}
.hero-actions .btn {
  min-height: 44px;
  font-size: 12px;
}
.hero-trust {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 9px;
  color: #b8cbe1;
  margin-top: 23px;
}
.hero-trust i {
  width: 3px;
  height: 3px;
  background: #8199b4;
  border-radius: 50%;
  margin-inline: 6px;
}
.photo-credit {
  position: absolute;
  bottom: 12px;
  right: 24px;
  font-size: 8px;
  color: #fff9;
}
.hero-coordinate {
  position: absolute;
  right: max(7%, 32px);
  bottom: 60px;
  display: flex;
  flex-direction: column;
}
.hero-coordinate > span {
  font-size: 64px;
  line-height: 1;
  letter-spacing: 5px;
  font-weight: 300;
  color: #ffffffc9;
}
.hero-coordinate small {
  letter-spacing: 2px;
  font-size: 9px;
  color: #ffffffa0;
}
.quick-section {
  padding-top: 32px;
}
.section-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 22px;
}
.section-title p {
  font-size: 12px;
  color: #8290a3;
  margin-top: 6px;
}
.section-title h2 {
  font-size: 24px;
}
.little-label {
  font-size: 10px;
  border: 1px solid #e3e9f1;
  padding: 5px 9px;
  border-radius: 5px;
  color: #8a98a9;
}
.shortcuts {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 13px;
}
.shortcuts a {
  position: relative;
  min-height: 115px;
  background: white;
  border: 1px solid #e6ebf2;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 12px;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}
.shortcuts a:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 15px #193f7210;
  border-color: #cbdaf5;
}
.shortcuts a > span {
  color: #3d71bc;
  background: #f0f5fc;
  width: 42px;
  height: 42px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.shortcuts strong {
  font-size: 11px;
  font-weight: 600;
}
.shortcut-arrow {
  position: absolute;
  right: 9px;
  top: 9px;
  color: #b7c2d1;
}
.home-flights {
  margin-top: 45px;
}
.flight-panel,
.panel {
  background: white;
  border: 1px solid #e5eaf2;
  border-radius: 11px;
  overflow: hidden;
}
.board-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 23px;
  border-bottom: 1px solid #e9edf4;
  min-height: 65px;
}
.tabs {
  display: flex;
  gap: 23px;
}
.tabs button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 21px 0 19px;
  font-size: 13px;
  color: #7c899b;
  border-bottom: 2px solid transparent;
  font-weight: 600;
}
.tabs button.selected {
  color: #2466df;
  border-color: #2466df;
}
.table-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #8b98a9;
  font-size: 10px;
}
.table-scroll {
  overflow-x: auto;
}
table {
  border-collapse: collapse;
  width: 100%;
  font-size: 12px;
  text-align: start;
}
th {
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #8b98aa;
  font-weight: 600;
  background: #fcfdff;
  padding: 14px 23px;
  text-align: start;
  white-space: nowrap;
}
td {
  padding: 16px 23px;
  border-top: 1px solid #edf0f5;
  vertical-align: middle;
}
td > strong {
  font-size: 12px;
  display: block;
  font-weight: 650;
}
td small {
  display: block;
  color: #8a97a8;
  font-size: 10px;
  margin-top: 5px;
}
.airline {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 9px;
  color: #8a96a7;
  margin-top: 5px;
}
.airline-logo {
  display: flex;
  color: #6998cb;
}
.airline-logo.royal {
  color: #bd4a58;
}
.airline-logo.ryan {
  color: #d7a437;
}
.airline-logo.trans {
  color: #39a286;
}
.city-link {
  font-size: 13px;
  font-weight: 600;
}
.city-link:hover {
  color: #2466df;
}
.time-cell {
  font-size: 16px;
  font-variant-numeric: tabular-nums;
  font-weight: 600;
}
.gate {
  background: #f1f5fa;
  border: 1px solid #e8edf4;
  display: inline-flex;
  width: 25px;
  height: 25px;
  border-radius: 4px;
  align-items: center;
  justify-content: center;
  color: #7b8aa0;
  font-size: 11px;
}
.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  white-space: nowrap;
  background: #f1f4f9;
  color: #738196;
  border-radius: 5px;
  padding: 6px 9px;
  font-weight: 600;
}
.badge i {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: currentColor;
}
.status-ON_TIME,
.status-ARRIVED,
.status-RESOLVED {
  background: #edf7f2;
  color: #338568;
}
.status-BOARDING,
.status-IN_PROGRESS {
  background: #edf2ff;
  color: #3a68d3;
}
.status-DELAYED,
.status-RECEIVED {
  background: #fff6e7;
  color: #b7842f;
}
.status-CANCELLED {
  background: #fcecee;
  color: #b84558;
}
.status-DEPARTED,
.status-CLOSED {
  background: #f0f3f7;
  color: #8190a3;
}
.board-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 13px 23px;
  border-top: 1px solid #edf0f5;
  font-size: 9px;
  color: #8a98aa;
}
.board-foot > span {
  display: flex;
  align-items: center;
  gap: 6px;
}
.demo-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #7dabba;
}
.home-services {
  margin-top: 44px;
}
.service-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 19px;
}
.home-grid {
  grid-template-columns: repeat(4, 1fr);
}
.service-card {
  background: white;
  border: 1px solid #e5eaf1;
  border-radius: 11px;
  padding: 25px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  transition:
    box-shadow 0.2s,
    transform 0.2s;
}
.service-card:hover {
  box-shadow: 0 6px 20px #17355708;
  transform: translateY(-2px);
}
.service-card.highlighted {
  border-color: #5285df;
  box-shadow: 0 0 0 3px #286ce610;
}
.service-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: #edf3fc;
  color: #497aba;
  border-radius: 12px;
  margin-bottom: 19px;
}
.service-1 .service-icon {
  background: #fff5e9;
  color: #bf945f;
}
.service-2 .service-icon {
  background: #edf6f3;
  color: #6a9a8b;
}
.service-3 .service-icon {
  background: #f1effa;
  color: #9381bc;
}
.service-card h3 {
  font-size: 16px;
}
.service-card p {
  font-size: 12px;
  line-height: 1.8;
  color: #8390a3;
  margin-top: 10px;
  margin-bottom: 18px;
  flex: 1;
}
.service-card .text-link {
  font-size: 11px;
}
.service-location {
  display: flex;
  gap: 5px;
  font-size: 10px;
  color: #8390a3;
  margin: 4px 0 20px;
}
.assistant-cta {
  display: flex;
  align-items: center;
  gap: 22px;
  background: #edf3fd;
  border: 1px solid #e1eafa;
  border-radius: 13px;
  padding: 29px 32px;
  margin-top: 35px;
}
.cta-icon {
  height: 62px;
  width: 62px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  color: #4775c7;
  border-radius: 16px;
  box-shadow: 0 4px 12px #5c86c611;
}
.assistant-cta h2 {
  font-size: 23px;
}
.assistant-cta p {
  font-size: 12px;
  color: #8090a6;
  margin-top: 7px;
  max-width: 600px;
}
.assistant-cta > .btn {
  margin-inline-start: auto;
  font-size: 12px;
}
.home-links {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin: 22px 0 48px;
  font-size: 10px;
  color: #8b98a8;
}
.home-links a {
  display: flex;
  align-items: center;
  gap: 7px;
  color: #44698c;
}
.home-links > span {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 8px;
}
.site-footer {
  background: white;
  border-top: 1px solid #e5ebf3;
}
.footer-main {
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr 1.5fr;
  gap: 45px;
  padding-top: 40px;
  padding-bottom: 35px;
}
.footer-main .brand {
  transform-origin: left;
  transform: scale(0.87);
}
.footer-main p {
  font-size: 11px;
  color: #8995a5;
  margin-top: 13px;
}
.footer-main h4 {
  font-size: 12px;
  margin-bottom: 15px;
}
.footer-main > div > a:not(.brand) {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 11px;
  color: #8995a5;
  margin-bottom: 10px;
}
.footer-academic {
  background: #f8faff;
  padding: 17px;
  border-radius: 8px;
  color: #6687ba;
}
.footer-academic > strong {
  display: block;
  margin-top: 7px;
  font-size: 12px;
}
.footer-academic p {
  font-size: 10px;
}
.footer-bottom {
  border-top: 1px solid #edf1f5;
  display: flex;
  justify-content: space-between;
  padding-block: 17px;
  font-size: 9px;
  color: #98a4b3;
}
.floating-chat {
  position: fixed;
  bottom: 25px;
  right: 26px;
  z-index: 25;
  background: #2466df;
  color: white;
  height: 52px;
  width: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  box-shadow: 0 5px 22px #2466df40;
}
.page {
  padding-top: 40px;
  padding-bottom: 65px;
  min-height: 65vh;
}
.page-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 30px;
}
.page-title p {
  color: #8491a4;
  margin-top: 12px;
  font-size: 14px;
}
.page-title h1 {
  font-size: 34px;
}
.notice {
  display: flex;
  align-items: flex-start;
  gap: 9px;
  background: #f0f5fc;
  border: 1px solid #e3eaf5;
  color: #7386a0;
  padding: 13px 17px;
  border-radius: 8px;
  font-size: 11px;
  line-height: 1.6;
  margin: 18px 0 24px;
}
.notice svg {
  flex-shrink: 0;
  margin-top: 1px;
}
.flight-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding: 20px 23px;
  border-bottom: 1px solid #edf0f5;
  align-items: center;
}
.search-input {
  display: flex;
  align-items: center;
  gap: 9px;
  border: 1px solid #dfe6ef;
  border-radius: 7px;
  background: white;
  padding: 0 12px;
  color: #8a99ad;
}
.search-input input {
  border: 0;
  background: none;
  outline: none;
  padding: 12px 0;
  min-width: 0;
  width: 100%;
  font-size: 12px;
}
.flight-filters .search-input {
  flex: 1;
  min-width: 250px;
}
.flight-filters > input {
  max-width: 150px;
}
.time-filter {
  display: flex !important;
  gap: 8px;
  align-items: center;
  font-size: 11px !important;
  margin: 0 !important;
  color: #7b8da2;
}
.time-filter input {
  width: auto;
  padding: 9px;
}
.flight-filters select {
  max-width: 210px;
  font-size: 12px;
}
.flight-detail {
  padding: 35px;
  background: white;
  border: 1px solid #e4eaf3;
  border-radius: 13px;
}
.flight-route {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 0 40px;
  gap: 30px;
}
.flight-route > div:not(.route-plane) {
  flex: 1;
}
.flight-route > div:last-child {
  text-align: end;
}
.flight-route span {
  color: #8291a6;
  font-size: 12px;
}
.flight-route h2 {
  font-size: 38px;
  margin: 10px 0;
}
.flight-route p {
  color: #8b97a7;
}
.route-plane {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  color: #3a75d9;
}
.route-plane span {
  border-top: 1px dashed #b9cde8;
  flex: 1;
}
.detail-metrics {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border-top: 1px solid #e5ebf3;
  border-bottom: 1px solid #e5ebf3;
  padding: 25px 0;
  margin-bottom: 25px;
}
.detail-metrics small {
  display: block;
  font-size: 11px;
  color: #8a98ab;
  margin-bottom: 8px;
}
.detail-metrics strong {
  font-size: 24px;
}
.faq-search {
  max-width: 740px;
  margin-bottom: 30px;
}
.faq-search input {
  padding: 17px 0;
  font-size: 14px;
}
.faq-layout {
  display: grid;
  grid-template-columns: 225px 1fr;
  gap: 35px;
}
.faq-categories {
  display: flex;
  flex-direction: column;
  align-self: start;
  background: white;
  border: 1px solid #e4ebf3;
  border-radius: 10px;
  padding: 10px;
}
.faq-categories button {
  display: flex;
  justify-content: space-between;
  padding: 12px 15px;
  font-size: 13px;
  color: #8391a6;
  border-radius: 6px;
  text-align: start;
}
.faq-categories button.active {
  background: #edf3fe;
  color: #2a65cc;
}
.faq-list details {
  background: white;
  border: 1px solid #e5eaf1;
  border-radius: 9px;
  margin-bottom: 13px;
  padding: 20px 23px;
}
.faq-list summary {
  list-style: none;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  cursor: pointer;
}
.faq-list details[open] summary svg {
  transform: rotate(180deg);
}
.faq-list details p {
  color: #7b8ca2;
  font-size: 13px;
  line-height: 1.9;
  margin: 18px 0;
}
.faq-list details small {
  font-size: 10px;
  color: #8ea0b6;
}
.chat-layout {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 20px;
  min-height: 650px;
}
.chat-history {
  border: 1px solid #e4eaf3;
  background: white;
  border-radius: 11px;
  padding: 18px;
  display: flex;
  flex-direction: column;
}
.chat-history h4 {
  display: flex;
  gap: 8px;
  align-items: center;
  color: #8a98a9;
  font-size: 11px;
  margin: 28px 0 14px;
}
.chat-history > button:not(.btn) {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 13px 10px;
  text-align: start;
  font-size: 11px;
  color: #7a8da5;
  border-radius: 6px;
  margin: 3px 0;
}
.chat-history > button > span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.chat-history button.active {
  background: #edf4ff;
  color: #2e68d2;
}
.chat-history button small {
  display: block;
  color: #99a6b7;
  font-size: 9px;
  margin-top: 4px;
}
.chat-history-note {
  margin-top: auto;
  padding-top: 40px;
  color: #a3b1c5;
}
.chat-history-note p {
  font-size: 10px;
  margin-top: 10px;
}
.chat-main {
  display: flex;
  flex-direction: column;
  background: white;
  border: 1px solid #e3eaf3;
  border-radius: 12px;
  overflow: hidden;
  min-width: 0;
}
.chat-top {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 18px 24px;
  border-bottom: 1px solid #edf1f7;
}
.assistant-avatar,
.message-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #edf3ff;
  color: #4778d9;
  border-radius: 12px;
  width: 42px;
  height: 42px;
  flex-shrink: 0;
}
.chat-top strong {
  font-size: 14px;
}
.chat-top small {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 10px;
  color: #8da0b8;
  margin-top: 5px;
}
.chat-top i {
  width: 5px;
  height: 5px;
  background: #66ac91;
  border-radius: 50%;
}
.lang-badge {
  margin-inline-start: auto;
  background: #f6f8fc;
  color: #8da0b9;
  padding: 6px 8px;
  border-radius: 5px;
  font-size: 10px;
}
.chat-messages {
  padding: 24px;
  flex: 1;
  height: 460px;
  max-height: 550px;
  overflow: auto;
}
.chat-intro {
  padding: 25px 30px;
  text-align: center;
  max-width: 650px;
  margin: auto;
}
.large-ai {
  display: inline-flex;
  width: 75px;
  height: 75px;
  border-radius: 24px;
  background: #f0f5ff;
  color: #5582d5;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}
.chat-intro h2 {
  font-size: 22px;
  line-height: 1.6;
}
.suggestions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 25px;
}
.suggestions button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 9px;
  font-size: 11px;
  text-align: start;
  padding: 13px;
  border: 1px solid #e1e9f5;
  border-radius: 8px;
  color: #7890af;
}
.suggestions button:hover {
  background: #f4f8ff;
}
.chat-message {
  display: flex;
  gap: 8px;
  margin: 18px 0;
  max-width: 90%;
}
.chat-message > div {
  padding: 14px 17px;
  border-radius: 0 12px 12px 12px;
  background: #f2f6fc;
  font-size: 13px;
}
.chat-message small {
  display: block;
  font-size: 9px;
  color: #8d9eb4;
  margin-top: 9px;
}
.chat-message p {
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
.chat-message.user {
  margin-inline-start: auto;
  justify-content: flex-end;
}
.chat-message.user > div {
  background: #2466df;
  color: white;
  border-radius: 12px 0 12px 12px;
}
.message-avatar {
  width: 30px;
  height: 30px;
  border-radius: 9px;
}
.chat-compose {
  border-top: 1px solid #e9eef5;
  padding: 18px 22px;
}
.chat-compose > div {
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid #dce5f2;
  border-radius: 9px;
  padding: 6px;
}
.chat-compose input {
  border: 0;
  outline: none;
  flex: 1;
  min-width: 0;
  padding: 8px;
}
.chat-compose .btn {
  padding: 9px;
  min-height: 37px;
}
.chat-compose small {
  display: block;
  margin-top: 10px;
  font-size: 9px;
  color: #9aa8ba;
  text-align: center;
}
.typing {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  color: #889ab2;
  margin: 12px 0;
}
.typing span {
  height: 4px;
  width: 4px;
  background: #7892b5;
  border-radius: 50%;
  animation: pulse 1s infinite;
}
.typing span:nth-child(2) {
  animation-delay: 0.2s;
}
.typing span:last-of-type {
  margin-inline-end: 6px;
}
.form-layout {
  display: grid;
  grid-template-columns: 1fr 330px;
  gap: 28px;
}
.form-panel {
  padding: 28px;
  background: white;
  border: 1px solid #e4eaf2;
  border-radius: 12px;
}
.form-tabs {
  margin-top: -12px;
  margin-bottom: 24px;
  border-bottom: 1px solid #e6ebf2;
}
label {
  display: block;
  font-size: 12px;
  font-weight: 500;
  margin: 17px 0;
  color: #526780;
}
label input,
label select,
label textarea {
  display: block;
  margin-top: 7px;
  width: 100%;
}
input,
select,
textarea {
  padding: 11px 13px;
  border: 1px solid #dce4ef;
  border-radius: 6px;
  background: white;
  color: #244363;
  outline: none;
}
input:focus,
select:focus,
textarea:focus {
  border-color: #78a4ee;
  box-shadow: 0 0 0 3px #538cee12;
}
textarea {
  resize: vertical;
  line-height: 1.7;
}
input::placeholder,
textarea::placeholder {
  color: #a0acbd;
}
label small {
  color: #99a6b6;
  display: block;
  margin-top: 6px;
  font-size: 10px;
}
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}
.form-aside {
  border-radius: 12px;
  padding: 30px;
  background: #eff4fc;
  align-self: start;
}
.form-aside h2 {
  font-size: 23px;
  margin-bottom: 15px;
}
.form-aside p {
  font-size: 12px;
  color: #7c8fa9;
  margin-bottom: 20px;
}
.form-aside .btn {
  font-size: 12px;
}
.form-aside hr {
  margin: 28px 0;
  border: 0;
  border-top: 1px solid #dae4f3;
}
.form-aside > svg {
  color: #7e9fc8;
  margin-bottom: 10px;
}
.form-error {
  background: #fff0f1;
  color: #ad4153;
  padding: 11px 13px;
  border-radius: 6px;
  font-size: 12px;
  margin: 15px 0;
}
.success {
  padding: 20px 0;
  color: #397f6a;
}
.success h2 {
  margin: 17px 0;
  font-size: 23px;
}
.success code {
  display: block;
  padding: 14px;
  background: #f2f6fc;
  border-radius: 7px;
  font-size: 16px;
  word-break: break-all;
  color: #376597;
  margin-top: 9px;
}
.success p {
  color: #7c8ca3;
  font-size: 12px;
  margin: 20px 0;
}
.tracked {
  border-top: 1px solid #e3eaf3;
  padding: 25px 0;
  margin-top: 20px;
}
.tracked h3 {
  margin-bottom: 15px;
}
.tracked p {
  margin: 15px 0;
  color: #7b8ea6;
}
.auth-page {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  max-width: 1120px;
  padding-block: 60px;
}
.auth-visual {
  position: relative;
  padding: 45px;
  background: linear-gradient(140deg, #173855, #225991);
  color: white;
  border-radius: 18px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
}
.auth-visual > .eyebrow {
  color: #8fbbec;
  margin-top: 35px;
}
.auth-visual h2 {
  white-space: pre-line;
  font-size: 40px;
}
.auth-visual p {
  color: #b1c9e4;
  font-size: 13px;
  margin: 22px 0;
}
.auth-visual > svg {
  color: #8bb9ea;
}
.auth-route {
  display: flex;
  gap: 10px;
  align-items: center;
  margin: 36px 0;
  font-size: 27px;
  color: #b4d2ef;
}
.auth-route > span {
  font-size: 16px;
  letter-spacing: 2px;
}
.auth-visual small {
  color: #8badcf;
  font-size: 11px;
}
.auth-form {
  padding: 20px 0;
}
.auth-form h1 {
  font-size: 29px;
}
.auth-form > p {
  font-size: 13px;
  margin: 16px 0 26px;
}
.auth-form .btn {
  margin-top: 20px;
}
.auth-form > p:last-child {
  font-size: 11px;
}
.account-tabs {
  padding-inline: 23px;
  border-bottom: 1px solid #e9eef5;
}
.request-list {
  padding: 10px 25px;
}
.request-list article {
  padding: 22px 0;
  border-bottom: 1px solid #edf0f5;
}
.request-list article:last-child {
  border-bottom: 0;
}
.request-list article p {
  font-size: 13px;
  color: #7f90a7;
  margin-top: 13px;
}
.request-list article small {
  font-size: 10px;
  color: #92a0b3;
  display: block;
  margin-top: 7px;
}
.request-list article > a,
.conversation-row {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 15px;
  text-align: start;
}
.request-list article > a > svg:last-child,
.conversation-row > svg:last-child {
  margin-inline-start: auto;
}
.admin-response {
  padding: 15px;
  border-radius: 8px;
  background: #f4f7fc;
  margin-top: 15px;
}
.admin-response strong {
  font-size: 12px;
}
.modal {
  position: fixed;
  margin: auto;
  border: 0;
  border-radius: 15px;
  padding: 28px;
  width: min(620px, 94vw);
  max-height: 88vh;
  overflow: auto;
  color: #23415f;
  box-shadow: 0 20px 90px #132b4d2a;
}
.modal::backdrop {
  background: #10284080;
  backdrop-filter: blur(3px);
}
.modal-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 23px;
}
.modal-head h2 {
  font-size: 23px;
}
.modal > p {
  color: #7a8da5;
  font-size: 13px;
  margin: 15px 0;
}
.modal > h4 {
  margin-top: 20px;
}
.toast {
  position: fixed;
  bottom: 28px;
  left: 50%;
  transform: translateX(-50%);
  background: #143652;
  color: white;
  padding: 14px 22px;
  border-radius: 9px;
  z-index: 100;
  font-size: 13px;
  max-width: 90vw;
  box-shadow: 0 6px 25px #17395920;
}
.empty {
  padding: 60px 25px;
  text-align: center;
  color: #93a1b3;
}
.empty svg {
  margin: 0 auto 15px;
}
.empty .btn {
  margin-top: 25px;
}
.empty h1 {
  font-size: 90px;
  color: #316cc5;
}
.error-box {
  padding: 35px;
  color: #af5964;
  text-align: center;
}
.error-box svg {
  margin: auto;
}
.error-box p {
  margin: 15px;
}
.skeletons {
  padding: 25px;
}
.skeletons div {
  height: 40px;
  border-radius: 7px;
  margin: 12px 0;
  background: linear-gradient(90deg, #f3f6fa, #e9eff7, #f3f6fa);
  background-size: 200% 100%;
  animation: pulse 1.5s infinite;
}
.spin {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
@keyframes pulse {
  50% {
    opacity: 0.4;
  }
}
.admin-shell {
  display: flex;
  min-height: 100vh;
  background: #f6f8fc;
}
.admin-sidebar {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 238px;
  background: white;
  border-inline-end: 1px solid #e5ebf4;
  padding: 28px 18px;
  display: flex;
  flex-direction: column;
  z-index: 30;
}
.admin-sidebar .brand {
  margin: 0 12px 35px;
}
.admin-label {
  font-size: 9px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: #94a3b5;
  margin: 0 15px 17px;
}
.admin-sidebar nav {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.admin-sidebar nav a {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 13px 15px;
  font-size: 13px;
  color: #7f90a7;
  border-radius: 7px;
}
.admin-sidebar nav a.active {
  background: #edf3ff;
  color: #2f6cdb;
  font-weight: 600;
}
.admin-sidebar-bottom {
  margin-top: auto;
  padding: 25px 10px 0;
  display: flex;
  flex-direction: column;
  gap: 22px;
  font-size: 12px;
  color: #8295af;
}
.admin-sidebar-bottom a,
.admin-sidebar-bottom button {
  display: flex;
  align-items: center;
  gap: 10px;
}
.admin-main {
  margin-inline-start: 238px;
  flex: 1;
  min-width: 0;
}
.admin-header {
  height: 80px;
  background: white;
  border-bottom: 1px solid #e5ebf4;
  padding-inline: 35px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  font-size: 12px;
  color: #8292a8;
}
.admin-header > div {
  display: flex;
  align-items: center;
  gap: 15px;
}
.admin-header strong {
  font-size: 11px;
  color: #46627f;
}
.user-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e9f0fc;
  border-radius: 50%;
  height: 33px;
  width: 33px;
  color: #5682c8;
}
.demo-pill {
  background: #f0f5fe;
  border-radius: 5px;
  font-size: 9px;
  padding: 5px 8px;
  color: #7d9bc3;
  margin-inline-start: 12px;
}
.admin-content {
  padding: 32px;
  max-width: 1500px;
  margin: auto;
}
.admin-content .page-title h1 {
  font-size: 29px;
}
.admin-content .page-title p {
  font-size: 12px;
}
.admin-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
  margin-bottom: 24px;
}
.admin-stats article {
  background: white;
  border: 1px solid #e4ebf4;
  border-radius: 11px;
  padding: 23px;
  display: flex;
  flex-direction: column;
  position: relative;
}
.stat-icon {
  background: #edf2ff;
  color: #5684d4;
  width: 43px;
  height: 43px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  margin-bottom: 16px;
}
.stat-1 {
  background: #f0ecfc;
  color: #9982cb;
}
.stat-2 {
  background: #eaf6f0;
  color: #72a18b;
}
.stat-3 {
  background: #fff5e8;
  color: #c29d66;
}
.admin-stats article > span:nth-child(2) {
  font-size: 12px;
  color: #8493a9;
}
.admin-stats article > strong {
  font-size: 32px;
  margin: 6px 0;
}
.admin-stats article > small {
  font-size: 9px;
  color: #a0adbd;
}
.analytics-grid {
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  gap: 22px;
}
.chart-panel {
  padding: 24px;
  margin-bottom: 0;
}
.chart-panel h3 {
  font-size: 15px;
  margin-bottom: 23px;
}
.chart-panel .section-title h3 {
  margin: 0;
}
.chart-panel select {
  font-size: 10px;
  padding: 6px 9px;
}
.bar-chart {
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  gap: 9px;
  height: 215px;
  overflow-x: auto;
  min-width: 0;
  padding: 8px 0;
}
.bar-chart > div {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}
.bar-chart i {
  display: block;
  background: linear-gradient(#6090e7, #b5cdf6);
  width: 100%;
  min-width: 10px;
  max-width: 32px;
  border-radius: 4px 4px 0 0;
}
.bar-chart small {
  font-size: 8px;
  color: #8c9cb1;
}
.bar-chart span {
  font-size: 10px;
  color: #7295cc;
}
.horizontal-chart > div {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 10px;
  color: #8797ad;
  margin: 19px 0;
}
.horizontal-chart > div > span {
  width: 90px;
  flex-shrink: 0;
}
.horizontal-chart > div > div {
  flex: 1;
  height: 7px;
  background: #f1f5fb;
  border-radius: 5px;
  overflow: hidden;
}
.horizontal-chart i {
  display: block;
  height: 100%;
  background: #7a9fdf;
  border-radius: 5px;
}
.horizontal-chart strong {
  font-size: 11px;
  width: 20px;
  text-align: end;
}
.sentiments {
  display: flex;
  gap: 15px;
  justify-content: space-around;
  margin: 28px 0;
}
.sentiments > div {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  flex: 1;
}
.sentiments span {
  font-size: 24px;
}
.sentiments strong {
  font-size: 30px;
  color: #335171;
}
.sentiments small {
  font-size: 11px;
}
.positive {
  color: #79a38c;
}
.neutral {
  color: #a1aabd;
}
.negative {
  color: #cd929d;
}
.service-ranks > div {
  display: flex;
  gap: 15px;
  font-size: 12px;
  padding: 11px 0;
  border-bottom: 1px solid #f0f3f7;
  align-items: center;
}
.service-ranks > div > span {
  font-size: 10px;
  color: #afbac9;
}
.service-ranks strong {
  font-weight: 500;
}
.service-ranks small {
  margin-inline-start: auto;
  color: #7f9dc7;
}
.recommendation-panel {
  background: #edf3ff;
  border: 1px solid #e0e9fb;
  border-radius: 12px;
  padding: 25px;
  margin: 24px 0;
}
.recommendation-panel > div:first-child {
  display: flex;
  align-items: center;
  gap: 12px;
}
.recommendation-panel .stat-icon {
  margin: 0;
  background: white;
}
.recommendation-panel h3 {
  font-size: 16px;
}
.recommendation-panel p {
  display: flex;
  align-items: center;
  gap: 9px;
  font-size: 12px;
  color: #7c91af;
  padding: 12px 0;
}
.recommendation-panel p > span {
  height: 22px;
  width: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #dfeafe;
  border-radius: 50%;
  font-size: 10px;
  color: #6d94cf;
}
.recommendation-panel p > small {
  margin-inline-start: auto;
}
.recommendation-panel p > strong {
  font-weight: 500;
  color: #4e78b5;
}
.question-row {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  border-bottom: 1px solid #eef2f7;
  padding: 15px 0;
  color: #7e91ac;
  font-size: 12px;
}
.resource-toolbar {
  padding: 20px;
}
.resource-toolbar.search-input {
  border: 0;
  border-radius: 0;
  border-bottom: 1px solid #e7edf5;
}
.table-actions {
  display: flex;
  gap: 4px;
}
.danger-text {
  color: #c87988;
}
.language-tabs {
  margin-bottom: 17px;
}
.language-tabs button {
  padding: 10px 5px;
}
.admin-footer {
  padding: 25px 32px;
  color: #9aaabe;
  font-size: 10px;
}
.admin-chat {
  padding: 15px;
  border-radius: 8px;
  background: #f4f7fc;
  margin: 12px 0;
  font-size: 12px;
}
.admin-chat.user {
  background: #edf3ff;
}
.admin-chat p {
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  margin-top: 6px;
}
.admin-chat small {
  font-size: 9px;
  color: #8c9eb8;
}
[dir="rtl"] .hero-overlay {
  background: linear-gradient(
    270deg,
    #102d48f7 0%,
    #133653e8 28%,
    #16364d96 52%,
    #132c4120 100%
  );
}
[dir="rtl"] .hero-coordinate {
  right: auto;
  left: 7%;
}
[dir="rtl"] .photo-credit {
  right: auto;
  left: 24px;
}
[dir="rtl"] .brand {
  direction: ltr;
}
[dir="rtl"] .hero h1 {
  letter-spacing: 0;
}
[dir="rtl"] .floating-chat {
  right: auto;
  left: 26px;
}
[dir="rtl"] .admin-sidebar {
  right: 0;
}
[dir="rtl"] .service-card,
[dir="rtl"] .chat-history {
  text-align: right;
}
@media (min-width: 1500px) {
  .hero-content {
    padding-top: 65px;
  }
  .hero {
    height: 470px;
  }
}
@media (max-width: 1150px) {
  .site-header nav {
    gap: 16px;
  }
  .header-inner {
    gap: 15px;
  }
  .brand > span:last-child {
    font-size: 21px;
  }
  .account-btn span {
    display: none;
  }
  .home-grid {
    gap: 12px;
  }
  .service-card {
    padding: 20px;
  }
  .admin-header strong {
    display: none;
  }
  .admin-stats {
    gap: 12px;
  }
  .admin-stats article {
    padding: 18px;
  }
  .admin-content {
    padding: 25px;
  }
  .form-layout {
    grid-template-columns: 1fr 280px;
  }
}
@media (max-width: 950px) {
  .container {
    padding-inline: 24px;
  }
  .header-inner {
    height: 73px;
  }
  .site-header nav {
    position: absolute;
    top: 73px;
    left: 0;
    right: 0;
    display: none;
    height: auto;
    background: white;
    padding: 20px 25px;
    box-shadow: 0 10px 15px #162f5510;
    flex-direction: column;
    align-items: stretch;
    gap: 0;
  }
  .site-header nav.open {
    display: flex;
  }
  .site-header nav a {
    padding: 13px;
    height: auto;
  }
  .site-header nav a.active:after {
    display: none;
  }
  .mobile-menu {
    display: inline-flex;
  }
  .hero h1 {
    font-size: 48px;
  }
  .shortcuts {
    gap: 8px;
  }
  .shortcuts a {
    min-height: 105px;
  }
  .service-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .assistant-cta {
    flex-wrap: wrap;
  }
  .assistant-cta .btn {
    margin-inline-start: 84px;
  }
  .footer-main {
    gap: 25px;
  }
  .footer-academic {
    grid-column: 1/-1;
  }
  .footer-main {
    grid-template-columns: 1.3fr 1fr 1fr;
  }
  .home-links > span {
    display: none;
  }
  .form-layout {
    grid-template-columns: 1fr;
  }
  .form-aside {
    display: none;
  }
  .chat-layout {
    grid-template-columns: 200px 1fr;
  }
  .chat-history {
    padding: 12px;
  }
  .chat-intro {
    padding: 20px 5px;
  }
  .auth-page {
    gap: 30px;
  }
  .auth-visual {
    padding: 28px;
  }
  .auth-visual h2 {
    font-size: 33px;
  }
  .admin-sidebar {
    width: 195px;
    padding: 25px 12px;
  }
  .admin-sidebar .brand {
    margin-inline: 5px;
  }
  .admin-main {
    margin-inline-start: 195px;
  }
  .admin-sidebar nav a {
    font-size: 12px;
    gap: 8px;
    padding: 13px 10px;
  }
  .admin-header {
    padding-inline: 23px;
  }
  .admin-header .demo-pill {
    display: none;
  }
  .admin-stats {
    grid-template-columns: repeat(2, 1fr);
  }
  .analytics-grid {
    grid-template-columns: 1fr;
  }
  .admin-content .page-title {
    align-items: flex-start;
  }
}
@media (max-width: 640px) {
  .container {
    padding-inline: 18px;
  }
  .utility-bar {
    height: 28px;
  }
  .utility-bar span {
    font-size: 9px;
  }
  .utility-bar span:last-child {
    font-size: 0;
    gap: 0;
  }
  .utility-bar span:last-child svg {
    width: 13px;
  }
  .utility-bar i {
    display: none;
  }
  .header-inner {
    height: 68px;
    gap: 10px;
  }
  .brand-icon {
    width: 32px;
    height: 32px;
    border-radius: 9px;
  }
  .brand > span:last-child {
    font-size: 21px;
  }
  .brand small {
    font-size: 6px;
    letter-spacing: 2px;
  }
  .header-actions {
    gap: 8px;
  }
  .language-picker {
    gap: 2px;
  }
  .language-picker svg {
    width: 14px;
  }
  .language-picker select {
    font-size: 11px;
  }
  .account-btn {
    min-height: 33px;
    padding: 7px 8px;
  }
  .mobile-menu {
    width: 29px;
  }
  .site-header nav {
    top: 68px;
  }
  .hero {
    height: 440px;
  }
  .hero-content {
    padding-top: 43px;
  }
  .hero-image {
    object-position: 61% 50%;
  }
  .hero-overlay {
    background: linear-gradient(90deg, #102d48eb, #173d57aa);
  }
  .hero-kicker {
    font-size: 8px;
    letter-spacing: 1.3px;
  }
  .hero h1 {
    font-size: 42px;
    line-height: 1.15;
    letter-spacing: -1.8px;
    margin: 22px 0;
  }
  .hero p {
    font-size: 12px;
    max-width: 340px;
  }
  .hero-actions {
    gap: 10px;
    flex-wrap: wrap;
    margin-top: 25px;
  }
  .hero-actions .btn {
    font-size: 10px;
    padding: 10px 12px;
    gap: 7px;
  }
  .hero-actions .btn svg {
    width: 15px;
  }
  .hero-trust {
    font-size: 8px;
    gap: 5px;
    margin-top: 22px;
  }
  .hero-coordinate {
    display: none;
  }
  .photo-credit {
    font-size: 6px;
    right: 18px;
    bottom: 10px;
  }
  .quick-section {
    padding-top: 28px;
  }
  .section-title {
    gap: 12px;
    margin-bottom: 19px;
  }
  .section-title h2 {
    font-size: 22px;
    line-height: 1.35;
  }
  .section-title p {
    font-size: 11px;
  }
  .section-title .text-link {
    font-size: 10px;
    white-space: nowrap;
  }
  .little-label {
    display: none;
  }
  .shortcuts {
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
  }
  .shortcuts a {
    min-height: 90px;
    gap: 9px;
  }
  .shortcuts a > span {
    height: 33px;
    width: 33px;
    border-radius: 9px;
  }
  .shortcuts a svg {
    width: 19px;
  }
  .shortcuts strong {
    font-size: 10px;
  }
  .shortcuts .shortcut-arrow {
    width: 10px;
    top: 5px;
    right: 5px;
  }
  .shortcuts a:last-child {
    grid-column: span 2;
    flex-direction: row;
  }
  .home-flights {
    margin-top: 33px;
  }
  .home-flights > .section-title {
    align-items: flex-end;
  }
  .home-flights h2 {
    font-size: 23px;
  }
  .home-flights .eyebrow {
    font-size: 8px;
  }
  .board-toolbar {
    padding-inline: 15px;
    min-height: 58px;
    gap: 10px;
  }
  .tabs {
    gap: 18px;
  }
  .tabs button {
    font-size: 12px;
    gap: 6px;
    padding: 19px 0 17px;
  }
  .table-meta {
    display: none;
  }
  th,
  td {
    padding: 14px 15px;
  }
  .flight-table {
    min-width: 580px;
  }
  .flight-table th {
    font-size: 8px;
  }
  .flight-table td {
    padding-block: 15px;
  }
  .board-foot {
    padding: 12px 15px;
    font-size: 8px;
  }
  .home-services {
    margin-top: 30px;
  }
  .home-services > .section-title {
    flex-direction: column;
    align-items: flex-start;
    gap: 13px;
  }
  .home-grid {
    gap: 10px;
  }
  .service-card {
    padding: 18px 15px;
    border-radius: 9px;
  }
  .service-icon {
    width: 40px;
    height: 40px;
    border-radius: 11px;
    margin-bottom: 15px;
  }
  .service-icon svg {
    width: 23px;
  }
  .service-card h3 {
    font-size: 14px;
  }
  .service-card p {
    font-size: 11px;
    line-height: 1.75;
  }
  .service-card .text-link {
    font-size: 10px;
  }
  .service-location {
    font-size: 9px;
    line-height: 1.6;
  }
  .service-location svg {
    flex-shrink: 0;
  }
  .assistant-cta {
    padding: 24px 20px;
    gap: 16px;
    margin-top: 25px;
  }
  .cta-icon {
    height: 43px;
    width: 43px;
    border-radius: 12px;
  }
  .cta-icon svg {
    width: 23px;
  }
  .assistant-cta > div {
    flex: 1;
    min-width: 200px;
  }
  .assistant-cta h2 {
    font-size: 21px;
  }
  .assistant-cta p {
    font-size: 11px;
  }
  .assistant-cta > .btn {
    margin: 0;
    font-size: 11px;
  }
  .home-links {
    margin-bottom: 32px;
  }
  .footer-main {
    grid-template-columns: 1fr 1fr;
    gap: 25px;
    padding-top: 30px;
  }
  .footer-main > div:first-child {
    grid-column: 1/-1;
  }
  .footer-main .brand {
    transform: none;
  }
  .footer-main > div:first-child p {
    font-size: 10px;
  }
  .footer-academic {
    padding: 15px;
  }
  .footer-bottom {
    font-size: 8px;
    gap: 20px;
  }
  .floating-chat {
    width: 44px;
    height: 44px;
    bottom: 17px;
    right: 15px;
    border-radius: 13px;
  }
  .page {
    padding-top: 28px;
    padding-bottom: 40px;
  }
  .page-title {
    align-items: flex-start;
    flex-direction: column;
    gap: 18px;
    margin-bottom: 24px;
  }
  .page-title h1 {
    font-size: 29px;
  }
  .page-title p {
    font-size: 12px;
    line-height: 1.75;
  }
  .eyebrow {
    font-size: 8px;
    letter-spacing: 1.4px;
  }
  .notice {
    font-size: 10px;
    padding: 12px;
    line-height: 1.8;
  }
  .flight-filters {
    padding: 15px;
    gap: 10px;
  }
  .flight-filters .search-input {
    flex-basis: 100%;
    min-width: 0;
  }
  .flight-filters select {
    flex: 1;
    max-width: none;
    min-width: 120px;
    font-size: 11px;
  }
  .flight-filters > input {
    max-width: none;
    width: 45%;
    font-size: 11px;
  }
  .flight-filters .text-link {
    font-size: 11px;
  }
  .flight-detail {
    padding: 20px;
  }
  .flight-route {
    gap: 12px;
    flex-wrap: wrap;
  }
  .flight-route h2 {
    font-size: 25px;
  }
  .flight-route p {
    font-size: 10px;
  }
  .flight-route span {
    font-size: 10px;
  }
  .route-plane {
    max-width: 70px;
  }
  .route-plane svg {
    width: 23px;
  }
  .detail-metrics {
    grid-template-columns: repeat(2, 1fr);
    gap: 25px;
  }
  .detail-metrics strong {
    font-size: 22px;
  }
  .flight-detail .flex-between {
    align-items: flex-start;
    flex-direction: column;
  }
  .faq-layout {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  .faq-categories {
    display: flex;
    flex-direction: row;
    overflow: auto;
    gap: 5px;
    padding: 7px;
  }
  .faq-categories button {
    white-space: nowrap;
    padding: 9px 11px;
    font-size: 11px;
  }
  .faq-categories svg {
    display: none;
  }
  .faq-list details {
    padding: 17px;
  }
  .faq-list summary {
    font-size: 13px;
    line-height: 1.5;
  }
  .faq-list p {
    font-size: 12px;
  }
  .chat-layout {
    display: flex;
    flex-direction: column;
    min-height: 0;
  }
  .chat-history {
    max-height: 190px;
    overflow: auto;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 8px;
  }
  .chat-history .full {
    width: auto;
    font-size: 11px;
    min-height: 35px;
  }
  .chat-history h4,
  .chat-history-note {
    display: none;
  }
  .chat-history > button:not(.btn) {
    max-width: 180px;
    padding: 8px;
  }
  .chat-messages {
    height: 430px;
    max-height: 430px;
    padding: 15px;
  }
  .chat-top {
    padding: 14px 15px;
  }
  .chat-top strong {
    font-size: 12px;
  }
  .chat-top small {
    font-size: 9px;
  }
  .chat-intro {
    padding-top: 20px;
  }
  .chat-intro h2 {
    font-size: 20px;
  }
  .suggestions {
    gap: 9px;
    margin-top: 20px;
  }
  .suggestions button {
    font-size: 10px;
    padding: 10px;
    line-height: 1.7;
  }
  .chat-message {
    max-width: 97%;
  }
  .chat-message > div {
    font-size: 12px;
    padding: 12px;
  }
  .chat-compose {
    padding: 13px;
  }
  .chat-compose small {
    font-size: 8px;
  }
  .form-panel {
    padding: 20px;
  }
  .form-row {
    grid-template-columns: 1fr;
    gap: 0;
  }
  label {
    font-size: 11px;
  }
  .form-tabs button {
    font-size: 11px;
  }
  .auth-page {
    display: block;
    padding-top: 28px;
  }
  .auth-visual {
    display: none;
  }
  .auth-form {
    max-width: 440px;
    margin: auto;
  }
  .auth-form h1 {
    font-size: 29px;
  }
  .account-tabs {
    padding-inline: 15px;
    gap: 16px;
    overflow: auto;
  }
  .account-tabs button {
    white-space: nowrap;
    font-size: 10px;
  }
  .request-list {
    padding: 5px 16px;
  }
  .request-list h3 {
    font-size: 15px;
  }
  .request-list p {
    font-size: 12px;
  }
  .modal {
    padding: 22px;
    max-height: 90vh;
  }
  .modal-head h2 {
    font-size: 20px;
  }
  .admin-shell {
    display: block;
  }
  .admin-sidebar {
    position: relative;
    top: auto;
    bottom: auto;
    width: 100%;
    padding: 16px;
    border: 0;
  }
  .admin-sidebar .brand {
    margin: 0 0 18px;
  }
  .admin-label,
  .admin-sidebar-bottom {
    display: none;
  }
  .admin-sidebar nav {
    flex-direction: row;
    overflow: auto;
    gap: 4px;
  }
  .admin-sidebar nav a {
    white-space: nowrap;
    font-size: 10px;
    padding: 10px;
    gap: 5px;
  }
  .admin-sidebar nav svg {
    width: 15px;
  }
  .admin-main {
    margin-inline-start: 0;
  }
  .admin-header {
    height: 56px;
    padding: 12px 18px;
    font-size: 10px;
  }
  .admin-header > div {
    gap: 10px;
  }
  .user-avatar {
    height: 28px;
    width: 28px;
  }
  .admin-content {
    padding: 22px 16px;
  }
  .admin-stats {
    gap: 10px;
  }
  .admin-stats article {
    padding: 17px;
  }
  .admin-stats article > span:nth-child(2) {
    font-size: 10px;
  }
  .admin-stats article strong {
    font-size: 28px;
  }
  .admin-stats article small {
    font-size: 8px;
  }
  .stat-icon {
    width: 35px;
    height: 35px;
    border-radius: 10px;
  }
  .analytics-grid {
    gap: 16px;
  }
  .chart-panel {
    padding: 20px;
  }
  .chart-panel h3 {
    font-size: 14px;
  }
  .bar-chart {
    gap: 5px;
  }
  .bar-chart small {
    font-size: 6px;
  }
  .recommendation-panel {
    padding: 19px;
  }
  .recommendation-panel h3 {
    font-size: 14px;
  }
  .recommendation-panel p {
    font-size: 11px;
    flex-wrap: wrap;
  }
  .recommendation-panel p > small {
    margin-inline-start: 0;
  }
  .admin-footer {
    padding: 20px 16px;
    font-size: 9px;
  }
  .admin-content table {
    min-width: 620px;
  }
  .language-tabs {
    gap: 28px;
  }
  .resource-toolbar {
    padding: 15px;
  }
  [dir="rtl"] .hero-overlay {
    background: linear-gradient(270deg, #102d48eb, #173d57aa);
  }
}
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
    scroll-behavior: auto !important;
  }
}
button:focus-visible,
a:focus-visible {
  outline: 2px solid #518beb;
  outline-offset: 3px;
}

/* Contain visually hidden table headings within the horizontal scroller. */
.table-scroll {
  position: relative;
}

```

## frontend/src/tracking.css

```css
.tracking-page {
  --tracking-line: #dbe5df;
  padding-top: 36px;
}
.tracking-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
  margin-bottom: 26px;
}
.tracking-heading .eyebrow {
  display: flex;
  align-items: center;
  gap: 8px;
}
.tracking-heading h1 {
  font-size: clamp(30px, 3.6vw, 46px);
  font-weight: 550;
  margin: 12px 0;
  line-height: 1.16;
}
.tracking-heading p {
  max-width: 650px;
  color: #60766e;
  line-height: 1.8;
  font-size: 14px;
}
.tracking-heading-source {
  border-inline-start: 1px solid var(--tracking-line);
  padding-inline-start: 28px;
  flex-shrink: 0;
}
.tracking-heading-source > span {
  display: block;
  color: #687e75;
  font-size: 11px;
  margin-bottom: 5px;
}
.tracking-heading-source strong {
  font-size: 21px;
  color: #203f3d;
  letter-spacing: -1px;
  font-style: italic;
}
.tracking-heading-source strong span {
  color: #977430;
}
.tracking-status {
  display: flex;
  gap: 13px;
  align-items: flex-start;
  background: #edf4ef;
  color: #365e4c;
  border: 1px solid #d8e6dc;
  border-radius: 12px;
  padding: 17px 20px;
  margin-bottom: 24px;
}
.tracking-status-icon {
  flex-shrink: 0;
  padding-top: 1px;
}
.tracking-status strong {
  display: block;
  font-size: 14px;
}
.tracking-status p {
  margin: 5px 0 0;
  font-size: 12px;
  line-height: 1.75;
}
.tracking-status small {
  display: block;
  font-size: 11px;
  line-height: 1.6;
  margin-top: 5px;
}
.tracking-status-sandbox,
.tracking-status-stale {
  background: #fcf4e5;
  border-color: #eadbbc;
  color: #80602b;
}
.tracking-status-unavailable {
  background: #fcf0ec;
  border-color: #ecd6ce;
  color: #935943;
}
.tracking-status-paused,
.tracking-status-not_configured,
.tracking-status-loading {
  background: #eef3f0;
  border-color: #dbe5df;
  color: #566f65;
}
.tracking-workspace {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 330px;
  gap: 22px;
  align-items: start;
}
.tracking-map-column,
.tracking-sidebar {
  min-width: 0;
}
.tracking-map-toolbar {
  background: #fff;
  border: 1px solid var(--tracking-line);
  border-bottom: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 14px;
  min-height: 62px;
  padding: 12px 18px;
  border-radius: 12px 12px 0 0;
}
.tracking-map-toolbar > div {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}
.tracking-map-toolbar .text-link {
  min-height: 36px;
  font-size: 11px;
  gap: 5px;
  white-space: nowrap;
}
.tracking-map-wrap {
  position: relative;
  overflow: hidden;
  border-inline: 1px solid var(--tracking-line);
  background: #e8eee8;
  isolation: isolate;
}
.tracking-map {
  height: 485px;
  width: 100%;
  background: #e8eee8;
  z-index: 0;
  font-family: inherit;
}
.tracking-map.leaflet-container {
  font-family: inherit;
}
.tracking-map .leaflet-control-attribution {
  font-size: 10px;
  background: #fffffff2;
  color: #34534a;
  padding: 3px 6px;
}
.tracking-map .leaflet-control-attribution a {
  color: #176b62;
}
.tracking-map .leaflet-control-zoom {
  border: 1px solid #d3dfd7;
  box-shadow: 0 3px 10px #1c493119;
}
.tracking-map .leaflet-control-zoom a {
  color: #28594c;
  width: 36px;
  height: 36px;
  line-height: 36px;
}
.tracking-plane-marker {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fff;
  border: 1px solid #bbcfc2;
  border-radius: 50%;
  box-shadow: 0 3px 10px #173a3333;
  color: #156b59;
}
.tracking-plane-marker.selected {
  background: #174f48;
  border-color: #174f48;
  color: #fff;
  box-shadow: 0 0 0 5px #174f4826;
}
.tracking-plane-marker.old {
  color: #9a7336;
  border-color: #d5bb8a;
  background: #fff9ed;
}
.tracking-plane-marker.old.selected {
  box-shadow: 0 0 0 5px #9a733629;
}
.tracking-plane-symbol {
  width: 23px;
  height: 23px;
  display: block;
}
.tracking-plane-symbol svg {
  width: 100%;
  height: 100%;
  fill: currentColor;
}
.tracking-map-popup {
  padding: 3px 1px;
  min-width: 0;
  line-height: 1.55;
  overflow-wrap: anywhere;
}
.tracking-map-popup strong {
  font-size: 16px;
  color: #214b43;
}
.tracking-map-popup p {
  font-size: 14px;
  margin: 8px 0;
  color: #526b60;
}
.tracking-map-popup small {
  display: block;
  font-size: 11px;
  color: #61766b;
  margin-top: 5px;
}
.tracking-map-popup small.old {
  color: #906d31;
}
.tracking-map .leaflet-popup-content-wrapper {
  border-radius: 10px;
}
.tracking-map .leaflet-popup-close-button {
  min-width: 30px;
  min-height: 30px;
}
.tracking-map .leaflet-marker-icon:focus-visible {
  outline: 3px solid #477db5;
  outline-offset: 4px;
}
.tracking-tile-warning {
  position: absolute;
  bottom: 35px;
  inset-inline: 16px;
  display: flex;
  align-items: flex-start;
  gap: 7px;
  background: #fffcf1ed;
  color: #7b663a;
  border: 1px solid #d9caac;
  border-radius: 7px;
  padding: 10px 12px;
  font-size: 11px;
  line-height: 1.6;
  pointer-events: none;
  z-index: 1;
}
.tracking-tile-warning svg {
  flex-shrink: 0;
  margin-top: 2px;
}
.tracking-update-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 13px;
  background: #fff;
  padding: 14px 16px;
  border: 1px solid var(--tracking-line);
  border-radius: 0 0 12px 12px;
}
.tracking-update-bar > span {
  color: #60756b;
  font-size: 10px;
  display: flex;
  gap: 5px;
  align-items: center;
  flex-wrap: wrap;
}
.tracking-update-bar > span svg {
  flex-shrink: 0;
}
.tracking-update-bar > div {
  display: flex;
  gap: 8px;
}
.tracking-update-bar .btn {
  min-height: 38px;
  padding: 8px 11px;
  font-size: 11px;
  gap: 6px;
}
.tracking-update-bar button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
.tracking-cadence {
  margin: 11px 2px 0;
  font-size: 10px;
  line-height: 1.7;
  color: #718078;
}
.tracking-provider-credit {
  margin: 5px 2px 0;
  font-size: 11px;
  color: #718078;
}
.tracking-provider-credit a {
  color: #176b62;
  text-decoration: underline;
  text-underline-offset: 3px;
}
.tracking-sidebar {
  background: #fff;
  border: 1px solid var(--tracking-line);
  border-radius: 12px;
  overflow: hidden;
}
.tracking-list-heading {
  padding: 21px 20px 15px;
}
.tracking-list-heading .eyebrow {
  font-size: 9px;
  letter-spacing: 1.5px;
}
.tracking-list-heading h2 {
  font-size: 21px;
  line-height: 1.4;
  margin: 7px 0 4px;
}
.tracking-list-heading p {
  color: #728079;
  font-size: 11px;
}
.tracking-filter-tabs {
  display: flex;
  gap: 2px;
  margin-inline: 16px;
  padding: 4px;
  background: #f2f5f0;
  border-radius: 7px;
}
.tracking-filter-tabs button {
  min-width: 0;
  min-height: 36px;
  flex: 1;
  border: 0;
  background: transparent;
  font-size: 10px;
  font-weight: 550;
  color: #677a6e;
  border-radius: 5px;
  padding: 6px;
}
.tracking-filter-tabs button.selected {
  color: #235f4e;
  background: #fff;
  box-shadow: 0 1px 4px #2b4e3415;
}
.tracking-search {
  display: flex;
  align-items: center;
  gap: 7px;
  border: 1px solid var(--tracking-line);
  border-radius: 7px;
  margin: 14px 16px;
  padding-inline: 11px;
  color: #728278;
}
.tracking-search input {
  border: 0;
  box-shadow: none;
  outline: none;
  background: transparent;
  padding: 11px 0;
  min-width: 0;
  width: 100%;
  font-size: 11px;
}
.tracking-search:focus-within {
  outline: 2px solid #318978;
  outline-offset: 2px;
}
.tracking-search input:focus,
.tracking-search input:focus-visible {
  outline: none;
  box-shadow: none;
  border: 0;
}
.tracking-flight-list {
  max-height: 410px;
  overflow: auto;
  scrollbar-width: thin;
  padding: 0 12px 12px;
}
.tracking-empty {
  min-height: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  padding: 25px 16px;
  gap: 10px;
  color: #7d9180;
}
.tracking-empty h3 {
  font-size: 16px;
  color: #4d6958;
}
.tracking-empty p {
  font-size: 12px;
  line-height: 1.7;
  margin: 0;
}
.tracking-empty .text-link {
  margin-top: 7px;
  min-height: 36px;
  font-size: 11px;
}
.tracking-flight-card {
  width: 100%;
  border: 1px solid #e3eae3;
  background: #fff;
  border-radius: 8px;
  padding: 13px;
  text-align: start;
  margin-bottom: 9px;
  transition:
    border-color 0.15s,
    background-color 0.15s;
}
.tracking-flight-card:hover {
  background: #f8fbf5;
  border-color: #a8c0ad;
}
.tracking-flight-card.selected {
  background: #eef5eb;
  border-color: #7fa785;
  box-shadow: inset 3px 0 0 #49734a;
}
.tracking-card-top,
.tracking-card-route,
.tracking-card-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}
.tracking-card-top > strong {
  color: #214e42;
  font-size: 14px;
  overflow-wrap: anywhere;
}
.tracking-card-top > span {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #768476;
  font-size: 9px;
  white-space: nowrap;
}
.tracking-card-route {
  justify-content: flex-start;
  margin-top: 13px;
  font-size: 17px;
  font-weight: 600;
  letter-spacing: 1px;
  color: #3c5d4a;
}
.tracking-card-route svg {
  color: #94a48d;
  flex-shrink: 0;
}
.tracking-card-bottom {
  margin-top: 13px;
  padding-top: 10px;
  border-top: 1px solid #e8eee4;
  font-size: 9px;
  color: #788577;
  flex-wrap: wrap;
}
.tracking-card-bottom > span:last-child {
  display: flex;
  align-items: center;
  gap: 4px;
}
.tracking-card-bottom .old {
  color: #967238;
}
.tracking-limit {
  display: flex;
  gap: 6px;
  font-size: 10px;
  line-height: 1.65;
  color: #8a713e;
  padding: 13px 16px;
  margin: 0;
  background: #fffaed;
  border-top: 1px solid #eee1bd;
}
.tracking-limit svg {
  flex-shrink: 0;
  margin-top: 2px;
}
.tracking-details {
  background: #fff;
  border: 1px solid var(--tracking-line);
  border-radius: 12px;
  margin-top: 24px;
  padding: 23px 26px;
  display: grid;
  grid-template-columns: 200px 1fr 250px;
  gap: 16px 30px;
  align-items: start;
}
.tracking-detail-heading {
  display: flex;
  gap: 15px;
  justify-content: space-between;
  grid-column: 1/-1;
}
.tracking-detail-heading .eyebrow {
  font-size: 9px;
}
.tracking-detail-heading h2 {
  font-size: 27px;
  margin-top: 5px;
}
.tracking-detail-heading .icon-btn {
  min-height: 36px;
  min-width: 36px;
}
.tracking-route {
  display: flex;
  align-items: center;
  gap: 14px;
  font-size: 25px;
  font-weight: 550;
  grid-row: 2;
  grid-column: 1;
}
.tracking-route svg {
  color: #a0b298;
  flex-shrink: 0;
}
.tracking-position-label {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #70836c;
  font-size: 10px;
  grid-column: 1;
  grid-row: 3;
}
.tracking-position-label.old {
  color: #967238;
}
.tracking-metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
  grid-row: 2/4;
  margin: 0;
}
.tracking-metrics div {
  min-width: 0;
}
.tracking-metrics dt {
  font-size: 10px;
  color: #82907f;
  margin-bottom: 6px;
}
.tracking-metrics dd {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: #31593f;
  overflow-wrap: anywhere;
}
.tracking-detail-time {
  display: flex;
  flex-direction: column;
  gap: 4px;
  grid-row: 2/4;
  font-size: 10px;
  color: #7a8972;
  padding-inline-start: 22px;
  border-inline-start: 1px solid #e2e9dd;
}
.tracking-detail-time strong {
  color: #49623d;
  font-size: 12px;
  margin-bottom: 7px;
  font-weight: 500;
}
.tracking-detail-time small {
  font-size: 9px;
}
.tracking-selection-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 22px;
  border: 1px dashed #ccd9cd;
  border-radius: 10px;
  margin-top: 24px;
  color: #7d947d;
}
.tracking-selection-hint p {
  margin: 0;
}
.tracking-selection-hint strong,
.tracking-selection-hint span {
  display: block;
}
.tracking-selection-hint strong {
  font-size: 12px;
  color: #577354;
  margin-bottom: 4px;
}
.tracking-selection-hint span {
  font-size: 11px;
  line-height: 1.7;
}
.tracking-explanation {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 25px 0 0;
  border-top: 1px solid var(--tracking-line);
  padding-top: 20px;
  color: #728073;
}
.tracking-explanation > svg {
  flex-shrink: 0;
}
.tracking-explanation p {
  flex: 1;
  font-size: 11px;
  line-height: 1.7;
}
.tracking-explanation a {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #426d50;
  font-size: 11px;
  flex-shrink: 0;
  min-height: 38px;
}
.tracking-spinning {
  animation: tracking-spin 1.2s linear infinite;
}
@keyframes tracking-spin {
  to {
    transform: rotate(360deg);
  }
}
[dir="rtl"] .tracking-page h1,
[dir="rtl"] .tracking-page h2 {
  letter-spacing: 0;
}
[dir="rtl"] .tracking-flight-card.selected {
  box-shadow: inset -3px 0 0 #49734a;
}
[dir="rtl"] .tracking-route > svg {
  transform: scaleX(-1);
}
@media (max-width: 1050px) {
  .tracking-workspace {
    grid-template-columns: minmax(0, 1fr) 290px;
    gap: 16px;
  }
  .tracking-map-toolbar {
    flex-wrap: wrap;
    gap: 4px;
  }
  .tracking-map {
    height: 475px;
  }
  .tracking-details {
    grid-template-columns: 170px 1fr;
  }
  .tracking-detail-time {
    grid-row: 4;
    grid-column: 1/-1;
    display: grid;
    grid-template-columns: 130px 1fr;
    padding: 16px 0 0;
    border-inline-start: 0;
    border-top: 1px solid var(--tracking-line);
  }
}
@media (max-width: 760px) {
  .tracking-page {
    padding-top: 26px;
  }
  .tracking-heading {
    gap: 16px;
    align-items: start;
  }
  .tracking-heading h1 {
    font-size: 33px;
  }
  .tracking-heading p {
    font-size: 12px;
  }
  .tracking-heading-source {
    display: none;
  }
  .tracking-status {
    padding: 15px;
    margin-bottom: 18px;
  }
  .tracking-status p {
    font-size: 11px;
  }
  .tracking-workspace {
    grid-template-columns: minmax(0, 1fr);
  }
  .tracking-map {
    height: 370px;
  }
  .tracking-map-toolbar {
    min-height: 60px;
    flex-wrap: nowrap;
    padding: 11px 13px;
  }
  .tracking-map-toolbar > div {
    font-size: 11px;
    gap: 6px;
  }
  .tracking-map-toolbar .text-link {
    font-size: 10px;
  }
  .tracking-update-bar {
    padding: 12px;
  }
  .tracking-update-bar > span {
    width: 100%;
  }
  .tracking-update-bar > div {
    width: 100%;
  }
  .tracking-update-bar .btn {
    flex: 1;
    min-height: 42px;
  }
  .tracking-list-heading {
    padding: 18px 18px 13px;
  }
  .tracking-list-heading h2 {
    font-size: 23px;
  }
  .tracking-filter-tabs button {
    font-size: 11px;
    min-height: 40px;
  }
  .tracking-search input {
    font-size: 16px;
  }
  .tracking-flight-list {
    max-height: 440px;
  }
  .tracking-card-bottom {
    font-size: 10px;
  }
  .tracking-empty {
    min-height: 180px;
  }
  .tracking-details {
    grid-template-columns: minmax(0, 1fr);
    padding: 20px;
    gap: 16px;
  }
  .tracking-route {
    grid-row: auto;
    grid-column: auto;
  }
  .tracking-position-label {
    grid-row: auto;
    grid-column: auto;
  }
  .tracking-metrics {
    grid-row: auto;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .tracking-detail-time {
    grid-row: auto;
  }
  .tracking-explanation {
    flex-wrap: wrap;
    align-items: flex-start;
    gap: 9px;
  }
  .tracking-explanation p {
    margin: 0;
  }
  .tracking-explanation a {
    width: 100%;
    padding-inline-start: 29px;
  }
  [dir="rtl"] .tracking-heading h1 {
    font-size: 35px;
    line-height: 1.4;
  }
  [dir="rtl"] .tracking-map-toolbar {
    flex-wrap: wrap;
  }
}
@media (prefers-reduced-motion: reduce) {
  .tracking-spinning {
    animation: none;
  }
}
.tracking-area-notice {
  border-top: 1px solid currentColor;
  border-color: #b8cfc133;
  padding-top: 8px;
}
.tracking-license {
  display: inline-block;
  margin-inline-start: 16px;
}
.tracking-route.tracking-route-unknown,
.tracking-card-route.tracking-route-unknown {
  color: #718276;
  font-size: 12px;
  font-weight: 400;
  letter-spacing: 0;
  line-height: 1.6;
}
.tracking-route.tracking-route-unknown {
  margin: 0;
}
@media (max-width: 760px) {
  .tracking-license {
    display: block;
    margin-inline-start: 0;
    margin-top: 6px;
  }
}

.tracking-research-credit {
  font-size: 11px;
  line-height: 1.6;
  color: #52685f;
  margin: 8px 0;
}
.tracking-research-credit span {
  display: block;
}

```

## frontend/tailwind.config.js

```javascript
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: { extend: { colors: { brand: "#2466df" } } },
  plugins: [],
};

```

## frontend/vite.config.js

```javascript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({
  plugins: [react()],
  server: {
    host: "127.0.0.1",
    port: 3102,
    strictPort: true,
    proxy: { "/api": { target: "http://127.0.0.1:4102", changeOrigin: false } },
  },
  preview: {
    port: 3102,
    proxy: { "/api": { target: "http://127.0.0.1:4102", changeOrigin: false } },
  },
});

```

## Oujda-Smart.code-workspace

```text
{
  "folders": [{ "path": "." }],
  "settings": { "editor.tabSize": 2, "files.exclude": { "**/node_modules": true, "**/.data": true, "**/dist": true } },
  "extensions": { "recommendations": ["esbenp.prettier-vscode", "bradlc.vscode-tailwindcss"] },
  "tasks": {
    "version": "2.0.0",
    "tasks": [
      { "label": "Backend : démarrer", "type": "shell", "command": "npm run dev", "options": { "cwd": "${workspaceFolder}/backend" }, "isBackground": true, "problemMatcher": [] },
      { "label": "Frontend : démarrer", "type": "shell", "command": "npm run dev", "options": { "cwd": "${workspaceFolder}/frontend" }, "isBackground": true, "problemMatcher": [] },
      { "label": "Backend : tester", "type": "shell", "command": "npm test", "options": { "cwd": "${workspaceFolder}/backend" }, "problemMatcher": [] },
      { "label": "Frontend : compiler", "type": "shell", "command": "npm run build", "options": { "cwd": "${workspaceFolder}/frontend" }, "problemMatcher": [] }
    ]
  }
}

```


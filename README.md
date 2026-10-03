# Kerstens Media & Presentatie – compleet pakket

Dit pakket is gecontroleerd: alle lokale verwijzingen in index.html bestaan daadwerkelijk.

Upload ALLE bestanden uit deze map tegelijk naar de hoofdmap van je GitHub-repository.
De video is al gecomprimeerd tot onder de limiet van 25 MB.

Na Commit changes zal Vercel automatisch opnieuw deployen.

Belangrijk:
- verwijder of vervang de oude index.html en style.css
- zorg dat alle media exact deze bestandsnamen behouden
- alle bestanden staan in de hoofdmap; er is geen images-map nodig


## SEO en bezoekersmeting (3 oktober 2026)

- Tien openbare pagina's in sitemap.xml; de oude alternatieve homepage is noindex met de echte homepage als canonical.
- Dienstenpagina's bevatten gerichte teksten, boekingsvragen, onderlinge links, Service/WebPage/Breadcrumb-schema en deelmetadata. Geen verzonnen reviews, prijzen of beschikbaarheid.
- Afbeeldingen hebben intrinsieke afmetingen; beelden lager op de pagina worden uitgesteld geladen. Mobiele navigatie is beschikbaar via Menu.
- Apart GA4-account: Kerstens Media & Presentatie. Webstream 15996946266, meet-ID G-MMSSSW1LGY. Enhanced Measurement staat uit.
- analytics.js laadt Google uitsluitend na toestemming op www.kerstensmediaenpresentatie.nl. Meet page_view, contact_page_click, contact_click en demo_play. Querystrings, hashes, mailinhoud en formulierwaarden worden niet verzonden. Een contact_click betekent geen ontvangen aanvraag of bevestigde boeking.
- Cookiekeuze is maximaal 180 dagen geldig en kan in de footer worden ingetrokken. Geen Clarity toegevoegd.
- Search Console gebruikt de bestaande domeinproperty kerstensmediaenpresentatie.nl. Nulmeting in het rapport van 3 oktober: afgelopen 3 maanden 10 klikken, 81 vertoningen, 12,3% CTR; getoonde data 6–29 september. Dit is geen garantie op toekomstige posities.

Controle voor publicatie: `python check-seo.py` en `node --test analytics.test.mjs`. Beoordeel ook een dienstenpagina en contactpagina op desktop en mobiel. GitHub main wordt door de bestaande Vercel-koppeling gepubliceerd.

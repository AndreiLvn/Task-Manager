# Task Manager App

## Link publicare aplicație

https://task-manager-three-fawn.vercel.app/

## 1. Introducere

Odată cu creșterea volumului de activități și sarcini pe care oamenii trebuie să le gestioneze zilnic, nevoia de organizare eficientă a timpului a devenit o prioritate. În special în contextul în care mulți utilizatori, fie ei studenți, angajați sau freelanceri, jonglează între multiple responsabilități, o soluție digitală care să îi ajute să țină evidența taskurilor devine indispensabilă.

Aplicația „Task Manager” a fost dezvoltată cu scopul de a oferi o platformă simplă, intuitivă și eficientă pentru gestionarea sarcinilor personale sau profesionale. Prin intermediul acestei aplicații, utilizatorii își pot crea taskuri personalizate, pot seta termene limită și pot adăuga remindere automate pentru a nu uita de activitățile importante. În plus, aplicația oferă și opțiunea de a atașa fișiere relevante fiecărui task, facilitând astfel centralizarea informațiilor și documentelor necesare.

Aplicația este organizată în două componente principale: frontend-ul, realizat în React, care oferă o interfață modernă și responsive, și backend-ul, dezvoltat cu Node.js și Express, ce gestionează toate operațiile de tip API, inclusiv conectarea la baza de date MongoDB. Pentru trimiterea notificărilor pe email este utilizat serviciul MailerSend, iar fișierele încărcate sunt stocate în Cloudinary.

Proiectul a fost gândit astfel încât să poată fi extins cu ușurință pe viitor, oferind o arhitectură modulară, cu rute protejate și funcționalități CRUD bine delimitate. În plus, aplicația este complet funcțională și a fost publicată online prin intermediul platformei Vercel.

„Task Manager” nu este doar un instrument util pentru gestionarea sarcinilor, ci și un exemplu practic de aplicație web modernă, dezvoltată end-to-end, care pune accent pe experiența utilizatorului, performanță și siguranța datelor.

## 2. Descrierea problemei

În prezent, mulți utilizatori se confruntă cu dificultăți în organizarea eficientă a activităților zilnice. Lipsa unui sistem clar pentru prioritizarea sarcinilor, termene limită ratate sau uitarea unor taskuri importante sunt probleme frecvente, în special în mediile academice și profesionale.

Majoritatea utilizatorilor apelează fie la metode clasice, precum agende sau notițe pe hârtie, fie la aplicații complexe, greu de utilizat și supraîncărcate cu funcționalități. Aceste soluții fie nu oferă o experiență digitală coerentă și accesibilă, fie nu acoperă nevoia de notificări automate și centralizare a informațiilor.

Problema principală identificată este lipsa unui instrument simplu, intuitiv și accesibil care să permită:

- Crearea și gestionarea rapidă a taskurilor;
- Setarea unor remindere automate înainte de termenul limită;
- Vizualizarea centralizată a sarcinilor și fișierelor aferente;
- Autentificare securizată și recuperare parolă în caz de nevoie.

Aplicația „Task Manager” răspunde exact acestei nevoi, oferind o soluție modernă, ușor de folosit și accesibilă de pe orice dispozitiv, eliminând riscurile uitării taskurilor și contribuind semnificativ la creșterea productivității.

## 3. Descriere API

Aplicația include un API REST complet, dezvoltat în Node.js folosind Express, care permite comunicarea cu baza de date MongoDB și implementarea funcționalităților backend pentru autentificare, gestionarea taskurilor, atașamente și remindere automate.

Principalele endpoint-uri:

- `POST /api/users/register` – Înregistrare utilizator
- `POST /api/users/login` – Autentificare utilizator
- `GET /api/users/profile` – Afișare date cont (protecție prin token)
- `PUT /api/users/profile` – Editare date cont (nume, email, parolă)
- `POST /api/users/forgot-password` – Trimitere email resetare parolă
- `POST /api/users/reset-password/:token` – Salvare parolă nouă
- `GET /api/tasks` – Afișare toate taskurile utilizatorului
- `POST /api/tasks` – Creare task nou
- `PUT /api/tasks/:id` – Editare task
- `DELETE /api/tasks/:id` – Ștergere task
- `POST /api/tasks/:id/upload` – Upload fișier atașat
- `DELETE /api/tasks/:id/attachments/:publicId` – Ștergere fișier

## 4. Flux de date

Aplicația este structurată pe baza unei arhitecturi client-server. Frontend-ul trimite cereri HTTP către server (backend), care le procesează și interacționează cu baza de date MongoDB. În același timp, sistemul de remindere este configurat să trimită emailuri automat, în funcție de termenele limită ale taskurilor.

### Metode HTTP

Metodele HTTP folosite sunt:

- **GET** – pentru obținerea datelor (ex. toate taskurile, detalii cont)
- **POST** – pentru creare de resurse (ex. task nou, înregistrare, resetare)
- **PUT** – pentru actualizarea resurselor (ex. modificare task sau cont)
- **DELETE** – pentru ștergerea resurselor (ex. taskuri sau fișiere)

Exemplu real din aplicație (`taskRoutes.js`):

```js
router.route("/").get(protect, getTasks).post(protect, createTask);
```

Metoda `GET /tasks` returnează toate taskurile unui utilizator, iar `POST /tasks` creează unul nou.

Pentru resetarea parolei:

```js
router.post("/reset-password/:token", resetPassword);
```

## 5. Referințe

- Documentație oficială React: https://react.dev/
- Express.js: https://expressjs.com/
- MongoDB Atlas: https://www.mongodb.com/atlas
- MailerSend: https://developers.mailersend.com/
- Cloudinary: https://cloudinary.com/
- Node-cron: https://www.npmjs.com/package/node-cron
- Platforma Vercel: https://vercel.com

## Configurare .env

Pentru ca aplicația să funcționeze corect, trebuie să adaugi un fișier `.env` în directorul rădăcină al backend-ului. Acesta trebuie să conțină următoarele valori personalizate:

```
JWT_SECRET=cheia_ta_secreta
MONGODB_URI=stringul_tău_de_conectare_la_MongoDB
MAILERSEND_API_KEY=cheia_ta_de_la_mailersend
CLOUDINARY_CLOUD_NAME=numele_tău_cloudinary
CLOUDINARY_API_KEY=cheia_ta_cloudinary
CLOUDINARY_API_SECRET=secretul_tău_cloudinary
```

Asigură-te că aceste date sunt corecte pentru a permite funcționarea completă a autentificării, trimiterii de emailuri și încărcării de fișiere.

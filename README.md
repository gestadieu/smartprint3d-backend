# SmartPrint3D.io

Backend for the SmartPrint3D.io application and reserarch project

- [x] Pre-survey form
- [x] API
- [x] use Google API for google-spreadsheet
- [x] QR Code generator on order
- [x] use mongodb/mongoose instead of nedb
- [x] Integration with the _shop_
- [x] form validation (required fields and basic validation in mongoose schema)
- [ ] adminbro
- [ ] Post-survey form
- [ ] API to access the post-survey with QRCode
- [ ] Send email to smartprint3d.io@gmail.com upon order validation
- [ ] if QRCode is scanned: test if the status == PRINTED then show post-survey
- [ ] Post-survey: display order information as well
- [ ] Tests and security
- [ ] SSL for API

Installation

```javascript
npm install
```

Run dev mode

```javascript
npm run dev
```

then you can connect to [localhost:8082!](http://localhost:8082/)

Resources
https https://stackoverflow.com/questions/5998694/how-to-create-an-https-server-in-node-js
openssl genrsa -out client-key.pem 2048
openssl req -new -key client-key.pem -out client.csr
openssl x509 -req -in client.csr -signkey client-key.pem -out client-cert.pem

https://medium.com/swlh/jwt-authentication-authorization-in-nodejs-express-mongodb-rest-apis-2019-ad14ec818122

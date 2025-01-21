 ![Site Layout](https://github.com/horodylova/special-leter-backend/raw/main/public/Site_Layout.jpg)

**first start**

npm run setup-dbs
npm run seed

**next start**
npm start 
npm run dev

**with sql**

psql -U postgres -d special_letter 
psql -U postgres -d test_special_letter
\d 
\d users
\q

**with Postman**

GET http://localhost:3001/api/auth/login
POST http://localhost:3001/api/auth/register
POST http://localhost:3001/api/auth/logout
Authorization: Bearer your_jwt_token

**with port**

lsof -i :3001
kill -9 


swagger https://app.swaggerhub.com/apis/SvitlanaHorodylova/Special_Letter/1.0.0 

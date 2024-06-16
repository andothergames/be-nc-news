## Northcoders News API

### <img src="https://github.com/andothergames/stars/blob/main/starss/star3.png?raw=true?" width="16"> What is this Article Feed Project?

This project was developed whilst studying software development at Northcoders. It is an API used to programmatically access app data. Technologies used include Express, Postgres, SQL and TDD in Jest and Supertest.

I hosted the site using Supabase and Render, feel free to [have a look](https://article-feed.onrender.com/api)! :frog:

---

### How can I play around with my own version of the repo?

<img src="https://github.com/andothergames/stars/blob/main/starss/star12.png?raw=true?" width="16"> Clone the repo

`git clone https://github.com/andothergames/be-nc-news.git`


<img src="https://github.com/andothergames/stars/blob/main/starss/star7.png?raw=true?" width="16"> Install dependencies

`npm i`


<img src="https://github.com/andothergames/stars/blob/main/starss/star1.png?raw=true?" width="16"> Create .env files in the root folder

`echo PGDATABASE=nc_news > .env.development`

`echo PGDATABASE=nc_news_test > .env.test`


<img src="https://github.com/andothergames/stars/blob/main/starss/star17.png?raw=true?" width="16"> Set up and seed databases

`npm run setup-dbs`

`npm run seed`

---

<img src="https://github.com/andothergames/stars/blob/main/starss/star8.png?raw=true?" width="16"> Testing

For testing using Jest:

`npm run test`


--- 

<img src="https://github.com/andothergames/stars/blob/main/starss/star2.png?raw=true?" width="14"> Versions

This project was built with:
Node.js: v.21.7.0
Postgres: v14.11


--- 

##### This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)

# Blogful Api

### Steps to get Setup
- First step is to create the database, make sure you have postgres installed on your machine, then start the psql server and create the database. 
- Create a database named blogful `createdb -U [your-username] blogful`
- Run `npm i` to install all dependencies
- Run `npm migrate` to get the database setup to the latest version. 
- Run `psql -U [your-username] -d blogful -f ./seeds/seed.blogful_articles.sql` to seed data for the blogful articles table. If ran successfully it should insert 10 rows.
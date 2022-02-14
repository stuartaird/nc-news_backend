# NC NEWS API

## Summary

A simple API for serving news articles and their associated comments & votes. Built in JS using the MVC pattern and Express for middleware, the API uses Postgres for data storage. A hosted copy of the API can be found here: https://sa-nc-news.herokuapp.com/api

<br />

---

<br />

## Setup Instructions

<br />

> ### Cloning the Repo
>
> To clone the repo simply run:-
>
> `git clone https://github.com/stuartaird/nc-news_backend.git`

<br />

> ### Installing JS Module Dependencies
>
> Assuming the use of npm as your package manager of choice, run the following to install all JS dependencies:-
>
> - `npm install` to install only what's required to run the API locally
> - `npm install -D` to install all developer dependencies (if you're interested in running the associated Jest test files)
>   If you're using yarn or another package manager, please refer to its own documentation.

<br />

> ### Minimum Requirements
>
> The API was built with the following software versions. While earlier versions may work, please consider these as the minimum requirements.
>
> - node: 16.6.0 (LTS)
> - postgres: 13.5\
>   <br /> > **Node Modules (npm) :-** > _ cors: ^2.8.5
>   _ dotenv: ^10.0.0
>   _ express: ^4.17.1
>   _ lodash.clonedeep: ^4.5.0
>   _ pg: ^8.7.1
>   _ pg-format: ^1.0.4
>
> For a list of the dev dependencies, please review the package.json.

<br />

> ### Environment Files
>
> One of two .env files will be required to run any of the Postgres setup scripts (details below).
>
> Testing: .env.test
> Containing: `PGDATABASE=nc_news_test`
>
> Development: .env.development
> Contaiing: `PGDATABASE=nc_news`
>
> In either case, the .env file should be placed in the db folder.

<br />

---

<br />

## npm Scripts

<br />

> The following scripts are available for use:-
>
> - `setup-dbs` \* will create the psql databases (defined in the .env files) ready for the seed script to populate them.
> - `seed` & `seed:test` \* will populate their respective databases with sample data
>   - `testenv`
>     - will set the node_env variable to test (triggering the use of psql's test db), start the api and begin listening on port 9090
>   - `devenv`
>     - will start the api and begin listening on port 9090 (.env will default to dev mode unless specified with the `testenv` script)
>   - `test`
>     - will run both app & util test files in Jest

<br />

---

<br />

## Further Development

The following endpoints are supplimental and will be released in the future:-

- `DELETE /api/comments/:comment_id`
  - to allow authorised users to delete their own comments
- `GET /api/users`
  - serves a list of configured usernames
- `GET /api/users/:username`
  - serves details on a specific user including username, name and avatar_url
- `POST /api/articles`
  - to allow authorised users to post new articles
- `DELETE /api/articles/:article_id`
  - to allow authorised users to delete specific articles
- `post /api/topics`
  - to allow authorised users to add new topics to the database
- `delete /api/topics/:topic_id`
  - to allow authorised users to remove specific topics from the database

<br />
<hr />

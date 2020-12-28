# Mr Men News Backend

- API created for my Mr Men News site. Has Appropriate error handling and is tested with [Jest](https://jestjs.io).
- Created using an [express](http://expressjs.com) server and [Knex](https://knexjs.org) to interact with a [PSQL](https://www.postgresql.org) database.
- The api is hosted [here](https://nc-news-api-br.herokuapp.com/api) using [Heroku](https://www.heroku.com)

[Click here](https://mr-men-news.netlify.app) to see the **hosted** version of the full stack app.

[Click here](https://github.com/bellaroyle/Mr-Men-News-Frontend) to see the **frontend code** for this project

## The Database

---

This is the schema of the tables in my database:

Each topic has:

- `slug` field which is a unique string that acts as the table's primary key
- `description` field which is a string giving a brief description of a given topic

Each user has:

- `username` which is the primary key & unique
- `avatar_url`
- `name`

Each article has:

- `article_id` which is the primary key
- `title`
- `body`
- `votes` defaults to 0
- `topic` field which references the slug in the topics table
- `author` field that references a user's primary key (username)
- `created_at` defaults to the current timestamp

Each comment has:

- `comment_id` which is the primary key
- `author` field that references a user's primary key (username)
- `article_id` field that references an article's primary key
- `votes` defaults to 0
- `created_at` defaults to the current timestamp
- `body`

## Available Endpoints

---

### /api

GET

- Serves a json representation of all the available endpoints of the api

### /api/topics

GET

- Serves an array of all topics.
- example response

```
{
  "topics": [{
    "slug": "football",
    "description": "Footie!"
  }]
}
```

### /api/users

POST

- Adds a user, serves the added user
- Example request body:

```
{
  "name": "user-1",
  "username": "username"
}
```

- Example response

```
{
 "user": {
   "name": "user-1",
   "username": "username",
   "avatar-url": "null"
  }
}
```

### /api/users/:username

GET

- Serves an object with the given usernames data
- Example response:

```
{
  "user": {
    "username": "username",
    "name": "user-1",
    "avatar-url": "https://avatar.img"
  }
}
```

### /api/articles

GET

- Serves an array of all articles
- Acceptable queries:
  - Filters:
    - `author={username}` to return only articles by a certain user
    - `topic={topic_slug}` to return only articles of a certain topic
    - `limit={integer}` to limit the number of articles returned
    - `p={integer}` to navigate to a page number
  - Ordering: -`sort_by={author/title/article_id/topic/created_at/votes/comment_count}` to sort the articles any order you want
    - `order={asc/desc}` to sort the articles in ascending or descending order
- Example response:

```
{
  "articles": [
    {
      "title": "Seafood substitutions are increasing",
      "topic": "cooking",
      "author": "weegembump",
      "body": "Text from the article..",
      "created_at": "2018-05-30T15:59:13.341Z"
    }
  ]
}
```

### /api/articles/:article_id

GET

- Serves an object containing the article that matches article_id
- Example response:

```
{
  "article": {
    "article_id": 1,
    "title": "article-1",
    "author": "author-username",
    "body": "Text from the article...",
    "topic": "article-topic",
    "created_at": "2018-05-30T15:59:13.341Z",
    "votes": 25,
    "comment_count": 9
  }
}
```

PATCH

- Updates the votes on the article that matches article_id, by amount passed as the body of the request. Serves an object containing the updated article
- Example request body

```
{
      "inc_votes": 5
}
```

- Example response:

```
{
  "article": {
    "article_id": 1,
    "title": "article-1",
    "author": "author-username",
    "body": "Text from the article...",
    "topic": "article-topic",
    "created_at": "2018-05-30T15:59:13.341Z",
    "votes": 30,
    "comment_count": 9
  }
}
```

### api/articles/:article_id/comments

GET

- Serves an array containing the comment objects associated with the article that matches article_id
- Acceptable queries:
  - Filters:
    - `limit={integer}` to limit the number of comments returned
    - `p={integer}` to navigate to a page number of the comments
  - Ordering:
    - `sort_by={comment_id/author/votes/created_at/body}` to sort the comments any order you want
    - `order={asc/desc}` to sort the comments in ascending or descending order
- Example response:

```
{
  "comments": [
    {
      "comment_id": 1,
      "author": "author-username",
      "votes": 0,
      "created_at": "2018-05-30T15:59:13.341Z",
      "body": "Text from the comment..."
    }
  ]
}
```

POST

- Adds a comment to the article that matches article_id, serves an object containing the added comment
- Request example body:

```
{
  "username": "user-1",
  "body": "Text from the comment..."
}
```

- Example response:

```
{
 "comment": {
    "comment_id": 20,
    "author": "author-username",
    "article_id": 1,
    "votes": 0,
    "created_at": "2018-05-30T15:59:13.341Z",
    "body": "Text from the comment..."
  }
}
```

### /api/comments/:comment_id

GET

- Serves an object containing the comment that matches comment_id
- Example response:

```
{
  "comment": {
    "comment_id": 1,
    "author": "author-username",
    "votes": 0,
    "created_at": "2018-05-30T15:59:13.341Z",
    "body": "Text from the comment..."
  }
}
```

PATCH

- Updates the votes on the comment that matches comment_id, by amount passed as the body of the request, serves an object containing the updated comment
- Example request body:

```
{
  "inc_votes": 5
}
```

- Example response:

```
{
  "comment": {
    "comment_id": 1,
    "author": "author-username",
    "votes": 10,
    "created_at": "2018-05-30T15:59:13.341Z"
    "body": "Text from the comment..."
  }
}
```

DELETE

- Deletes the comment that matches comment_id

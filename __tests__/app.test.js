process.env.NODE_ENV = "test"
const app = require("../app")
const request = require("supertest")
const connection = require("../connection")


describe('/api', () => {
    afterAll(() => { return connection.destroy() })

    beforeEach(() => { return connection.seed.run() })

    test("GET -- 200 -- responds with a JSON object describing all available endpoints", () => {
        return request(app)
            .get("/api")
            .expect(200)
            .then(({ body: { endpoints } }) => {
                expect(typeof JSON.parse(endpoints)).toBe('object');
            });
    });

    describe('./api/topics', () => {
        test('GET -- 200 -- responds with all topics ', () => {
            return request(app)
                .get('/api/topics')
                .expect(200)
                .then(({ body }) => {
                    expect(body).toMatchObject({
                        topics: [
                            { slug: 'mitch', description: 'The man, the Mitch, the legend' },
                            { slug: 'cats', description: 'Not dogs' },
                            { slug: 'paper', description: 'what books are made of' }
                        ]
                    })
                })
        })
        test('GET -- 405 "Invalid Method"', () => {
            const invalidMethods = ['post', 'patch', 'delete', 'put'];
            const requestPromises = invalidMethods.map((method) => {
                return request(app)
                [method]('/api/topics')
                    .expect(405)
                    .then(({ body }) => {
                        expect(body.msg).toBe('Invalid Method')
                    });
            });
            return Promise.all(requestPromises);
        });
    })

    describe('./api/users/:username', () => {
        test('GET -- 200 -- responds with the user', () => {
            return request(app)
                .get('/api/users/butter_bridge')
                .expect(200)
                .then(({ body }) => {
                    expect(body).toMatchObject({
                        user: {
                            username: 'butter_bridge',
                            avatar_url: 'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg',
                            name: 'jonny'
                        }
                    })
                })
        });
        test('GET -- 404 "User Not Found" -- if given a username that does not exist', () => {
            return request(app)
                .get('/api/users/myUsername123')
                .expect(404)
                .then(({ body }) => {
                    expect(body).toMatchObject({ msg: 'User Not Found' })
                })
        });
        test('GET -- 405 "Invalid Method" -- invalid methods', () => {
            const invalidMethods = ['post', 'patch', 'delete', 'put'];
            const requestPromises = invalidMethods.map((method) => {
                return request(app)
                [method]('/api/users/:username')
                    .expect(405)
                    .then(({ body }) => {
                        expect(body.msg).toBe('Invalid Method')
                    });
            });
            return Promise.all(requestPromises);
        });
    });


    describe('./api/articles', () => {
        describe('GET methods', () => {
            describe('happy path', () => {
                test('200 -- responds with array of articles with the correct properties', () => {
                    return request(app)
                        .get('/api/articles')
                        .expect(200)
                        .then(({ body: { articles } }) => {
                            expect(Object.keys(articles[0])).toEqual(expect.arrayContaining([
                                'author',
                                'title',
                                'article_id',
                                'topic',
                                'created_at',
                                'votes',
                                'comment_count'
                            ]))
                            //expect(articles[0].author).toBe("butter_bridge")
                        })
                });
                test('200 -- responds with articles sorted by created_at, in descending order as a default', () => {
                    return request(app)
                        .get('/api/articles')
                        .expect(200)
                        .then(({ body: { articles } }) => {
                            expect(articles).toBeSortedBy('created_at', { descending: true })
                        })
                });
                test('200 -- responds with articles sorted by any valid column that is queried,(in desc order as a default)', () => {
                    const columnToSortBy = [
                        'author',
                        'title',
                        'article_id',
                        'topic',
                        'created_at',
                        'votes',
                        'comment_count'
                    ]
                    const sortPromises = columnToSortBy.map(column => {
                        return request(app)
                            .get(`/api/articles?sort_by=${column}`)
                            .expect(200)
                            .then(({ body }) => {

                                expect(body.articles).toBeSortedBy(column, { descending: true, coerce: true })
                            })
                    })
                    return Promise.all(sortPromises)
                });
                test('200 -- responds with articles sorted by any valid column that is queried, sorted in ascending order', () => {
                    const columnToSortBy = [
                        'author',
                        'title',
                        'article_id',
                        'topic',
                        'created_at',
                        'votes',
                        'comment_count'
                    ]
                    const sortPromises = columnToSortBy.map(column => {
                        return request(app)
                            .get(`/api/articles?sort_by=${column}&order=asc`)
                            .expect(200)
                            .then(({ body }) => {

                                expect(body.articles).toBeSortedBy(column, { descending: false, coerce: true })
                            })
                    })
                    return Promise.all(sortPromises)
                });
                test('200 -- accepts articles query, responds with articles filtered by the author value specified in the query', () => {
                    return request(app)
                        .get('/api/articles?author=butter_bridge')
                        .expect(200)
                        .then(({ body: { articles } }) => {
                            const allByAuthor = articles.every(article => {
                                return article.author === 'butter_bridge'
                            })
                            expect(allByAuthor).toBe(true)
                        })
                });
                test('200 -- accepts topic query, responds with articles filtered by the topic value specified in the query', () => {
                    return request(app)
                        .get('/api/articles?topic=mitch')
                        .expect(200)
                        .then(({ body: { articles } }) => {
                            const allByTopic = articles.every(article => {
                                return article.topic === 'mitch'
                            })
                            expect(allByTopic).toBe(true)
                        })
                });
                test('200 -- limits number of articles to 10 as a default', () => {
                    return request(app)
                        .get('/api/articles')
                        .expect(200)
                        .then(({ body: { articles } }) => {
                            expect(articles.length).toBeLessThanOrEqual(10)
                        })
                });
                test('200 -- limits number of articles by number (<10) given in query', () => {
                    return request(app)
                        .get('/api/articles?limit=5')
                        .expect(200)
                        .then(({ body: { articles } }) => {
                            expect(articles.length).toBeLessThanOrEqual(5)
                        })
                });
                test('200 -- limits number of articles by number (>10) given in query', () => {
                    return request(app)
                        .get('/api/articles?limit=11')
                        .expect(200)
                        .then(({ body: { articles } }) => {
                            expect(articles.length).toBeLessThanOrEqual(11)
                        })
                });
                test('200 -- accepts p query which specifies at which page to start if no limit given', () => {
                    return request(app)
                        .get('/api/articles?p=2')
                        .expect(200)
                        .then(({ body: { articles } }) => {
                            const articlesFromP2 = articles.every(article => {
                                return article.article_id <= 20 && article.article_id > 10
                            })
                            expect(articlesFromP2).toBe(true)
                        })
                });
                test('200 -- accepts p query which specifies at which page to start if limit given', () => {
                    return request(app)
                        .get('/api/articles?limit=5&p=2')
                        .expect(200)
                        .then(({ body: { articles } }) => {
                            const articlesFromP2 = articles.every(article => {
                                return article.article_id <= 10 && article.article_id > 5
                            })
                            expect(articlesFromP2).toBe(true)
                        })
                });
                test('200 -- able to handle all potential queries together', () => {
                    return request(app)
                        .get('/api/articles?sort_by=article_id&order=asc&author=rogersop&topic=mitch&limit=1&p=2')
                        .expect(200)
                        .then(({ body: { articles } }) => {
                            const allByTopic = articles.every(article => {
                                return article.topic === 'mitch'
                            })
                            const allByAuthor = articles.every(article => {
                                return article.author === 'rogersop'
                            })
                            expect(articles).toBeSortedBy('article_id', { descending: false })
                            expect(allByTopic).toBe(true)
                            expect(allByAuthor).toBe(true)
                            expect(articles.length).toBeLessThanOrEqual(1)
                            expect(articles[0].article_id).toBe(10)
                        })
                });

            });

            describe('unhappy path', () => {
                test('400 "Bad Request" -- if trying to sort by column that doesn\'t exist', () => {
                    return request(app)
                        .get('/api/articles?sort_by=notAColumn')
                        .expect(400)
                        .then(({ body }) => {
                            expect(body).toEqual({ msg: "Bad Request" })
                        })
                });
                test('400 "Bad Request" -- if order is not asc or desc', () => {
                    return request(app)
                        .get('/api/articles?order=random')
                        .expect(400)
                        .then(({ body }) => {
                            expect(body).toEqual({ msg: "Bad Request" })
                        })
                });
                test('404 "Author not found" -- username passed to author query does not exist', () => {
                    return request(app)
                        .get('/api/articles?author=fake_username')
                        .expect(404)
                        .then(({ body: { msg } }) => {
                            expect(msg).toBe('Author not found')
                        })
                });
                test('200 -- responds with empty array if author has no articles but is a valid username', () => {
                    return request(app)
                        .get('/api/articles?author=lurker')
                        .expect(200)
                        .then(({ body: { articles } }) => {
                            expect(articles).toEqual([])
                        })
                });
                test('404 "Topic not found" -- username passed to topic query does not exist', () => {
                    return request(app)
                        .get('/api/articles?topic=fake_topic')
                        .expect(404)
                        .then(({ body: { msg } }) => {
                            expect(msg).toBe('Topic not found')
                        })
                });
                test('200 -- responds with empty array if there is no article with queried topic but it is a valid topic', () => {
                    return request(app)
                        .get('/api/articles?topic=paper')
                        .expect(200)
                        .then(({ body: { articles } }) => {
                            expect(articles).toEqual([])
                        })
                });
                //?? do we want bad req instead? 
                test('200 -- limit is not a number then limited to 10', () => {
                    return request(app)
                        .get('/api/articles?limit=seven')
                        .expect(200)
                        .then(({ body: { articles } }) => {
                            expect(articles.length).toBeLessThanOrEqual(10)
                        })
                });
                //???? do we want 400 instead?
                test('200 -- page not a number then is ignored and first page is returned', () => {
                    return request(app)
                        .get('/api/articles?p=seven')
                        .expect(200)
                        .then(({ body: { articles } }) => {
                            expect(articles[0].article_id).toBe(1)
                        })
                });
            });

        });

        describe('invalid method', () => {
            test('405 "Invalid Method"', () => {
                const invalidMethods = ['post', 'patch', 'delete', 'put'];
                const requestPromises = invalidMethods.map((method) => {
                    return request(app)
                    [method]('/api/articles')
                        .expect(405)
                        .then(({ body }) => {
                            expect(body.msg).toBe('Invalid Method')
                        });
                });
                return Promise.all(requestPromises);
            });
        });

        describe('./api/articles/:article_id', () => {

            describe('GET methods', () => {
                test('200 -- responds with the article with a comment_count', () => {
                    return request(app)
                        .get('/api/articles/1')
                        .expect(200)
                        .then(({ body }) => {
                            expect(body).toMatchObject({
                                article: {
                                    article_id: 1,
                                    title: 'Living in the shadow of a great man',
                                    body: 'I find this existence challenging',
                                    votes: 100,
                                    topic: 'mitch',
                                    author: 'butter_bridge',
                                    created_at: '2018-11-15T12:21:54.171Z',
                                    comment_count: '13'
                                }
                            })
                        })
                });
            })

            describe('PATCH methods', () => {
                test('202 -- responds with the article with incremented votes', () => {
                    return request(app)
                        .patch('/api/articles/1')
                        .send({ inc_votes: 5 })
                        .expect(202)
                        .then(({ body }) => {
                            expect(body).toMatchObject({
                                article: {
                                    article_id: 1,
                                    title: 'Living in the shadow of a great man',
                                    body: 'I find this existence challenging',
                                    votes: 105,
                                    topic: 'mitch',
                                    author: 'butter_bridge',
                                    created_at: '2018-11-15T12:21:54.171Z'
                                }
                            })
                        })
                });
                test('202 -- responds with the article with decremented votes', () => {
                    return request(app)
                        .patch('/api/articles/1')
                        .send({ inc_votes: -5 })
                        .expect(202)
                        .then(({ body }) => {
                            expect(body).toMatchObject({
                                article: {
                                    article_id: 1,
                                    title: 'Living in the shadow of a great man',
                                    body: 'I find this existence challenging',
                                    votes: 95,
                                    topic: 'mitch',
                                    author: 'butter_bridge',
                                    created_at: '2018-11-15T12:21:54.171Z'
                                }
                            });
                        });
                });
                test('400 "Bad Request" -- if inc_votes is not an number ', () => {
                    return request(app)
                        .patch('/api/articles/1')
                        .send({ inc_votes: 'not a number' })
                        .expect(400)
                        .then(({ body }) => {
                            expect(body).toMatchObject({ msg: "Bad Request" })
                        });
                })
                test('400 "Bad Request" -- if passed object with key anything but inc_votes', () => {
                    const propertiesToUpdate = [
                        { article_id: 5900 },
                        { title: 'newTitle' },
                        { body: 'newBody' },
                        { topic: 'FAKE NEWS' },
                        { author: 'user123' },
                        { created_at: 'now' }
                    ]
                    const propertiesPromises = propertiesToUpdate.map((property) => {
                        return request(app)
                            .patch('/api/articles/1')
                            .send(property)
                            .expect(400)
                            .then(({ body }) => {
                                expect(body).toEqual({ msg: "Bad Request" })
                            })
                    })
                    return Promise.all(propertiesPromises)

                });
            });

            describe('invalid article_id or method', () => {
                test('GET, PATCH -- 404 "Article Not Found" -- if given an article_id that does not exist', () => {
                    const methods = ['get', 'patch'];
                    const requestPromises = methods.map((method) => {
                        return request(app)
                        [method]('/api/articles/100')
                            .send({ inc_votes: 5 })
                            .expect(404)
                            .then(({ body }) => {
                                expect(body).toMatchObject({ msg: 'Article Not Found' })
                            })
                    })
                    return Promise.all(requestPromises);
                });
                test('GET, PATCH -- 400 "Bad Request" -- if given an article_id that is of the wrong type', () => {
                    const methods = ['get', 'patch'];
                    const requestPromises = methods.map((method) => {
                        return request(app)
                        [method]('/api/articles/articleFive')
                            .expect(400)
                            .send({ inc_votes: 5 })
                            .then(({ body }) => {
                                expect(body).toMatchObject({ msg: 'Bad Request' })
                            })
                    });
                    return Promise.all(requestPromises);
                });
                test('405 "Invalid Method"', () => {
                    const invalidMethods = ['post', 'put', 'delete'];
                    const requestPromises = invalidMethods.map((method) => {
                        return request(app)
                        [method]('/api/articles/1')
                            .expect(405)
                            .then(({ body }) => {
                                expect(body.msg).toBe('Invalid Method')
                            });
                    });
                    return Promise.all(requestPromises);
                });
            });

            describe('./api/articles/:article_id/comments', () => {

                describe('POST methods', () => {
                    test('201 -- responds with the new comment', () => {
                        return request(app)
                            .post('/api/articles/1/comments')
                            .send({
                                username: 'rogersop',
                                body: 'hahahah poor mitch'
                            })
                            .expect(201)
                            .then(({ body: { comment } }) => {
                                expect(Object.keys(comment)).toEqual(expect.arrayContaining([
                                    'comment_id',
                                    'author',
                                    'article_id',
                                    'votes',
                                    'created_at',
                                    'body'
                                ]))
                                expect(comment.author).toBe('rogersop')
                                expect(comment.body).toBe('hahahah poor mitch')
                                expect(comment.article_id).toBe(1)

                            })
                    });
                    test('201 -- responds with a comment with a timestamp', () => {
                        return request(app)
                            .post('/api/articles/1/comments')
                            .send({
                                username: 'rogersop',
                                body: 'hahahah poor mitch'
                            })
                            .expect(201)
                            .then(({ body: { comment } }) => {
                                expect(comment.created_at).not.toBe(null)
                            })
                    });
                    test('201 -- accepts a votes key', () => {
                        return request(app)
                            .post('/api/articles/1/comments')
                            .send({
                                username: 'rogersop',
                                body: 'hahahah poor mitch',
                                votes: 50

                            })
                            .expect(201)
                            .then(({ body: { comment } }) => {
                                expect((comment.votes)).toBe(50)
                            })
                    });
                    test('400 "Bad Request" -- if posting something of the wrong type', () => {
                        const commentsToPost = [
                            { username: 'rogersop', body: 1234567890 },
                            { username: 1234567890, body: 'this is a valid comment' },
                            { username: 'rogersop', body: 'this is a valid comment', votes: 'seventy three' }
                        ]
                        const commentsPromises = commentsToPost.map((comment) => {
                            return request(app)
                                .post('/api/articles/1/comments')
                                .send(comment)
                                .expect(400)
                                .then(({ body }) => {
                                    expect(body).toEqual({ msg: "Bad Request" })
                                })
                        })
                        return Promise.all(commentsPromises)

                    });
                    test('400 -- if user doesn\'t exist in the database', () => {
                        return request(app)
                            .post('/api/articles/1/comments')
                            .send({
                                username: 'fakeUser123',
                                body: 'comment'
                            })
                            .expect(400)
                            .then(({ body }) => {
                                expect(body).toEqual({ msg: "Bad Request" })
                            })
                    });
                });

                describe('GET methods', () => {
                    test('200 -- responds with array of the comments which have the correct properties ', () => {
                        return request(app)
                            .get('/api/articles/1/comments')
                            .expect(200)
                            .then(({ body: { comments } }) => {
                                expect(Object.keys(comments[0])).toEqual(expect.arrayContaining([
                                    'comment_id',
                                    'author',
                                    'votes',
                                    'created_at',
                                    'body'
                                ]))
                                expect(comments[0].author).toBe("butter_bridge")
                            })
                    });
                    test('200 -- responds with comments sorted by created_at, in descending order as a default', () => {
                        return request(app)
                            .get('/api/articles/1/comments')
                            .expect(200)
                            .then(({ body: { comments } }) => {
                                expect(comments).toBeSortedBy('created_at', { descending: true })
                            })
                    });
                    test('200 -- responds with comments in ascending order', () => {
                        return request(app)
                            .get('/api/articles/1/comments?order=asc')
                            .expect(200)
                            .then(({ body: { comments } }) => {
                                expect(comments).toBeSortedBy('created_at', { descending: false })
                            })
                    });
                    test('200 -- responds with comments sorted by any valid column, in desc order as a default ', () => {
                        const columnToSortBy = ['comment_id', 'author', 'votes', 'created_at', 'body']
                        const sortPromises = columnToSortBy.map(column => {
                            return request(app)
                                .get(`/api/articles/1/comments?sort_by=${column}`)
                                .expect(200)
                                .then(({ body: { comments } }) => {
                                    expect(comments).toBeSortedBy(column, { descending: true })
                                })
                        })
                        return Promise.all(sortPromises)
                    });
                    test('200 -- responds with comments sorted by any valid column, in asc order', () => {
                        const columnToSortBy = ['comment_id', 'author', 'votes', 'created_at', 'body']
                        const sortPromises = columnToSortBy.map(column => {
                            return request(app)
                                .get(`/api/articles/1/comments?sort_by=${column}&order=asc`)
                                .expect(200)
                                .then(({ body: { comments } }) => {
                                    expect(comments).toBeSortedBy(column, { descending: false })
                                })
                        })
                        return Promise.all(sortPromises)
                    });
                    test('400 "Bad Request" -- if trying to sort by column that doesn\'t exist', () => {
                        return request(app)
                            .get('/api/articles/1/comments?sort_by=notAColumn')
                            .expect(400)
                            .then(({ body }) => {
                                expect(body).toEqual({ msg: "Bad Request" })
                            })
                    });
                    test('400 "Bad Request" -- if order is not asc or desc', () => {
                        return request(app)
                            .get('/api/articles/1/comments?order=random')
                            .expect(400)
                            .then(({ body }) => {
                                expect(body).toEqual({ msg: "Bad Request" })
                            })
                    });
                });

                describe('invalid article id or method ', () => {
                    test('GET, POST -- 404 "Comment Not Found" -- if article_id that does not exist in the database', () => {
                        const methods = ['get', 'post'];
                        const requestPromises = methods.map((method) => {
                            return request(app)
                            [method]('/api/articles/100/comments')
                                .send({
                                    username: 'rogersop',
                                    body: 'comment'
                                })
                                .expect(404)
                                .then(({ body }) => {
                                    expect(body).toMatchObject({ msg: 'Not Found' })
                                })
                        })
                        return Promise.all(requestPromises);
                    });
                    test('GET, POST -- 400 "Bad Request" -- if  article_id that is not a number', () => {
                        const methods = ['get', 'post'];
                        const requestPromises = methods.map((method) => {
                            return request(app)
                            [method]('/api/articles/articleFive/comments')
                                .send({
                                    username: 'rogersop',
                                    body: 'comment'
                                })
                                .expect(400)
                                .then(({ body }) => {
                                    expect(body).toMatchObject({ msg: 'Bad Request' })
                                })
                        });
                        return Promise.all(requestPromises);
                    });
                    test('405 "Invalid Method"', () => {
                        const invalidMethods = ['patch', 'put', 'delete'];
                        const requestPromises = invalidMethods.map((method) => {
                            return request(app)
                            [method]('/api/articles/1/comments')
                                .expect(405)
                                .then(({ body }) => {
                                    expect(body.msg).toBe('Invalid Method')
                                });
                        });
                        return Promise.all(requestPromises);
                    });
                });
            });

        });

    });


    describe('./api/comments/:comment_id', () => {

        describe('PATCH methods', () => {
            test('202 -- responds with the comment with incremented votes', () => {
                return request(app)
                    .patch('/api/comments/1')
                    .send({ inc_votes: 5 })
                    .expect(202)
                    .then(({ body: { comment } }) => {
                        expect(comment).toMatchObject({
                            comment_id: 1,
                            author: 'butter_bridge',
                            article_id: 9,
                            votes: 21,
                            created_at: '2017-11-22T12:36:03.389Z',
                            body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!"
                        })
                    })
            });
            test('202 -- responds with the comment with decremented votes', () => {
                return request(app)
                    .patch('/api/comments/1')
                    .send({ inc_votes: -5 })
                    .expect(202)
                    .then(({ body: { comment } }) => {
                        expect(comment).toMatchObject({
                            comment_id: 1,
                            author: 'butter_bridge',
                            article_id: 9,
                            votes: 11,
                            created_at: '2017-11-22T12:36:03.389Z',
                            body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!"
                        })
                    })
            });
            test('400 "Bad Request" -- if inc_votes is not an number ', () => {
                return request(app)
                    .patch('/api/comments/1')
                    .send({ inc_votes: 'not a number' })
                    .expect(400)
                    .then(({ body }) => {
                        expect(body).toMatchObject({ msg: "Bad Request" })
                    });
            })
            test('400 "Bad Request" -- f passed object with key anything but inc_votes', () => {
                const propertiesToUpdate = [
                    { comment_id: 100 },
                    { author: 'newUser' },
                    { article_id: 100 },
                    { created_at: 'now' },
                    { body: "much worse comment" }
                ]
                const propertiesPromises = propertiesToUpdate.map((property) => {
                    return request(app)
                        .patch('/api/comments/1')
                        .send(property)
                        .expect(400)
                        .then(({ body }) => {
                            expect(body).toEqual({ msg: "Bad Request" })
                        })
                })
                return Promise.all(propertiesPromises)

            });
        });

        describe('DELETE methods', () => {
            test('204 -- removes requested comment', () => {
                return request(app)
                    .delete('/api/comments/1')
                    .expect(204)
                    .then(() => {
                        return request(app)
                            .get('/api/comments/1')
                            .expect(404)
                            .then(({ body: { msg } }) => {
                                expect(msg).toBe("Comment Not Found")
                            })
                    })
            });
        });

        describe('invalid comment id or method ', () => {
            test('GET, PATCH, DELETE -- 404 "Comment Not Found" --if comment_id does not exist in the database', () => {
                const methods = ['get', 'patch', 'delete'];
                const requestPromises = methods.map((method) => {
                    return request(app)
                    [method]('/api/comments/100')
                        .send({ inc_votes: 5 })
                        .expect(404)
                        .then(({ body }) => {
                            expect(body).toMatchObject({ msg: 'Comment Not Found' })
                        })
                })
                return Promise.all(requestPromises);
            });
            test('GET, PATCH, DELETE -- 400 "Bad Request" --if comment_id is not a number', () => {
                const methods = ['get', 'patch', 'delete'];
                const requestPromises = methods.map((method) => {
                    return request(app)
                    [method]('/api/comments/commentFive')
                        .send({ inc_votes: 5 })
                        .expect(400)
                        .then(({ body }) => {
                            expect(body).toMatchObject({ msg: 'Bad Request' })
                        })
                });
                return Promise.all(requestPromises);
            });
            test('405 "Invalid Method"', () => {
                const invalidMethods = ['post', 'put'];
                const requestPromises = invalidMethods.map((method) => {
                    return request(app)
                    [method]('/api/comments/1')
                        .expect(405)
                        .then(({ body }) => {
                            expect(body.msg).toBe('Invalid Method')
                        });
                });
                return Promise.all(requestPromises);
            });
        });
    });


    // test for incorrect endpoint
    describe('/missingRoute', () => {
        test('404 "Route Not Found" -- All methods', () => {
            const allMethods = ['get', 'post', 'patch', 'put', 'delete']
            const methodPromises = allMethods.map((method) => {
                return request(app)
                [method]('/missingRoute')
                    .expect(404)
                    .then(({ body }) => {
                        expect(body.msg).toBe('Route Not Found')
                    })
            })
            return Promise.all(methodPromises)
        })
    });
})
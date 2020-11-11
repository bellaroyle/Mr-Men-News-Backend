process.env.NODE_ENV = "test"
const app = require("../app")
const request = require("supertest")
const connection = require("../connection")
const { notify } = require("../app")

describe('/api', () => {
    afterAll(() => {
        return connection.destroy()
    })

    beforeEach(() => {
        return connection.seed.run()
    })

    describe('./api/topics', () => {
        test('GET responds with status 200 & all topics ', () => {
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

        test('status 405 for an invalid method', () => {
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
        test('GET responds with status 200 and the user', () => {
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
        test('GET responds with status 404 and message "User Not Found" if given a username that does not exist', () => {
            return request(app)
                .get('/api/users/myUsername123')
                .expect(404)
                .then(({ body }) => {
                    expect(body).toMatchObject({ msg: 'User Not Found' })
                })
        });
        test('status 405 for an invalid method', () => {
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
            //// do stuff here
        });


        describe('./api/articles/:article_id', () => {

            describe('GET methods', () => {
                test('GET responds with 200 and the article with a comment_count', () => {
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
                test('PATCH responds with 202 and the article with incremented votes', () => {
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
                test('PATCH responds with 202 and the article with decremented votes', () => {
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
                test('PATCH responds with 400 and message "Bad Request" if inc_votes is not an number ', () => {
                    return request(app)
                        .patch('/api/articles/1')
                        .send({ inc_votes: 'not a number' })
                        .expect(400)
                        .then(({ body }) => {
                            expect(body).toMatchObject({ msg: "Bad Request" })
                        });
                })
                test('PATCH responds with 400 and message "Bad Request" if trying to update anything but votes', () => {
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

                test('GET, PATCH - respond with 404 and message "Article Not Found" if given an article_id that does not exist', () => {
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
                test('GET, PATCH - respond with 400 and message "Bad Request" if given an article_id that does not exist', () => {
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

                test('status 405 for an invalid method', () => {
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
                    test('POST responds with 201 and returns the new comment', () => {
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

                    test('POST returns a comment with a timestamp', () => {
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

                    test('POST responds with 201 and accepts a votes key', () => {
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

                    test('POST responds with 400 and message "Bad Request" if posting something of the wrong type', () => {
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

                    test('POST responds with 4 if user doesn\'t exist ', () => {

                    });
                });

                describe('GET methods', () => {
                    test('GET responds with 200 and an array of the comments which have the correct properties ', () => {
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
                            })
                    });
                });

                describe('invalid article id or method ', () => {

                });
            });


        });

    });


    describe('./api/comments/:comment_id', () => {

        describe('PATCH methods', () => {
            //// do stuff here
        });

        describe('DELETE methods', () => {
            //// do stuff here 
        });

    });


    // test for incorrect endpoint
    describe('/missingRoute', () => {
        test('status 404 -All methods', () => {
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
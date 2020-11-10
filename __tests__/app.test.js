process.env.NODE_ENV = "test"
const app = require("../app")
const request = require("supertest")
const connection = require("../connection")

describe('/api', () => {
    afterAll(() => {
        return connection.destroy()
    })
    beforeEach(() => {
        return connection.seed.run()
    })
    describe('./api/topics', () => {
        test('GETs all topics with status 200', () => {
            return request(app)
                .get('/api/topics')
                .expect(200)
                .then(response => {
                    expect(response.body).toMatchObject({
                        topics: [
                            { slug: 'mitch', description: 'The man, the Mitch, the legend' },
                            { slug: 'cats', description: 'Not dogs' },
                            { slug: 'paper', description: 'what books are made of' }
                        ]
                    })
                })
        })
    })
})
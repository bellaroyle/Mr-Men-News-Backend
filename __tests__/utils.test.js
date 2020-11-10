const { createArticleRef, formatCommentData, formatDate } = require('../db/utils/data-manipulation')

describe('createArticleRef', () => {
    test('Returns an empty object when passed a n empty array', () => {
        const articleRows = [];
        const expected = {};
        expect(createArticleRef(articleRows)).toEqual(expected);
    })
    test('creates object with title:article_id', () => {
        const articleRows = [{
            article_id: 1,
            title: 'Living in the shadow of a great man',
            topic: 'mitch',
            author: 'butter_bridge',
            body: 'I find this existence challenging',
            created_at: 1542284514171,
            votes: 100,
        }]
        const expected = { 'Living in the shadow of a great man': 1 }
        expect(createArticleRef(articleRows)).toEqual(expected);
    })
    test('creates object with multiple title:article_id key value pairs', () => {
        const articleRows = [{
            article_id: 1,
            title: 'Living in the shadow of a great man',
            topic: 'mitch',
            author: 'butter_bridge',
            body: 'I find this existence challenging',
            created_at: 1542284514171,
            votes: 100,
        },
        {
            article_id: 2,
            title: 'Sony Vaio; or, The Laptop',
            topic: 'mitch',
            author: 'icellusedkars',
            body:
                'Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.',
            created_at: 1416140514171,
        }];
        const expected = { 'Living in the shadow of a great man': 1, 'Sony Vaio; or, The Laptop': 2 }
        expect(createArticleRef(articleRows)).toEqual(expected);
    })
    test('does not mutate input', () => {
        const articleRows = [{
            article_id: 1,
            title: 'Living in the shadow of a great man',
            topic: 'mitch',
            author: 'butter_bridge',
            body: 'I find this existence challenging',
            created_at: 1542284514171,
            votes: 100,
        }]
        createArticleRef(articleRows)
        expect(articleRows).toEqual([{
            article_id: 1,
            title: 'Living in the shadow of a great man',
            topic: 'mitch',
            author: 'butter_bridge',
            body: 'I find this existence challenging',
            created_at: 1542284514171,
            votes: 100,
        }]);
    })
})

describe('formatCommentData', () => {

    test('returns an empty array when passed an empty array', () => {
        const commentData = [];
        const articleRef = {};
        const expected = [];
        expect(formatCommentData(commentData, articleRef)).toEqual(expected)
    })
    test('returns comment data with article_id,author,and correct timestamp', () => {
        const commentData = [{
            body:
                "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
            belongs_to: "They're not exactly dogs, are they?",
            created_by: 'butter_bridge',
            votes: 16,
            created_at: 1511354163389,
        }];
        const articleRef = { "They're not exactly dogs, are they?": 9 };
        const expected = [{
            body:
                "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
            article_id: 9,
            author: 'butter_bridge',
            votes: 16,
            created_at: new Date(1511354163389),
        }];
        expect(formatCommentData(commentData, articleRef)).toEqual(expected)
    })
    test('returns multiple Comments data correctly formatted', () => {
        const commentData = [{
            body:
                "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
            belongs_to: "They're not exactly dogs, are they?",
            created_by: 'butter_bridge',
            votes: 16,
            created_at: 1511354163389,
        },
        {
            body:
                'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.',
            belongs_to: 'Living in the shadow of a great man',
            created_by: 'butter_bridge',
            votes: 14,
            created_at: 1479818163389,
        }];
        const articleRef = { "They're not exactly dogs, are they?": 9, 'Living in the shadow of a great man': 1 };
        const expected = [{
            body:
                "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
            article_id: 9,
            author: 'butter_bridge',
            votes: 16,
            created_at: new Date(1511354163389),
        },
        {
            body:
                'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.',
            article_id: 1,
            author: 'butter_bridge',
            votes: 14,
            created_at: new Date(1479818163389),
        }];
        expect(formatCommentData(commentData, articleRef)).toEqual(expected)
    })
    test('doesn\'t mutate original data', () => {
        const commentData = [{
            body:
                "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
            belongs_to: "They're not exactly dogs, are they?",
            created_by: 'butter_bridge',
            votes: 16,
            created_at: 1511354163389,
        }]
        const authorRef = { 'butter-bridge': 'jonny' }
        formatCommentData(commentData, authorRef);
        expect(commentData).toEqual([{
            body:
                "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
            belongs_to: "They're not exactly dogs, are they?",
            created_by: 'butter_bridge',
            votes: 16,
            created_at: 1511354163389,
        }])
    })
})



describe('formatDate', () => {
    test('returns empty array when passed an empty array', () => {
        const input = []
        const output = []
        expect(formatDate(input)).toEqual(output);
    })
    test('returns article with date when passed article with unix', () => {
        const input = [
            {
                title: 'Living in the shadow of a great man',
                topic: 'mitch',
                body: 'I find this existence challenging',
                created_at: 1542284514171,
                votes: 100,
                author: 'jonny'
            }
        ]
        const output = [
            {
                title: 'Living in the shadow of a great man',
                topic: 'mitch',
                body: 'I find this existence challenging',
                created_at: new Date(1542284514171),
                votes: 100,
                author: 'jonny'
            }
        ]
        expect(formatDate(input)).toEqual(output)
    })
})

/*

describe('createRef', () => {
    test('should return an object', () => {
        const rows = [];
        const expectedOutput = {};
        expect(createReference(rows)).toEqual(expectedOutput);
    });
    test('creates object with multiple title:article_id key value pairs', () => {
        const articleRows = [{
            article_id: 1,
            title: 'Living in the shadow of a great man',
            topic: 'mitch',
            author: 'butter_bridge',
            body: 'I find this existence challenging',
            created_at: 1542284514171,
            votes: 100,
        },
        {
            article_id: 2,
            title: 'Sony Vaio; or, The Laptop',
            topic: 'mitch',
            author: 'icellusedkars',
            body:
                'Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.',
            created_at: 1416140514171,
        }];
        const expected = { 'Living in the shadow of a great man': 1, 'Sony Vaio; or, The Laptop': 2 }
        expect(createReference(articleRows, 'title', 'article_id')).toEqual(expected);
    })
    test('creates object with multiple username:name key value pairs', () => {
        const userRows = [
            {
                username: 'butter_bridge',
                avatar_url: 'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg',
                name: 'jonny'
            },
            {
                username: 'icellusedkars',
                avatar_url: 'https://avatars2.githubusercontent.com/u/24604688?s=460&v=4',
                name: 'sam'
            },
            {
                username: 'rogersop',
                avatar_url: 'https://avatars2.githubusercontent.com/u/24394918?s=400&v=4',
                name: 'paul'
            },
            {
                username: 'lurker',
                avatar_url: 'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
                name: 'do_nothing'
            }
        ];
        const expected = {
            butter_bridge: 'jonny',
            icellusedkars: 'sam',
            rogersop: 'paul',
            lurker: 'do_nothing'
        }
        expect(createReference(userRows, 'username', 'name')).toEqual(expected);
    })
    test('does not mutate input', () => {
        const userRows = [{
            username: 'lurker',
            avatar_url: 'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
            name: 'do_nothing'
        }];
        createReference(userRows, 'username', 'name');
        expect(userRows).toEqual([{
            username: 'lurker',
            avatar_url: 'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
            name: 'do_nothing'
        }])
    })
});
*/

/*

describe('createAuthorRef', () => {
    test('Returns an empty object when passed a n empty array', () => {
        const userRows = [];
        const expected = {};
        expect(createAuthorRef(userRows)).toEqual(expected);
    })
    test('creates object with username:name', () => {
        const userRows = [{
            username: 'lurker',
            avatar_url: 'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
            name: 'do_nothing'
        }]
        const expected = { 'lurker': 'do_nothing' }
        expect(createAuthorRef(userRows)).toEqual(expected);
    })
    test('creates object with multiple username:name key value pairs', () => {
        const userRows = [
            {
                username: 'butter_bridge',
                avatar_url: 'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg',
                name: 'jonny'
            },
            {
                username: 'icellusedkars',
                avatar_url: 'https://avatars2.githubusercontent.com/u/24604688?s=460&v=4',
                name: 'sam'
            },
            {
                username: 'rogersop',
                avatar_url: 'https://avatars2.githubusercontent.com/u/24394918?s=400&v=4',
                name: 'paul'
            },
            {
                username: 'lurker',
                avatar_url: 'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
                name: 'do_nothing'
            }
        ];
        const expected = {
            butter_bridge: 'jonny',
            icellusedkars: 'sam',
            rogersop: 'paul',
            lurker: 'do_nothing'
        }
        expect(createAuthorRef(userRows)).toEqual(expected);
    })
    test('does not mutate input', () => {
        const userRows = [{
            username: 'lurker',
            avatar_url: 'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
            name: 'do_nothing'
        }];
        createAuthorRef(userRows);
        expect(userRows).toEqual([{
            username: 'lurker',
            avatar_url: 'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
            name: 'do_nothing'
        }])
    })
})

*/



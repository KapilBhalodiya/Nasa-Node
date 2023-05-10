const request = require('supertest');
const app = require('../../app');

const {mongoConeection, mongoDisconnect} = require('../../util/mongoConnect');

const sendWithValidDate = {
    lunchDate : new Date('Dec 27, 2032'),
    mission : "Mangal",
    rocket : "Kepler-B-100",
    destination : "Keplers"
}

const sendWithInValidDate = {
    lunchDate : 'hello',
    mission : "Mangal",
    rocket : "Kepler-B-100",
    destination : "Keplers"
}

describe('NASA API',() => {

    beforeAll(() => {
        mongoConeection();
    })

    afterAll(() => {
        mongoDisconnect();
    })

    describe('Test /Get Reuqest for Lauches', () => {
        test('It Should Return 200 status', async () => {
            const response = await request(app)
                .get('/lunches')
                .expect(200);
        })
    });
    
    describe('Test /POST Reuqest for Lauches', () => {
        test('It Should Return 201 status', async () => {
            const response = await request(app)
                .post('/lunches')
                .send(sendWithValidDate)
                .expect(201);
        })
    
        test('It Should Return 400 status', async () => {
            const response = await request(app)
                .post('/lunches')
                .send(sendWithInValidDate)
                .expect(400);
        })
    });
})
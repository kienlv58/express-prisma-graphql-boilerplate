import request from "supertest";

import App from "../src/app";


// ========== API Test ============

/**
 * Testing `get all contacts` endpoint
 */
describe("Get all contacts request", function() {
    let responseObject: any = [];

    beforeAll(() => {
        responseObject = [
            {
                name: "Rob",
                luckyNumber: 42
            },
            {
                name: "Henry",
                luckyNumber: 43
            }
        ];
    });

    afterAll(async () => {
        await App.close();// close the server connection
        await new Promise<void>(resolve => setTimeout(() => resolve(), 500)); // avoid jest open handle error
    });

    test("Responds with json containing a list of all contacts", async function() {
        const response = await request(App)
            .get("/first/all")
            .set("Accept", "application/json");


        expect(response.headers["content-type"]).toMatch(/json/);

        expect(response.status).toEqual(200);

        expect(response.body).toEqual(responseObject);
    });
});
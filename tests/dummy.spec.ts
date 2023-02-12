import { Server } from "http";
import request from "supertest";

import server from "../src/server";

// ========== API Test ============

/**
 * Testing `get all contacts` endpoint
 */
describe("Get all contacts request", function() {
    let responseObject: any = [];
    let App: Server;
    beforeAll(async () => {
        App = await server;

        responseObject = [
            {
                name: "Rob",
                luckyNumber: 45
            },
            {
                name: "Henry",
                luckyNumber: 43
            }
        ];
    });

    afterAll(async () => {
        await App.close(function(err: any) {
            if (err) {
                console.error("Close server error", err);
            } else {
                console.log("Close server success");
            }
        });
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
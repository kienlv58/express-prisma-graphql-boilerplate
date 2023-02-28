import express, { Application, Request } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import bodyParser from "body-parser";
import actuator from "express-actuator";
import { GraphQLFormattedError,
} from "graphql";
import {
    simpleEstimator,
    fieldExtensionsEstimator,
    directiveEstimator,
} from "graphql-query-complexity";
import ApolloServerPluginQueryComplexity, {
    QueryComplexityError,
} from "apollo-server-plugin-query-complexity";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";

import { buildSchema } from "type-graphql";
import { resolvers } from "../prisma/generated/type-graphql";
import path from "path";
import customResolvers from "./resolvers";
import http from "http";

// Express App
const app: Application = express();


// * Route Files
import first from "./routers/first";
import prisma from "./utils/prisma-client";
import { PrismaClient } from "@prisma/client";

// * Logging (Development)
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}


//  * Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ! Helmet
// app.use(helmet()); // not work with graphiql use alias instead
// app.use(helmet.contentSecurityPolicy()); // not work with graphiql
// app.use(helmet.crossOriginEmbedderPolicy()); // not work with graphiql
app.use(helmet.crossOriginOpenerPolicy());
app.use(helmet.crossOriginResourcePolicy());
app.use(helmet.dnsPrefetchControl());
app.use(helmet.expectCt());
app.use(helmet.frameguard());
app.use(helmet.hidePoweredBy());
app.use(helmet.hsts());
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
app.use(helmet.originAgentCluster());
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.referrerPolicy());
app.use(helmet.xssFilter());

// ! Cors
app.use(cors({ origin: true }));

// ! Health check
app.use(actuator());

// ! Routes
app.use("/first", first);

interface MyContext {
    token?: string;
    prisma: PrismaClient
  }
// const a = customResolvers;
const appConfig = async (): Promise<http.Server> => {

    const httpServer = http.createServer(app);
    const schema = await buildSchema({
        
        // resolvers, // only resolvers generate by type-graphql
        // resolvers: ["./node_modules/@generated/type-graphql", __dirname + "/resolvers/**/*.resolver.{ts,js}"],
        resolvers:[...customResolvers, ...resolvers],
        nullableByDefault: true,
        validate: false,
        emitSchemaFile: path.resolve(__dirname, "../prisma/snapshots/schema", "schema.gql"),
    });
    const server = new ApolloServer<MyContext>({
        schema,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer }),
            ApolloServerPluginQueryComplexity({
                estimators: [fieldExtensionsEstimator(),directiveEstimator(), simpleEstimator({ defaultComplexity:1 })],
                maximumComplexity: 2,
            }),
        ],
        formatError: (formattedError: GraphQLFormattedError, error: unknown) => {
            if (error instanceof QueryComplexityError) {
                return {
                    message: `Sorry, your request is too complex. Your request had a complexity of ${error.extensions.complexity}, but we limit it to ${error.extensions.maximumComplexity}.`,
                    extensions: {
                        code: "QUERY_TOO_COMPLEX",
                        complexity: error.extensions.complexity,
                        maximumComplexity: error.extensions.maximumComplexity,
                    },
                };
            }
            console.log("formattedError",formattedError);
            
            return formattedError;
        },
        
    });
    // Ensure we wait for our server to start
    await server.start();

    const generateContext = (req: Request): MyContext =>({
        token: req.headers.token as string,
        prisma,
    });

    app.use(
        "/",
        cors<cors.CorsRequest>(),
        bodyParser.json(),
        // expressMiddleware accepts the same arguments:
        // an Apollo Server instance and optional configuration options
        expressMiddleware(server, {
            context: async ({ req }) => generateContext(req),
        }),
    );

  
    return httpServer;
};
  
export default appConfig;

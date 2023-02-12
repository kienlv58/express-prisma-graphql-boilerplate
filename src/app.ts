import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import actuator from "express-actuator";
import { graphqlHTTP } from "express-graphql";
import { GraphQLError,
    //  GraphQLInputObjectType, GraphQLInt, GraphQLObjectType, GraphQLSchema, GraphQLString
} from "graphql";
import queryComplexity, {
    simpleEstimator,
    fieldExtensionsEstimator,
} from "graphql-query-complexity";
import { buildSchema } from "type-graphql";
import { resolvers } from "@generated/type-graphql";
import path from "path";
import customResolvers from "./resolvers";


// Express App
const app: Application = express();


// * Route Files
import first from "./routers/first";
import prisma from "./utils/prisma-client";

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

// const a = customResolvers;
const appConfig = async (): Promise<Application> => {
    const schema = await buildSchema({
        
        // resolvers, // only resolvers generate by type-graphql
        // resolvers: ["./node_modules/@generated/type-graphql", __dirname + "/resolvers/**/*.resolver.{ts,js}"],
        resolvers:[...customResolvers, ...resolvers],
        nullableByDefault: true,
        validate: false,
        emitSchemaFile: path.resolve(__dirname, "snapshots/schema", "schema.gql"),
    });

  
    app.use(
        "/graphql",
        graphqlHTTP(async (req, res, params) => ({
            schema,
            context: { prisma },
            graphiql: true,
            validationRules: [
                /**
           * This provides GraphQL query analysis to reject complex queries to your GraphQL server.
           * This can be used to protect your GraphQL servers
           * against resource exhaustion and DoS attacks.
           * More documentation can be found (here)[https://github.com/ivome/graphql-query-complexity]
           */
                queryComplexity({
                    // The maximum allowed query complexity, queries above this threshold will be rejected
                    maximumComplexity: 20,
                    // The query variables. This is needed because the variables are not available
                    // in the visitor of the graphql-js library
                    variables: params?.variables || undefined,
                    // Optional callback function to retrieve the determined query complexity
                    // Will be invoked weather the query is rejected or not
                    // This can be used for logging or to implement rate limiting
                    onComplete: (complexity: number) => {
                        // tslint:disable-next-line: no-console
                        console.log("Determined query complexity: ", complexity);
                    },
                    createError: (max: number, actual: number) => {
                        return new GraphQLError(
                            `Query is too complex: ${actual}. Maximum allowed complexity: ${max}`,
                        );
                    },
                    // Add any number of estimators. The estimators are invoked in order, the first
                    // numeric value that is being returned by an estimator is used as the field complexity.
                    // If no estimator returns a value, an exception is raised.
                    estimators: [
                        // fieldConfigEstimator(),
                        fieldExtensionsEstimator(),
                        // Add more estimators here...
                        // This will assign each field a complexity of 1 if no other estimator
                        // returned a value.
                        simpleEstimator({
                            defaultComplexity: 1,
                        }),
                    ],
                }),
            ],
        })),
    );
  
    return app;
};
  
export default appConfig;

/**
 * 
 * Example build schema from scratch
 * 
 * const AuthorType = new GraphQLObjectType({
        name: "Author",
        description: "This is author",
        fields: () =>({
            id:{
                type: GraphQLInt,
                // resolve:()=>1
            },
            name:{
                type: GraphQLString,
                // resolve: () => "Author name"
            }
        })
    });

    const WhereType = new GraphQLInputObjectType({
        name: "Where",
        description: "This is where condition",
        fields: () =>({
            id:{
                type: GraphQLInt,
            },
            name:{
                type: GraphQLString,
            }
        })
    });


    const schema = new GraphQLSchema({
        query: new GraphQLObjectType({
            name:"test",
            fields: ()=>({
                message: {
                    type: GraphQLString,
                    resolve: () => "Hello"
                },
                messageId: {
                    type: GraphQLString,
                    args:{
                        id: { type: GraphQLInt }
                    },
                    resolve: (parent, args) =>" test" + args.id
                },
                messageByInputObj: {
                    type: AuthorType,
                    args:{ where: { type: WhereType! } },
                    resolve: (parent, args) => {
                        return { id: args.where.id, name:"test " + args.where.name };}
                }
            })
        })
    });
 */
import { NonEmptyArray } from "type-graphql";
import CustomUserResolver from "./CustomUser.resolver";

// eslint-disable-next-line @typescript-eslint/ban-types
const resolvers: NonEmptyArray<Function> = [CustomUserResolver];
export default resolvers;
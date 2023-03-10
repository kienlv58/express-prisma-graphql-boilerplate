import { Arg, Ctx, Field, FieldResolver, InputType, Mutation, Query, Resolver, Root } from "type-graphql";
import { User, Book, Author } from "../../prisma/generated/type-graphql";
import { PrismaContext } from "../utils/prisma-client";


import * as TypeGraphQL from "type-graphql";
import { MinLength } from "class-validator";
@TypeGraphQL.InputType("UserTest", {
    isAbstract: true
})
export class UserTest {
  @TypeGraphQL.Field(_type => String, {
      nullable: false
  })
      user_name!: string;

  @TypeGraphQL.Field(_type => String, {
      nullable: false
  })
      email!: string;

  @TypeGraphQL.Field(_type => String, {
      nullable: false
  })
  @MinLength(10,{ message:"min 30" })
      password!: string;

  @TypeGraphQL.Field(_type => Date, {
      nullable: true
  })
      created_at?: Date | undefined;

  @TypeGraphQL.Field(_type => Date, {
      nullable: true
  })
      updated_at?: Date | undefined;
}

// custom resolver for custom business logic using Prisma Client
@Resolver(of => User)
export default class CustomUserResolver {
  @Query(returns => User, { nullable: true })
    async bestUser(@Ctx() { prisma }: PrismaContext): Promise<User | null> {
        return await prisma.user.findFirst({
            where: { email: "test1@gmail.com" },
        });
    }

  @FieldResolver(type => Book, { nullable: true })
  async favoriteBookByAuthor(
    @Root() author: Author,
    @Ctx() { prisma }: PrismaContext,
  ): Promise<Book | undefined> {
      const bookByAuthor = await prisma.book
          .findFirst({ where: { authorId: author.id } });

      return bookByAuthor||undefined;
  }

  @Mutation(returns => String)
  async addTest(@Arg("userTest") recipeInput: UserTest): Promise<string> {
      
      return "test";
  }
}

import { Ctx, FieldResolver, Query, Resolver, Root } from "type-graphql";
import { User, Book, Author } from "@generated/type-graphql";
import { PrismaContext } from "../utils/prisma-client";

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
}
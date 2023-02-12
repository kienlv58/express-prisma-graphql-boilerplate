import prisma from "../src/utils/prisma-client";
async function main() {
    for (let i = 0; i < 20; i++) {


        await prisma.book.create({
            data: {
                title: "Book Title " + i,
                description:" Book description",
                imageThumbnail:"image thumbnail",
                languageName: "English",
                author: {
                    connectOrCreate: {
                        where: { name: "Author " + i },
                        create: {
                            name: "Author " + i
                        }
                    }
                },
                categories: {
                    create: [
                        {
                            category: {
                                connectOrCreate: {
                                    where: { name: "Category " + i },
                                    create: { name: "Category " + i, displayName: "Category " + i }
                                }
                            }
                        }
                    ]
                },
            }
        });
        await prisma.user.create({ data:{
            email: "test"+i+"@gmail.com",
            user_name: "test"+i,
            password:"123456"
        } });
    }
    

}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        //TODO
    });

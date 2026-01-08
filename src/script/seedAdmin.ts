import {prisma} from "../lib/prisma";
import {UserRole} from "../middlewares/auth";


async function seedAdmin() {
    try {
        const adminData = {
            name: 'Md Alamin',
            email: 'mdalaminweb.1@gmail.com',
            password: 'alamin123',
            role: UserRole.ADMIN,
            emailVerified: true,


        }
        //check a user exists in db or not
        const existingUser = await prisma.user.findUnique({
            where: {email: adminData.email},
        })

        if (existingUser) {
            throw new Error("User already exists!!");
        }


        const signUpAdmin = await fetch("http://localhost:5000/api/auth/sign-up/email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(adminData)
        })

        if (signUpAdmin.ok) {
            console.log("**** Admin created")
            await prisma.user.update({
                where: {
                    email: adminData.email
                },
                data: {
                    emailVerified: true
                }
            })

            console.log("**** Email verification status updated!")
        }

        console.log('Admin seeded successfully:', signUpAdmin);
    } catch (error) {
        console.error('Seed admin error:', error);
    }
}

seedAdmin()
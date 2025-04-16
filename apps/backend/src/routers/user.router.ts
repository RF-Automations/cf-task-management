import { getAuth } from "@clerk/express";
import { prismaClient } from "db/client";
import { Request, Response, Router } from "express";
const router = Router();


router.get('/', async (req: Request, res: Response) => {
  const { userId } = req.query

  if (!userId) {
    return res.status(401).json({ data: null, message: null, error: "User not found" });
  }

  try {
    const user = await prismaClient.user.findFirst({
      where: {
        id: userId as string
      },
      select: {
        id: true,
        active: true,
        clerkuuid: true,
        role: true,
        college_name: true,
        current_skills: true,
        previous_experience: true,
        learning_goals: true
      }
    })
  
    if (user){
      return res.status(200).json({ data: user, message: "User fetched", error: null})
    }
  } catch (error: any) {
    return res.status(error?.status | 500).json({
      message: error?.message
    })
  }

})

router.post("/create", async (req: Request, res: Response) => {
    const { clerkuuid, firstName, lastName, email } = req.body

    console.log(firstName, lastName)
    if (!clerkuuid){
      return res.status(400).json({
        data: null,
        message: null,
        error: "Clerk Id not present"
      })
    }
    console.log(clerkuuid)

    const existingUser = await prismaClient.user.findFirst({
      where: {
        clerkuuid
      },
      select: {
        id: true,
        clerkuuid: true
      }
    })

    console.log("existing user: ", existingUser)

    if (existingUser){
      return res.status(209).json({ data: { userId: existingUser.id, clerkuuid}, message: "User already exists", error: null})
    }

    const data = await prismaClient.user.create({
      data: {
        clerkuuid,
        firstName,
        lastName,
        email
      },
      select: {
        id: true,
      }
    })
    console.log(data)

    if (data.id){
      return res.status(200).json({ data: { userId: data.id }, message: "User created sucessfully", error: null})
    }
})

router.post("/update", async (req: Request, res: Response) => {
  const { userId } = req.body
  const { userId: clerkuuid } = getAuth(req)
  

  if (!userId) {
    return res
      .status(401)
      .json({ data: null, message: null, error: "User not found" });
  }

  if (!clerkuuid) {
    return res
      .status(401)
      .json({ data: null, message: null, error: "User not found in clerk." });
  }

  const { college_name, previous_experience, current_skills, learning_goals } =
    req.body;

  console.log(current_skills.split(','), previous_experience.split(','), learning_goals.split(','));
  try {
    const user = await prismaClient.user.update({
      where: {
        id: userId,
      },
      data: {
        college_name,
        current_skills: current_skills.split(','),
        previous_experience: previous_experience.split(','),
        learning_goals: learning_goals.split(','),
        clerkuuid: clerkuuid,
      },
      select: {
        id: true,
        active: true,
        clerkuuid: true,
        role: true,
      },
    });
    console.log(user)
    if (user.id){
      return res.status(200).json({
        data: user,
        message: "Updated User profile",
        error: null,
      });
    }

    return res.status(400).json({
      message: "Not able to update. Re-Try again."
    })

  } catch (error: any) {
    console.log(error)
    return res.json({ error: error?.message || "some error occured" }).status(500);
  }
});

export default router;

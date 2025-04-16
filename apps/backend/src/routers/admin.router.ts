import { getAuth } from "@clerk/express";
import { prismaClient } from "db/client";
import { Router, Request, Response } from "express";
import getClerkClient from "../clients/clerk.client";

const router = Router();

router.get("/activeUsers", async (req: Request, res: Response) => {
  const { userId } = getAuth(req);

  if (!userId) {
    return res
      .status(401)
      .json({ data: null, message: null, error: "User not found" });
  }

  try {
    const dbUsers = await prismaClient.user.findMany({
      orderBy: [
        {
          lastActiveAt: "desc",
        },
      ],
      include: {
        task: true,
      },
    });
    console.log(dbUsers);
    if (!dbUsers) {
      return res.status(404).json({
        data: null,
        message: "Not found",
        error: "No users exists on the database",
      });
    }

    return res.status(200).json({
      data: dbUsers,
      message: "Successfully retrive users",
      error: null,
    });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({
      data: null,
      message: "Server side error",
      error: error?.message || "unknown error occured",
    });
  }
});

router.get("/users", async (req: Request, res: Response) => {
  const { userId } = getAuth(req);
  if (!userId) {
    return res
      .status(401)
      .json({ data: null, message: null, error: "User not found" });
  }

  try {
    const users = await prismaClient.user.findMany();

    if (users.length > 0) {
      return res.status(200).json({
        message: "Users reterived succefully",
        data: users,
        error: null,
      });
    }

    return res.status(205).json({
      message: "No user found",
      data: null,
      error: "Unable to find the user.",
    });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({
      message: "Server side error",
      error: typeof error.message === "string" ? error.message : "Server error",
    });
  }
});

router.get("/tasks", async (req: Request, res: Response) => {
  const { userId } = getAuth(req);

  console.log(userId);

  if (!userId) {
    return res
      .status(401)
      .json({ data: null, message: null, error: "User not found" });
  }

  try {
    const tasks = await prismaClient.task.findMany({
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        creator: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    console.log("get task tasks", tasks);

    return res.status(200).json({
      data: tasks,
      message: "Task reterived",
      error: null,
    });
  } catch (error: any) {
    console.log("get task error", error);
    return res
      .status(500)
      .json({ error: error?.message || "some error occured" });
  }
});

router.patch("/task-status-update", async (req: Request, res: Response) => {
  const { userId } = getAuth(req);

  const { taskId, status } = req.body;

  console.log(status);

  if (!taskId && !status) {
    return res.status(400).json({
      message: "status and task both required",
      error: "task id and status need.",
      data: null,
    });
  }

  if (!userId) {
    return res
      .status(401)
      .json({ data: null, message: null, error: "User not found" });
  }

  try {
    const task = await prismaClient.task.findFirst({
      where: {
        id: taskId,
      },
    });

    if (
      status === "reassigned" &&
      (task?.status === "completed" || !task?.dead_line)
    ) {
      return res.status(406).json({
        message: "Task not assigned",
        error: "Task not assigned yet.",
        data: null,
      });
    }

    let assigned;
    if (status === "reassigned") {
      assigned = await prismaClient.task.update({
        where: {
          id: taskId,
        },
        data: {
          status,
          reassigned: { increment: 1 },
        },
      });
    }
    assigned = await prismaClient.task.update({
      where: {
        id: taskId,
      },
      data: {
        status,
      },
    });

    if (assigned.id) {
      return res.status(200).json({
        message: "Status updated",
        data: assigned,
        error: null,
      });
    }
  } catch (error: any) {
    console.log(error.message);
    return res.status(500).json({
      message: "Server problem",
      error: typeof error?.message && error.message,
    });
  }
});

router.patch("/assign-task", async (req: Request, res: Response) => {
  const { userId } = getAuth(req);

  const { taskId, dead_line } = req.body;

  if (!taskId && !dead_line) {
    return res.status(400).json({
      message: "dead line and task all are required",
      error: "task id, dead line need.",
      data: null,
    });
  }

  if (!userId) {
    return res
      .status(401)
      .json({ data: null, message: null, error: "User not found" });
  }

  try {
    const prevDeadline = await prismaClient.task.findFirst({
      where: {
        id: taskId,
      },
    });

    const assigned = await prismaClient.task.update({
      where: {
        id: taskId,
      },
      data: {
        status: prevDeadline?.dead_line ? "reassigned" : "assigned",
        dead_line,
        assignedBy: prevDeadline?.assignedBy,
      },
    });

    if (assigned.id) {
      return res.status(200).json({
        message: "Task assign succefully",
        data: assigned,
        error: null,
      });
    }
  } catch (error: any) {
    console.log(error.message);
    return res.status(500).json({
      message: "Server problem",
      error: typeof error?.message && error.message,
    });
  }
});

router.post("/task-create", async (req: Request, res: Response) => {
  const { userId } = getAuth(req);

  if (!userId) {
    return res
      .status(401)
      .json({ data: null, message: null, error: "User not found" });
  }

  const {
    title,
    description,
    assignedTo,
    assignedBy,
    difficulty_level,
    dead_line,
    outcomes,
    prerequisites,
  } = req.body;

  if (
    !title &&
    !description &&
    !assignedTo &&
    !assignedBy &&
    !difficulty_level &&
    !dead_line &&
    !outcomes &&
    !prerequisites
  ) {
    return res.status(400).json({
      message: "All the details are required",
      error:
        "All the details title, description, assignedTo, assignedBy, difficulty_level, dead_line, outcomes, prerequisites required",
      data: null,
    });
  }

  try {
    const task = await prismaClient.task.create({
      data: {
        approved: true,
        userId: assignedTo,
        status: "assigned",
        title,
        description,
        difficulty_level,
        dead_line,
        assignedBy,
        outcomes,
        prerequisites,
      },
    });

    if (!task.id) {
      return res.status(404).json({
        message: "Unable to create task",
        error: "Unable to create task",
        data: null,
      });
    }

    return res.status(200).json({
      message: "Task created and assigned.",
      error: null,
      data: task,
    });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({
      message: "Unable to create task",
      error: typeof error.message ? error.message : "Internal server error",
      data: null,
    });
  }
});

router.patch("/user-approve", async (req: Request, res: Response) => {
  const { userId: currentUser } = getAuth(req);

  if (!currentUser) {
    return res
      .status(401)
      .json({ data: null, message: null, error: "User not found" });
  }

  const { userId } = req.body;

  if (!userId) {
    return res.status(404).json({
      message: "User not found",
      error: "User not found",
      data: null,
    });
  }

  try {
    const user = await prismaClient.user.update({
      where: {
        id: userId,
      },
      data: {
        approved: true,
      },
    });
    console.log(user);
    if (user.id) {
      
      if (!user?.clerkuuid) {
        return res.status(404).json({
          message: "Clerk approved failed",
          error: "User approved in db but not approved in clerk",
          data: null,
        });
      }

      const client = getClerkClient();
      const currentUser = await client.users.getUser(user.clerkuuid);
      const previousPublicMetaData = currentUser.publicMetadata;
      const udpatedPublicMetatData = {
        ...previousPublicMetaData,
        approved: true,
      };
      await client.users.updateUserMetadata(user.clerkuuid, {
        publicMetadata: udpatedPublicMetatData,
      });

      return res.status(200).json({
        message: "user approved",
        error: null,
        data: user,
      });
    }
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({
      message: "Server side error",
      error:
        typeof error?.message === "string" ? error.message : "Server error",
    });
  }
});

router.patch("/user-toggle-ban", async (req: Request, res: Response) => {
  const { userId: currentUser } = getAuth(req);

  if (!currentUser) {
    return res
      .status(401)
      .json({ data: null, message: null, error: "User not found" });
  }

  const { userId, banned } = req.body;

  if (!userId && !banned) {
    return res.status(404).json({
      message: "User and banned status no found",
      error: "User and banned status not found",
      data: null,
    });
  }

  try {
    const user = await prismaClient.user.update({
      where: {
        id: userId,
      },
      data: {
        banned,
      },
    });
    console.log(user);
    if (user.id) {
      return res.status(200).json({
        message: banned ? "User banned" : "user unbanned",
        error: null,
        data: user,
      });
    }
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({
      message: "Server side error",
      error:
        typeof error?.message === "string" ? error.message : "Server error",
    });
  }
});

export default router;

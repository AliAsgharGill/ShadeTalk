import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function POST(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || session.user) {
    return Response.json(
      {
        success: false,
        message: "User not Authenticated",
      },
      { status: 404 }
    );
  }

  const userId = user._id;
  const { acceptMessages } = await request.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessage: acceptMessages },
      {
        new: true,
      }
    );
    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }
    return Response.json(
      {
        success: true,
        message: "Messages accepted successfully",
        updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error accepting messages:", error);
    return Response.json(
      {
        success: false,
        message: "Error accepting messages",
      },
      { status: 500 }
    );
  }
}

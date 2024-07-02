import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  await dbConnect();
  try {
    // here we will get username from url using searchParams
    const { searchParams } = new URL(request.url);
    const queryParam = { username: searchParams.get("username") };

    // here we will validate username using zod schema
    const result = UsernameQuerySchema.safeParse(queryParam);
    // console.log("result", result);

    // what if username is not valid
    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            usernameErrors.length > 0
              ? usernameErrors.join(",")
              : "Invalid username",
          errors: usernameErrors,
        },
        { status: 400 }
      );
    }

    const { username } = result.data;
    const existingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUser) {
      return Response.json(
        {
          success: true,
          message: "Username is already taken",
        },
        { status: 200 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Username is available",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error checking username:", error);
    return Response.json(
      {
        success: false,
        message: "Error checking username,Something went wrong",
      },
      { status: 500 }
    );
  }
}

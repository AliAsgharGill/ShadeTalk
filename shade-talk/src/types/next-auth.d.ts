import "next-auth";

// we can modify original User interface of next-auth in *next-auth.d.ts*
// we modified it because we want when we get token we also get other information of user like, id, verification status, isMessageAccepting and username. These all with token.

// here we modified User interface.
declare module "next-auth" {
  interface User {
    _id?: string;
    isVerified: boolean;
    isAcceptingMessage: boolean;
    username?: string;
  }

  // we have modified original Session interface of next-auth in *next-auth.d.ts*
  interface Session {
    user: {
      _id?: string;
      isVerified: boolean;
      isAcceptingMessage: boolean;
      username?: string;
    } & DefaultSession["user"];
  }
}

// This is another method to modify JWT interface of next-auths
// declare module "next-auth/jwt" {
//   interface JWT {
//     _id?: string;
//     isVerified: boolean;
//     isAcceptingMessage: boolean;
//     username?: string;
//   }
// }

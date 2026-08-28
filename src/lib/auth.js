import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { admin } from "better-auth/plugins";

const client = new MongoClient(process.env.MONGO_DB_URI);
const db = client.db(process.env.AUTH_DB_NAME);

// role হিসেবে গ্রহণযোগ্য মানগুলো — admin ইচ্ছাকৃতভাবে বাদ, কারণ এটা signup থেকে সেট হওয়া উচিত না
const ALLOWED_SIGNUP_ROLES = ["user", "lawyer"];

export const auth = betterAuth({
  trustedOrigins: [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://legalease-pearl-eta.vercel.app",
  ],
  emailAndPassword: {
    enabled: true,
  },
  database: mongodbAdapter(db, { client }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },

  user: {
    additionalFields: {
      // ✅ এটা "role" না — এটা শুধু ইউজারের ইচ্ছা/অনুরোধ ধরে রাখে
      requestedRole: {
        type: "string",
        required: false,
        input: true, // ক্লায়েন্ট থেকে পাঠানো যাবে
      },
      publishingPaid: {
        type: "boolean",
        defaultValue: false,
      },
      publishingPaidAt: {
        type: "date",
        required: false,
      },
      publishingTransactionId: {
        type: "string",
        required: false,
      },
    },
  },

  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const requested = user.requestedRole;
          const finalRole = ALLOWED_SIGNUP_ROLES.includes(requested)
            ? requested
            : "user";

          return {
            data: {
              ...user,
              role: finalRole, // ✅ এখানে সার্ভার-সাইডে validate করে role সেট হচ্ছে
            },
          };
        },
      },
    },
  },

  plugins: [
    admin({
      defaultRole: "user",
      adminRoles: ["admin"], // কারা admin API ব্যবহার করতে পারবে
    }),
  ],
});
import { ADMIN_EMAIL, defaultProducts, defaultSettings } from "@/lib/constants";
import { connectDatabase } from "@/lib/db";
import Admin from "@/models/Admin";
import Product from "@/models/Product";
import Setting from "@/models/Setting";

let seedPromise;

export async function ensureSeeded() {
  if (!seedPromise) {
    seedPromise = (async () => {
      await connectDatabase();

      if (!(await Setting.countDocuments())) {
        await Setting.create({ ...defaultSettings, gmailUser: ADMIN_EMAIL });
      }

      if (!(await Admin.countDocuments())) {
        await Admin.create({ email: ADMIN_EMAIL, passwordHash: "", passwordSalt: "", sessions: [] });
      }

      if (!(await Product.countDocuments())) {
        await Product.insertMany(defaultProducts);
      }
    })();
  }

  return seedPromise;
}

"use server";

import { redirect } from "next/navigation";
import { deleteSession } from "../utils/auth";

export default async function () {
  deleteSession();
  redirect("/");
}

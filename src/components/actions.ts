"use server";

import { deleteSession } from "@/app/utils/auth";

// export async function signOut() {
//
// }

export async function create() {
  console.log("hi");
  deleteSession();
}

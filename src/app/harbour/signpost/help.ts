"use server";

import { getWakaSessions } from "@/app/utils/waka";

export async function sesss() {
  const s = await getWakaSessions();
  console.log(s);
}

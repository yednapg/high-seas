"use server";

import { getSession } from "../../utils/auth";

// export async function hasHb(username: string, key: string): Promise<boolean> {
//   if (!username)
//     throw new Error("Username is undefined while checking waka hasData");

//   const res = await fetch(
//     `https://waka.hackclub.com/api/special/hasData?user=${username}`,
//     { headers: { Authorization: `Bearer ${process.env.WAKA_API_KEY}` } },
//   );
//   if (!res.ok) {
//     const txt = await res.text();
//     const err = new Error(
//       `Error while checking ${username}'s waka hasData: ${txt}`,
//     );
//     console.error(err);
//     throw err;
//   }

//   const resJson = await res.json();
//   return resJson.hasData === true;
// }

"use server";

export async function hasHb(username: string, key: string): Promise<boolean> {
  const res = await fetch(
    `https://waka.hackclub.com/api/special/hasData?user=${username}`,
    { headers: { Authorization: `Bearer ${key}` } },
  ).then((d) => d.json());

  return res.hasData === true;
}

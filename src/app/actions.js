"use server";

import { revalidateTag } from "next/cache";

export default async function revalidate_data(tag) {
  revalidateTag(tag);
}

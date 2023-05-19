import Viewer from "@/components/viewer";
import { MongoClient } from "mongodb";
import { headers } from "next/headers";

async function getItem() {
  const headers_val = headers();
  const client = new MongoClient(process.env.MONGODB_URI as string);

  await client.connect();

  const collection = client.db("myDB").collection("images");

  const item = await collection.findOneAndUpdate(
    { done: false },
    { $set: { done: false } } // TODO: change for prod
  );

  return item.value;
}

export interface Image {
  name: string;
  size: [number, number];
}

export default async function Home() {
  let raw_data = await getItem();

  const data = JSON.stringify(raw_data, ["name", "size"]) as unknown as Image;

  return (
    <main>
      <Viewer image={data} />
    </main>
  );
}

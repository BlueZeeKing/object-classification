import { MongoClient } from "mongodb";

export async function POST(request: Request) {
  const client = new MongoClient(process.env.MONGODB_URI as string);

  await client.connect();

  const collection = client.db("myDB").collection("images");

  const data: {
    name: string;
    data: { x: number; y: number; width: number; height: number };
  } = await request.json();

  collection.updateOne(
    { name: data.name },
    { $set: { boundingBox: data.data } }
  );

  return new Response();
}

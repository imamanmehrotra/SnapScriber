import { NextResponse } from "next/server";
import { groq } from "@/lib/groq";

const model = "meta-llama/llama-4-maverick-17b-128e-instruct";

function creativityToTemp(level: string) {
  if (level === "High") return 0.8;
  if (level === "Medium") return 0.7;
  return 0.6;
}

function lengthToTokens(len: string) {
  if (len === "10 - 20") return 300;
  if (len === "20 - 80") return 700;
  if (len === "80 - 140") return 1000;
  return 1200;
}

function parseCaptions(content: string) {
  try {
    const data = JSON.parse(content);
    return Object.values<any>(data).map((item) => ({
      text: item.text ?? "",
      hashtag: item.hashtag ?? "",
    }));
  } catch (err) {
    return [];
  }
}

async function fileToBase64(file: File) {
  const arrayBuffer = await file.arrayBuffer();
  return Buffer.from(arrayBuffer).toString("base64");
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }

    const tone = (form.get("tone") as string) || "";
    const creativity = (form.get("creativity") as string) || "";
    const captionLength = (form.get("captionLength") as string) || "";
    const language = (form.get("language") as string) || "";
    const keywords = (form.get("keywords") as string) || "";
    const numCaptions = Number(form.get("numCaptions") || 1);

    if (!tone || !creativity || !captionLength || !language) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const temp = creativityToTemp(creativity);
    const tokenLen = lengthToTokens(captionLength);
    const base64Image = await fileToBase64(file);

    const prompt = `Generate ${numCaptions} instagram post captions for this image in ${language} language.
The tone should be ${tone}.
The creativity level should be ${creativity}.
Each caption length should be ${captionLength} words.
Please use at least one of words from: ${keywords}, while generating captions. If empty, no keyword restriction.
Include relevant and trending hashtags for each caption.
Return ONLY JSON in this format:
{
  "Caption 1": {"text": "some text", "hashtag": "#few-hashtags"},
  "Caption 2": {"text": "another text", "hashtag": "#another-hashtags"}
}`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      model,
      response_format: { type: "json_object" },
      top_p: 1,
      temperature: temp,
      max_tokens: tokenLen,
      seed: 42,
      n: 1,
    });

    const content = completion.choices[0]?.message?.content || "{}";
    const captions = parseCaptions(content);

    return NextResponse.json({ captions });
  } catch (error: any) {
    console.error("image caption error", error);
    return NextResponse.json({ error: error?.message || "Server error" }, { status: 500 });
  }
}

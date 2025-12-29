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

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      tone,
      creativity,
      captionLength,
      language,
      keywords,
      numCaptions,
    } = body as {
      tone: string;
      creativity: string;
      captionLength: string;
      language: string;
      keywords: string;
      numCaptions: number;
    };

    if (!tone || !creativity || !captionLength || !language || !numCaptions) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const temp = creativityToTemp(creativity);
    const tokenLen = lengthToTokens(captionLength);

    const prompt = `
Generate ${numCaptions} Instagram post captions in ${language} language.
The tone should be ${tone}.
The creativity level should be ${creativity}.
Each of the generated captions should have a length of ${captionLength} words.
You need to use at least one of the following keywords, or their synonyms, or any other form of these words: ${keywords || ""}, while generating captions.
If the keyword list is empty, generate captions without any keyword restrictions.
Make sure that you also provide the relevant and trending hashtags followed by each caption.
Do not generate anything else apart from captions in JSON format.
Generate the captions only in JSON format and stick to the format defined below:

{
    "Caption 1": {
        "text": "some text",
        "hashtag": "#few-hashtags"
    },
    "Caption 2": {
        "text": "another text",
        "hashtag": "#another-hashtags"
    }
}
`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
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
    console.error("text caption error", error);
    return NextResponse.json({ error: error?.message || "Server error" }, { status: 500 });
  }
}

const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function analyzeDocument(documentText) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is missing in the backend .env file");
  }

  const limitedText = documentText.slice(0, 14000);

  const prompt = `
You are an AI document intelligence assistant.

Analyze the document text and return ONLY valid JSON.
Do not include markdown.
Do not include explanations outside JSON.

Your tasks:
1. Classify the document type.
2. Give a confidence score from 0 to 100.
3. Summarize the document clearly.
4. Extract key information.
5. Identify missing or incomplete details based on the document type.
6. Identify risks, issues, or concerns.
7. Recommend useful next steps.

Supported document categories include:
- Resume
- Invoice
- Contract
- Report
- Form
- Letter
- Business Document
- Other

Document text:
${limitedText}

Return JSON exactly in this structure:

{
  "documentType": "",
  "confidenceScore": 0,
  "summary": "",
  "keyDetails": {
    "names": [],
    "emails": [],
    "phoneNumbers": [],
    "dates": [],
    "amounts": [],
    "addresses": [],
    "organizations": [],
    "skills": [],
    "importantTerms": []
  },
  "missingDetails": [],
  "risksOrIssues": [],
  "recommendedActions": []
}
`;

  const response = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
    messages: [
      {
        role: "system",
        content:
          "You are a document analysis engine. Always return valid JSON only.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.2,
    response_format: {
      type: "json_object",
    },
  });

  const content = response.choices[0].message.content;

  try {
    const parsed = JSON.parse(content);
    return normalizeAnalysis(parsed);
  } catch (error) {
    console.error("Failed to parse AI JSON:", content);

    return {
      documentType: "Unknown",
      confidenceScore: 0,
      summary:
        "The document was processed, but the AI response could not be converted into structured JSON.",
      keyDetails: {
        names: [],
        emails: [],
        phoneNumbers: [],
        dates: [],
        amounts: [],
        addresses: [],
        organizations: [],
        skills: [],
        importantTerms: [],
      },
      missingDetails: ["AI response was not valid JSON"],
      risksOrIssues: ["The analysis may be incomplete"],
      recommendedActions: ["Try uploading the document again"],
    };
  }
}

function normalizeAnalysis(data) {
  return {
    documentType: data.documentType || "Unknown",
    confidenceScore:
      typeof data.confidenceScore === "number" ? data.confidenceScore : 0,
    summary: data.summary || "No summary generated.",
    keyDetails: {
      names: data.keyDetails?.names || [],
      emails: data.keyDetails?.emails || [],
      phoneNumbers: data.keyDetails?.phoneNumbers || [],
      dates: data.keyDetails?.dates || [],
      amounts: data.keyDetails?.amounts || [],
      addresses: data.keyDetails?.addresses || [],
      organizations: data.keyDetails?.organizations || [],
      skills: data.keyDetails?.skills || [],
      importantTerms: data.keyDetails?.importantTerms || [],
    },
    missingDetails: data.missingDetails || [],
    risksOrIssues: data.risksOrIssues || [],
    recommendedActions: data.recommendedActions || [],
  };
}

module.exports = { analyzeDocument };

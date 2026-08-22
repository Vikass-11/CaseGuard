import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({ region: process.env.AWS_REGION || 'us-east-1' });

export async function generateTitanEmbedding(text: string): Promise<number[]> {
  if (process.env.USE_MOCK_BEDROCK === 'true') {
    // Return dummy vector of length 1024 for testing
    return Array.from({ length: 1024 }, () => Math.random());
  }

  const payload = {
    inputText: text,
  };

  const command = new InvokeModelCommand({
    modelId: "amazon.titan-embed-text-v2:0",
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify(payload)
  });

  const response = await client.send(command);
  const responseBody = JSON.parse(new TextDecoder().decode(response.body));
  return responseBody.embedding;
}

export async function cohereRerank(query: string, documents: string[], topN: number = 5): Promise<any[]> {
  if (process.env.USE_MOCK_BEDROCK === 'true') {
    // Mock simply returns documents in order with fake scores
    return documents.slice(0, topN).map((doc, i) => ({
      index: i,
      relevance_score: 0.9 - (i * 0.1)
    }));
  }

  const payload = {
    query,
    documents,
    top_n: topN,
    return_documents: false
  };

  const command = new InvokeModelCommand({
    modelId: "cohere.rerank-v3-5:0", // Default Cohere Rerank model ID on Bedrock
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify(payload)
  });

  const response = await client.send(command);
  const responseBody = JSON.parse(new TextDecoder().decode(response.body));
  return responseBody.results;
}

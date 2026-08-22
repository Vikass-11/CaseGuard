import ResearchChunk from '../models/ResearchChunk';
import { generateTitanEmbedding, cohereRerank } from './bedrock';

export async function retrieveResearch(query: string, k: number = 5) {
  // 1. Embed query
  const queryEmbedding = await generateTitanEmbedding(query);

  // 2. Vector Search (Atlas Vector Search format)
  // Requires MongoDB Atlas cluster with vectorSearch index named "vector_index"
  const vectorResults = await ResearchChunk.aggregate([
    {
      "$vectorSearch": {
        index: "vector_index",
        path: "embedding",
        queryVector: queryEmbedding,
        numCandidates: k * 10,
        limit: k * 2
      }
    }
  ]);

  // 3. Lexical Search (Atlas Search format)
  // Requires MongoDB Atlas cluster with search index named "default"
  const lexicalResults = await ResearchChunk.aggregate([
    {
      "$search": {
        index: "default",
        text: {
          query: query,
          path: "chunkText"
        }
      }
    },
    { $limit: k * 2 }
  ]);

  // 4. Reciprocal Rank Fusion (RRF)
  const fusionScores = new Map<string, { doc: any, score: number }>();
  const RRF_K = 60; // Standard constant for RRF

  const addScore = (doc: any, rank: number) => {
    const id = doc._id.toString();
    const current = fusionScores.get(id) || { doc, score: 0 };
    current.score += 1 / (RRF_K + rank);
    fusionScores.set(id, current);
  };

  vectorResults.forEach((doc, idx) => addScore(doc, idx + 1));
  lexicalResults.forEach((doc, idx) => addScore(doc, idx + 1));

  // Sort by fusion score
  const mergedCandidates = Array.from(fusionScores.values())
    .sort((a, b) => b.score - a.score)
    .map(entry => entry.doc);

  if (mergedCandidates.length === 0) return [];

  // 5. Rerank
  const textsToRerank = mergedCandidates.map(c => c.chunkText);
  const rerankedResults = await cohereRerank(query, textsToRerank, k);

  // Map back to original documents based on reranker indices
  const finalResults = rerankedResults.map(r => {
    const originalDoc = mergedCandidates[r.index];
    return {
      chunkText: originalDoc.chunkText,
      sourceDocId: originalDoc.sourceDocId,
      sectionHeading: originalDoc.sectionHeading,
      relevanceScore: r.relevance_score
    };
  });

  return finalResults;
}

// MOCK Retrieval for Local Dev (when not connected to Atlas)
export async function mockRetrieveResearch(query: string, k: number = 5) {
  // Simple regex search for local testing without Atlas
  const allDocs = await ResearchChunk.find({
    chunkText: { $regex: query.split(' ')[0], $options: 'i' }
  }).limit(k);

  return allDocs.map(doc => ({
    chunkText: doc.chunkText,
    sourceDocId: doc.sourceDocId,
    sectionHeading: doc.sectionHeading,
    relevanceScore: 0.99
  }));
}

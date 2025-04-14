import React from 'react';

type DataType = {
  subtopics: string[];
  time_allocation: string[];
  resources: string[];
};

const data: DataType = {
  subtopics: [
    "Day 1: Introduction to Vector Databases - What and Why",
    "Day 1: Vector Embeddings: Understanding and Creation",
    "Day 1: Basic Vector Database Operations (CRUD)",
    "Day 2: Vector Similarity Search Algorithms",
    "Day 2: Indexing Techniques for Vector Databases",
    "Day 2: Evaluating Vector Database Performance",
    "Day 3: Vector Databases in Real-World Applications",
    "Day 3: Choosing the Right Vector Database",
    "Day 3: Advanced Topics: Scaling, Security, and Monitoring",
  ],
  time_allocation: [
    "Day 1: 1.5 hours",
    "Day 1: 2 hours",
    "Day 1: 1.5 hours",
    "Day 2: 2 hours",
    "Day 2: 2 hours",
    "Day 2: 1 hour",
    "Day 3: 2 hours",
    "Day 3: 1.5 hours",
    "Day 3: 1.5 hours",
  ],
  resources: [
    "Day 1: Blog posts, introductory articles, and vendor documentation (Pinecone, Weaviate, Milvus). Example: Pinecone's documentation on vector databases.",
    "Day 1: Tutorials on word embeddings (Word2Vec, GloVe, FastText), Sentence Transformers documentation, OpenAI embedding API documentation.",
    "Day 1: Example code snippets using a specific Vector DB SDK (Pinecone Python client, Weaviate Go client). Quickstart guides for CRUD operations.",
    "Day 2: Research papers on approximate nearest neighbor search (ANN) algorithms (e.g., HNSW, FAISS), blog posts comparing different algorithms.",
    "Day 2: Documentation on indexing techniques used in specific Vector DBs (e.g., IVF in FAISS, HNSW in Weaviate). Benchmarking reports.",
    "Day 2: Articles and blog posts on evaluating recall, precision, and query latency in vector search. Tools for performance testing.",
    "Day 3: Case studies and examples of using Vector DBs in recommendation systems, search engines, fraud detection, and image retrieval.",
    "Day 3: Comparison matrices and articles evaluating different Vector DBs based on factors like cost, scalability, ease of use, and features.",
    "Day 3: Documentation on scaling strategies, security best practices (authentication, authorization, encryption), and monitoring tools for Vector DBs.",
  ],
};

const Table: React.FC = () => {
  return (
    <div className="overflow-x-auto">
      <div className="shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-blue-50 to-white">
        <table className="w-full text-left border-collapse min-w-[700px]">
          {/* Table Head */}
          <thead>
            <tr className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800">
              <th className="px-6 py-4 font-semibold uppercase border-b border-blue-300">Subtopic</th>
              <th className="px-6 py-4 font-semibold uppercase border-b border-blue-300">Time Allocation</th>
              <th className="px-6 py-4 font-semibold uppercase border-b border-blue-300">Resources</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {data.subtopics.map((subtopic, index) => (
              <tr 
                key={index} 
                className="hover:bg-blue-50 transition duration-200 ease-in-out"
              >
                {/* Subtopic */}
                <td className="px-6 py-4 border-b border-blue-100">
                  <span className="text-gray-800">{subtopic}</span>
                </td>

                {/* Time Allocation */}
                <td className="px-6 py-4 border-b border-blue-100">
                  <span className="text-gray-600">{data.time_allocation[index]}</span>
                </td>

                {/* Resources */}
                <td className="px-6 py-4 border-b border-blue-100">
                  <span className="text-gray-600">{data.resources[index]}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;

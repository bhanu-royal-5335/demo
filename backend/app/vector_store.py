import math
import re
from typing import List, Dict, Any
from app.sample_corpus import SAMPLE_CORPUS
from app.config import config

class VectorStore:
    def __init__(self):
        self.documents: List[Dict[str, Any]] = []
        self.passages: List[Dict[str, Any]] = []
        self.vocabulary: Dict[str, int] = {}
        self.idf: Dict[str, float] = {}
        self.passage_vectors: List[Dict[str, float]] = []
        
        # Load sample corpus on startup
        self.load_corpus(SAMPLE_CORPUS)

    def _tokenize(self, text: str) -> List[str]:
        """Simple, robust regex tokenizer for keyword/vector indexing."""
        words = re.findall(r'\b[a-zA-Z0-9\-]{2,}\b', text.lower())
        stopwords = {'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'it', 'this', 'that'}
        return [w for w in words if w not in stopwords]

    def _chunk_text(self, text: str, chunk_size: int = 250) -> List[str]:
        """Splits document text into sentence-aware chunks/passages."""
        sentences = re.split(r'(?<=[.!?])\s+', text)
        chunks = []
        current_chunk = []
        current_length = 0
        
        for sentence in sentences:
            if current_length + len(sentence) > chunk_size and current_chunk:
                chunks.append(" ".join(current_chunk))
                current_chunk = [sentence]
                current_length = len(sentence)
            else:
                current_chunk.append(sentence)
                current_length += len(sentence)
        if current_chunk:
            chunks.append(" ".join(current_chunk))
        return chunks

    def load_corpus(self, docs: List[Dict[str, Any]]):
        """Loads and indexes a list of documents into passages."""
        self.documents = docs
        self.passages = []
        
        passage_id_counter = 1
        for doc in docs:
            chunks = self._chunk_text(doc["content"], config.PASSAGE_CHUNK_SIZE)
            for idx, chunk in enumerate(chunks):
                self.passages.append({
                    "passage_id": f"P-{passage_id_counter:03d}",
                    "doc_id": doc["id"],
                    "doc_title": doc["title"],
                    "author": doc.get("author", "Unknown"),
                    "category": doc.get("category", "General"),
                    "passage_index": idx + 1,
                    "text": chunk
                })
                passage_id_counter += 1
                
        self._build_index()

    def add_document(self, title: str, content: str, author: str = "User Ingested", category: str = "Custom") -> Dict[str, Any]:
        doc_id = f"DOC-{len(self.documents) + 1:03d}"
        new_doc = {
            "id": doc_id,
            "title": title,
            "author": author,
            "category": category,
            "content": content
        }
        self.documents.append(new_doc)
        
        # Add passages
        chunks = self._chunk_text(content, config.PASSAGE_CHUNK_SIZE)
        start_id = len(self.passages) + 1
        for idx, chunk in enumerate(chunks):
            self.passages.append({
                "passage_id": f"P-{start_id + idx:03d}",
                "doc_id": doc_id,
                "doc_title": title,
                "author": author,
                "category": category,
                "passage_index": idx + 1,
                "text": chunk
            })
            
        self._build_index()
        return new_doc

    def _build_index(self):
        """Calculates TF-IDF index over all passage chunks."""
        doc_count = len(self.passages)
        if doc_count == 0:
            return
            
        doc_freq: Dict[str, int] = {}
        passage_tokens = []
        
        for p in self.passages:
            tokens = self._tokenize(p["text"] + " " + p["doc_title"])
            passage_tokens.append(tokens)
            unique_tokens = set(tokens)
            for t in unique_tokens:
                doc_freq[t] = doc_freq.get(t, 0) + 1
                
        # Calculate IDF
        self.idf = {t: math.log((doc_count + 1) / (df + 1)) + 1.0 for t, df in doc_freq.items()}
        
        # Calculate TF-IDF vectors for each passage
        self.passage_vectors = []
        for tokens in passage_tokens:
            tf: Dict[str, int] = {}
            for t in tokens:
                tf[t] = tf.get(t, 0) + 1
            length = len(tokens) if len(tokens) > 0 else 1
            vector = {t: (count / length) * self.idf.get(t, 1.0) for t, count in tf.items()}
            self.passage_vectors.append(vector)

    def search(self, query: str, top_k: int = None) -> List[Dict[str, Any]]:
        """Hybrid search returning ranked passages with similarity scores."""
        if top_k is None:
            top_k = config.TOP_K_RETRIEVAL
            
        query_tokens = self._tokenize(query)
        if not query_tokens or not self.passages:
            return self.passages[:top_k]
            
        # Calculate query TF-IDF vector
        q_tf = {}
        for t in query_tokens:
            q_tf[t] = q_tf.get(t, 0) + 1
        q_len = len(query_tokens)
        q_vec = {t: (count / q_len) * self.idf.get(t, 1.0) for t, count in q_tf.items()}
        
        # Cosine similarity matching
        scores = []
        q_norm = math.sqrt(sum(val ** 2 for val in q_vec.values()))
        
        for idx, p_vec in enumerate(self.passage_vectors):
            dot_product = sum(q_vec[t] * p_vec.get(t, 0.0) for t in q_vec if t in p_vec)
            p_norm = math.sqrt(sum(val ** 2 for val in p_vec.values()))
            
            similarity = 0.0
            if q_norm > 0 and p_norm > 0:
                similarity = dot_product / (q_norm * p_norm)
                
            # Boost score for keyword presence in passage text
            passage = self.passages[idx]
            keyword_matches = sum(1 for t in query_tokens if t in passage["text"].lower())
            keyword_boost = 0.05 * keyword_matches
            
            final_score = round(min(1.0, similarity + keyword_boost), 4)
            scores.append((final_score, passage))
            
        scores.sort(key=lambda x: x[0], reverse=True)
        
        results = []
        for score, passage in scores[:top_k]:
            res = dict(passage)
            res["score"] = score
            results.append(res)
            
        return results

vector_store = VectorStore()

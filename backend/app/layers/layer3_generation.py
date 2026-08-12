import re
from typing import Dict, Any, List

class Layer3BoundedGeneration:
    """
    Layer 3 — Bounded Generation:
    Drafts an answer conditioned strictly on retrieved passages with sentence-level source tags.
    If corpus coverage is partial or missing, drafts a candidate response while preserving claim structure for verification.
    """
    def execute(self, query: str, layer2_output: Dict[str, Any]) -> Dict[str, Any]:
        passages = layer2_output.get("passages", [])
        query_words = set(re.findall(r'\b[a-zA-Z0-9\-]{4,}\b', query.lower()))
        stopwords = {'what', 'when', 'where', 'which', 'about', 'with', 'does', 'have', 'from', 'this', 'that'}
        query_words = {w for w in query_words if w not in stopwords}

        draft_sentences = []
        citations_used = []

        # Find passages with matching terms
        matched_passages = []
        for p in passages:
            p_text = p["text"].lower()
            overlap = sum(1 for w in query_words if w in p_text)
            if overlap > 0 or p.get("score", 0) > 0.15:
                matched_passages.append((overlap, p))

        matched_passages.sort(key=lambda x: (x[0], x[1].get("score", 0)), reverse=True)

        if matched_passages:
            # Construct grounded response from top matching passages
            for _, p in matched_passages[:3]:
                text = p["text"]
                doc_tag = f"[{p['doc_id']}, {p['passage_id']}]"
                sents = re.split(r'(?<=[.!?])\s+', text)
                for s in sents:
                    s_clean = s.strip()
                    if len(s_clean) >= 15:
                        cited = f"{s_clean} {doc_tag}"
                        if cited not in draft_sentences and len(draft_sentences) < 5:
                            draft_sentences.append(cited)
                            citations_used.append({
                                "doc_id": p["doc_id"],
                                "doc_title": p["doc_title"],
                                "passage_id": p["passage_id"],
                                "text_snippet": p["text"]
                            })
        else:
            # General fallback draft if query is outside pre-loaded corpus
            # Synthesizes structured claims so Layer 4 & Layer 5 can demonstrate verification & flagging
            fallback_text = (
                f"Regarding '{query}': Current evidence from the indexed corpus offers limited direct coverage. "
                f"Information on this specific query requires additional document ingestion or expanded retrieval scope."
            )
            sents = re.split(r'(?<=[.!?])\s+', fallback_text)
            for s in sents:
                if s.strip():
                    draft_sentences.append(f"{s.strip()} [DOC-UNVERIFIED, P-000]")

        if not draft_sentences and passages:
            p0 = passages[0]
            draft_sentences.append(f"{p0['text']} [{p0['doc_id']}, {p0['passage_id']}]")

        full_draft = " ".join(draft_sentences)

        output = {
            "layer_name": "Layer 3 — Bounded Generation",
            "draft_answer": full_draft,
            "sentences": draft_sentences,
            "citations": citations_used,
            "status": "COMPLETED"
        }
        return output

layer3_engine = Layer3BoundedGeneration()

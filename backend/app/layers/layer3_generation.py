import re
from typing import Dict, Any, List

class Layer3BoundedGeneration:
    """
    Layer 3 — Bounded Generation:
    Drafts an answer conditioned ONLY on retrieved passages, with sentence-level source tags.
    """
    def execute(self, query: str, layer2_output: Dict[str, Any]) -> Dict[str, Any]:
        passages = layer2_output.get("passages", [])
        
        if not passages:
            return {
                "layer_name": "Layer 3 — Bounded Generation",
                "draft_answer": "No relevant context was found in the indexed corpus to answer the query.",
                "sentences": [],
                "citations": [],
                "status": "COMPLETED_EMPTY"
            }

        # Build sentence-level draft with source tags
        draft_sentences = []
        citations_used = []

        # Construct concise response synthesis from retrieved passages
        query_words = set(re.findall(r'\b\w{4,}\b', query.lower()))
        
        for idx, p in enumerate(passages):
            text = p["text"]
            doc_tag = f"[{p['doc_id']}, {p['passage_id']}]"
            
            # Extract key sentences from passage
            raw_sents = re.split(r'(?<=[.!?])\s+', text)
            for s in raw_sents:
                s_clean = s.strip()
                if len(s_clean) < 15:
                    continue
                # Check keyword overlap or take primary statements
                if any(w in s_clean.lower() for w in query_words) or idx < 2:
                    cited_sentence = f"{s_clean} {doc_tag}"
                    if cited_sentence not in draft_sentences and len(draft_sentences) < 5:
                        draft_sentences.append(cited_sentence)
                        citations_used.append({
                            "doc_id": p["doc_id"],
                            "doc_title": p["doc_title"],
                            "passage_id": p["passage_id"],
                            "text_snippet": p["text"]
                        })

        if not draft_sentences:
            p0 = passages[0]
            draft_sentences.append(f"{p0['text']} [{p0['doc_id']}, {p0['passage_id']}]")
            citations_used.append({
                "doc_id": p0["doc_id"],
                "doc_title": p0["doc_title"],
                "passage_id": p0["passage_id"],
                "text_snippet": p0["text"]
            })

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

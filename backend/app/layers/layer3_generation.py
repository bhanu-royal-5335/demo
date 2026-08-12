import re
from typing import Dict, Any, List
from app.llm_provider import llm_provider

class Layer3BoundedGeneration:
    """
    Layer 3 — Bounded Generation:
    Executes answer generation via selected AI Agent (ChatGPT, Gemini, Claude, DuckDuckGo Live Web Search, or Vector Corpus).
    """

    def execute(self, query: str, layer2_output: Dict[str, Any], api_key: str = "", selected_agent: str = "auto") -> Dict[str, Any]:
        passages = layer2_output.get("passages", [])
        
        query_words = set(re.findall(r'\b[a-zA-Z0-9\-]{3,}\b', query.lower()))
        stopwords = {'what', 'when', 'where', 'which', 'who', 'how', 'why', 'about', 'with', 'does', 'have', 'from', 'this', 'that', 'in', 'the', 'is', 'are', 'was', 'were'}
        query_words = {w for w in query_words if w not in stopwords}

        matched_passages = []
        for p in passages:
            p_text = p["text"].lower()
            overlap_count = sum(1 for w in query_words if w in p_text)
            if overlap_count >= 2 or (overlap_count >= 1 and len(query_words) <= 2):
                matched_passages.append(p)

        # Execute chosen Agent
        llm_res = llm_provider.generate_llm_response(
            query=query,
            context_passages=matched_passages if matched_passages else passages[:2],
            api_key=api_key,
            selected_agent=selected_agent
        )

        full_text = llm_res.get("text", "")
        provider_name = llm_res.get("provider", "Multi-Agent Core")

        raw_sents = re.split(r'(?<=[.!?])\s+', full_text)
        draft_sentences = []
        citations_used = []

        is_grounded = "Corpus" in provider_name or len(matched_passages) > 0

        for idx, s in enumerate(raw_sents):
            s_clean = s.strip()
            if not s_clean:
                continue

            if is_grounded and matched_passages:
                best_p = matched_passages[min(idx, len(matched_passages) - 1)]
                doc_tag = f"[{best_p['doc_id']}, {best_p['passage_id']}]"
                cited = f"{s_clean} {doc_tag}" if doc_tag not in s_clean else s_clean
                draft_sentences.append(cited)
                citations_used.append({
                    "doc_id": best_p["doc_id"],
                    "doc_title": best_p["doc_title"],
                    "passage_id": best_p["passage_id"],
                    "text_snippet": best_p["text"]
                })
            else:
                doc_tag = f"[{provider_name}]"
                cited = f"{s_clean} {doc_tag}" if not re.search(r'\[.+\]', s_clean) else s_clean
                draft_sentences.append(cited)
                citations_used.append({
                    "doc_id": "AGENT_RESPONSE",
                    "doc_title": provider_name,
                    "passage_id": "AG-001",
                    "text_snippet": s_clean
                })

        output = {
            "layer_name": f"Layer 3 — Bounded Generation ({provider_name})",
            "draft_answer": " ".join(draft_sentences),
            "sentences": draft_sentences,
            "citations": citations_used,
            "provider_used": provider_name,
            "corpus_grounded": is_grounded,
            "status": "COMPLETED"
        }
        return output

layer3_engine = Layer3BoundedGeneration()

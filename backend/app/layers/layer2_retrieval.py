from typing import Dict, Any, List
from app.vector_store import vector_store
from app.config import config

class Layer2Retrieval:
    """
    Layer 2 — Retrieval:
    Hybrid vector + keyword search returning ranked passages with source metadata.
    """
    def execute(self, layer1_output: Dict[str, Any], top_k: int = None) -> Dict[str, Any]:
        if top_k is None:
            top_k = config.TOP_K_RETRIEVAL

        sub_queries = layer1_output.get("sub_queries", [layer1_output.get("original_query", "")])
        all_passages = []
        seen_passage_ids = set()

        for sq in sub_queries:
            results = vector_store.search(sq, top_k=top_k)
            for res in results:
                if res["passage_id"] not in seen_passage_ids:
                    seen_passage_ids.add(res["passage_id"])
                    all_passages.append(res)

        # Sort combined results by relevance score
        all_passages.sort(key=lambda x: x.get("score", 0.0), reverse=True)
        top_passages = all_passages[:top_k * 2]

        output = {
            "layer_name": "Layer 2 — Retrieval",
            "total_retrieved": len(top_passages),
            "passages": top_passages,
            "sources": list({p["doc_id"]: p["doc_title"] for p in top_passages}.items()),
            "status": "COMPLETED"
        }
        return output

layer2_engine = Layer2Retrieval()

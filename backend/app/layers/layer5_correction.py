from typing import Dict, Any, List
from app.config import config
from app.vector_store import vector_store

class Layer5SelfCorrection:
    """
    Layer 5 — Self-Correction:
    Executes bounded revision cycles (re-retrieval / revision) for unsupported claims.
    Enforces hard iteration caps (default max = 3) and explicitly flags unresolved claims.
    """
    def execute(self, layer4_output: Dict[str, Any], max_iterations: int = None) -> Dict[str, Any]:
        if max_iterations is None:
            max_iterations = config.MAX_CORRECTION_ITERATIONS

        claims = [dict(c) for c in layer4_output.get("claims", [])]
        iteration_logs = []
        
        current_iteration = 0
        unsupported_claims = [c for c in claims if c["status"] in ("Unsupported", "Partially Supported")]

        while unsupported_claims and current_iteration < max_iterations:
            current_iteration += 1
            iteration_actions = []
            
            for claim in unsupported_claims:
                # Targeted re-retrieval for unsupported claim
                re_retrieved = vector_store.search(claim["claim_text"], top_k=2)
                
                if re_retrieved:
                    top_evidence = re_retrieved[0]
                    # Attempt re-verification with newly targeted evidence
                    # Simple re-alignment check
                    c_text = claim["claim_text"].lower()
                    e_text = top_evidence["text"].lower()
                    
                    c_words = set(c_text.split())
                    e_words = set(e_text.split())
                    overlap_ratio = len(c_words.intersection(e_words)) / max(1, len(c_words))
                    
                    if overlap_ratio > 0.4:
                        new_conf = round(min(1.0, claim["confidence_score"] + 0.35), 4)
                        new_status = "Supported" if new_conf >= config.VERIFICATION_THRESHOLD else "Partially Supported"
                        
                        action_msg = f"Iteration {current_iteration}: Re-retrieved {top_evidence['doc_id']} and revised claim support status from {claim['status']} to {new_status} (Confidence: {int(new_conf*100)}%)."
                        
                        claim["status"] = new_status
                        claim["confidence_score"] = new_conf
                        claim["confidence_percent"] = int(new_conf * 100)
                        claim["matched_evidence"] = {
                            "doc_id": top_evidence["doc_id"],
                            "doc_title": top_evidence["doc_title"],
                            "passage_id": top_evidence["passage_id"],
                            "text_snippet": top_evidence["text"]
                        }
                    else:
                        action_msg = f"Iteration {current_iteration}: Targeted re-retrieval completed. Insufficient evidence match (overlap {int(overlap_ratio*100)}%). Retaining status: {claim['status']}."
                else:
                    action_msg = f"Iteration {current_iteration}: No additional evidence found in corpus."

                iteration_actions.append({
                    "claim_id": claim["claim_id"],
                    "action": action_msg
                })

            iteration_logs.append({
                "iteration": current_iteration,
                "actions": iteration_actions
            })

            # Refresh unsupported claims list
            unsupported_claims = [c for c in claims if c["status"] in ("Unsupported", "Partially Supported")]

        # FR-7: Explicitly flag unresolved claims after max iterations
        flagged_unresolved = []
        for claim in claims:
            if claim["status"] != "Supported":
                claim["unresolved_flag"] = True
                flagged_unresolved.append(claim["claim_id"])
            else:
                claim["unresolved_flag"] = False

        output = {
            "layer_name": "Layer 5 — Self-Correction",
            "iterations_run": current_iteration,
            "max_iterations_capped": max_iterations,
            "iteration_logs": iteration_logs,
            "revised_claims": claims,
            "unresolved_flagged_claims": flagged_unresolved,
            "status": "COMPLETED"
        }
        return output

layer5_engine = Layer5SelfCorrection()

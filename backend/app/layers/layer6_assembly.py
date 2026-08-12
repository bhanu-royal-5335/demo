from typing import Dict, Any, List

class Layer6ResponseAssembly:
    """
    Layer 6 — Response Assembly:
    Compiles final verified response with citations, overall Trust Score, and flagged unsupported claims.
    """
    def execute(self, layer3_output: Dict[str, Any], layer5_output: Dict[str, Any]) -> Dict[str, Any]:
        claims = layer5_output.get("revised_claims", [])
        
        if not claims:
            return {
                "layer_name": "Layer 6 — Response Assembly",
                "final_answer": layer3_output.get("draft_answer", "No answer generated."),
                "trust_score": 0,
                "trust_tier": "Low Confidence",
                "claims": [],
                "citations": layer3_output.get("citations", []),
                "flagged_unresolved": [],
                "status": "COMPLETED"
            }

        # Calculate global Trust Score
        total_claims = len(claims)
        supported_weight = sum(1.0 for c in claims if c["status"] == "Supported")
        partially_weight = sum(0.5 for c in claims if c["status"] == "Partially Supported")
        
        raw_trust_score = ((supported_weight + partially_weight) / total_claims) * 100
        trust_score = round(min(100.0, max(0.0, raw_trust_score)), 1)
        
        if trust_score >= 85.0:
            trust_tier = "High Verification (Trustworthy)"
        elif trust_score >= 60.0:
            trust_tier = "Moderate Verification (Check Citations)"
        else:
            trust_tier = "Low Verification (Unresolved Claims Present)"

        # Re-assemble verified final response text with explicit citations and warning flags
        final_sentences = []
        flagged_list = []

        for c in claims:
            match_doc = c["matched_evidence"].get("doc_id", "")
            match_p = c["matched_evidence"].get("passage_id", "")
            
            citation_str = f"[{match_doc}, {match_p}]" if match_doc != "N/A" else "[Unverified Source]"
            
            if c.get("unresolved_flag", False):
                sentence = f"{c['claim_text']} {citation_str} ⚠️ [FLAGGED: {c['status'].upper()}]"
                flagged_list.append(c)
            else:
                sentence = f"{c['claim_text']} {citation_str}"
                
            final_sentences.append(sentence)

        final_answer = " ".join(final_sentences)

        output = {
            "layer_name": "Layer 6 — Response Assembly",
            "final_answer": final_answer,
            "trust_score": trust_score,
            "trust_tier": trust_tier,
            "verified_claims_count": int(supported_weight),
            "total_claims_count": total_claims,
            "claims": claims,
            "citations": layer3_output.get("citations", []),
            "flagged_unresolved": flagged_list,
            "status": "COMPLETED"
        }
        return output

layer6_engine = Layer6ResponseAssembly()

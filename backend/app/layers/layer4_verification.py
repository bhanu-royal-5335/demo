import re
import math
from typing import Dict, Any, List
from app.config import config

class Layer4Verification:
    """
    Layer 4 — Verification:
    Decomposes the draft answer into discrete claims, calculates stance & confidence score 
    against retrieved evidence using vector similarity & semantic overlap.
    """
    def execute(self, layer3_output: Dict[str, Any], layer2_output: Dict[str, Any]) -> Dict[str, Any]:
        draft_sentences = layer3_output.get("sentences", [])
        passages = layer2_output.get("passages", [])
        
        claims = []
        overall_support_scores = []
        
        for idx, sentence_with_tag in enumerate(draft_sentences):
            # Clean sentence (strip inline tag like [DOC-001, P-001])
            clean_sentence = re.sub(r'\[DOC-\d+,\s*P-\d+\]', '', sentence_with_tag).strip()
            if not clean_sentence:
                continue

            # Extract claim ID
            claim_id = f"CLAIM-{idx+1:02d}"
            
            # Find best matching evidence passage & compute support confidence
            best_match_passage = None
            max_sim = 0.0
            
            s_words = set(re.findall(r'\b[a-zA-Z0-9\-]{3,}\b', clean_sentence.lower()))
            s_stopwords = {'the', 'and', 'for', 'that', 'this', 'with', 'from', 'have', 'were', 'been'}
            s_words = {w for w in s_words if w not in s_stopwords}
            
            for p in passages:
                p_text = p["text"].lower()
                p_words = set(re.findall(r'\b[a-zA-Z0-9\-]{3,}\b', p_text))
                p_words = {w for w in p_words if w not in s_stopwords}
                
                if not s_words or not p_words:
                    continue
                    
                overlap = len(s_words.intersection(p_words))
                union = len(s_words.union(p_words))
                jaccard = overlap / union if union > 0 else 0
                
                # Check for numerical / entity match exactness
                numbers_in_claim = set(re.findall(r'\b\d+(?:\.\d+)?%?\b', clean_sentence))
                numbers_in_passage = set(re.findall(r'\b\d+(?:\.\d+)?%?\b', p["text"]))
                
                num_score = 1.0
                if numbers_in_claim:
                    num_match = len(numbers_in_claim.intersection(numbers_in_passage)) / len(numbers_in_claim)
                    num_score = 0.5 + (0.5 * num_match)
                    
                confidence = round(min(1.0, (jaccard * 1.5) * num_score), 4)
                
                # Boost confidence if sentence cites this specific passage
                if f"{p['doc_id']}" in sentence_with_tag and f"{p['passage_id']}" in sentence_with_tag:
                    confidence = round(min(1.0, confidence + 0.35), 4)
                    
                if confidence > max_sim:
                    max_sim = confidence
                    best_match_passage = p

            # Determine stance status
            if max_sim >= config.VERIFICATION_THRESHOLD:
                status = "Supported"
            elif max_sim >= 0.45:
                status = "Partially Supported"
            else:
                status = "Unsupported"

            overall_support_scores.append(max_sim)

            claims.append({
                "claim_id": claim_id,
                "claim_text": clean_sentence,
                "status": status,
                "confidence_score": max_sim,
                "confidence_percent": int(max_sim * 100),
                "matched_evidence": {
                    "doc_id": best_match_passage["doc_id"] if best_match_passage else "N/A",
                    "doc_title": best_match_passage["doc_title"] if best_match_passage else "No direct match",
                    "passage_id": best_match_passage["passage_id"] if best_match_passage else "N/A",
                    "text_snippet": best_match_passage["text"] if best_match_passage else "Evidence missing or low overlap"
                }
            })

        avg_confidence = sum(overall_support_scores) / len(overall_support_scores) if overall_support_scores else 0.0

        output = {
            "layer_name": "Layer 4 — Verification",
            "total_claims": len(claims),
            "claims": claims,
            "average_confidence": round(avg_confidence, 4),
            "supported_count": sum(1 for c in claims if c["status"] == "Supported"),
            "partially_supported_count": sum(1 for c in claims if c["status"] == "Partially Supported"),
            "unsupported_count": sum(1 for c in claims if c["status"] == "Unsupported"),
            "status": "COMPLETED"
        }
        return output

layer4_engine = Layer4Verification()

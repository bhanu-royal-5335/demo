import re
from typing import Dict, Any, List

class Layer1QueryUnderstanding:
    """
    Layer 1 — Query Understanding:
    Classifies query intent and decomposes complex or multi-part queries into atomic sub-queries.
    """
    def execute(self, raw_query: str) -> Dict[str, Any]:
        cleaned_query = raw_query.strip()
        
        # Determine intent
        intent = "Factual_Lookup"
        if any(kw in cleaned_query.lower() for kw in ["compare", "vs", "versus", "difference", "between"]):
            intent = "Comparative_Analysis"
        elif any(kw in cleaned_query.lower() for kw in ["how", "why", "mechanism", "architecture", "process"]):
            intent = "Technical_Synthesis"
        elif "?" in cleaned_query and len(cleaned_query.split()) > 15:
            intent = "Multi_Aspect_Query"

        # Decompose into atomic sub-queries
        sub_queries = []
        # Split by conjunctions or question marks if multi-part
        parts = re.split(r'\s+(?:and|also|additionally|\?|\;)\s+', cleaned_query, flags=re.IGNORECASE)
        for part in parts:
            part = part.strip().rstrip("?")
            if len(part.split()) >= 3:
                sub_queries.append(part + "?")
                
        if not sub_queries:
            sub_queries = [cleaned_query]

        output = {
            "layer_name": "Layer 1 — Query Understanding",
            "original_query": cleaned_query,
            "intent": intent,
            "sub_queries": sub_queries,
            "query_keywords": [w for w in re.findall(r'\b\w{4,}\b', cleaned_query.lower()) if w not in {'what', 'when', 'where', 'which', 'about', 'with'}],
            "status": "COMPLETED"
        }
        return output

layer1_engine = Layer1QueryUnderstanding()

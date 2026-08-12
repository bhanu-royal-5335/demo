import os

class Config:
    PROJECT_NAME = "HBI-TGA Architecture Engine"
    VERSION = "1.0.0"
    
    # Layer 0 & Layer 5 Defaults
    MAX_CORRECTION_ITERATIONS = 3
    VERIFICATION_THRESHOLD = 0.70  # Claims below 70% confidence trigger correction
    
    # Layer 2 Defaults
    TOP_K_RETRIEVAL = 4
    PASSAGE_CHUNK_SIZE = 300  # characters per passage chunk
    
    # Execution Settings
    ENABLE_AUDIT_LOGGING = True
    DEFAULT_LLM_PROVIDER = os.getenv("LLM_PROVIDER", "smart_heuristic") # "smart_heuristic", "gemini", or "openai"
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

config = Config()

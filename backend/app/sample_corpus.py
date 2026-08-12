SAMPLE_CORPUS = [
    {
        "id": "DOC-001",
        "title": "Hierarchical Bounded Intelligence & Trustworthy Generative AI",
        "author": "Dr. E. Vance et al. (2026)",
        "category": "AI Architecture",
        "content": (
            "Large Language Models (LLMs) suffer from hallucinations, unverified claims, and unbounded reasoning drift. "
            "The Hierarchical Bounded Intelligence Architecture for Trustworthy Generative AI (HBI-TGA) decomposes generation into bounded operational layers. "
            "Layer 1 decomposes queries into sub-queries. Layer 2 performs hybrid vector retrieval over domain documents. "
            "Layer 3 drafts candidate responses strictly conditioned on retrieved passages. "
            "Layer 4 independently decomposes answers into discrete atomic claims and verifies them against source evidence using Natural Language Inference (NLI) scoring. "
            "Layer 5 runs a bounded self-correction loop capped at a configurable maximum iteration count (default: 3 iterations). "
            "Layer 6 computes an overall Trust Score (0-100%) and tags all verified or unsupported claims before presenting the answer to the user."
        )
    },
    {
        "id": "DOC-002",
        "title": "Clinical Guidelines for Type-2 Diabetes Management",
        "author": "Global Endocrinology Board (2025)",
        "category": "Medical & Health",
        "content": (
            "Type-2 Diabetes Management requires a combined approach of lifestyle modifications and pharmacological therapy. "
            "First-line oral medication remains Metformin, administered at 500mg to 2000mg daily, provided kidney function (eGFR) is above 30 mL/min. "
            "GLP-1 receptor agonists like Semaglutide are recommended for patients with concurrent cardiovascular disease or chronic kidney disease. "
            "HbA1c target levels for non-pregnant adults are typically below 7.0% (53 mmol/mol) to minimize microvascular complications. "
            "Continuous Glucose Monitoring (CGM) improves time-in-range metrics significantly compared to traditional fingerstick checks. "
            "Insulin therapy is introduced if oral agents and GLP-1 agonists fail to maintain glycemic targets."
        )
    },
    {
        "id": "DOC-003",
        "title": "Next-Generation Solar Photovoltaic Efficiency & Perovskites",
        "author": "Journal of Renewable Energy Materials (2025)",
        "category": "Renewable Energy",
        "content": (
            "Perovskite-Silicon Tandem Solar Cells have achieved laboratory power conversion efficiencies exceeding 33.9%, outperforming traditional single-junction silicon cells capped at 29.4%. "
            "Perovskite materials absorb short-wavelength blue photons, while the bottom silicon cell captures longer-wavelength infrared light. "
            "Commercial adoption faces challenges in long-term operational stability under moisture, heat, and ultraviolet degradation. "
            "Encapsulation techniques using polyisobutylene and self-healing fluoropolymer coatings have extended outdoor lifetime tests beyond 20,000 equivalent sun-hours."
        )
    },
    {
        "id": "DOC-004",
        "title": "Artemis Lunar Base & Deep Space Life Support Systems",
        "author": "Space Systems Engineering Review (2026)",
        "category": "Aerospace",
        "content": (
            "The Artemis Lunar Surface Habitat incorporates Closed-Loop Environmental Control and Life Support Systems (ECLSS). "
            "Oxygen recovery reaches 98% efficiency utilizing the Sabatier reaction coupled with Plasma Pyrolysis Assembly (PPA). "
            "Water recycling efficiency exceeds 98% using advanced catalytic oxidation and forward osmosis filtration. "
            "Surface power generation relies on Vertical Solar Array (VSA) towers supplemented by a 40 kW Kilopower Nuclear Fission Reactor during the 14-day lunar night."
        )
    }
]

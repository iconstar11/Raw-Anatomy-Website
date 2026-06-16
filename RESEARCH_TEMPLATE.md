# RawAnatomy Research Template

Use this template as a reference for all new `.md` files in `src/content/`. Copy the content below and replace the placeholders with your research data.

---

```markdown
---
title: "THE EXACT TITLE OF THE STUDY OR REVIEW"
description: "A compelling 1-2 sentence hook that explains the 'So What?' of this research. This appears on the homepage cards."
author: "Anton"
date: "2026-06-16"
readTime: "X min read"
category: "Physiology / Bioenergetics / Nutrition"
tags: ["keyword1", "keyword2", "keyword3"]
---

# Overview
Provide a high-level summary here. Why did you research this? What is the general consensus versus the raw data? 

## The Core Data
Use **bold text** for emphasis. If you have specific numbers or percentages, highlight them clearly.

> [!IMPORTANT]
> **The Bottom Line:** Use this callout for the most important takeaway of the entire article.

## Key Mechanisms
Deep dive into the "How" and "Why."
- **Point 1:** Brief explanation.
- **Point 2:** Brief explanation.

### Visualizing the Data
Use tables for comparisons or protocols:

| Phase | Duration | Primary Focus |
| :--- | :--- | :--- |
| **A** | 0-24h | Inflammation & Clearance |
| **B** | 24-48h | Peak Protein Synthesis |
| **C** | 48h+ | Remodeling & Growth |

## Common Misconceptions
- **Myth:** "Statement of the myth."
- **Truth:** "The evidence-based correction based on the studies cited below."

## References
Include clickable links to primary sources (PubMed/PMC). Use the numerical index to cite them in the text above (e.g., [1]).

1. **Author.** (Year). *Title of the paper.* Journal Name. [View Source](URL)
2. **Author.** (Year). *Title of the paper.* Journal Name. [View Source](URL)
```

---

## Best Practices for High-Quality Research Pages:
1. **Title Case:** Use consistent title casing for the `title` field in the frontmatter.
2. **Impactful Descriptions:** Keep the `description` under 160 characters so it fits perfectly on your homepage cards.
3. **Internal Links:** You can reference other articles using `#/a/slug-name`.
4. **Citations:** Always add at least 3-5 peer-reviewed sources in the references section to maintain the "Evidence-Based" authority of the site.
5. **Code Blocks:** If you are sharing a spreadsheet formula, a script, or a protocol "algorithm," use triple backticks:
   ```text
   Protocol: 3 sets x 8-12 reps @ 75% 1RM
   ```

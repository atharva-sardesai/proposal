# Proposal for {{#each Scopes}}{{serviceType}}{{#unless @last}}, {{/unless}}{{/each}}

**Client**: {{Company.name}}  
**Prepared By**: SecComply  
**Date**: {{Dates.startDate}}

SecComply is pleased to present this proposal for the following services:
{{#each Scopes}}
- {{serviceType}}: {{description}}
{{/each}}

---

## Scope of Services

{{#each Scopes}}
### {{serviceType}}

{{#if (eq serviceType "VAPT")}}
**Targets**  
{{targets}}

**Testing Approach**  
{{testingApproach}}

**Focus Areas**  
{{focusAreas}}

**Methodology**  
{{methodology}}
{{/if}}

{{#if (eq serviceType "ISO 27001")}}
**Gap Assessment**  
- Review of existing controls  
- Interviews with stakeholders  

**ISMS Implementation**  
- Creation of policies, procedures  
- Risk assessment, SoA, internal audit

**Documentation**  
- Policy templates  
- Training materials
{{/if}}

**Deliverables**
{{deliverables}}

**Timeline**
{{timeline}}

**Out of Scope**
{{outOfScope}}

---
{{/each}}

## Roles and Responsibilities

**SecComply**:  
{{Engagement.details}}

**Client**:  
- Provide access  
- Coordinate with stakeholders

---

## Cost & Commercials

**Total Quoted Amount**: {{Financials.quotedAmount}} {{Financials.currency}}  
**Payment Terms**: {{Financials.paymentTerms}}

---

## Compliance Requirements

{{compliance.requirements}}

{{Compliance.details}}

---

## Contact Information

**Contact Person**: {{Company.contactName}}  
**Email**: {{Company.contactEmail}}  
**Phone**: {{Company.contactPhone}}  
**Address**: {{Company.address}} 
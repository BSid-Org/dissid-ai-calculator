export const industries = [
  {
    id: "professional",
    label: "Professional Services",
    subtitle: "Consulting, legal, accounting",
    icon: "work",
  },
  {
    id: "ecommerce",
    label: "E-Commerce",
    subtitle: "Online store, marketplace",
    icon: "shopping_cart",
  },
  {
    id: "realestate",
    label: "Real Estate",
    subtitle: "Property management, listings",
    icon: "apartment",
  },
  {
    id: "healthcare",
    label: "Healthcare",
    subtitle: "Clinic, wellness, telehealth",
    icon: "favorite",
  },
  {
    id: "marketing",
    label: "Marketing Agency",
    subtitle: "Content, social, SEO",
    icon: "campaign",
  },
  {
    id: "saas",
    label: "SaaS / Tech",
    subtitle: "Software product, platform",
    icon: "code",
  },
  {
    id: "construction",
    label: "Construction",
    subtitle: "Contractors, field services",
    icon: "construction",
  },
  { id: "other", label: "Other", subtitle: "Tell us more", icon: "add_circle" },
] as const;

export const painPoints = [
  {
    id: "support",
    label: "Customer Support",
    subtitle: "Answering emails, calls, tickets",
    icon: "support_agent",
    hourlyCost: 25,
    replacementPct: 0.7,
    aiCostPerMonth: 200,
  },
  {
    id: "scheduling",
    label: "Scheduling",
    subtitle: "Booking, reminders, follow-ups",
    icon: "calendar_month",
    hourlyCost: 20,
    replacementPct: 0.85,
    aiCostPerMonth: 100,
  },
  {
    id: "content",
    label: "Content & Social Media",
    subtitle: "Writing posts, newsletters, blogs",
    icon: "edit_note",
    hourlyCost: 35,
    replacementPct: 0.6,
    aiCostPerMonth: 300,
  },
  {
    id: "dataentry",
    label: "Data Entry & Admin",
    subtitle: "Invoicing, reports, spreadsheets",
    icon: "table_chart",
    hourlyCost: 22,
    replacementPct: 0.9,
    aiCostPerMonth: 150,
  },
  {
    id: "leadgen",
    label: "Lead Generation",
    subtitle: "Cold emails, prospecting, CRM",
    icon: "trending_up",
    hourlyCost: 30,
    replacementPct: 0.5,
    aiCostPerMonth: 250,
  },
  {
    id: "research",
    label: "Research & Analysis",
    subtitle: "Market research, competitor tracking",
    icon: "query_stats",
    hourlyCost: 40,
    replacementPct: 0.65,
    aiCostPerMonth: 200,
  },
  {
    id: "documents",
    label: "Document Processing",
    subtitle: "Contracts, proposals, PDFs",
    icon: "description",
    hourlyCost: 25,
    replacementPct: 0.8,
    aiCostPerMonth: 150,
  },
  {
    id: "inventory",
    label: "Inventory & Operations",
    subtitle: "Order tracking, supply chain",
    icon: "inventory_2",
    hourlyCost: 28,
    replacementPct: 0.55,
    aiCostPerMonth: 200,
  },
] as const;

export const teamSizes = [
  { id: "solo", label: "Just me", icon: "person", multiplier: 1.0 },
  { id: "small", label: "2-5", icon: "group", multiplier: 1.5 },
  { id: "growing", label: "6-20", icon: "groups", multiplier: 2.5 },
  { id: "midsize", label: "21-50", icon: "diversity_3", multiplier: 4.0 },
  { id: "large", label: "50+", icon: "corporate_fare", multiplier: 6.0 },
] as const;

export type PainPoint = (typeof painPoints)[number];

export function calculateResults(
  selectedPainPoints: string[],
  teamSizeId: string,
  hoursPerWeek: number,
) {
  const team = teamSizes.find((t) => t.id === teamSizeId) || teamSizes[0];
  const selected = painPoints.filter((p) => selectedPainPoints.includes(p.id));
  const hoursPerTask = hoursPerWeek / Math.max(selected.length, 1);

  const breakdown = selected.map((task) => {
    const currentMonthlyCost =
      hoursPerTask * 4.33 * task.hourlyCost * team.multiplier;
    const savings = currentMonthlyCost * task.replacementPct;
    const netSavings = savings - task.aiCostPerMonth;
    const hoursSaved = hoursPerTask * task.replacementPct * 4.33;

    return {
      id: task.id,
      label: task.label,
      currentCost: Math.round(currentMonthlyCost),
      savings: Math.round(Math.max(netSavings, 0)),
      hoursSaved: Math.round(hoursSaved * 10) / 10,
      aiCost: task.aiCostPerMonth,
      replacementPct: Math.round(task.replacementPct * 100),
    };
  });

  const totalMonthlySavings = breakdown.reduce((sum, b) => sum + b.savings, 0);
  const totalHoursSaved = breakdown.reduce((sum, b) => sum + b.hoursSaved, 0);
  const totalAiCost = breakdown.reduce((sum, b) => sum + b.aiCost, 0);
  const roi = totalAiCost > 0 ? totalMonthlySavings / totalAiCost : 0;

  return {
    totalMonthlySavings,
    totalHoursSaved: Math.round(totalHoursSaved),
    totalAiCost,
    roi: Math.round(roi * 10) / 10,
    annualSavings: totalMonthlySavings * 12,
    breakdown,
  };
}

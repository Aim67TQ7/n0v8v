import type { AnalysisStep, Cause, CauseCategory } from "@/types/fishbone";

export const initialSteps: AnalysisStep[] = [
  {
    category: 'Man',
    title: 'People Factors',
    description: 'Identify potential human-related causes',
    causes: [
      { id: 'man1', text: 'Operator not trained on color verification', checked: false, category: 'Man' },
      { id: 'man2', text: 'Communication gap between shifts', checked: false, category: 'Man' },
      { id: 'man3', text: 'Work instructions misinterpreted', checked: false, category: 'Man' },
      { id: 'man4', text: 'Color verification done under wrong lighting', checked: false, category: 'Man' },
      { id: 'man5', text: 'Rush to complete job', checked: false, category: 'Man' },
      { id: 'man6', text: 'Fatigue during long shifts', checked: false, category: 'Man' },
    ]
  },
  {
    category: 'Machine',
    title: 'Equipment Factors',
    description: 'Identify equipment and tool-related causes',
    causes: [
      { id: 'machine1', text: 'Color matching equipment malfunction', checked: false, category: 'Machine' },
      { id: 'machine2', text: 'Paint gun settings incorrect', checked: false, category: 'Machine' },
      { id: 'machine3', text: 'Poor lighting in paint area', checked: false, category: 'Machine' },
      { id: 'machine4', text: 'Wrong spray tips used', checked: false, category: 'Machine' },
      { id: 'machine5', text: 'Equipment not cleaned between colors', checked: false, category: 'Machine' },
      { id: 'machine6', text: 'Paint pressure settings incorrect', checked: false, category: 'Machine' },
    ]
  },
  {
    category: 'Method',
    title: 'Process Factors',
    description: 'Identify methodology and process-related causes',
    causes: [
      { id: 'method1', text: 'Paint mixing procedure not followed', checked: false, category: 'Method' },
      { id: 'method2', text: 'Wrong mixing ratios used', checked: false, category: 'Method' },
      { id: 'method3', text: 'Incorrect paint code referenced', checked: false, category: 'Method' },
      { id: 'method4', text: 'Paint specification sheet misread', checked: false, category: 'Method' },
      { id: 'method5', text: 'Quality check steps skipped', checked: false, category: 'Method' },
      { id: 'method6', text: 'Paint batch testing not performed', checked: false, category: 'Method' },
    ]
  },
  {
    category: 'Material',
    title: 'Material Factors',
    description: 'Identify material and supply-related causes',
    causes: [
      { id: 'material1', text: 'Similar color codes confused', checked: false, category: 'Material' },
      { id: 'material2', text: 'Paint containers mislabeled', checked: false, category: 'Material' },
      { id: 'material3', text: 'Multiple paint types stored in same area', checked: false, category: 'Material' },
      { id: 'material4', text: 'Expired paint used', checked: false, category: 'Material' },
      { id: 'material5', text: 'Wrong base coat applied', checked: false, category: 'Material' },
      { id: 'material6', text: 'Paint contaminated during storage', checked: false, category: 'Material' },
    ]
  },
  {
    category: 'Environment',
    title: 'Environmental Factors',
    description: 'Identify environmental and workplace-related causes',
    causes: [
      { id: 'env1', text: 'Poor lighting conditions', checked: false, category: 'Environment' },
      { id: 'env2', text: 'Temperature affecting paint properties', checked: false, category: 'Environment' },
      { id: 'env3', text: 'Humidity levels outside spec', checked: false, category: 'Environment' },
      { id: 'env4', text: 'Dust contamination', checked: false, category: 'Environment' },
      { id: 'env5', text: 'Ventilation issues', checked: false, category: 'Environment' },
      { id: 'env6', text: 'Storage conditions improper', checked: false, category: 'Environment' },
    ]
  }
];

export const generateSecondRound = (selectedCauses: Cause[]): AnalysisStep[] => {
  // Group selected causes by category
  const categorizedCauses = selectedCauses.reduce((acc, cause) => {
    if (!acc[cause.category]) {
      acc[cause.category] = [];
    }
    acc[cause.category].push(cause);
    return acc;
  }, {} as Record<CauseCategory, Cause[]>);

  // Generate detailed questions for each selected cause
  return Object.entries(categorizedCauses).map(([category, causes]) => ({
    category: category as CauseCategory,
    title: `Detailed ${category} Analysis`,
    description: 'Identify specific contributing factors',
    causes: causes.flatMap(cause => generateDetailedCauses(cause))
  })).filter(step => step.causes.length > 0);
};

const generateDetailedCauses = (cause: Cause): Cause[] => {
  const baseId = cause.id + '_detail_';
  
  switch (cause.category) {
    case 'Man':
      return [
        { id: baseId + '1', text: `Was proper training provided for ${cause.text.toLowerCase()}?`, checked: false, category: cause.category },
        { id: baseId + '2', text: 'Are there documented competency assessments?', checked: false, category: cause.category },
        { id: baseId + '3', text: 'Is there a clear escalation process for questions?', checked: false, category: cause.category },
      ];
    case 'Machine':
      return [
        { id: baseId + '1', text: 'Is there a maintenance schedule in place?', checked: false, category: cause.category },
        { id: baseId + '2', text: 'Are calibration records up to date?', checked: false, category: cause.category },
        { id: baseId + '3', text: 'Is equipment properly certified for use?', checked: false, category: cause.category },
      ];
    // Add similar detailed causes for other categories
    default:
      return [
        { id: baseId + '1', text: `Is there a standard procedure for ${cause.text.toLowerCase()}?`, checked: false, category: cause.category },
        { id: baseId + '2', text: 'Are there documented checks and balances?', checked: false, category: cause.category },
        { id: baseId + '3', text: 'Is there a verification process in place?', checked: false, category: cause.category },
      ];
  }
};

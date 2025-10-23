import * as XLSX from 'xlsx';

export interface MaterialData {
  supplier: string;
  articleNumber: string;
  material: string;
  quantity: number;
  unit: string;
  weight?: number;
  carbonFootprint?: number;
}

// Carbon emission factors (kg CO₂e per kg of material)
const EMISSION_FACTORS: { [key: string]: number } = {
  // Steel products
  'betonstahl': 1.85, // Reinforcing steel
  'baustahlgewebematte': 1.85, // Steel mesh
  'stahl': 1.85, // Generic steel
  
  // Concrete and mortar
  'beton': 0.13, // Concrete
  'mörtel': 0.22, // Mortar
  'zement': 0.90, // Cement
  
  // Wood products
  'holz': 0.45, // Wood
  'film': 0.50, // Film/formwork
  'rauspund': 0.45, // Wood planks
  
  // Plastic/PVC
  'pvc': 2.50, // PVC
  
  // Textile
  'textil': 1.30, // Textile
  'geotextil': 1.30, // Geotextile
  
  // Default for unknown materials
  'default': 1.00,
};

// Estimate weight from quantity for non-kg units
const estimateWeight = (quantity: number, unit: string, material: string): number => {
  const materialLower = material.toLowerCase();
  
  // If already in kg, return as is
  if (unit === 'kg') return quantity;
  
  // Estimate based on unit and material type
  if (unit === 'Stk') { // Pieces
    if (materialLower.includes('mutter') || materialLower.includes('schraube')) return quantity * 0.01; // Bolts/nuts
    if (materialLower.includes('abstandhalter')) return quantity * 0.05; // Spacers
    if (materialLower.includes('beton')) return quantity * 2; // Concrete elements
    return quantity * 0.5; // Default piece weight
  }
  
  if (unit === 'm³') { // Cubic meters
    if (materialLower.includes('beton')) return quantity * 2400; // Concrete density
    return quantity * 1000; // Default density
  }
  
  if (unit === 'm²') { // Square meters
    if (materialLower.includes('film') || materialLower.includes('geotextil')) return quantity * 0.5;
    return quantity * 2; // Default weight per m²
  }
  
  return quantity; // Fallback
};

// Get emission factor for a material
const getEmissionFactor = (material: string): number => {
  const materialLower = material.toLowerCase();
  
  for (const [key, factor] of Object.entries(EMISSION_FACTORS)) {
    if (materialLower.includes(key)) {
      return factor;
    }
  }
  
  return EMISSION_FACTORS.default;
};

export const parseExcelFile = async (file: File): Promise<MaterialData[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        const materials: MaterialData[] = jsonData.map((row: any) => {
          const supplier = row['Lieferant'] || 'Unknown';
          const articleNumber = row['Artikel-Nummer'] || '';
          const material = row['Artikel'] || 'Unknown Material';
          const quantity = parseFloat(row['Menge']) || 0;
          const unit = row['Einheit'] || '';
          
          // Calculate weight
          const weight = estimateWeight(quantity, unit, material);
          
          // Calculate carbon footprint
          const emissionFactor = getEmissionFactor(material);
          const carbonFootprint = weight * emissionFactor;
          
          return {
            supplier,
            articleNumber,
            material,
            quantity,
            unit,
            weight,
            carbonFootprint,
          };
        });
        
        resolve(materials);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsBinaryString(file);
  });
};

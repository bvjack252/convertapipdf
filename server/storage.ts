// This API doesn't require database storage for conversions
// All conversions are stateless and processed in-memory
// If you need to track conversion history, implement database storage here

export interface IStorage {
  // Add storage methods here if needed in the future
  // For example: saveConversionHistory, getConversionHistory, etc.
}

export class MemStorage implements IStorage {
  constructor() {
    // Initialize if needed
  }
}

export const storage = new MemStorage();

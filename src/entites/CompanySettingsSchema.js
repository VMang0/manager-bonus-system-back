import { model, Schema } from 'mongoose';
import CompanySchema  from './CompanySchema.js';

const PriorityCoefficientSchema = new Schema({
  normal: { type: Number, default: 0.5 },
  high: { type: Number, default: 2 },
  critical: { type: Number, default: 3.0 },
});

const ComplexityCoefficientSchema = new Schema({
  low: { type: Number, default: 1.0 },
  medium: { type: Number, default: 1.5 },
  high: { type: Number, default: 2.0 }
});

const SuccessCoefficientSchema = new Schema({
  first: { type: Number, default: 1.0 },
  second: { type: Number, default: 0.8 },
  more: { type: Number, default: 0.5 }
});

const getDefaultPriority = () => ({
  normal: 0.5,
  high: 2,
  critical: 3.0,
});

const getDefaultComplexity = () => ({
  low: 1.0,
  medium: 1.5,
  high: 2.0
});

const getDefaultSuccess = () => ({
  first: 1.0,
  second: 0.8,
  more: 0.5
});

const CompanySettingsSchema = new Schema({
  company: { type: CompanySchema.schema, required: true },
  settings: {
    priority: { type: PriorityCoefficientSchema, default: getDefaultPriority()},
    complexity: { type: ComplexityCoefficientSchema, default: getDefaultComplexity() },
    success: { type: SuccessCoefficientSchema, default: getDefaultSuccess() }
  }
});

export default model('CompanySettings', CompanySettingsSchema);
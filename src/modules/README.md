# Lovable Modules

This directory contains standalone modules that can be imported into other Lovable projects.

## Dependencies

These modules require the following core dependencies:
- React 18+
- Tailwind CSS
- Shadcn/ui
- Supabase Client
- React Query

## Available Modules

### AI Capabilities
- `AICapabilities`: Displays AI features and capabilities

### Authentication
- `PasswordReset`: Password reset form
- `UpdatePassword`: Password update form
- `SignUpForm`: User registration form
- `AuthGuard`: Route protection component

### Five S
- `FiveSImageUpload`: Image upload for 5S evaluations
- `FiveSVisionImageUploader`: AI-powered image analysis for 5S
- `FiveSEvaluationForm`: 5S evaluation form
- `FiveSRadarChart`: Radar chart for 5S scores
- `FiveSEvaluationContent`: 5S evaluation results display

### Process Analysis
- `ProcessAnalysisResults`: Display process analysis results
- `ProcessImageUploader`: Image upload for process analysis

### Team Management
- `DepartmentTable`: Department management table
- `WorkcenterTab`: Workcenter management interface
- `TeamFilter`: Team filtering component
- `TeamActions`: Team management actions

### GPT Interface
- `ChatInterface`: Main chat interface
- `ChatContainer`: Chat container with history
- `ChatHistory`: Chat history display
- `ModelSelector`: AI model selection

### VAVE Analysis
- `VAVEForm`: Value Analysis form
- `VAVEHeader`: VAVE header component
- `VAVEInstructions`: VAVE instructions display

### Common Components
- `SWOTAnalysis`: SWOT analysis component
- `WorkcenterSelect`: Workcenter selection component
- `Header`: Application header

## Usage

Import modules directly from the modules directory:

```typescript
import { AICapabilities, ChatInterface, FiveSEvaluationForm } from "@/modules";
```

Each module is self-contained and includes its own types and interfaces.
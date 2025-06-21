# Components Organization

This directory contains all React components organized by their purpose and functionality.

## Structure

```
components/
├── ui/                    # Reusable UI components
│   ├── Button.tsx        # Button component with variants
│   ├── LoadingSpinner.tsx # Loading spinner component
│   └── index.ts          # UI components exports
├── layout/               # Layout and navigation components
│   ├── Layout.tsx        # Main layout with sidebar
│   └── index.ts          # Layout components exports
├── tasks/                # Task-related components
│   ├── TaskCard.tsx      # Individual task display
│   ├── TaskList.tsx      # List of tasks
│   ├── TaskModal.tsx     # Task creation/editing modal
│   ├── RecentTasks.tsx   # Recent tasks widget
│   └── index.ts          # Task components exports
├── users/                # User-related components
│   ├── UserCard.tsx      # Individual user display
│   ├── UserList.tsx      # List of users
│   ├── UserModal.tsx     # User creation/editing modal
│   └── index.ts          # User components exports
├── dashboard/            # Dashboard-specific components
│   ├── StatsGrid.tsx     # Statistics grid layout
│   ├── StatCard.tsx      # Individual stat card
│   └── index.ts          # Dashboard components exports
└── index.ts              # Main components barrel export
```

## Usage

### Importing Components

You can import components in several ways:

1. **Individual imports** (recommended for better tree-shaking):
```tsx
import { Button } from '@/components/ui';
import { TaskCard } from '@/components/tasks';
import { Layout } from '@/components/layout';
```

2. **Barrel imports** (convenient but may include unused code):
```tsx
import { Button, TaskCard, Layout } from '@/components';
```

3. **Direct imports** (if you need specific components):
```tsx
import Button from '@/components/ui/Button';
import TaskCard from '@/components/tasks/TaskCard';
```

### Component Categories

- **UI Components**: Reusable, generic components like buttons, spinners, etc.
- **Layout Components**: Components that define the overall structure and navigation
- **Task Components**: Components specific to task management functionality
- **User Components**: Components specific to user management functionality
- **Dashboard Components**: Components specific to the dashboard view

## Guidelines

1. **Naming**: Use PascalCase for component files and exports
2. **Organization**: Group related components in appropriate folders
3. **Exports**: Always export components through index files for clean imports
4. **Types**: Keep component-specific types in the same file or in a nearby types file
5. **Dependencies**: Minimize cross-folder dependencies when possible 
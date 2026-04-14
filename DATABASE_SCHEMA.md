# Renamify Database Schema

## Overview

Supabase PostgreSQL database with Row Level Security (RLS) for multi-tenant SaaS architecture.

---

## Tables

### `user_profiles`

User profile information linked 1:1 with `auth.users`.

```sql
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro')),
  stripe_customer_id TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**RLS Policies:**
- Users can view their own profile
- Users can update their own profile

**Triggers:**
- Auto-creates profile on user signup
- Auto-updates `updated_at` on changes

---

### `projects`

Saved image renaming projects.

```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  images JSONB NOT NULL DEFAULT '[]'::jsonb,
  groups JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Indexes:**
- `projects_user_id_idx` - Fast user project lookups
- `projects_created_at_idx` - Ordered by creation date

**RLS Policies:**
- Users can view their own projects
- Users can insert their own projects
- Users can update their own projects
- Users can delete their own projects

**JSONB Structure:**

```typescript
// images
[
  {
    id: string
    name: string
    originalName: string
    size: number
    type: string
    preview: string // blob URL
  }
]

// groups
[
  {
    id: string
    sku: string
    descriptors: string[]
    imageIds: string[]
  }
]
```

---

### `templates`

Saved descriptor and SKU patterns for quick reuse.

```sql
CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  descriptors JSONB NOT NULL DEFAULT '[]'::jsonb,
  sku_pattern TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Indexes:**
- `templates_user_id_idx` - Fast user template lookups
- `templates_created_at_idx` - Ordered by creation date

**RLS Policies:**
- Users can view their own templates
- Users can insert their own templates
- Users can update their own templates
- Users can delete their own templates

**JSONB Structure:**

```typescript
// descriptors
[
  "Color",
  "Size",
  "Material",
  "Style"
]
```

---

### `usage_tracking`

Monthly usage limits for free tier enforcement.

```sql
CREATE TABLE usage_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  month TEXT NOT NULL, -- Format: 'YYYY-MM'
  images_processed INTEGER DEFAULT 0,
  projects_created INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, month)
);
```

**Indexes:**
- `usage_tracking_user_month_idx` - Fast monthly usage lookups

**RLS Policies:**
- Users can view their own usage
- Users can insert their own usage
- Users can update their own usage

**Usage Limits:**
- **Free Tier:** 20 images per session
- **Pro Tier:** Unlimited

---

### `subscription_events`

Audit log for subscription changes from Stripe webhooks.

```sql
CREATE TABLE subscription_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('subscribed', 'canceled', 'renewed', 'upgraded', 'downgraded')),
  stripe_subscription_id TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Indexes:**
- `subscription_events_user_id_idx` - Fast user event lookups
- `subscription_events_created_at_idx` - Chronological ordering

**RLS Policies:**
- Users can view their own subscription events (read-only)

---

## TypeScript Types

Generated types are available in `src/lib/supabase/database.types.ts`.

### Usage Example

```typescript
import { createClient } from '@/lib/supabase/client'
import type { Tables } from '@/lib/supabase/database.types'

type Project = Tables<'projects'>

const supabase = createClient()

// Type-safe query
const { data, error } = await supabase
  .from('projects')
  .select('*')
  .eq('user_id', userId)
```

---

## React Hooks

Pre-built hooks for all CRUD operations:

### User Profiles
- `useUserProfile(userId)` - Fetch user profile
- `useUpdateProfile()` - Update profile

### Projects
- `useProjects(userId)` - List all projects
- `useProject(projectId)` - Fetch single project
- `useCreateProject()` - Create new project
- `useUpdateProject()` - Update project
- `useDeleteProject()` - Delete project

### Templates
- `useTemplates(userId)` - List all templates
- `useCreateTemplate()` - Create new template
- `useUpdateTemplate()` - Update template
- `useDeleteTemplate()` - Delete template

### Usage Tracking
- `useUsageTracking(userId)` - Get current month usage
- `useIncrementUsage()` - Increment usage counters

### Example Usage

```typescript
'use client'

import { useProjects, useCreateProject } from '@/hooks/useProjects'

export function ProjectList({ userId }: { userId: string }) {
  const { projects, loading, error, refetch } = useProjects(userId)
  const { createProject, creating } = useCreateProject()

  const handleCreate = async () => {
    await createProject({
      user_id: userId,
      name: 'New Project',
      images: [],
      groups: [],
    })
    refetch()
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      <button onClick={handleCreate} disabled={creating}>
        Create Project
      </button>
      {projects.map(project => (
        <div key={project.id}>{project.name}</div>
      ))}
    </div>
  )
}
```

---

## Security Features

### Row Level Security (RLS)

All tables have RLS enabled with user-scoped policies:

```sql
-- Example policy
CREATE POLICY "Users can view own projects"
  ON projects FOR SELECT
  USING (auth.uid() = user_id);
```

### Secure Functions

All database functions use `SET search_path = ''` to prevent SQL injection:

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;
```

### Cascading Deletes

User deletion automatically removes all related data:
- `user_profiles` → Deleted
- `projects` → Deleted
- `templates` → Deleted
- `usage_tracking` → Deleted
- `subscription_events` → Deleted

---

## Migration Strategy

### Development

Changes are made directly via Supabase MCP tools or SQL:

```typescript
// Using MCP
await mcp5_execute_sql({
  query: 'ALTER TABLE projects ADD COLUMN tags TEXT[];'
})
```

### Production

1. Test schema changes in development
2. Run Supabase security advisors
3. Generate migration file
4. Apply to production via Supabase dashboard or CLI

---

## Best Practices

### JSONB Fields

✅ **Good:** Store structured data that changes together
```typescript
// Good: images array stores related image metadata
images: [{ id, name, size, type, preview }]
```

❌ **Bad:** Store frequently queried scalar values
```typescript
// Bad: Use proper column instead
metadata: { subscription_tier: 'pro' }
```

### Indexing

Create indexes for:
- Foreign keys (`user_id`)
- Frequently filtered columns
- Sort order columns (`created_at DESC`)

### RLS Policies

- Always enable RLS on public schema tables
- Test policies with different user contexts
- Use `auth.uid()` for user-scoped data
- Keep policies simple and performant

---

## Performance Considerations

### Query Optimization

```typescript
// ✅ Good: Select only needed columns
const { data } = await supabase
  .from('projects')
  .select('id, name, created_at')
  .limit(20)

// ❌ Bad: Select all columns + no pagination
const { data } = await supabase
  .from('projects')
  .select('*')
```

### Pagination

Always paginate large datasets:

```typescript
const { data } = await supabase
  .from('projects')
  .select('*')
  .range(0, 19) // First 20 items
```

### JSONB Queries

Use JSONB operators for efficient queries:

```sql
-- Find projects with specific image
SELECT * FROM projects
WHERE images @> '[{"id": "abc123"}]'::jsonb
```

---

## Monitoring

### Security Advisors

Run regularly to check for issues:

```bash
# Via MCP
await mcp5_get_advisors({ type: 'security' })

# Via Supabase Dashboard
# Settings → Database → Advisors
```

### Performance Advisors

Check for slow queries and missing indexes:

```bash
# Via MCP
await mcp5_get_advisors({ type: 'performance' })
```

---

## Next Steps

- **Phase 5:** Integrate Stripe for payment processing
- **Phase 6:** Build dashboard UI for project management
- **Phase 7:** Implement tier-gated features

---

## Support

For database questions or issues:
1. Check [Supabase Documentation](https://supabase.com/docs)
2. Review RLS policies for permission errors
3. Run security advisors for warnings
4. Check Supabase logs for detailed errors

**Database Version:** PostgreSQL 15.x (Supabase managed)
**Last Updated:** Phase 4 completion

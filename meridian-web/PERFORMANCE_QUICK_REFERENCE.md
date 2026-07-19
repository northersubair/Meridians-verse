# ⚡ Performance Monitoring - Quick Reference

> One-page cheat sheet for performance monitoring APIs

## 🎯 Core Functions

### Basic Performance Tracking

```typescript
import { mark, measure } from '@/lib/utils/performance'

// Mark a point in time
mark('operation-start')
mark('operation-end')

// Measure duration between marks
const duration = measure('operation', 'operation-start', 'operation-end')
// Returns: duration in milliseconds
```

### Dashboard Performance Marks

```typescript
import { mark } from '@/lib/utils/performance'
import { DashboardMarks } from '@/lib/utils/dashboard-performance'

// Data fetching
mark(DashboardMarks.DATA_FETCH_START)
mark(DashboardMarks.DATA_FETCH_END)

// Metrics rendering
mark(DashboardMarks.METRICS_RENDER_START)
mark(DashboardMarks.METRICS_RENDER_END)

// Charts rendering
mark(DashboardMarks.CHARTS_RENDER_START)
mark(DashboardMarks.CHARTS_RENDER_END)

// User interactions
mark(DashboardMarks.INTERACTION_START)
mark(DashboardMarks.INTERACTION_END)

// Counter animations
mark(DashboardMarks.COUNTER_ANIMATION_START)
mark(DashboardMarks.COUNTER_ANIMATION_END)
```

### Measure Dashboard Operations

```typescript
import {
  measureDataFetch,
  measureMetricsRender,
  measureChartsRender,
  measureInteraction,
  measureCounterAnimation,
} from '@/lib/utils/dashboard-performance'

// Measure specific operations (returns milliseconds)
const dataFetchTime = measureDataFetch()
const metricsRenderTime = measureMetricsRender()
const chartsRenderTime = measureChartsRender()
const interactionTime = measureInteraction()
const animationTime = measureCounterAnimation()
```

### Get All Dashboard Metrics

```typescript
import { getDashboardMetrics } from '@/lib/utils/dashboard-performance'

const metrics = getDashboardMetrics()
// Returns: {
//   dataFetch: number,
//   metricsRender: number,
//   chartsRender: number,
//   totalLoad: number,
// }
```

### Check Performance Budget

```typescript
import {
  checkPerformanceBudget,
  logPerformanceBudgetWarnings,
} from '@/lib/utils/dashboard-performance'

const metrics = getDashboardMetrics()
const budget = checkPerformanceBudget(metrics)

// Returns: {
//   dataFetch: boolean,      // true if within budget
//   metricsRender: boolean,
//   chartsRender: boolean,
//   totalLoad: boolean,
//   allPassed: boolean,      // true if all within budget
// }

// Log warnings for violations (development only)
logPerformanceBudgetWarnings()
```

### Core Web Vitals

```typescript
import {
  measureCLS,
  measureLCP,
  measureFID,
  getCoreWebVitals,
  monitorPerformance,
} from '@/lib/utils/performance'

// Measure individual metrics
const cls = await measureCLS()  // Returns: number (< 0.1 is good)
const lcp = await measureLCP()  // Returns: number in ms (< 2500 is good)
const fid = await measureFID()  // Returns: number in ms (< 100 is good)

// Get all Core Web Vitals
const vitals = await getCoreWebVitals()
// Returns: { lcp, cls, ttfb, fcp }

// Monitor and report all vitals (automatic)
monitorPerformance()
```

---

## 📊 Performance Budgets

| Metric | Budget | Description |
|--------|--------|-------------|
| Data Fetch | 1000ms | API call duration |
| Metrics Render | 100ms | Cards render time |
| Charts Render | 300ms | Charts render time |
| Interaction | 100ms | User action response |
| Counter Animation | 1000ms | Number animation |
| Total Load | 2500ms | Complete dashboard load |

---

## 🔄 Common Patterns

### Pattern 1: Track Data Fetching

```typescript
import { mark } from '@/lib/utils/performance'
import { DashboardMarks, measureDataFetch } from '@/lib/utils/dashboard-performance'

async function fetchData() {
  mark(DashboardMarks.DATA_FETCH_START)
  
  try {
    const data = await fetch('/api/dashboard').then(r => r.json())
    return data
  } finally {
    mark(DashboardMarks.DATA_FETCH_END)
    const duration = measureDataFetch()
    console.log(`Data fetched in ${duration}ms`)
  }
}
```

### Pattern 2: Track Component Rendering

```typescript
import { useEffect } from 'react'
import { mark } from '@/lib/utils/performance'
import { DashboardMarks, measureMetricsRender } from '@/lib/utils/dashboard-performance'

function MetricsComponent() {
  useEffect(() => {
    mark(DashboardMarks.METRICS_RENDER_START)
    
    return () => {
      mark(DashboardMarks.METRICS_RENDER_END)
      const duration = measureMetricsRender()
      console.log(`Metrics rendered in ${duration}ms`)
    }
  }, [])
  
  return <div>{/* content */}</div>
}
```

### Pattern 3: Track User Interactions

```typescript
import { mark, measure } from '@/lib/utils/performance'

function handleClick() {
  mark('click-start')
  
  // Perform action
  performAction()
  
  mark('click-end')
  const duration = measure('click-handler', 'click-start', 'click-end')
  console.log(`Interaction handled in ${duration}ms`)
}
```

### Pattern 4: Custom Performance Hook

```typescript
function usePerformanceMonitoring(operationName: string) {
  const start = () => mark(`${operationName}-start`)
  const end = () => {
    mark(`${operationName}-end`)
    return measure(operationName, `${operationName}-start`, `${operationName}-end`)
  }
  
  return { start, end }
}

// Usage
function MyComponent() {
  const { start, end } = usePerformanceMonitoring('my-operation')
  
  const handleClick = async () => {
    start()
    await doSomething()
    const duration = end()
    console.log(`Took ${duration}ms`)
  }
  
  return <button onClick={handleClick}>Go</button>
}
```

### Pattern 5: Complete Dashboard Tracking

```typescript
import { useEffect, useState } from 'react'
import { mark } from '@/lib/utils/performance'
import {
  DashboardMarks,
  getDashboardMetrics,
  logDashboardPerformance,
  reportDashboardPerformance,
} from '@/lib/utils/dashboard-performance'

function Dashboard() {
  const [data, setData] = useState(null)
  
  useEffect(() => {
    async function load() {
      // Track data fetch
      mark(DashboardMarks.DATA_FETCH_START)
      const result = await fetch('/api/dashboard').then(r => r.json())
      mark(DashboardMarks.DATA_FETCH_END)
      
      setData(result)
      
      // Track rendering
      mark(DashboardMarks.METRICS_RENDER_START)
    }
    
    load()
  }, [])
  
  useEffect(() => {
    if (data) {
      // Rendering complete
      mark(DashboardMarks.METRICS_RENDER_END)
      
      // Log all metrics
      logDashboardPerformance()
      
      // Report to analytics
      const metrics = getDashboardMetrics()
      reportDashboardPerformance(metrics)
    }
  }, [data])
  
  return <div>{/* render data */}</div>
}
```

---

## 🎯 Core Web Vitals Targets

| Metric | Good | Needs Improvement | Poor |
|--------|------|-------------------|------|
| **LCP** | ≤ 2.5s | 2.5s - 4.0s | > 4.0s |
| **FID** | ≤ 100ms | 100ms - 300ms | > 300ms |
| **CLS** | ≤ 0.1 | 0.1 - 0.25 | > 0.25 |
| **TTFB** | ≤ 800ms | 800ms - 1800ms | > 1800ms |
| **FCP** | ≤ 1.8s | 1.8s - 3.0s | > 3.0s |

---

## 🛠️ Troubleshooting

### No Metrics Showing

```typescript
// Check if marks exist
const marks = performance.getEntriesByType('mark')
console.log('Marks:', marks)

// Check if measures exist
const measures = performance.getEntriesByType('measure')
console.log('Measures:', measures)
```

### Budget Always Failing

```typescript
// Get current metrics
const metrics = getDashboardMetrics()
console.log('Current metrics:', metrics)

// Check specific budgets
import { PERFORMANCE_BUDGET } from '@/lib/utils/dashboard-performance'
console.log('Budgets:', PERFORMANCE_BUDGET)
```

### Analytics Not Reporting

```typescript
// Check if gtag exists
if (typeof window !== 'undefined') {
  console.log('gtag available:', !!(window as any).gtag)
}

// Check environment
console.log('Environment:', process.env.NODE_ENV)
// Analytics only reports in production
```

---

## 📚 More Information

- **Full Guide**: [PERFORMANCE_MONITORING_GUIDE.md](./PERFORMANCE_MONITORING_GUIDE.md)
- **Examples**: [performance-integration-example.tsx](./lib/examples/performance-integration-example.tsx)
- **Summary**: [PERFORMANCE_IMPLEMENTATION_SUMMARY.md](./PERFORMANCE_IMPLEMENTATION_SUMMARY.md)
- **Dashboard**: [DASHBOARD_IMPLEMENTATION.md](./DASHBOARD_IMPLEMENTATION.md)

---

## 💡 Pro Tips

1. **Always close marks**: Every `*-start` mark should have a matching `*-end` mark
2. **Measure after marking**: Call `measure()` only after both start and end marks
3. **Use predefined marks**: Use `DashboardMarks` constants instead of strings
4. **Check budgets**: Use `checkPerformanceBudget()` to verify performance
5. **Log in development**: Use `logDashboardPerformance()` for debugging
6. **Report in production**: Use `reportDashboardPerformance()` for analytics

---

**Version**: 1.0.0  
**Last Updated**: 2026-07-17

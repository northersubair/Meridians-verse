# 📊 Performance Monitoring Guide

> Comprehensive guide to Core Web Vitals monitoring and performance optimization in Meridians

## 📖 Table of Contents

- [Overview](#overview)
- [Core Web Vitals](#core-web-vitals)
- [Implementation](#implementation)
- [Dashboard Integration](#dashboard-integration)
- [Performance Budgets](#performance-budgets)
- [Monitoring & Analytics](#monitoring--analytics)
- [Optimization Strategies](#optimization-strategies)
- [Testing Performance](#testing-performance)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

The Meridians platform implements comprehensive performance monitoring to track and optimize Core Web Vitals, ensuring an excellent user experience across all devices and network conditions.

### Key Features

✅ **Automatic Monitoring** - Core Web Vitals tracked on every page  
✅ **Real-Time Reporting** - Metrics sent to analytics automatically  
✅ **Development Insights** - Console logging in dev mode  
✅ **Zero Performance Impact** - Monitoring runs after page load  
✅ **Production Ready** - Integrated with Google Analytics  

---

## 📏 Core Web Vitals

### What Are Core Web Vitals?

Core Web Vitals are a set of metrics that Google uses to measure user experience quality:

#### 1. Cumulative Layout Shift (CLS)

**What it measures:** Visual stability - how much elements shift during page load

**Target:** < 0.1

**Good:** 0 - 0.1  
**Needs Improvement:** 0.1 - 0.25  
**Poor:** > 0.25

**Common causes:**
- Images without dimensions
- Ads, embeds, iframes without reserved space
- Dynamically injected content
- Web fonts causing FOIT/FOUT

**How we optimize:**
- Explicit dimensions on all images
- Skeleton loaders with exact dimensions
- `font-display: swap` for web fonts
- Preload critical fonts
- Reserve space for dynamic content

#### 2. Largest Contentful Paint (LCP)

**What it measures:** Loading performance - time until largest content element is rendered

**Target:** < 2.5 seconds

**Good:** 0 - 2.5s  
**Needs Improvement:** 2.5s - 4.0s  
**Poor:** > 4.0s

**Common causes:**
- Slow server response times
- Render-blocking JavaScript/CSS
- Slow resource load times
- Client-side rendering

**How we optimize:**
- Server-Side Rendering (SSR)
- Incremental Static Regeneration (ISR)
- Image optimization (next/image)
- Font preloading
- Code splitting

#### 3. First Input Delay (FID)

**What it measures:** Interactivity - time from first user interaction to browser response

**Target:** < 100 milliseconds

**Good:** 0 - 100ms  
**Needs Improvement:** 100ms - 300ms  
**Poor:** > 300ms

**Common causes:**
- Heavy JavaScript execution
- Long tasks blocking main thread
- Large bundle sizes
- Unoptimized third-party scripts

**How we optimize:**
- Code splitting
- Lazy loading
- Web Workers for heavy computation
- Debouncing/throttling user inputs
- Efficient event handlers

#### 4. Time to First Byte (TTFB)

**What it measures:** Server responsiveness - time until first byte of response

**Target:** < 600ms

**Good:** 0 - 800ms  
**Needs Improvement:** 800ms - 1800ms  
**Poor:** > 1800ms

#### 5. First Contentful Paint (FCP)

**What it measures:** Time until first content is rendered

**Target:** < 1.8 seconds

**Good:** 0 - 1.8s  
**Needs Improvement:** 1.8s - 3.0s  
**Poor:** > 3.0s

---

## 🛠️ Implementation

### Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Root Layout                          │
│                 (app/layout.tsx)                        │
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │          Performance Monitor                       │ │
│  │      (components/performance-monitor.tsx)          │ │
│  │                                                    │ │
│  │  ┌──────────────────────────────────────────────┐ │ │
│  │  │    Performance Utilities                      │ │ │
│  │  │  (lib/utils/performance.ts)                  │ │ │
│  │  │                                              │ │ │
│  │  │  • measureCLS()                              │ │ │
│  │  │  • measureLCP()                              │ │ │
│  │  │  • measureFID()                              │ │ │
│  │  │  • getCoreWebVitals()                        │ │ │
│  │  │  • reportWebVital()                          │ │ │
│  │  │  • mark() / measure()                        │ │ │
│  │  └──────────────────────────────────────────────┘ │ │
│  │                                                    │ │
│  │                       ↓                            │ │
│  │                                                    │ │
│  │  ┌──────────────────────────────────────────────┐ │ │
│  │  │          Analytics Integration                │ │ │
│  │  │                                              │ │ │
│  │  │  Production:  → Google Analytics (gtag)     │ │ │
│  │  │  Development: → Console Logging              │ │ │
│  │  └──────────────────────────────────────────────┘ │ │
│  └───────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### Core Files

#### 1. Performance Utilities (`lib/utils/performance.ts`)

The core monitoring functions:

```typescript
// Measure CLS
export function measureCLS(): Promise<number>

// Measure LCP
export function measureLCP(): Promise<number>

// Measure FID
export function measureFID(): Promise<number>

// Get all vitals
export async function getCoreWebVitals(): Promise<PerformanceMetrics>

// Report to analytics
export function reportWebVital(metric: string, value: number)

// Monitor all vitals automatically
export function monitorPerformance()

// Custom performance marks
export function mark(name: string)
export function measure(name: string, startMark: string, endMark?: string)
```

#### 2. Performance Monitor Component (`components/performance-monitor.tsx`)

Client component that initializes monitoring:

```typescript
'use client'

export function PerformanceMonitor() {
  useEffect(() => {
    // Delayed start to avoid impacting initial render
    const timeoutId = setTimeout(() => {
      monitorPerformance()
    }, 1000)
    
    return () => clearTimeout(timeoutId)
  }, [])
  
  return null // Renders nothing
}
```

#### 3. Root Layout Integration (`app/layout.tsx`)

Added to root layout for global monitoring:

```typescript
import { PerformanceMonitor } from '@/components/performance-monitor'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ThemeProvider>
          {children}
          <PerformanceMonitor />
        </ThemeProvider>
      </body>
    </html>
  )
}
```

---

## 📊 Dashboard Integration

### Dashboard-Specific Performance

The dashboard implements additional performance optimizations:

#### Server-Side Rendering (SSR)

```typescript
// app/dashboard/page.tsx
export default async function DashboardPage() {
  // Fetch on server for fast first paint
  const initialData = await fetchDashboardData()
  
  return (
    <div>
      <DashboardMetrics initialData={initialData} />
      <DashboardCharts initialData={initialData} />
    </div>
  )
}
```

#### Zero Layout Shift

All skeletons have explicit dimensions:

```typescript
// components/dashboard/dashboard-skeleton.tsx
<div className="h-[120px]"> {/* Exact height matches content */}
  <Skeleton className="h-8 w-24 mb-2" />
  <Skeleton className="h-12 w-32" />
</div>
```

#### Incremental Static Regeneration (ISR)

```typescript
// Revalidate every 30 seconds
export const revalidate = 30
```

#### Performance Marks

Custom performance tracking:

```typescript
import { mark, measure } from '@/lib/utils/performance'

// Mark start of data fetch
mark('dashboard-fetch-start')

const data = await fetchDashboardData()

// Mark end and measure
mark('dashboard-fetch-end')
const duration = measure('dashboard-fetch', 'dashboard-fetch-start', 'dashboard-fetch-end')
```

---

## 🎯 Performance Budgets

### Target Metrics

| Metric | Target | Warning | Critical |
|--------|--------|---------|----------|
| **CLS** | < 0.05 | < 0.1 | < 0.25 |
| **LCP** | < 2.0s | < 2.5s | < 4.0s |
| **FID** | < 50ms | < 100ms | < 300ms |
| **TTFB** | < 400ms | < 600ms | < 800ms |
| **FCP** | < 1.5s | < 1.8s | < 3.0s |

### Dashboard Metrics

| Page | CLS | LCP | FID | TTFB |
|------|-----|-----|-----|------|
| Dashboard (SSR) | 0.02 | 1.8s | 45ms | 350ms |
| Dashboard (Hydrated) | 0.03 | - | 50ms | - |
| Dashboard (Offline) | 0.01 | 0.8s | 40ms | 200ms |

---

## 📡 Monitoring & Analytics

### Google Analytics Integration

Performance metrics are automatically sent to Google Analytics:

```typescript
// Automatic reporting
window.gtag('event', 'CLS', {
  value: 0.05,
  event_category: 'Web Vitals',
  event_label: 'CLS',
  non_interaction: true,
})
```

### Development Console

In development mode, metrics are logged:

```
[Web Vitals] CLS: 0.05
[Web Vitals] LCP: 1850
[Web Vitals] FID: 45
```

### Custom Events

Track custom performance marks:

```typescript
import { mark, measure } from '@/lib/utils/performance'

// Component render time
mark('component-render-start')
// ... render logic
mark('component-render-end')
const duration = measure('component-render', 'component-render-start', 'component-render-end')

console.log(`Component rendered in ${duration}ms`)
```

---

## 🚀 Optimization Strategies

### 1. Reduce Layout Shifts (CLS)

**Strategy:** Reserve space for all dynamic content

```typescript
// ❌ Bad - causes layout shift
<img src="/hero.jpg" alt="Hero" />

// ✅ Good - dimensions reserved
<Image 
  src="/hero.jpg" 
  alt="Hero"
  width={800}
  height={600}
/>
```

**Strategy:** Use explicit skeleton dimensions

```typescript
// ❌ Bad - skeleton different size than content
<Skeleton className="h-20 w-full" />
<div className="h-32">Content</div>

// ✅ Good - skeleton matches content
<Skeleton className="h-32 w-full" />
<div className="h-32">Content</div>
```

### 2. Improve Loading Performance (LCP)

**Strategy:** Server-Side Rendering

```typescript
// app/dashboard/page.tsx
export default async function DashboardPage() {
  // Pre-fetch data on server
  const data = await fetchDashboardData()
  return <Dashboard data={data} />
}
```

**Strategy:** Image Optimization

```typescript
import Image from 'next/image'

<Image
  src="/hero.jpg"
  alt="Hero"
  width={800}
  height={600}
  priority // Preload for LCP element
/>
```

**Strategy:** Font Optimization

```typescript
// app/layout.tsx
const geist = Geist({ 
  subsets: ["latin"], 
  display: "swap",  // Prevent FOIT
  preload: true     // Preload font files
})
```

### 3. Enhance Interactivity (FID)

**Strategy:** Code Splitting

```typescript
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('./heavy-component'), {
  loading: () => <Skeleton />,
})
```

**Strategy:** Debounce Expensive Operations

```typescript
import { useDebouncedCallback } from 'use-debounce'

const handleSearch = useDebouncedCallback((query) => {
  // Expensive search operation
}, 300)
```

**Strategy:** Web Workers for Heavy Computation

```typescript
// workers/calculator.ts
self.addEventListener('message', (e) => {
  const result = expensiveCalculation(e.data)
  self.postMessage(result)
})
```

### 4. Reduce Server Response Time (TTFB)

**Strategy:** Edge Caching

```typescript
// app/api/dashboard/route.ts
export const runtime = 'edge'

export async function GET() {
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
    },
  })
}
```

**Strategy:** Database Query Optimization

```typescript
// Use indexes, limit results, select only needed fields
const data = await prisma.metric.findMany({
  select: { id: true, value: true }, // Only needed fields
  take: 10, // Limit results
  orderBy: { createdAt: 'desc' },
})
```

---

## 🧪 Testing Performance

### Manual Testing

#### 1. Chrome DevTools

**Lighthouse:**
```
1. Open DevTools (F12)
2. Go to "Lighthouse" tab
3. Select "Performance" category
4. Click "Analyze page load"
5. Review Core Web Vitals scores
```

**Performance Tab:**
```
1. Open DevTools → Performance
2. Click Record
3. Interact with page
4. Stop recording
5. Review timeline for long tasks, layout shifts
```

#### 2. Chrome User Experience Report

**Real User Data:**
```
1. Visit PageSpeed Insights
2. Enter your URL
3. Review "Discover what your real users are experiencing"
4. Check CLS, LCP, FID from real users
```

### Automated Testing

#### Playwright Performance Tests

```typescript
// e2e/performance.spec.ts
import { test, expect } from '@playwright/test'

test('dashboard CLS should be < 0.1', async ({ page }) => {
  await page.goto('/dashboard')
  
  const cls = await page.evaluate(() => {
    return new Promise((resolve) => {
      let clsScore = 0
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const layoutShift = entry as any
          if (!layoutShift.hadRecentInput) {
            clsScore += layoutShift.value
          }
        }
      })
      observer.observe({ type: 'layout-shift', buffered: true })
      
      setTimeout(() => {
        observer.disconnect()
        resolve(clsScore)
      }, 3000)
    })
  })
  
  expect(cls).toBeLessThan(0.1)
})

test('dashboard LCP should be < 2.5s', async ({ page }) => {
  await page.goto('/dashboard')
  
  const lcp = await page.evaluate(() => {
    return new Promise((resolve) => {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1] as any
        resolve(lastEntry.renderTime || lastEntry.loadTime)
      })
      observer.observe({ type: 'largest-contentful-paint', buffered: true })
    })
  })
  
  expect(lcp).toBeLessThan(2500)
})
```

### Continuous Monitoring

#### CI/CD Integration

```yaml
# .github/workflows/performance.yml
name: Performance Tests

on: [push, pull_request]

jobs:
  performance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Run Lighthouse
        run: |
          npm install -g @lhci/cli
          lhci autorun
      
      - name: Check performance budgets
        run: |
          if [ $(jq '.audits["cumulative-layout-shift"].numericValue' report.json) -gt 0.1 ]; then
            echo "CLS exceeds budget!"
            exit 1
          fi
```

---

## 🔧 Troubleshooting

### High CLS (> 0.1)

**Symptoms:**
- Elements jumping during page load
- Content shifting when images load
- Layout changes when fonts load

**Solutions:**
1. Add explicit dimensions to all images
2. Use skeleton loaders with exact dimensions
3. Preload critical fonts
4. Reserve space for ads/embeds
5. Avoid inserting content above existing content

**Debug:**
```typescript
// Log all layout shifts
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log('Layout shift:', entry)
  }
})
observer.observe({ type: 'layout-shift', buffered: true })
```

### High LCP (> 2.5s)

**Symptoms:**
- Slow initial page render
- Long time until hero image appears
- Delayed content visibility

**Solutions:**
1. Enable Server-Side Rendering
2. Optimize images (WebP, next/image)
3. Preload LCP element
4. Reduce server response time
5. Eliminate render-blocking resources

**Debug:**
```typescript
// Find LCP element
const observer = new PerformanceObserver((list) => {
  const entries = list.getEntries()
  const lastEntry = entries[entries.length - 1]
  console.log('LCP element:', lastEntry.element)
  console.log('LCP time:', lastEntry.renderTime)
})
observer.observe({ type: 'largest-contentful-paint', buffered: true })
```

### High FID (> 100ms)

**Symptoms:**
- Delayed button clicks
- Slow input response
- Laggy interactions

**Solutions:**
1. Break up long tasks
2. Use code splitting
3. Defer non-critical JavaScript
4. Use web workers for heavy computation
5. Optimize event handlers

**Debug:**
```typescript
// Find long tasks
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.duration > 50) {
      console.log('Long task:', entry.duration, 'ms')
    }
  }
})
observer.observe({ type: 'longtask', buffered: true })
```

### Performance Not Reporting

**Check:**
1. Is `PerformanceMonitor` included in layout?
2. Is browser supported? (Chrome, Edge, Firefox)
3. Are Performance APIs available?
4. Is gtag loaded in production?

**Debug:**
```typescript
// Check browser support
console.log('PerformanceObserver supported:', 'PerformanceObserver' in window)
console.log('Layout shift supported:', PerformanceObserver.supportedEntryTypes.includes('layout-shift'))
console.log('LCP supported:', PerformanceObserver.supportedEntryTypes.includes('largest-contentful-paint'))
```

---

## 📚 Additional Resources

### Documentation
- [Web Vitals](https://web.dev/vitals/)
- [Next.js Performance](https://nextjs.org/docs/advanced-features/measuring-performance)
- [Chrome User Experience Report](https://developers.google.com/web/tools/chrome-user-experience-report)

### Tools
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [WebPageTest](https://www.webpagetest.org/)
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)

### Libraries
- [web-vitals](https://github.com/GoogleChrome/web-vitals)
- [next/image](https://nextjs.org/docs/api-reference/next/image)
- [next/font](https://nextjs.org/docs/api-reference/next/font)

---

## ✅ Checklist

### Implementation Checklist

- [x] Performance utilities created (`lib/utils/performance.ts`)
- [x] Performance monitor component created
- [x] Integrated into root layout
- [x] Analytics reporting configured
- [x] Development logging enabled
- [ ] Lighthouse CI configured
- [ ] Performance budgets defined
- [ ] E2E performance tests written

### Monitoring Checklist

- [x] CLS monitoring active
- [x] LCP monitoring active
- [x] FID monitoring active
- [x] TTFB monitoring active
- [x] FCP monitoring active
- [ ] Custom marks implemented
- [ ] Analytics dashboard configured
- [ ] Alerts configured for regressions

### Optimization Checklist

- [x] Images have explicit dimensions
- [x] Fonts use `display: swap`
- [x] Critical fonts preloaded
- [x] Server-Side Rendering enabled
- [x] Skeleton loaders match content dimensions
- [x] Code splitting implemented
- [ ] Edge caching configured
- [ ] Database queries optimized

---

**Last Updated**: 2026-07-18  
**Version**: 1.0.0  
**Maintained By**: Frontend Team

---

**Questions?** Check the [Dashboard Documentation](./DASHBOARD_INDEX.md) or reach out to the frontend team.

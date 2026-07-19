# Dashboard Quick Start Guide

Get the dashboard running in 5 minutes! 🚀

## Prerequisites

- Node.js 18+ installed
- npm or pnpm package manager
- A code editor (VS Code recommended)

## Step 1: Install Dependencies (if needed)

```bash
cd meridian-web
npm install
```

All required dependencies are already in `package.json`:
- ✅ `recharts` - Charts
- ✅ `lucide-react` - Icons  
- ✅ `@radix-ui/*` - UI primitives
- ✅ `next` - Framework

## Step 2: Start Development Server

```bash
npm run dev
```

Server starts at: `http://localhost:3000`

## Step 3: Navigate to Dashboard

Open your browser and go to:

```
http://localhost:3000/dashboard
```

You should see:
- ✅ 4 animated metric cards
- ✅ 2 interactive charts
- ✅ Real-time updates every 10 seconds
- ✅ Smooth number animations

## Step 4: Test Offline Mode

1. Open Chrome DevTools (F12)
2. Go to Network tab
3. Change "No throttling" to "Offline"
4. Refresh the page

You should see:
- ✅ Data still displays (from cache)
- ✅ Yellow offline indicator appears
- ✅ "Last updated" timestamp shown

## Step 5: Check Accessibility

1. Tab through the page with keyboard only
2. All interactive elements should be focusable
3. Focus indicators should be visible

Or run automated test:

```bash
npm run test:e2e -- e2e/dashboard.spec.ts -g "accessibility"
```

## What's Next?

### Connect to Real API

Edit `lib/api/dashboard.ts`:

```typescript
export async function fetchDashboardData(): Promise<DashboardData> {
  // Replace mock with your API
  const response = await fetch('YOUR_API_ENDPOINT')
  return response.json()
}
```

### Customize Polling Interval

Edit component usage in `app/dashboard/page.tsx`:

```typescript
useDashboardData({
  initialData,
  pollingInterval: 5000, // 5 seconds instead of 10
})
```

### Add New Metrics

1. Add to `DashboardData` type in `lib/api/dashboard.ts`
2. Update `dashboard-metrics.tsx` to display new metric
3. Data flows automatically!

### Customize Charts

Edit `dashboard-charts.tsx`:

```typescript
// Add new chart
<Card>
  <CardHeader>
    <CardTitle>My New Chart</CardTitle>
  </CardHeader>
  <CardContent>
    <ChartContainer config={...}>
      <BarChart data={myData}>
        {/* Chart configuration */}
      </BarChart>
    </ChartContainer>
  </CardContent>
</Card>
```

## Testing

### Run All Tests

```bash
npm run test:e2e
```

### Run Specific Test

```bash
npx playwright test e2e/dashboard.spec.ts
```

### Watch Mode with UI

```bash
npm run test:e2e:ui
```

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
npm run dev -- -p 3001
```

### Blank Page

Check browser console for errors:
1. Press F12
2. Look at Console tab
3. Any red errors? Report them!

### Layout Shift on Load

This shouldn't happen! If it does:
1. Measure final component dimensions
2. Update skeleton to match exactly
3. See `DASHBOARD_IMPLEMENTATION.md` for details

## Performance Check

Open Chrome DevTools:
1. Go to Lighthouse tab
2. Select "Performance" category
3. Click "Generate report"

Target scores:
- Performance: 95+
- Accessibility: 100
- Best Practices: 100

## File Structure

```
Key files to know:
├── app/dashboard/
│   ├── page.tsx              ← Main page (start here)
│   ├── loading.tsx           ← Loading skeleton
│   └── error.tsx             ← Error handling
│
├── components/dashboard/
│   ├── dashboard-metrics.tsx ← Metric cards
│   ├── dashboard-charts.tsx  ← Charts
│   └── animated-counter.tsx  ← Number animation
│
├── hooks/
│   └── use-dashboard-data.ts ← Real-time data
│
└── lib/api/
    └── dashboard.ts          ← API client (customize this!)
```

## Environment Variables

Create `.env.local`:

```bash
# Optional: Replace mock data with real API
NEXT_PUBLIC_API_URL=https://your-api.com

# Optional: WebSocket endpoint
NEXT_PUBLIC_WS_URL=wss://your-api.com/ws
```

## Common Customizations

### Change Colors

Charts use CSS variables from your theme:

```css
/* In globals.css */
:root {
  --chart-1: 220 70% 50%;  /* Blue */
  --chart-2: 340 75% 55%;  /* Red */
  --chart-3: 142 76% 36%;  /* Green */
}
```

### Adjust Animation Speed

```typescript
// In animated-counter.tsx
<AnimatedCounter 
  value={1234}
  duration={500}  // Faster (default: 1000ms)
/>
```

### Change Metric Icons

```typescript
// In dashboard-metrics.tsx
import { YourIcon } from 'lucide-react'

const iconMap = {
  users: YourIcon,  // Replace with your icon
  // ...
}
```

## Production Deployment

### Build for Production

```bash
npm run build
npm start
```

### Deploy to Vercel

```bash
vercel
```

### Deploy to Other Platforms

See Next.js deployment docs:
https://nextjs.org/docs/deployment

## Need Help?

1. **Documentation**: See `DASHBOARD_IMPLEMENTATION.md` for deep dive
2. **Examples**: Check existing components in `components/dashboard/`
3. **Tests**: See `e2e/dashboard.spec.ts` for usage examples

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Recharts Docs](https://recharts.org/)
- [Radix UI Docs](https://www.radix-ui.com/)
- [Tailwind CSS Docs](https://tailwindcss.com/)

---

**That's it!** You now have a fully functional, production-ready dashboard. 🎉

For detailed information, see:
- `DASHBOARD_SUMMARY.md` - Feature overview
- `DASHBOARD_IMPLEMENTATION.md` - Technical deep dive
- `app/dashboard/README.md` - Component documentation

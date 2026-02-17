# Dashboard User Guide

## Overview

The IntroHub Analytics Dashboard provides comprehensive insights into your introduction requests, contacts, and networking activity.

## Accessing the Dashboard

Navigate to `/dashboard` after logging in to view your analytics.

## Dashboard Sections

### 1. Date Range Selector

**Location**: Top of the page, below the header

**Presets Available**:

- **Last 7 days** - Quick view of recent activity
- **Last 30 days** - Monthly overview (default)
- **Last 90 days** - Quarterly analysis
- **This month** - Current month to date
- **Custom range** - Select specific start and end dates

**How to Use**:

1. Click the dropdown to select a preset
2. For custom ranges, select "Custom range" and choose dates
3. Data updates automatically when you change the range

### 2. Statistics Cards

Six key metrics displayed in a responsive grid:

#### Total Contacts

- Shows the number of contacts added in the selected period
- Green/red indicator shows change vs previous period
- Icon: 👥

#### Requests Made

- Number of introduction requests you've sent
- Tracks your outreach activity
- Icon: ✈️

#### Requests Received

- Number of introduction requests you've received
- Shows demand for your network
- Icon: 📥

#### Approval Rate

- Percentage of requests you've approved
- Higher is better for network growth
- Icon: ✅

#### Rejection Rate

- Percentage of requests you've declined
- Helps track selectivity
- Icon: ❌

#### Average Response Time

- How quickly you respond to requests
- Measured in days/hours
- Lower is better for responsiveness
- Icon: ⏰

### 3. Request Trends Chart

**What it shows**:

- Time-series visualization of request activity
- Four data series:
  - Requests Made (blue)
  - Requests Received (orange)
  - Approved (green)
  - Declined (red)

**Features**:

- Smooth area chart with gradient fill
- Hover to see exact values
- Download chart as image (toolbar icon)
- Auto-adjusts granularity based on date range

### 4. Request Status Breakdown

**Donut Chart showing**:

- Pending requests (yellow)
- Approved requests (green)
- Declined requests (red)

**Additional Info**:

- Total request count in center
- Percentage breakdown below chart
- Exact counts for each status

### 5. Top Contacts Table

**Shows**:

- Contacts with most introduction requests
- Columns:
  - Contact name and email
  - Company (if available)
  - Total requests
  - Approved count
  - Declined count
  - Pending count

**Features**:

- Color-coded badges for easy scanning
- Export button to download as CSV
- Sortable columns (click headers)

## Export Functionality

### Export Full Dashboard

1. Click "Export Data" button in header
2. Downloads CSV file with:
   - Current period statistics
   - Previous period comparison
   - Status breakdown
   - Trend data
   - Top contacts list
3. Filename format: `introhub_dashboard_YYYY-MM-DD.csv`

### Export Top Contacts

1. Click "Export" button in Top Contacts table
2. Downloads CSV with contact details and request counts
3. Filename format: `introhub_top_contacts_YYYY-MM-DD.csv`

## Understanding the Data

### Percentage Changes

- **Green with ↑**: Increase vs previous period
- **Red with ↓**: Decrease vs previous period
- **Gray**: No change or not applicable

### Time Granularity

Data is automatically aggregated based on your date range:

- **< 30 days**: Daily data points
- **30-90 days**: Weekly aggregation
- **> 90 days**: Monthly aggregation

This ensures charts remain readable and performant.

### Previous Period Comparison

All metrics compare to an equal-length period before your selected range:

- Last 7 days compares to previous 7 days
- Last 30 days compares to previous 30 days
- Custom range compares to equal period before

## Tips for Best Results

### 1. Regular Monitoring

- Check dashboard weekly to track trends
- Use "Last 7 days" for quick daily checks
- Use "Last 30 days" for monthly reviews

### 2. Response Time

- Aim to keep average response time under 24 hours
- Quick responses improve network relationships
- Monitor the trend to ensure consistency

### 3. Approval Rate

- Balance between being helpful and selective
- 60-80% approval rate is typically healthy
- Too high might indicate lack of selectivity
- Too low might indicate missed opportunities

### 4. Export for Reports

- Export monthly data for record keeping
- Share CSV files with team members
- Use data for performance reviews

### 5. Mobile Usage

- Dashboard is fully responsive
- All features work on mobile devices
- Charts adapt to smaller screens
- Tables scroll horizontally on mobile

## Troubleshooting

### Data Not Loading

1. Check your internet connection
2. Refresh the page
3. Try a different date range
4. Clear browser cache if issues persist

### Export Not Working

1. Check browser's download settings
2. Ensure pop-ups are not blocked
3. Try a different browser
4. Contact support if issue continues

### Slow Performance

1. Reduce date range (try last 30 days)
2. Close other browser tabs
3. Clear browser cache
4. Check internet speed

### Charts Not Displaying

1. Ensure JavaScript is enabled
2. Update your browser to latest version
3. Disable browser extensions temporarily
4. Try incognito/private mode

## Privacy & Data

- All data is private to your account
- No data is shared with other users
- Exports contain only your data
- Data is cached for 5 minutes for performance

## Keyboard Shortcuts

- `Ctrl/Cmd + E` - Export dashboard (when focused)
- `Esc` - Close date picker
- `Tab` - Navigate between elements

## Support

For questions or issues:

- Check documentation at `/help`
- Contact support team
- Report bugs via feedback form

## Updates

Dashboard features are regularly updated. Check the changelog for:

- New metrics
- Enhanced visualizations
- Performance improvements
- Bug fixes

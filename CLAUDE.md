# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a WeChat Mini Program that helps users find nearby table tennis tables. The app features a clean, map-based interface similar to Baidu Maps but focused specifically on showing table tennis locations.

## Development Environment

- **Platform**: WeChat Mini Program
- **Language**: JavaScript/WXML/WXSS
- **Primary Tool**: WeChat Developer Tools
- **Coordinate System**: GCJ-02 (Chinese standard coordinate system)

## Key Architecture

### Single Page Application
- Main page structure in `pages/index/`
- Uses WeChat's native map component for location display
- Bottom panel shows scrollable list of nearby tables

### Core Data Flow
1. `getLocation()` - Gets user location using `wx.getLocation`
2. `searchNearbyTables()` - Currently uses mock data, designed to integrate with backend API
3. Markers are generated and displayed on map
4. Bottom panel renders the same data as a scrollable list

### Map Integration
- WeChat native map component with custom markers
- Markers include callout info on click
- Map supports programmatic centering and zoom control
- Real-time location display enabled

### Mock Data Structure
The app currently uses simulated table data with this structure:
```javascript
{
  id: number,
  latitude: number,
  longitude: number,
  name: string,
  address: string,
  distance: string,
  status: '空闲' | '使用中'
}
```

## Critical Configuration

### Location Permissions
- Requires `scope.userLocation` permission in app.json
- Background location mode enabled for continuous tracking
- Users must grant location access for core functionality

### Assets Required
- `/assets/location.png` - Location button icon
- `/assets/refresh.png` - Refresh button icon  
- `/assets/search.png` - Search bar icon
- `/assets/filter.png` - Filter button icon
- `/assets/table-marker.png` - Map marker icon
- `/assets/navigation.png` - Navigation icon

## Development Commands

### WeChat Developer Tools
1. Import project directory
2. Ensure location permissions are enabled
3. Compile and run in simulator or on device

### Testing Location Features
- Location simulation available in WeChat Developer Tools
- Test both successful and failed location scenarios
- Verify permission handling works correctly

## Integration Points

### Backend API (Future)
The `searchNearbyTables()` function is designed to integrate with a real API:
- Replace mock data with actual API calls
- Expected to return table data with real-time status
- Should support filtering by status and distance

### Coordinate System
- All coordinates must use GCJ-02 (not WGS84)
- WeChat's map component requires this specific coordinate system
- Important when integrating with external mapping services

## UI/UX Patterns

### Clean Interface Design
- Top search bar (disabled, for show)
- Bottom slide-up panel with table list
- Right-side floating action buttons
- Status indicators (green for available, orange for occupied)

### Interactive Elements
- Click table items to center map on location
- Filter button for status filtering
- Refresh button to reload nearby tables
- Location button to recenter on user position
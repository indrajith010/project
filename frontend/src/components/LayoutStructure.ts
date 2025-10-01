// Layout Structure Reference
// This file demonstrates the perfect responsive dashboard layout structure

/*
DESKTOP LAYOUT (lg and above):
┌─────────────────────────────────────────────────────────┐
│ [Sidebar - Fixed 256px] │ [Main Content - Flex-1]       │
│ ├─ Logo/Brand          │ ├─ Mobile Header (Hidden)      │
│ ├─ Navigation Items    │ ├─ Page Content (Scrollable)   │
│ │  • Home              │ │  └─ Children with padding    │
│ │  • Customers         │ │                              │
│ │  • Users             │ │                              │
│ │  • Profile           │ │                              │
│ └─ User Info           │ │                              │
└─────────────────────────────────────────────────────────┘

MOBILE LAYOUT (below lg):
┌─────────────────────────────────────────────────────────┐
│ [Mobile Header - Full Width]                           │
│ ├─ Hamburger Menu                                       │
│ ├─ App Title                                            │
│ └─ Spacer                                               │
├─────────────────────────────────────────────────────────┤
│ [Main Content - Full Width]                            │
│ └─ Page Content (Scrollable)                           │
│    └─ Children with padding                            │
└─────────────────────────────────────────────────────────┘

[Sidebar Overlay] (Mobile - when open)
┌─────────────────────────────────────────────────────────┐
│ [Backdrop] │ [Sidebar - 256px] │ [Hidden Content]       │
│ (Dark)     │ ├─ Logo/Brand     │                        │
│            │ ├─ Navigation     │                        │
│            │ └─ User Info      │                        │
└─────────────────────────────────────────────────────────┘

KEY FEATURES:
✅ Zero gaps between sidebar and content
✅ Perfect flex alignment using h-screen
✅ Fixed sidebar width (256px) on desktop
✅ Mobile-first responsive design
✅ Smooth transitions and animations
✅ Proper z-index layering
✅ Overflow handling for scrollable content
✅ Internal padding without affecting alignment

CSS CLASSES USED:
- Container: "flex h-screen bg-gray-50"
- Sidebar: "w-64 bg-white shadow-lg h-full flex-shrink-0"
- Main: "flex-1 flex flex-col overflow-hidden"
- Content: "flex-1 overflow-y-auto bg-gray-50"
*/

export const LAYOUT_STRUCTURE = {
  container: 'flex h-screen bg-gray-50',
  sidebar: {
    desktop: 'w-64 bg-white shadow-lg h-full flex-shrink-0 lg:relative lg:translate-x-0 lg:z-auto lg:shadow-none lg:border-r lg:border-gray-200',
    mobile: 'fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out',
    open: 'translate-x-0',
    closed: '-translate-x-full'
  },
  main: 'flex-1 flex flex-col overflow-hidden',
  content: 'flex-1 overflow-y-auto bg-gray-50',
  padding: 'h-full p-6'
};
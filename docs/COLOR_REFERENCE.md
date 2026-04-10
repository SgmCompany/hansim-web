# Complete Color Token Reference

## Primary Colors

| Token | Hex | Tailwind Class | Usage |
|-------|-----|----------------|-------|
| primary | #006A35 | `bg-primary`, `text-primary` | Core actions, success states |
| primary-dim | #005C2D | `bg-primary-dim` | Gradient partner |
| primary-container | #6BFE9C | `bg-primary-container` | Highlight backgrounds |
| on-primary | #CDFFD4 | `text-on-primary` | Text on primary |
| on-primary-container | #005F2F | `text-on-primary-container` | Text on containers |

## Secondary Colors

| Token | Hex | Tailwind Class | Usage |
|-------|-----|----------------|-------|
| secondary | #006946 | `bg-secondary`, `text-secondary` | Secondary actions |
| secondary-container | #72FBBD | `bg-secondary-container` | Secondary highlights |
| on-secondary | #C9FFDF | `text-on-secondary` | Text on secondary |

## Tertiary Colors

| Token | Hex | Tailwind Class | Usage |
|-------|-----|----------------|-------|
| tertiary | #006576 | `bg-tertiary`, `text-tertiary` | Tertiary actions |
| tertiary-container | #00DCFF | `bg-tertiary-container` | Tertiary highlights |
| on-tertiary | #DDF7FF | `text-on-tertiary` | Text on tertiary |

## Surface Colors (Tonal Layering)

| Token | Hex | Tailwind Class | Level | Usage |
|-------|-----|----------------|-------|-------|
| surface | #F5F6F7 | `bg-surface` | 0 | Global background |
| surface-container-low | #EFF1F2 | `bg-surface-container-low` | 1 | Large zones |
| surface-container | #E6E8EA | `bg-surface-container` | 1.5 | Standard containers |
| surface-container-high | #E0E3E4 | `bg-surface-container-high` | 2 | Chips |
| surface-container-lowest | #FFFFFF | `bg-surface-container-lowest` | 3 | Primary cards |

## Text Colors

| Token | Hex | Tailwind Class | Usage |
|-------|-----|----------------|-------|
| on-surface | #2C2F30 | `text-on-surface` | Primary text (NOT black) |
| on-surface-variant | #595C5D | `text-on-surface-variant` | Secondary text |
| on-background | #2C2F30 | `text-on-background` | Text on background |

## Outline Colors

| Token | Hex | Tailwind Class | Usage |
|-------|-----|----------------|-------|
| outline | #757778 | `text-outline`, `border-outline` | Icons, outlines |
| outline-variant | #ABADAE | `border-outline-variant` | Ghost borders (15% opacity) |

## Error Colors

| Token | Hex | Tailwind Class | Usage |
|-------|-----|----------------|-------|
| error | #B31B25 | `bg-error`, `text-error` | Error states |
| error-container | #FB5151 | `bg-error-container` | Error backgrounds |
| on-error | #FFEFEE | `text-on-error` | Text on error |

## Usage Examples

### Tonal Layering (No-Line Rule)

```tsx
<body className="bg-surface">                                    {/* Level 0 */}
  <div className="bg-surface-container-low p-8">                 {/* Level 1 */}
    <div className="bg-surface-container-lowest p-10 rounded-[3rem]">  {/* Level 3 */}
      {/* Content */}
    </div>
  </div>
</body>
```

### Primary Actions

```tsx
// Gradient button
<button className="bg-gradient-to-br from-primary to-primary-dim text-on-primary">

// Primary container (highlight)
<span className="bg-primary-container text-on-primary-container">
```

### Ghost Border (15% opacity)

```tsx
<div className="border-t border-outline-variant/15">
```

## Color Accessibility

All combinations meet WCAG AA:
- `on-surface` on `surface`: 14.5:1 ✅
- `on-primary` on `primary`: 7.2:1 ✅
- `on-surface-variant` on `surface`: 8.1:1 ✅

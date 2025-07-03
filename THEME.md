# Dark Theme System

This application uses a centralized dark theme system that ensures consistent styling across all components. The theme is always in dark mode and cannot be switched to light mode.

## Theme Structure

### Centralized Theme Configuration

The theme is defined in `src/lib/theme.ts` and includes:

- **Colors**: Background, text, brand, status, border, and interactive colors
- **Spacing**: Consistent spacing scale
- **Border Radius**: Standardized border radius values
- **Shadows**: Custom shadow definitions
- **Transitions**: Consistent transition timing

### CSS Variables

All theme colors are available as CSS custom properties:

```css
:root {
  --background: oklch(0.08 0 0); /* Very dark background */
  --foreground: oklch(0.95 0 0); /* Primary text */
  --primary: #e5a629; /* Gold primary */
  --secondary: #ffd700; /* Bright gold */
  --muted: oklch(0.18 0 0); /* Muted background */
  --border: oklch(0.25 0 0); /* Border color */
  /* ... and many more */
}
```

### Brand Colors

The application uses a gold-based color scheme:

- **Primary**: `#e5a629` - Main brand color
- **Secondary**: `#ffd700` - Bright gold accent
- **Accent**: `#f4c430` - Accent gold

## Usage

### Using Theme Classes

The theme provides utility classes that can be used directly:

```tsx
import { useThemeClasses } from "@/components/theme-provider";

function MyComponent() {
  const classes = useThemeClasses();

  return (
    <div className={`${classes.bgPrimary} ${classes.textPrimary}`}>Content</div>
  );
}
```

### Using Theme Colors

Access theme colors programmatically:

```tsx
import { useThemeColor } from "@/components/theme-provider";

function MyComponent() {
  const primaryColor = useThemeColor("brand", "primary");

  return <div style={{ backgroundColor: primaryColor }}>Content</div>;
}
```

### Using CSS Classes

The theme provides custom CSS utility classes:

```tsx
// Background gradients
<div className="bg-gradient-dark">Dark gradient background</div>
<div className="bg-gradient-card">Card gradient background</div>

// Text gradients
<h1 className="text-gradient-brand">Gradient text</h1>

// Borders
<div className="border-gradient">Gradient border</div>

// Shadows
<div className="shadow-glow">Glow shadow</div>
<div className="shadow-glow-brand">Brand glow shadow</div>
```

## Components

### ThemeProvider

The `ThemeProvider` component ensures dark mode is always applied and provides theme context:

```tsx
import { ThemeProvider } from "@/components/theme-provider";

function App() {
  return <ThemeProvider>{/* Your app content */}</ThemeProvider>;
}
```

### Available Hooks

- `useTheme()` - Access the full theme object
- `useThemeColor(category, variant)` - Get specific theme colors
- `useThemeClasses()` - Get theme utility classes

## Styling Guidelines

### Background Colors

- Use `bg-background` for main backgrounds
- Use `bg-card` for card backgrounds
- Use `bg-muted` for subtle backgrounds
- Use `bg-gradient-dark` for gradient backgrounds

### Text Colors

- Use `text-foreground` for primary text
- Use `text-muted-foreground` for secondary text
- Use `text-primary` for brand text
- Use `text-gradient-brand` for gradient text

### Borders

- Use `border-border` for primary borders
- Use `border-border/50` for subtle borders
- Use `border-border/25` for very subtle borders

### Interactive States

- Use `hover:bg-muted/50` for hover backgrounds
- Use `hover:text-primary` for hover text
- Use `transition-all duration-200` for smooth transitions

### Shadows

- Use `shadow-glow` for general shadows
- Use `shadow-glow-brand` for brand-colored shadows

## Custom CSS Classes

The theme includes several custom CSS classes defined in `globals.css`:

### Gradients

- `.bg-gradient-dark` - Dark gradient background
- `.bg-gradient-card` - Card gradient background
- `.text-gradient-brand` - Brand gradient text
- `.border-gradient` - Gradient border

### Shadows

- `.shadow-glow` - General glow shadow
- `.shadow-glow-brand` - Brand glow shadow

### Scrollbars

Custom scrollbar styling for dark theme is included automatically.

## Best Practices

1. **Always use theme colors** - Don't hardcode colors, use the theme system
2. **Use semantic class names** - Prefer `text-foreground` over `text-white`
3. **Leverage opacity modifiers** - Use `/50`, `/25` for subtle variations
4. **Use consistent transitions** - Apply `transition-all duration-200` for smooth interactions
5. **Test accessibility** - Ensure sufficient contrast ratios
6. **Use the brand colors** - Incorporate gold colors for highlights and accents

## File Structure

```
src/
├── lib/
│   └── theme.ts              # Centralized theme configuration
├── components/
│   └── theme-provider.tsx    # Theme provider component
└── styles/
    └── globals.css           # Global styles and CSS variables
```

This theme system ensures a consistent, professional dark mode experience across the entire application while maintaining flexibility for future design updates.

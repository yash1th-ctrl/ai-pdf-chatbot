// Red Color Scheme Theme Configuration
export const redTheme = {
  // Primary Red Palette
  primary: {
    50: '#fef2f2',
    100: '#fee2e2', 
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444', // Main red
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
    950: '#450a0a'
  },
  
  // Dark Red Palette
  dark: {
    bg: '#1a0b0b',      // Very dark red-black
    surface: '#2d1414',  // Dark red surface
    card: '#3d1a1a',     // Card background
    border: '#4d2020',   // Border color
    text: '#fef2f2',     // Light text
    textSecondary: '#fecaca', // Secondary text
    accent: '#ef4444'    // Accent red
  },
  
  // Light Red Palette  
  light: {
    bg: '#fef2f2',       // Very light red
    surface: '#ffffff',   // White surface
    card: '#fee2e2',     // Light red card
    border: '#fecaca',   // Light border
    text: '#7f1d1d',     // Dark red text
    textSecondary: '#991b1b', // Secondary text
    accent: '#dc2626'    // Accent red
  }
};

// Responsive Breakpoints
export const breakpoints = {
  sm: '640px',
  md: '768px', 
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
};

// Component Styles
export const componentStyles = {
  button: {
    primary: 'bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl',
    secondary: 'bg-red-100 hover:bg-red-200 text-red-800 font-medium px-6 py-3 rounded-lg transition-all duration-200',
    outline: 'border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white font-medium px-6 py-3 rounded-lg transition-all duration-200'
  },
  
  card: {
    default: 'bg-white border border-red-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200',
    dark: 'bg-red-950 border border-red-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-200'
  },
  
  input: {
    default: 'border border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 rounded-lg px-4 py-3 transition-all duration-200',
    dark: 'bg-red-950 border border-red-800 focus:border-red-600 focus:ring-2 focus:ring-red-900 text-red-100 rounded-lg px-4 py-3 transition-all duration-200'
  }
};

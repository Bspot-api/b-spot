import React from 'react';

interface FaviconManagerProps {
  faviconPath?: string;
  theme?: 'light' | 'dark';
}

export function FaviconManager({ 
  faviconPath = '/favicon.ico', 
  theme = 'light' 
}: FaviconManagerProps) {
  React.useEffect(() => {
    // Update favicon based on theme or other conditions
    const updateFavicon = () => {
      const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
      if (link) {
        link.href = faviconPath;
      } else {
        // Create favicon link if it doesn't exist
        const newLink = document.createElement('link');
        newLink.rel = 'icon';
        newLink.href = faviconPath;
        document.head.appendChild(newLink);
      }
    };

    updateFavicon();
  }, [faviconPath, theme]);

  // This component doesn't render anything visible
  return null;
}

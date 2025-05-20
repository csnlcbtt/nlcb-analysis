
import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';
import { Button } from '@/components/ui/button';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar - Fixed Position */}
      <div className="hidden md:block md:fixed inset-y-0 left-0 z-30">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 transform md:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        <Sidebar />
      </div>
      
      {/* Main Content - With left margin for fixed sidebar */}
      <div className="flex flex-col flex-1 md:ml-64">
        <header className="flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 md:sticky top-0 z-20">
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden" 
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu />
            <span className="sr-only">Toggle Menu</span>
          </Button>
          <div className="w-full flex items-center justify-end gap-4">
            <div className="flex items-center gap-4">
              {/* Header content here (if needed) */}
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto">
          {/* Overlay for mobile sidebar */}
          {sidebarOpen && (
            <div 
              className="fixed inset-0 bg-background/80 backdrop-blur-sm md:hidden z-40"
              onClick={() => setSidebarOpen(false)}
            />
          )}
          
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;

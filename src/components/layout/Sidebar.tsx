
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Search, 
  CheckSquare, 
  Hash, 
  Target, 
  Trophy, 
  Mail, 
  Info, 
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Logo component
const Logo = () => (
  <div className="flex items-center justify-center px-4 py-5">
    <img src="/img/logoblack.png" alt="CSNLCBTT Games Analysis" className="max-w-[180px] h-auto" />
  </div>
);

// Menu item component
interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  active?: boolean;
}

const SidebarItem = ({ to, icon, children, active }: SidebarItemProps) => (
  <Link to={to} className={cn("sidebar-item", active && "active")}>
    {icon}
    <span>{children}</span>
  </Link>
);

const Sidebar = () => {
  const location = useLocation();
  const pathname = location.pathname;  return (
    <div className="h-screen flex flex-col w-64 bg-background border-r border-border overflow-y-auto">
      <Logo />
      
      <div className="mt-4 flex items-center px-4 py-2 text-foreground/50">
        <span className="text-sm">Main Menu</span>
      </div>

      <div className="flex flex-col gap-1 px-2">
        <SidebarItem 
          to="/" 
          icon={<Home size={18} />} 
          active={pathname === '/'}
        >
          Home
        </SidebarItem>

        <SidebarItem 
          to="/playwhe" 
          icon={<Search size={18} />} 
          active={pathname === '/playwhe'}
        >
          PlayWhe
        </SidebarItem>

        <SidebarItem 
          to="/pick2" 
          icon={<Hash size={18} />} 
          active={pathname === '/pick2'}
        >
          PICK2
        </SidebarItem>

        <SidebarItem 
          to="/pick4" 
          icon={<Hash size={18} />} 
          active={pathname === '/pick4'}
        >
          PICK4
        </SidebarItem>

        <SidebarItem 
          to="/cashpot" 
          icon={<Target size={18} />} 
          active={pathname === '/cashpot'}
        >
          Cashpot
        </SidebarItem>

        <SidebarItem 
          to="/lotto" 
          icon={<CheckSquare size={18} />} 
          active={pathname === '/lotto'}
        >
          Lotto
        </SidebarItem>

        <SidebarItem 
          to="/winforlife" 
          icon={<Trophy size={18} />} 
          active={pathname === '/winforlife'}
        >
          WinForLife
        </SidebarItem>

        <SidebarItem 
          to="/contact" 
          icon={<Mail size={18} />} 
          active={pathname === '/contact'}
        >
          Contact
        </SidebarItem>

        <SidebarItem 
          to="/about" 
          icon={<Info size={18} />} 
          active={pathname === '/about'}
        >
          About
        </SidebarItem>

        <SidebarItem 
          to="/admin" 
          icon={<Settings size={18} />} 
          active={pathname === '/admin'}
        >
          Admin Dashboard
        </SidebarItem>
      </div>

      <div className="mt-auto p-4 bg-muted/20">
        <div className="text-xs text-muted-foreground">
          Converting NLCB T&T Data To Insights
        </div>
        <div className="mt-3 flex gap-2">
          <a href="mailto:" className="flex items-center justify-center w-full py-1.5 bg-destructive/80 text-destructive-foreground rounded text-xs font-medium">
            EMAIL
          </a>
          <a href="#" className="flex items-center justify-center w-full py-1.5 bg-blue-700/80 text-white rounded text-xs font-medium">
            FACEBOOK
          </a>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

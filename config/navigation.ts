import {
  Home, LayoutDashboard, MessageCircle, Search, Sparkles,
  Camera, Shield, Phone, FileText, Users, AlertCircle,
  Mail, BookOpen, Fingerprint, Wand2, LucideIcon
} from 'lucide-react';

export interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
  color: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export const navigationGroups: NavGroup[] = [
  {
    title: 'CORE',
    items: [
      { label: 'Home', path: '/', icon: Home, color: 'text-primary' },
      { label: 'My Dashboard', path: '/dashboard', icon: LayoutDashboard, color: 'text-primary' },
      { label: 'Assessment', path: '/assessment', icon: Fingerprint, color: 'text-primary' },
    ]
  },
  {
    title: 'EMERGENCY & TOOLS',
    items: [
      { label: 'Live AI Expert', path: '/live', icon: Phone, color: 'text-danger' },
      { label: 'Cleanup Guide', path: '/cleanup', icon: Sparkles, color: 'text-secondary' },
      { label: 'Scan (Multimodal)', path: '/scan', icon: Camera, color: 'text-accent' },
      { label: 'Safety Lab', path: '/lab', icon: Wand2, color: 'text-primary' },
      { label: 'Mattress Checker', path: '/checker', icon: Search, color: 'text-success' },
    ]
  },
  {
    title: 'HUB & KNOWLEDGE',
    items: [
      { label: 'Education Hub', path: '/hub', icon: BookOpen, color: 'text-accent' },
      { label: 'AI Chat', path: '/assistant', icon: MessageCircle, color: 'text-primary' },
      { label: 'Community Forum', path: '/forum', icon: Users, color: 'text-secondary' },
      { label: 'Resources', path: '/resources', icon: FileText, color: 'text-muted' },
      { label: 'Org Resources', path: '/org-resources', icon: Shield, color: 'text-primary' },
    ]
  },
  {
    title: 'REPORTING',
    items: [
      { label: 'Report Incident', path: '/report', icon: AlertCircle, color: 'text-danger' },
      { label: 'Contact Us', path: '/contact', icon: Mail, color: 'text-muted' },
    ]
  }
];

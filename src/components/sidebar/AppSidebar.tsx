import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { useSnippetsStore } from '@/store/snippetsStore';
import { LANGUAGES } from '@/data/languages';
import { Link } from 'react-router-dom';
import { Home, FileText, Share2 } from 'lucide-react';

const navigationItems = [
  { title: "Hjem", url: "/", icon: Home },
  { title: "Mine Snippets", url: "/snippets", icon: FileText },
  { title: "Delte", url: "/shared", icon: Share2 },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const { filters, setFilters, allTags, allLanguages } = useSnippetsStore();
  const tags = allTags();
  const langs = Array.from(new Set([...LANGUAGES, ...allLanguages()]));

  const toggleLang = (lang: string) => {
    const has = filters.languages.includes(lang);
    const next = has ? filters.languages.filter(l => l !== lang) : [...filters.languages, lang];
    setFilters({ languages: next });
  };

  const toggleTag = (tag: string) => {
    const has = filters.tags.includes(tag);
    const next = has ? filters.tags.filter(t => t !== tag) : [...filters.tags, tag];
    setFilters({ tags: next });
  };

  const isActive = (value: string, inList: string[]) => inList.includes(value);

    return (
      <Sidebar className={collapsed ? 'w-14' : 'w-64'} collapsible="icon">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigasjon</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigationItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link to={item.url} className="flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Språk</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {langs.map((l) => (
                  <SidebarMenuItem key={l}>
                    <SidebarMenuButton asChild className={isActive(l, filters.languages) ? 'bg-muted text-primary' : ''}>
                      <button onClick={() => toggleLang(l)}>{l}</button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Tags</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {tags.map((t) => (
                  <SidebarMenuItem key={t}>
                    <SidebarMenuButton asChild className={isActive(t, filters.tags) ? 'bg-muted text-primary' : ''}>
                      <button onClick={() => toggleTag(t)}>{t}</button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    );
}

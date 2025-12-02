import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { ChevronDown, ChevronUp, LayoutDashboard, Users } from "lucide-react";
import { useState } from "react";

const subApps = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    description: "Analytics & Finance",
    href: "/dashboard",
    colors: {
      bg: "bg-primary-50",
      text: "text-primary",
    },
  },
  {
    id: "hub",
    label: "Hub",
    icon: Users,
    description: "Community & Plans",
    href: "/hub",
    colors: {
      bg: "bg-accent-100",
      text: "text-accent",
    },
  },
];

interface SwitchAppProps {
  sidebarOpen: boolean;
}

function SwitchApp({ sidebarOpen }: SwitchAppProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeApp, setActiveApp] = useState<(typeof subApps)[number]>(
    subApps[0]
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none focus:ring-0 focus:ring-offset-0 mt-3 w-full">
        <div
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`group flex items-center ${sidebarOpen ? "justify-between" : "justify-center"} cursor-pointer rounded-base ${sidebarOpen ? "px-1.5 py-1 overflow-hidden" : "p-0"}`}
        >
          <div
            className={`flex items-center ${sidebarOpen ? "gap-2" : "gap-0"}`}
          >
            <div
              className={`relative flex h-6 w-6 items-center justify-center `}
            >
              <activeApp.icon
                className={`h-3! w-3! ${activeApp.colors.text} z-10`}
              />
              <span
                className={`rounded-base absolute inset-0 ${activeApp.colors.bg} ${sidebarOpen ? "group-hover:translate-x-[250%] group-hover:scale-x-[1500%] group-hover:scale-y-[200%] transition-all duration-500" : "group-hover:scale-x-[155%] group-hover:scale-y-[155%] transition-all duration-500"}`}
              />
            </div>
            {sidebarOpen && (
              <div className="z-10 flex flex-col items-start">
                <div className="text-sm font-medium transition-colors delay-250">
                  {activeApp.label}
                </div>
                <div className="text-xs text-muted-foreground transition-colors delay-250">
                  {activeApp.description}
                </div>
              </div>
            )}
          </div>

          {sidebarOpen &&
            (isCollapsed ? (
              <ChevronUp className="z-10 h-4 w-4 text-muted-foreground shrink-0 transition-colors delay-250" />
            ) : (
              <ChevronDown className="z-10 h-4 w-4 text-muted-foreground shrink-0 transition-colors delay-250" />
            ))}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-56 bg-popover border border-border shadow-lg z-50"
      >
        {subApps.map((app) => (
          <DropdownMenuItem
            key={app.id}
            onClick={() => {
              setActiveApp(app);
              setIsCollapsed(false);
            }}
            className={`flex items-center gap-3 p-3 cursor-pointer hover:${app.colors.bg} transition-colors`}
          >
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-lg ${app.colors.bg}`}
            >
              <app.icon className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className={`text-sm font-medium ${app.colors.text}`}>
                {app.label}
              </span>
              <span className="text-xs text-muted-foreground">
                {app.description}
              </span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default SwitchApp;

import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ArrowDownToLine, ChartBar, ChevronLeft, Cog } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";

const items = [
  {
    title: "Загальні",
    url: "",
    icon: Cog,
  },
  {
    title: "Версії",
    url: "/versions",
    icon: ArrowDownToLine,
  },
  {
    title: "Публікація",
    url: "/publish",
    icon: ChartBar,
  },
];

type Props = {
  appSettings: any; // Replace 'any' with the actual type of appSettings
};

export const AppsSidebar: React.FC<Props> = ({ appSettings }) => {
  const navigate = useNavigate();
  const { appId } = useParams<{ appId: string }>();

  const onBackClick = () => {
    navigate("/dev/apps", { replace: true });
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={onBackClick}
        >
          <ChevronLeft />
          <span>Назад</span>
        </Button>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Налаштування</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      to={`/dev/apps/${appId}${item.url}`}
                      className="flex items-center gap-2"
                    >
                      <item.icon />
                      {item.title}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

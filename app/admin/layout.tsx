"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Settings, FileText, Users, PaintBucket, FileCheck } from "lucide-react"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const navItems = [
    {
      title: "Templates",
      href: "/admin",
      icon: <FileText className="h-5 w-5" />,
      exact: true,
    },
    {
      title: "Users",
      href: "/admin/users",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "Branding",
      href: "/admin/branding",
      icon: <PaintBucket className="h-5 w-5" />,
    },
    {
      title: "Documents",
      href: "/admin/documents",
      icon: <FileCheck className="h-5 w-5" />,
    },
    {
      title: "Settings",
      href: "/admin/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ]

  const isActive = (item: { href: string; exact?: boolean }) => {
    if (item.exact) {
      return pathname === item.href
    }
    return pathname === item.href || pathname.startsWith(`${item.href}/`)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8">
        <div className="space-y-2">
          {navItems.map((item: { title: string; href: string; icon: React.ReactNode; exact?: boolean }) => (
            <Button
              key={item.href}
              variant={isActive(item) ? "default" : "ghost"}
              className="w-full justify-start"
              asChild
            >
              <Link href={item.href}>
                {item.icon}
                <span className="ml-2">{item.title}</span>
              </Link>
            </Button>
          ))}
        </div>

        <div>{children}</div>
      </div>
    </div>
  )
}


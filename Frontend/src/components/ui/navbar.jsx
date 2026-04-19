import { Anvil } from "lucide-react";
import Protected from "@/features/auth/components/protected";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { useAuth } from "../../features/auth/Hooks/useAuth";
import { Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function Navbar() {
  const { handleLogout } = useAuth();
  const navigate = useNavigate();
  async function logout(e) {
    e.preventDefault();
    await handleLogout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="flex justify-between items-center sticky top-0 z-50 bg-white/60 backdrop-blur-md px-4 md:px-8 py-2 lg:py-4 border-b border-gray-100">
      <span className="flex items-center">
        <Anvil className="text-purple-600 size-4 md:size-6" />
        <p className="ml-1 font-semibold lg:text-xl">TalentForge</p>
      </span>
      <Protected>
        <div>
            <div className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Menu className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 p-4">
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <Link to="/">Create New Interview Report</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link to="/dashboard">Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link to="/reports">All Reports</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <button className="w-full text-left" onClick={logout}>
                        Logout
                      </button>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div>
              <div className="hidden md:flex gap-4">
                <Link
                  to="/"
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium shadow-sm"
                >
                  Create New Interview Report
                </Link>
                <Link to='/dashboard' className="px-4 py-2 font-semibold">Dashboard</Link>
                <Button variant="outline" onClick={logout}>
                  Logout
                </Button>
              </div>
            </div>
        </div>
      </Protected>
    </div>
  );
}

export default Navbar;

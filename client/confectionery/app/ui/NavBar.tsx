import Link from "next/link";
import { cookies } from "next/headers";
import { User } from "../lib/definitions";

const NavBar: React.FC = () => {
  const cookie = cookies().get("user")?.value;
  let user: User | undefined = undefined;

  if (cookie) {
    user = JSON.parse(cookie) as User;
    console.log("user --->", user);
  }
  return (
    <nav>
      <div>
        <span>Logo</span>
      </div>
      <div>
        <div>
          {user ? (
            <div>
              <div>
                <Link href="cart">Cart</Link>
                <Link href="orders">Orders</Link>
              </div>
              <div>Hello, {user?.email}</div>
            </div>
          ) : (
            <div>
              <Link href="login">Login</Link>
              <a>Register</a>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;

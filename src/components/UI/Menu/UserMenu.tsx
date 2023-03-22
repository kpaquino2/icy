import { signOut } from "next-auth/react";
import { SignOut, UserCircle } from "phosphor-react";
import Button from "../Button";
import DropdownMenu from "./DropdownMenu";

const UserMenu = () => {
  return (
    <DropdownMenu
      button={
        <Button variant="base" size="lg">
          <UserCircle size={32} />
        </Button>
      }
      items={[
        <Button key={0} onClick={() => signOut()} variant="base" size="md" fill>
          <SignOut size={16} weight="bold" />
          sign out
        </Button>,
      ]}
    />
  );
};

export default UserMenu;

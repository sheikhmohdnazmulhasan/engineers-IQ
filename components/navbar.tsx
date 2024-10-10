'use client'

import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@nextui-org/navbar";
import { Link } from "@nextui-org/link";
// import { Input } from "@nextui-org/input";
import { link as linkStyles } from "@nextui-org/theme";
import NextLink from "next/link";
import clsx from "clsx";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar, User, Button } from "@nextui-org/react";
import { Spinner } from "@nextui-org/spinner";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { Logo, WriteIcon } from "@/components/icons";
import useUser from "@/hooks/useUser";
import signOut from "@/utils/sign_out_user";

import UserName from "./premium_acc_badge";

export const Navbar = () => {
  const { currentUser, isLoading } = useUser();

  // const searchInput = (
  //   <Input
  //     aria-label="Search"
  //     classNames={{
  //       inputWrapper: "bg-default-100",
  //       input: "text-sm",
  //     }}
  //     labelPlacement="outside"
  //     placeholder="Search..."
  //     startContent={
  //       <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
  //     }
  //     type="search"
  //   />
  // );

  const profileDropdownDesktop = (
    <Dropdown placement="bottom-start">
      <DropdownTrigger>
        <User
          as="button"
          avatarProps={{
            isBordered: true,
            src: currentUser?.profileImg,
          }}
          className="transition-transform"
          description={`@${currentUser?.username}`}
          name={<UserName isPremium={currentUser?.isPremiumMember} name={currentUser?.name} />}
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="User Actions" variant="flat">
        <DropdownItem key='settings' color="secondary" >
          <Link href={`/profile/${currentUser?.username}`}>Profile & Analytics</Link>
        </DropdownItem>
        <DropdownItem key="logout" color="danger" onClick={() => signOut()}>
          Log Out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );

  const profileDropdownMobile = (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Avatar
          isBordered
          as="button"
          className="transition-transform"
          size="sm"
          src={currentUser?.profileImg}
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="Profile Actions" variant="flat">
        <DropdownItem key="profile" className="h-14 gap-2">
          <p className="font-semibold"><UserName isPremium={currentUser?.isPremiumMember} name={currentUser?.name} /></p>
          <p className="font-semibold">{`@${currentUser?.username}`}</p>
        </DropdownItem>
        <DropdownItem key='settings' color="secondary" >
          <Link href={`/profile/${currentUser?.username}`}>Profile & Analytics</Link>
        </DropdownItem>
        <DropdownItem key="logout" color="danger" onClick={() => signOut()}>
          Log Out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )

  return (
    <NextUINavbar className="z-[500000]" maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            {/* <Logo /> */}
            <p className="font-bold text-inherit">EngineersIQ</p>
          </NextLink>
        </NavbarBrand>
        <ul className="hidden lg:flex gap-4 justify-start ml-2">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <NextLink
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium",
                )}
                color="foreground"
                href={item.href}
              >
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
        </ul>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <ThemeSwitch />
        <NavbarItem className="hidden lg:flex">
          {/* {searchInput} */}
        </NavbarItem>

        {currentUser && <Link href="/new" >
          <WriteIcon />
        </Link>}

        {isLoading ? <Spinner size="sm" /> : currentUser ? (
          profileDropdownDesktop
        ) : (
          <Link className="text-default-foreground" href="/auth/login">
            <Button color="default" variant="bordered">
              Sign In
            </Button>
          </Link>
        )}

      </NavbarContent>

      {/* mobile */}
      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        {currentUser && <Link href="/new" >
          <WriteIcon />
        </Link>}
        <ThemeSwitch />
        {isLoading ? <Spinner size="sm" /> : currentUser ? profileDropdownMobile : null}
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        {/* {searchInput} */}
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {siteConfig.navItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link color="foreground" href={item.href} size="lg">
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
          {!currentUser && <NavbarMenuItem >
            <Link color="primary" href='/auth/login' size="lg">
              Sign In
            </Link>
          </NavbarMenuItem>}
        </div>
      </NavbarMenu>
    </NextUINavbar>
  );
};

"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useDrawerStore } from "@/store/drawerStore";

export default function DashboardPage() {
  const { openDrawer, closeDrawer } = useDrawerStore();

  return (
    <>
      <Drawer onClose={closeDrawer}>
        <DrawerTrigger onClick={openDrawer}>Open</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>New Course</DrawerTitle>
          </DrawerHeader>

          <DrawerFooter>
            <Button>Submit</Button>
            <DrawerClose>cancel</DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}

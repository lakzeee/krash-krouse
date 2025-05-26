import { describe, it, expect, beforeEach } from 'vitest';
import { useDrawerStore } from './drawerStore';

describe('useDrawerStore', () => {
  beforeEach(() => {
    // Reset the store before each test to ensure test isolation
    useDrawerStore.setState({ isDrawerOpen: false });
  });

  it('should have an initial state where isDrawerOpen is false', () => {
    const { isDrawerOpen } = useDrawerStore.getState();
    expect(isDrawerOpen).toBe(false);
  });

  it('should open the drawer when openDrawer is called', () => {
    useDrawerStore.getState().openDrawer();
    const { isDrawerOpen } = useDrawerStore.getState();
    expect(isDrawerOpen).toBe(true);
  });

  it('should close the drawer when closeDrawer is called', () => {
    // First open the drawer
    useDrawerStore.getState().openDrawer();
    expect(useDrawerStore.getState().isDrawerOpen).toBe(true);

    // Then close it
    useDrawerStore.getState().closeDrawer();
    const { isDrawerOpen } = useDrawerStore.getState();
    expect(isDrawerOpen).toBe(false);
  });

  it('should toggle the drawer state when toggleDrawer is called', () => {
    // Initial state is false, should become true
    useDrawerStore.getState().toggleDrawer();
    expect(useDrawerStore.getState().isDrawerOpen).toBe(true);

    // Current state is true, should become false
    useDrawerStore.getState().toggleDrawer();
    expect(useDrawerStore.getState().isDrawerOpen).toBe(false);
  });
});

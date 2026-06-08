"use client"

import { useSyncExternalStore } from "react"
import { RiSunLine, RiMoonLine } from "@remixicon/react"

const STORAGE_KEY = "wattvision-theme"

function getSnapshot(): boolean {
  return document.documentElement.classList.contains("light")
}

function subscribe(callback: () => void) {
  const observer = new MutationObserver(callback)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
  return () => observer.disconnect()
}

function getServerSnapshot(): boolean {
  return false
}

export default function ThemeToggle() {
  const isLight = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  function toggle() {
    const next = !isLight
    document.documentElement.classList.toggle("light", next)
    localStorage.setItem(STORAGE_KEY, next ? "light" : "dark")
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="flex size-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-sidebar-accent"
      aria-label={isLight ? "切换到暗色模式" : "切换到亮色模式"}
    >
      {isLight ? <RiMoonLine className="size-5" /> : <RiSunLine className="size-5" />}
    </button>
  )
}

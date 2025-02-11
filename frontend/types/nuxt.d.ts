import type { ToastContainerOptions, ToastOptions, toast } from "vue3-toastify"
import type { ConfirmDialogOptions } from "~/plugins/confirm.client"

declare module "#app" {
  interface NuxtApp {
    $toast: typeof toast
    $confirm: (options: ConfirmDialogOptions) => Promise<boolean>
  }
}

declare module "vue" {
  interface ComponentCustomProperties {
    $toast: typeof toast
  }
}

export {}

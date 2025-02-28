import type { ToastContainerOptions, ToastOptions, toast } from "vue3-toastify"
import type { ConfirmDialogOptions } from "~/plugins/confirm.client"
import type { CustomSocket } from "./socket.io"

declare module "#app" {
  interface NuxtApp {
    $toast: typeof toast
    $confirm: (options: ConfirmDialogOptions) => Promise<boolean>
    $socket: CustomSocket
  }
}

declare module "vue" {
  interface ComponentCustomProperties {
    $toast: typeof toast
  }
}

export {}

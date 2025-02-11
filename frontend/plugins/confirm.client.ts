import { h, ref } from "vue"
import {
  VDialog,
  VCard,
  VCardTitle,
  VCardText,
  VCardActions,
  VBtn,
} from "vuetify/components"

export interface ConfirmDialogOptions {
  title: string
  message: string
  confirmText?: string
  cancelText?: string
}

export default defineNuxtPlugin((nuxtApp) => {
  const isVisible = ref(false)
  const resolveCallback = ref<(value: boolean) => void>()
  const dialogOptions = ref<ConfirmDialogOptions>({
    title: "",
    message: "",
    confirmText: "Confirmar",
    cancelText: "Cancelar",
  })

  function openDialog(options: ConfirmDialogOptions) {
    dialogOptions.value = {
      ...dialogOptions.value,
      ...options,
    }
    isVisible.value = true

    return new Promise<boolean>((resolve) => {
      resolveCallback.value = resolve
    })
  }

  function confirm() {
    isVisible.value = false
    resolveCallback.value?.(true)
  }

  function cancel() {
    isVisible.value = false
    resolveCallback.value?.(false)
  }

  const ConfirmComponent = {
    setup() {
      return { isVisible, dialogOptions, confirm, cancel }
    },
    render() {
      return h(
        VDialog,
        {
          modelValue: isVisible.value,
          "onUpdate:modelValue": (v: boolean) => (isVisible.value = v),
          persistent: true,
          maxWidth: "400px",
        },
        () => [
          h(VCard, { class: "pa-4" }, () => [
            h(
              VCardTitle,
              { class: "pa-0 mb-4 font-weight-bold" },
              () => dialogOptions.value.title
            ),
            h(
              VCardText,
              { class: "pa-0 mb-4" },
              () => dialogOptions.value.message
            ),
            h(VCardActions, { class: "pa-0" }, () => [
              h("div", { style: "flex: 1" }),
              h(
                VBtn,
                { variant: "text", onClick: cancel },
                () => dialogOptions.value.cancelText
              ),
              h(
                VBtn,
                { color: "primary", variant: "elevated", flat: true,  onClick: confirm },
                () => dialogOptions.value.confirmText
              ),
            ]),
          ]),
        ]
      )
    },
  }

  nuxtApp.vueApp.component("ConfirmDialog", ConfirmComponent)
  nuxtApp.provide("confirm", openDialog)
})

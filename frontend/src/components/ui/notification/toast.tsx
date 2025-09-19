import { toast as sonnerToast } from "sonner";

import Notification, { NotificationProps } from "./Notfication";

export function toast(toast: Omit<NotificationProps, "id">) {
  return sonnerToast.custom(
    (id) => (
      <Notification
        id={id}
        variant={toast.variant}
        title={toast.title}
        description={toast.description}
      />
    ),
    { duration: toast.hideDuration ?? 4000 }
  );
}

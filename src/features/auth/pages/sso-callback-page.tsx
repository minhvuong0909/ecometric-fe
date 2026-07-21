import { AuthenticateWithRedirectCallback, useUser } from "@clerk/react";
import { useEffect } from "react";
import { toast } from "sonner";

export function SsoCallbackPage() {
  const { user } = useUser();

  useEffect(() => {
    toast.success("Đăng nhập bằng Google thành công!", {
      description: user?.fullName
        ? `Chào mừng ${user.fullName} quay trở lại EcoMetric.`
        : "Chào mừng bạn quay trở lại EcoMetric.",
      duration: 4000,
    });
  }, [user]);

  return (
    <AuthenticateWithRedirectCallback
      signUpForceRedirectUrl="/app"
      signInForceRedirectUrl="/app"
    />
  );
}

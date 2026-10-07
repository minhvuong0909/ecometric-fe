import { AuthenticateWithRedirectCallback } from "@clerk/react";
export function SsoCallbackPage(){return <AuthenticateWithRedirectCallback signUpForceRedirectUrl="/app" signInForceRedirectUrl="/app"/>;}

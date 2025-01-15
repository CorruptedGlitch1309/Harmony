import { SignIn } from "@clerk/nextjs";

function page() {
  return (
    <div className="h-screen flex justify-center items-center">
      <SignIn forceRedirectUrl={"/"} signUpForceRedirectUrl={"/"} />
    </div>
  );
}

export default page;

import { SignUp } from "@clerk/nextjs";

function page() {
  return (
    <div className="h-screen flex justify-center items-center">
      <SignUp />
    </div>
  );
}

export default page;

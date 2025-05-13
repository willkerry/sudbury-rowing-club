import { SignIn } from "@clerk/nextjs";

const LoginPage = () => (
  <div className="mt-6 flex items-center justify-center">
    <SignIn />
  </div>
);

export default LoginPage;

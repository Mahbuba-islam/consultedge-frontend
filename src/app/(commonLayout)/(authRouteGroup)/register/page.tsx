// import RegisterForm from "@/components/modules/RegisterForm";

// interface RegisterParams {
//   searchParams: Promise<{ redirect?: string }>;
// }

// const RegisterPage = async ({ searchParams }: RegisterParams) => {
//   const params = await searchParams;
//   const redirectPath = params.redirect;

//   return <RegisterForm redirectPath={redirectPath} />;
// };

// export default RegisterPage;

export default function RegisterPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Register Page</h1>
    </div>
  )
}
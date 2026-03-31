
interface LoginParams {
  searchParams: Promise<{ redirect?: string }>;
}

const LoginPage = async ({ searchParams }: LoginParams) => {
  const params = await searchParams;
  const redirectPath = params.redirect;
  return (
    <div>login </div>
    // <LoginForm redirectPath={redirectPath}/>
  )
}

export default LoginPage
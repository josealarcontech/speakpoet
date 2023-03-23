import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  type error = {
    statusText : string,
    message: string
  }
  const currentError = useRouteError() as error;
  console.error(currentError);

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{currentError.statusText || currentError.message}</i>
      </p>
    </div>
  );
}
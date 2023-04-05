import { useEffect } from 'react';
function HomeView () {
  useEffect(() => {
    console.log("hello")
  });
  return (
    <div>
      Home
    </div>
  )
}
export default HomeView
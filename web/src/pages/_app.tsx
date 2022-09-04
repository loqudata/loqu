import { CoreApp } from "../components/CoreApp";

import dynamic from "next/dynamic";
import NoSsr from "../components/NoSsr";

function MyApp({ Component, pageProps }) {
  return (
    <CoreApp>
      <NoSsr>
        <Component {...pageProps} />
      </NoSsr>
    </CoreApp>
  );
}

// export default dynamic(() => Promise.resolve(MyApp), {
//   ssr: false,
// });

export default MyApp;

import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head />
        <body>
          <noscript>
              <div style={{backgroundColor:"#F7FAFC", padding: "3rem"}}>
              <h1 style={{fontSize: "3rem", letterSpacing:"-3px"}}>Whoops!</h1>
              <p>You need to enable JavaScript to run this app.</p>
              <p>We need JavaScript to provide an interactive data visualization interface,  instant search functionality, and much more.</p>
              <p>Check us out on <a href="https://github.com/loqudaa/docs" style={{color: "#2F855A"}}>Github</a> for more information.</p>
              </div>
          </noscript>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;

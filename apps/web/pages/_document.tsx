import Document, { Html, Head, Main, NextScript } from "next/document";

export default class SudburyDocument extends Document {
  render() {
    return (
      <Html lang="en-GB">
        <Head />
        <body className="antialiased">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

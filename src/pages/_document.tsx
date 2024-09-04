import { AppConfig } from "@src/utils/AppConfig";
import Document, { Head, Html, Main, NextScript, DocumentInitialProps, DocumentContext } from "next/document";
import { ServerStyleSheet } from "styled-components";

// Need to create a custom _document because i18n support is not compatible with `next export`.
class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps> {
    const originalRenderPage = ctx.renderPage;

    const sheet = new ServerStyleSheet();

    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: (App) => (props) => sheet.collectStyles(<App {...props} />),
        enhanceComponent: (Component) => Component,
      });

    const intialProps = await Document.getInitialProps(ctx);
    const styles = sheet.getStyleElement();

    return { ...intialProps, styles };
  }
  
  // eslint-disable-next-line class-methods-use-this
  render() {
    return (
      <Html lang={AppConfig.locale}>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;

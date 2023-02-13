import * as React from "react";
import { Helmet } from "react-helmet";
import Navbar from "../components/Navbar";
import "./all.sass";
import useSiteMetadata from "./SiteMetadata";
import { withPrefix } from "gatsby";

const TemplateWrapper = ({ children }) => {
  const { title, description, origin } = useSiteMetadata();
    const pageTitle = children.props.title;
    const excerpt = children.props.excerpt;
    console.log(`TemplateWrapper ~ excerpt`, excerpt);

    return (
    <div>
      <Helmet>
        <html lang="ja" />
        <title>{title}</title>
        <meta name="description" content={`${description ?? excerpt}`} />

        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href={`${withPrefix("/")}img/apple-touch-icon.png`}
        />
        <link
          rel="icon"
          type="image/png"
          href={`${withPrefix("/")}img/favicon-32x32.png`}
          sizes="32x32"
        />
        <link
          rel="icon"
          type="image/png"
          href={`${withPrefix("/")}img/favicon-16x16.png`}
          sizes="16x16"
        />

        <link
          rel="mask-icon"
          href={`${withPrefix("/")}img/safari-pinned-tab.svg`}
          color="#ff4400"
        />
        <meta name="theme-color" content="#fff" />

        <meta property="og:type" content="article" />
        <meta property="og:title" content={`${pageTitle} - ${title}`} />
        <meta property="og:description" content={`${description ?? excerpt}`} />
        <meta property="og:image" content={`${origin}/img/og-image.jpg`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@amay077" />
      </Helmet>
      <Navbar title={title}></Navbar>
      <div>{children}</div>
      {/* <Footer /> */}
    </div>
  );
};

export default TemplateWrapper;

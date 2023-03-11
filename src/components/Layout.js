import * as React from "react";
import { Helmet } from "react-helmet";
import Navbar from "../components/Navbar";
import "./all.scss";
import useSiteMetadata from "./SiteMetadata";
import { withPrefix } from "gatsby";

const TemplateWrapper = ({ children }) => {
    const { title, description, origin } = useSiteMetadata();
    const pageTitle = children?.props?.title ?? 'no title';
    const excerpt = (children?.props?.excerpt ?? description ?? 'no desc').substring(0, 100);

    return (
    <div>
      <Helmet>
        <html lang="ja" />
        <title>{title}</title>
        <meta name="description" content={`${excerpt}`} />

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

        <meta property="og:site_name" content={`${title}`} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={`${pageTitle} - ${title}`} />
        <meta property="og:description" content={`${excerpt}`} />
        <meta property="og:image" content={`${origin}/img/og-image.jpg`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@amay077" />
      </Helmet>
      <Navbar title={title}></Navbar>
      <div>{children}</div>
    </div>
  );
};

export default TemplateWrapper;

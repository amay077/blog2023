import * as React from "react";
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
      <Navbar title={title}></Navbar>
      <div>{children}</div>
    </div>
  );
};

export default TemplateWrapper;

import React from "react";

import MarkdownContentRenderer from "./MarkdownContentRenderer";

const AboutContent: React.FC = () => {
	return <MarkdownContentRenderer markdownFileName="about" />;
};

export default React.memo(AboutContent);

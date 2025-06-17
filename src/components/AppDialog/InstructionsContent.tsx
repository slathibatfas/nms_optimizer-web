import React from "react";

import MarkdownContentRenderer from "./MarkdownContentRenderer";

const InstructionsContent: React.FC = () => {
	return <MarkdownContentRenderer markdownFileName="instructions" />;
};

export default React.memo(InstructionsContent);

// src/components/AppDialog/TranslationRequestContent.tsx
import React from "react";

import MarkdownContentRenderer from "./MarkdownContentRenderer";

const TranslationRequestContent: React.FC = () => {
	return <MarkdownContentRenderer markdownFileName="translation-request" />;
};

export default React.memo(TranslationRequestContent);
